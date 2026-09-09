/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#fdfcf9',
          100: '#faf6ee',
          150: '#f6efe1',
          200: '#f0e6d2',
          300: '#e5d5be',
          400: '#d5bea1',
          500: '#be9f7b',
          600: '#a6825c',
          700: '#896745',
          800: '#6f5238',
          900: '#5a422e',
        },
        gold: {
          50: '#fbf8ea',
          100: '#f6f0c8',
          200: '#ede092',
          300: '#e2ca5c',
          400: '#d7b434',
          500: '#b8941f',
          600: '#947217',
          700: '#715414',
          800: '#5b4315',
          900: '#4e3816',
        },
        legal: {
          navy: '#1b2a4a',
          dark: '#1e1e24',
          charcoal: '#242426',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
