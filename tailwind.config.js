/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './intro-template/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './plugins/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Neo-Brutalist design system fonts (only these two are loaded)
        epilogue: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        'plus-jakarta-sans': ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
