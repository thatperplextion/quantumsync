/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          light: {
            bg: '#ffffff',
            text: '#1a1a1a',
            primary: '#3b82f6',
            secondary: '#6366f1',
            accent: '#8b5cf6',
          },
          dark: {
            bg: '#030712',
            text: '#ffffff',
            primary: '#60a5fa',
            secondary: '#818cf8',
            accent: '#a78bfa',
          },
        },
      },
      transitionProperty: {
        'colors': 'background-color, border-color, color, fill, stroke',
      },
      transitionDuration: {
        '250': '250ms',
      },
      transitionTimingFunction: {
        'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}