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
          50: "var(--parchment-50)",
          100: "var(--parchment-100)",
          200: "var(--parchment-200)",
          300: "var(--parchment-300)",
          400: "var(--parchment-400)",
          500: "var(--parchment-500)",
          600: "var(--parchment-600)",
          700: "var(--parchment-700)",
          800: "var(--parchment-800)",
          900: "var(--parchment-900)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
          dark: "var(--gold-dark)",
        },
        sacred: {
          dark: "var(--sacred-dark)",
          deeper: "var(--sacred-deeper)",
          warm: "var(--sacred-warm)",
          mid: "var(--sacred-mid)",
          accent: "var(--sacred-accent)",
        },
        "text-on-gold": "var(--text-on-gold)",
        olive: {
          DEFAULT: "var(--olive)",
          light: "var(--olive-light)",
          dark: "var(--olive-dark)",
        },
        crimson: {
          DEFAULT: "var(--crimson)",
          light: "var(--crimson-light)",
          dark: "var(--crimson-dark)",
        },
      },
      backgroundImage: {
        "gold-gradient": "var(--gradient-gold)",
        "sacred-gradient": "var(--gradient-sacred)",
        "parchment-gradient": "var(--gradient-parchment)",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(var(--gold-rgb), 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(var(--gold-rgb), 0.7)" },
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
        gold: "var(--shadow-gold)",
        "gold-sm": "var(--shadow-gold-sm)",
        sacred: "var(--shadow-sacred)",
        inner: "var(--shadow-inner)",
      },
    },
  },
  plugins: [],
};
