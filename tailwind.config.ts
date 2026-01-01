import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "rgb(var(--bg) / <alpha-value>)",
          panel: "rgb(var(--panel) / <alpha-value>)",
          panel2: "rgb(var(--panel2) / <alpha-value>)",
          text: "rgb(var(--text) / <alpha-value>)",
          muted: "rgb(var(--muted) / <alpha-value>)",
          accent: "rgb(var(--accent) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
