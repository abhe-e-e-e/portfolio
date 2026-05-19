import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL("https://abhiram-portfolio.netlify.app"),
  title: {
    default: "Abhiram S. Smitha | Product & Startup Operator",
    template: "%s | Abhiram Smitha"
  },
  description:
    "Computer Science student at BITS Pilani Dubai focused on product, startup operations, growth, entrepreneurship, and technology-led business execution.",
  keywords: [
    "product roles",
    "startup operations",
    "growth marketing",
    "entrepreneurship",
    "Computer Science portfolio",
    "BITS Pilani Dubai",
    "E-Cell BPDC",
    "founder's office",
    "technology strategy",
    "Dubai product portfolio"
  ],
  authors: [{ name: "Abhiram S. Smitha" }],
  openGraph: {
    title: "Abhiram S. Smitha | Product & Startup Operator",
    description:
      "Premium portfolio for product, growth, entrepreneurship, startup operations, and technology-led business execution.",
    url: "https://abhiram-portfolio.netlify.app",
    siteName: "Abhiram Smitha Portfolio",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhiram S. Smitha | Product & Startup Operator",
    description:
      "Product, growth, entrepreneurship, startup operations, and technology-led business execution."
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070d"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
