/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f7fafc",
        card: "#ffffff",
        accent: "#2563eb",
        muted: "#6b7280",
      },
    },
  },
  plugins: [],
};
