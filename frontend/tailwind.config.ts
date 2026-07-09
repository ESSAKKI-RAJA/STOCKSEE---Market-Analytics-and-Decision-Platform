import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Inter", "sans-serif"], // Clean institutional heading
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["Inter", "sans-serif"],
      },
      colors: {
        border: "#27272A",
        input: "#27272A",
        ring: "#2563EB",
        background: "#000000",
        foreground: "#FAFAFA",
        surface: "#121212",
        "bg-secondary": "#0A0A0A",
        
        "blue-accent": "#2563EB",
        "purple-accent": "#7C3AED",
        "green-gain": "#10B981",
        "red-loss": "#EF4444",
        "gold-premium": "#F59E0B",
        
        primary: {
          DEFAULT: "#2563EB",
          foreground: "#FAFAFA",
        },
        secondary: {
          DEFAULT: "#0A0A0A",
          foreground: "#A1A1AA",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FAFAFA",
        },
        muted: {
          DEFAULT: "#0A0A0A",
          foreground: "#71717A",
        },
        accent: {
          DEFAULT: "#2563EB",
          foreground: "#FAFAFA",
          hover: "#3B82F6",
        },
        popover: {
          DEFAULT: "#121212",
          foreground: "#FAFAFA",
        },
        card: {
          DEFAULT: "#121212",
          foreground: "#FAFAFA",
        },
        sidebar: {
          DEFAULT: "#000000",
          foreground: "#A1A1AA",
          primary: "#2563EB",
          "primary-foreground": "#FAFAFA",
          accent: "#121212",
          "accent-foreground": "#FAFAFA",
          border: "#27272A",
          ring: "#2563EB",
        },
      },
      borderRadius: {
        lg: "0.5rem", // 8px for sharper institutional feel
        md: "0.375rem", // 6px
        sm: "0.25rem", // 4px
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float-up": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(40px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ticker-scroll": "ticker-scroll 30s linear infinite",
        "float-up": "float-up 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2.5s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
      },
      backdropBlur: {
        xs: "2px",
        md: "8px",
        lg: "16px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
