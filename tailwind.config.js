/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#05070d",
        frost: "rgba(255,255,255,0.08)",
        line: "rgba(255,255,255,0.12)"
      },
      boxShadow: {
        glow: "0 0 42px rgba(62, 220, 255, 0.22)",
        premium: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "radial-grid": "radial-gradient(circle at 50% 0%, rgba(70, 166, 255, 0.25), transparent 36%), radial-gradient(circle at 85% 20%, rgba(165, 92, 255, 0.2), transparent 28%), linear-gradient(180deg, #05070d 0%, #0a0d16 45%, #05070d 100%)"
      }
    }
  },
  plugins: []
};
