export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Tight', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        'void': '#050505',
        'glass': 'rgba(255, 255, 255, 0.03)',
        'accent': '#E2E2E2' // Soft off-white is more premium than pure white
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
