/** @type {import('tailwindcss').Config} */

const { shadow } = require('@cloudinary/url-gen/actions/effect')

module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './intro-template/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './plugins/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        logo: ['var(--font-space-grotesk)'],
        mono: ['var(--font-roboto-mono)'],
        heading: ['var(--font-oswald)'],
      },

      colors: {
        mtw: {
          color: '#1F3447',
          'light-yellow-background': '#fefce8',
          background: '#fafaf9',
          pink: '#f472b6',
          green: '#34d399',
          yellow: '#FACC16',
          indigo: '#818cf8',
          'accent-1': '#6347F9',
          'accent-2': '#EAEAEA',
          'accent-7': '#333',
          success: '#0070f3',
          cyan: '#79FFE1',
          'blue-500': '#2276FC',
          'yellow-100': '#fef7da',
        },
      },
      spacing: {
        28: '7rem',
      },
      letterSpacing: {
        tighter: '-.04em',
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem',
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
        offsetGreen: '18px 18px 0 -4px rgba(211, 34, 255, 0.12)',  
      },
    },
  },
  plugins: [],
}
