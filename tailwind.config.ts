import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./tests/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem"
      },
      boxShadow: {
        glass: "0 20px 60px rgba(4, 12, 24, 0.45)",
        panel: "0 12px 40px rgba(15, 23, 42, 0.55)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 20% 20%, rgba(26, 190, 255, 0.2), transparent 25%), radial-gradient(circle at 80% 10%, rgba(103, 232, 249, 0.18), transparent 20%), radial-gradient(circle at 50% 80%, rgba(56, 189, 248, 0.15), transparent 30%)"
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
