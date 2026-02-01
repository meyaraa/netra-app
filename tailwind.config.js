/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'], 
        },
        boxShadow: {
          'soft': '0 0 10px rgba(0, 0, 0, 0.010)',       
          'soft-hover': '0 0 15px rgba(0, 0, 0, 0.08)', 
          'glow': '0 0 15px rgba(79, 70, 229, 0.15)',  
        }
      },
    },
    plugins: [],
}