// tailwind.config.js
module.exports = {
  content: [
    // Tienes que agregar "/src" al inicio de la ruta
    "./src/app/**/*.{js,jsx,ts,tsx}", 
    "./src/components/**/*.{js,jsx,ts,tsx}",
    
    // Mantén este por si acaso tienes algo fuera
    "./components/**/*.{js,jsx,ts,tsx}", 
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}