/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Theme colors
        'black-denim': '#151922',
        'transparent': '#00000000',
        'near-white': '#e6e6f1',
        'slate-800': '#1e293b',
        'slate-700': '#334155',
      },
      dropShadow: {
        'sm': '0 0 2px rgba(255, 255, 255, 255)'
      }
    },
  },
  plugins: [],
}
