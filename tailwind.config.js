/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        },
        neon: {
          emerald: '#10b981',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          pink: '#ec4899',
          amber: '#f59e0b'
        }
      }
    },
  },
  plugins: [],
}
