import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#16233F",
          light: "#25365C",
          faint: "#4A5A80",
        },
        paper: {
          DEFAULT: "#F6F4EE",
          card: "#FFFFFF",
        },
        brass: {
          DEFAULT: "#B8863B",
          light: "#D8AE6F",
        },
        good: "#2F6B4F",
        warn: "#B8863B",
        bad: "#A33D3D",
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
