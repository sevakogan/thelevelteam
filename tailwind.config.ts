import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
        },
        brand: {
          dark: "var(--brand-dark)",
          darker: "var(--brand-darker)",
          card: "var(--brand-card)",
          border: "var(--brand-border)",
          muted: "var(--brand-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          blue: "var(--accent)",
          purple: "var(--purple)",
          cyan: "var(--teal)",
          emerald: "var(--success)",
          pink: "var(--pink)",
        },
        ios: {
          blue: "var(--accent)",
          red: "var(--destructive)",
          green: "var(--success)",
          orange: "var(--orange)",
          yellow: "var(--yellow)",
          teal: "var(--teal)",
          purple: "var(--purple)",
          pink: "var(--pink)",
          fill: "var(--fill)",
          "fill-secondary": "var(--fill-secondary)",
          "fill-tertiary": "var(--fill-tertiary)",
        },
        separator: {
          DEFAULT: "var(--separator)",
          opaque: "var(--separator-opaque)",
        },
        glass: {
          bg: "var(--glass-bg)",
          border: "var(--glass-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        display: ["var(--font-syne)", "var(--font-geist-sans)"],
      },
      borderRadius: {
        ios: "var(--radius)",
        "ios-lg": "var(--radius-lg)",
      },
      boxShadow: {
        ios: "0 0 0 0.5px var(--separator), 0 1px 3px rgba(0,0,0,0.06)",
        "ios-lg": "0 0 0 0.5px var(--separator), 0 4px 12px rgba(0,0,0,0.08)",
        "ios-xl": "0 0 0 0.5px var(--separator), 0 8px 24px rgba(0,0,0,0.12)",
        glow: "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.2)",
        glass: "0 8px 32px var(--glass-shadow)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
