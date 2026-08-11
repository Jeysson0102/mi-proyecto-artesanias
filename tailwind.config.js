/** @type {import('tailwindcss').Config} */
module.exports = {
  // Las rutas donde Tailwind buscará tus clases
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  
  // ¡ESTA ES LA LÍNEA QUE FALTABA PARA NATIVEWIND v4!
  presets: [require("nativewind/preset")],
  
  theme: {
    extend: {},
  },
  plugins: [],
}