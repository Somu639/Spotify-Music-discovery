import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        app: {
          bg: "var(--app-bg)",
          shell: "var(--app-shell)",
          panel: "var(--app-panel)",
          surface: "var(--app-surface)",
          elevated: "var(--app-elevated)",
          border: "var(--app-border)",
          text: "var(--app-text)",
          muted: "var(--app-muted)",
          subtle: "var(--app-subtle)",
          chip: "var(--app-chip)",
          "chip-hover": "var(--app-chip-hover)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
