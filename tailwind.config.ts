import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        // Cyber colors
        'cyber-dark': 'var(--cyber-dark)',
        'cyber-darker': 'var(--cyber-darker)',
        'cyber-gray': 'var(--cyber-gray)',
        'cyber-lighter': 'var(--cyber-lighter)',
        'cyber-cyan': 'var(--cyber-cyan)',
        'cyber-magenta': 'var(--cyber-magenta)',
        'cyber-blue': 'var(--cyber-blue)',
        'cyber-red': 'var(--cyber-red)',
        'cyber-orange': 'var(--cyber-orange)',
        'cyber-yellow': 'var(--cyber-yellow)',
        'cyber-green': 'var(--cyber-green)',
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        cyber: ["var(--font-cyber)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-threat": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "slideIn": {
          "from": { opacity: "0", transform: "translateY(20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-threat": "pulse-threat 2s infinite",
        "slideIn": "slideIn 0.3s ease-out",
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-cyan': '4px 4px 0px 0px #00ffff',
        'brutal-magenta': '4px 4px 0px 0px #ff00ff',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
