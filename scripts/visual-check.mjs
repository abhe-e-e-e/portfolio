import { chromium } from "playwright";
import { inflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

const url = process.env.CHECK_URL || "http://127.0.0.1:3000";
const outputDir = ".verification";
const signature = "89504e470d0a1a0a";

function paeth(left, up, upLeft) {
  const p = left + up - upLeft;
  const pa = Math.abs(p - left);
  const pb = Math.abs(p - up);
  const pc = Math.abs(p - upLeft);
  if (pa <= pb && pa <= pc) return left;
  return pb <= pc ? up : upLeft;
}

function readPngPixels(buffer) {
  if (buffer.subarray(0, 8).toString("hex") !== signature) {
    throw new Error("Screenshot is not a PNG");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    }
    if (type === "IDAT") idat.push(data);
    offset += length + 12;
  }

  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (!bytesPerPixel) {
    throw new Error(`Unsupported PNG color type ${colorType}`);
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bytesPerPixel;
  const pixels = Buffer.alloc(height * stride);
  let rawOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[rawOffset];
    rawOffset += 1;
    const rowStart = y * stride;
    const prevRowStart = (y - 1) * stride;

    for (let x = 0; x < stride; x += 1) {
      const left = x >= bytesPerPixel ? pixels[rowStart + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[prevRowStart + x] : 0;
      const upLeft = y > 0 && x >= bytesPerPixel ? pixels[prevRowStart + x - bytesPerPixel] : 0;
      const value = raw[rawOffset + x];

      if (filter === 0) pixels[rowStart + x] = value;
      if (filter === 1) pixels[rowStart + x] = (value + left) & 255;
      if (filter === 2) pixels[rowStart + x] = (value + up) & 255;
      if (filter === 3) pixels[rowStart + x] = (value + Math.floor((left + up) / 2)) & 255;
      if (filter === 4) pixels[rowStart + x] = (value + paeth(left, up, upLeft)) & 255;
    }

    rawOffset += stride;
  }

  return { width, height, bytesPerPixel, pixels };
}

function assertNotBlankPng(buffer, label) {
  const { bytesPerPixel, pixels } = readPngPixels(buffer);
  let vivid = 0;
  let total = 0;
  let min = 255;
  let max = 0;
  const step = Math.max(bytesPerPixel, bytesPerPixel * 16);

  for (let i = 0; i < pixels.length; i += step) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const luminance = (r + g + b) / 3;
    min = Math.min(min, luminance);
    max = Math.max(max, luminance);
    if (r > 20 || g > 20 || b > 20) vivid += 1;
    total += 1;
  }

  const vividRatio = vivid / total;
  if (vividRatio < 0.015 || max - min < 8) {
    throw new Error(`${label} canvas appears blank or too low contrast`);
  }
}

mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const checks = [
  { name: "desktop", viewport: { width: 1440, height: 960 } },
  { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true }
];

for (const check of checks) {
  const page = await browser.newPage({
    viewport: check.viewport,
    isMobile: Boolean(check.isMobile),
    deviceScaleFactor: check.isMobile ? 2 : 1
  });
  const diagnostics = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      diagnostics.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    diagnostics.push(`pageerror: ${error.message}`);
  });

  await page.goto(url, { waitUntil: "networkidle" });
  try {
    await page.waitForSelector("canvas", { state: "visible", timeout: 20000 });
  } catch (error) {
    throw new Error(
      `${check.name} viewport did not render a visible canvas.\n${diagnostics.join("\n") || error.message}`
    );
  }
  await page.waitForTimeout(1800);

  const screenshot = await page.screenshot({ fullPage: true });
  writeFileSync(`${outputDir}/${check.name}.png`, screenshot);

  const canvasShot = await page.locator("canvas").first().screenshot();
  writeFileSync(`${outputDir}/${check.name}-canvas.png`, canvasShot);
  assertNotBlankPng(canvasShot, check.name);

  const overlappingButtons = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("a, button")].filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    return buttons.some((node, index) => {
      const a = node.getBoundingClientRect();
      return buttons.slice(index + 1).some((other) => {
        const b = other.getBoundingClientRect();
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      });
    });
  });

  if (overlappingButtons) {
    throw new Error(`${check.name} viewport has overlapping actionable elements`);
  }

  await page.close();
}

await browser.close();
console.log("Visual checks passed for desktop and mobile.");
