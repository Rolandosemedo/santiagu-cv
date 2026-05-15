/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        ocean: {
          DEFAULT: "#0B5E8A",
          light: "#1A8FBF",
          dark: "#0B2E4A",
        },
        sand: {
          DEFAULT: "#F2C67D",
          light: "#FAE8C2",
          dark: "#C89040",
        },
        terra: {
          DEFAULT: "#C4622D",
          light: "#E8895A",
        },
        verde: {
          DEFAULT: "#1D9E75",
          light: "#E1F5EE",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 2px 20px rgba(11,46,74,0.10)",
        "card-hover": "0 8px 32px rgba(11,46,74,0.18)",
        pin: "0 4px 12px rgba(0,0,0,0.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
