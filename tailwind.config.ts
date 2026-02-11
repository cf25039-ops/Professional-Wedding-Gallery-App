import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        babyBlue: {
          50: "#f3f8ff",
          100: "#e6f1ff",
          200: "#cfe2ff",
          300: "#b3d4fc",
          400: "#a0c4ff",
          500: "#8bb4f8",
          600: "#6f9fe6",
          700: "#5a83bf",
          800: "#42618d",
          900: "#2b3f5a"
        },
        ivory: "#fff8f2",
        silver: "#d9e2ec",
        night: "#1f2a3a"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 8px 30px rgba(160, 196, 255, 0.35)",
        soft: "0 6px 24px rgba(17, 24, 39, 0.08)"
      },
      borderRadius: {
        xl: "16px"
      }
    }
  },
  plugins: []
};

export default config;
