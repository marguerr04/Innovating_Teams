/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Colores de la temática de emprendimiento
      colors: {
        // Azul principal/fondo
        emprendimiento: {
          azul: '#2E5E8C',
          'azul-hover': '#254c72'
        },
        // Cyan para botones principales
        cyan: {
          principal: '#00B8A9',
          'principal-hover': '#00a396'
        },
        // Amarillo para destacados
        amarillo: {
          principal: '#FDC328',
          'principal-hover': '#e6b023'
        },
        // Rosa para elementos especiales
        rosa: {
          principal: '#E24872',
          'principal-hover': '#d13963'
        },
        // Naranja opcional
        naranja: {
          principal: '#FF7B39',
          'principal-hover': '#e66d33'
        },
        // Mantenemos los existentes para compatibilidad
        sea: { 500: '#2e5e8c', 600: '#254c72' },
        mint: { 500: '#00B8A9' },
        accent: { 500: '#FF7B39' }
      }
    },
  },
  plugins: [],
}