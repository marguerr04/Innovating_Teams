/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // --- AÑADIR ESTO ---
      colors: {
        sea: { 500: '#2e5e8c', 600: '#254c72' },
        mint: { 500: '#00B8A9' },
        accent: { 500: '#FF7B39' }
      }
      // --- FIN DE LO AÑADIDO ---
    },
  },
  plugins: [],
}