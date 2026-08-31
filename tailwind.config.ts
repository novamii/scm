import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#94CE47", // メインカラー：フレッシュグリーン
          grey: "#9AA1AC", // サブカラー：スレートグレイ
          alert: "#FF6B6B", // アラート：HACCP逸脱／ROI未達警告
          teal: "#2B7A78", // ROI強調：プラス成長アクセント
        },
        ink: {
          900: "#1C2321",
          700: "#3D4541",
          500: "#6B7370",
        },
      },
      fontFamily: {
        display: [
          "'Zen Kaku Gothic New'",
          "'Hiragino Sans'",
          "sans-serif",
        ],
        body: ["'Noto Sans JP'", "'Hiragino Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "10px",
        pill: "999px",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(28,35,33,0.06), 0 8px 24px -12px rgba(28,35,33,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
