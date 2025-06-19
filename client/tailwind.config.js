/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                 // ✅ include this
    "./src/**/*.{js,jsx,ts,tsx}",   // ✅ scan your source files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#9333EA',
        accent: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
