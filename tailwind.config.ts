import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NUST corporate palette, sampled from the myNUST portal
        ink: {
          DEFAULT: "#1B2C5D", // NUST navy
          light: "#2C4173",
          faint: "#5B6C99",
        },
        paper: {
          DEFAULT: "#F6F4EE",
          card: "#FFFFFF",
        },
        brass: {
          DEFAULT: "#FCAF17", // NUST gold
          light: "#FDC24E",
        },
        nustred: "#DC332E", // NUST red
        good: "#2F6B4F",
        warn: "#B8863B",
        bad: "#DC332E",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
