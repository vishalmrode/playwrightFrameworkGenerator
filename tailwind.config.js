/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        xxs: "10px",
        xs: "11px",
        sm: "12px",
        base: "14px",
        lg: "15px",
        xl: "18px",
        xxl: "22px",
        display: "26px",
        sharePageHeader: [],
      },
      width: {
        128: "32rem",
        152: "38rem",
      },
      boxShadow: {
        "sm-light":
          "0 2px 3px -1px rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        "md-light":
          "0 3px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
        "md-lightest":
          "0 3px 6px -1px rgba(0, 0, 0, 0.015), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        "lg-light":
          "0 5px 15px -2px rgba(0, 0, 0, 0.06), 0 3px 5px -1px rgba(0, 0, 0, 0.04)",
        "lg-lighter":
          "0 5px 15px -2px rgba(0, 0, 0, 0.04), 0 3px 5px -1px rgba(0, 0, 0, 0.02)",
        "lg-light-none":
          "0 5px 15px -2px rgba(0, 0, 0, 0.0), 0 3px 5px -1px rgba(0, 0, 0, 0)",
      },
      animation: {
        "fade-in": "fade-in 0.4s",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slow-bounce": "slow-bounce 1.35s infinite",
      },
      screens: {
        portrait: {
          raw: "(orientation: portrait)",
        },
        landscape: {
          raw: "(orientation: landscape)",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "slow-bounce": {
          "0%,100%": {
            transform: "translateY(-2%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(2%)",
            "animation-timing-function": "cubic-bezier(0.4, 0, 0.4, 1)",
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
