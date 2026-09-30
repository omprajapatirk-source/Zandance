/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border, 240 5% 18%))",
        input: "hsl(var(--input, 240 5% 18%))",
        ring: "hsl(var(--ring, 191 100% 50%))",
        background: "hsl(var(--background, 240 10% 3.9%))",
        foreground: "hsl(var(--foreground, 0 0% 100%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 191 100% 50%))",
          foreground: "hsl(var(--primary-foreground, 0 0% 0%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 240 5% 15%))",
          foreground: "hsl(var(--secondary-foreground, 0 0% 100%))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84.2% 60.2%))",
          foreground: "hsl(var(--destructive-foreground, 0 0% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 240 6% 12%))",
          foreground: "hsl(var(--muted-foreground, 215 20.2% 85%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 271 76% 58%))",
          foreground: "hsl(var(--accent-foreground, 0 0% 100%))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, 240 10% 3.9%))",
          foreground: "hsl(var(--popover-foreground, 0 0% 100%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 240 10% 4.9%))",
          foreground: "hsl(var(--card-foreground, 0 0% 100%))",
        },
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
    },
  },
  plugins: [],
}
