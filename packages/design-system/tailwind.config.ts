import type { Config } from "tailwindcss";

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        bg: "#f8f6f1",
        "bg-card": "#fdfcfa",
        "bg-section": "#f2f0eb",
        "bg-tag": "#e8e5df",
        "text-primary": "#1a1614",
        "text-body": "#5c5147",
        "text-muted": "#8a7f76",
        "text-label": "#6b5f54",
        accent: "#2d6a4f",
        border: "#e0dbd5",
      },
      maxWidth: {
        content: "680px",
        "content-wide": "720px",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: [
          "var(--font-source-serif)",
          "Georgia",
          '"PingFang SC"',
          '"Microsoft YaHei"',
          "serif",
        ],
        mono: [
          "var(--font-jetbrains)",
          '"Courier New"',
          "monospace",
        ],
      },
      fontSize: {
        "section-label": ["10px", { letterSpacing: "1.5px", lineHeight: "1" }],
        "nav-item": ["11px", { letterSpacing: "0.5px", lineHeight: "1" }],
      },
    },
  },
};

export default config;
