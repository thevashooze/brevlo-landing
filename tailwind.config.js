/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
      },
      colors: {
        neon: '#a855f7',
        'neon-dim': '#7c3aed',
        'dark-bg': '#0a0a0b',
        'dark-surface': '#111114',
        'dark-border': '#1f1f23',
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'marquee-left': 'marquee-left 35s linear infinite',
        'marquee-left-fast': 'marquee-left 25s linear infinite',
        'marquee-right': 'marquee-right 35s linear infinite',
        'marquee-right-fast': 'marquee-right 25s linear infinite',
      },
    },
  },
  plugins: [],
};
