import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "rgb(var(--bg-deep-rgb) / <alpha-value>)",
          900: "rgb(var(--bg-dark-rgb) / <alpha-value>)",
          800: "rgb(var(--bg-surface-rgb) / <alpha-value>)",
        },
        accent: {
          violet: "rgb(var(--accent-violet-rgb) / <alpha-value>)",
          indigo: "rgb(var(--accent-indigo-rgb) / <alpha-value>)",
          cyan: "rgb(var(--accent-cyan-rgb) / <alpha-value>)",
          mint: "rgb(var(--accent-mint-rgb) / <alpha-value>)",
        },
        semantic: {
          success: "rgb(var(--semantic-success-rgb) / <alpha-value>)",
          warning: "rgb(var(--semantic-warning-rgb) / <alpha-value>)",
          error: "rgb(var(--semantic-error-rgb) / <alpha-value>)",
        },
        txt: {
          primary: "rgb(var(--txt-primary-rgb) / <alpha-value>)",
          secondary: "rgb(var(--txt-secondary-rgb) / <alpha-value>)",
          muted: "rgb(var(--txt-muted-rgb) / <alpha-value>)",
        },
      },
      borderRadius: {
        card: "20px",
        btn: "13px",
        input: "13px",
        dialog: "24px",
        surface: "26px",
      },
      boxShadow: {
        glass:
          "0 16px 40px -12px rgba(5, 8, 18, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)",
        "glass-hover":
          "0 22px 48px -10px rgb(var(--accent-indigo-rgb) / 0.24), inset 0 1px 0 0 rgba(255, 255, 255, 0.24)",
        "glow-violet": "0 0 28px rgb(var(--accent-violet-rgb) / 0.35)",
        "glow-cyan": "0 0 28px rgb(var(--accent-cyan-rgb) / 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
