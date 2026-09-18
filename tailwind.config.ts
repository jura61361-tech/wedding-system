import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fdfbf3",
          100: "#fbf6e3",
          200: "#f5e8be",
          300: "#edd48f",
          400: "#e4bd5f",
          500: "#d4af37",
          600: "#b88f28",
          700: "#936d21",
          800: "#795720",
          900: "#67481f",
          950: "#3c270d",
        },
        crimson: {
          50: "#fef2f2",
          100: "#ffe1e1",
          200: "#ffc8c8",
          300: "#ffa2a2",
          400: "#f86e6e",
          500: "#ee3f3f",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#8b0000",
          900: "#600000",
          950: "#3d0000",
        },
        ivory: {
          50: "#fcfbf7",
          100: "#f8f6ee",
          200: "#f2ecdc",
          300: "#e8dcbe",
          400: "#dbc798",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-kantumruy)", "sans-serif"],
        khmer: ["var(--font-kantumruy)", "var(--font-battambang)", "sans-serif"],
        serif: ["var(--font-serif-khmer)", "serif"],
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 10px 25px -3px rgba(212, 175, 55, 0.35)",
        crimson: "0 4px 20px -2px rgba(139, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
