/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        "custom-white": "4px 4px 3px rgba(255,255,255,0.3)",
        "custom-purple": "4px 4px 3px rgba(147,51,234,0.7)",
      },
    },
  },
  plugins: [],
};
