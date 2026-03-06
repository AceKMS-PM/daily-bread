/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        serif: ["'EB Garamond'", "Georgia", "serif"],
        sans: ["'Outfit'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        parchment: {
          50: "#fdfaf4",
          100: "#f9f1e0",
          200: "#f2e0bc",
          300: "#e8c98e",
          400: "#dba85d",
          500: "#c8893a",
          600: "#a86c2a",
          700: "#865222",
          800: "#6b4020",
          900: "#58351d",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C97A",
          dark: "#9B7B2E",
        },
        sacred: {
          dark: "#0D0A06",
          deeper: "#1A1308",
          warm: "#2A1F0E",
          mid: "#3D2E18",
          accent: "#4A3520",
        },
        olive: {
          DEFAULT: "#7C8C5A",
          light: "#A4B478",
          dark: "#5A6640",
        },
        crimson: {
          DEFAULT: "#8B2020",
          light: "#C44444",
          dark: "#5A1010",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
        "sacred-gradient": "linear-gradient(180deg, #0D0A06 0%, #1A1308 100%)",
        "parchment-gradient": "linear-gradient(135deg, #fdfaf4 0%, #f2e0bc 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201, 168, 76, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(201, 168, 76, 0.7)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      boxShadow: {
        gold: "0 0 30px rgba(201, 168, 76, 0.4)",
        "gold-sm": "0 0 15px rgba(201, 168, 76, 0.3)",
        sacred: "0 8px 32px rgba(0, 0, 0, 0.6)",
        inner: "inset 0 2px 8px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
