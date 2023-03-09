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
        'gray-500': '#6b7280',
      },
      dropShadow: {
        'lg': '0 0 32px #e6e6f1'
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
