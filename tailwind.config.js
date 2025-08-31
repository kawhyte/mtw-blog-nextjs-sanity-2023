/** @type {import('tailwindcss').Config} */

// const { shadow } = require('@cloudinary/url-gen/actions/effect')

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
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-oswald)', 'system-ui', 'sans-serif'],
        'inter': ['var(--font-inter)'],
        'oswald': ['var(--font-oswald)'],
        'montserrat': ['var(--font-montserrat)'],
        'roboto-mono': ['var(--font-roboto-mono)'],
        'space-grotesk': ['var(--font-space-grotesk)'],
        'antonio': ['var(--antonio-font)'],
      },

      colors: {
        /* ===== shadcn/ui Theme Colors ===== */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        /* ===== Brand Colors ===== */
        brand: {
          primary: "hsl(var(--brand-primary))",
          "primary-dark": "hsl(var(--brand-primary-dark))",
          "primary-light": "hsl(var(--brand-primary-light))",
          secondary: "hsl(var(--brand-secondary))",
          "secondary-dark": "hsl(var(--brand-secondary-dark))",
          "secondary-light": "hsl(var(--brand-secondary-light))",
        },

        /* ===== Semantic Colors ===== */
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        info: "hsl(var(--info))",

        /* ===== Blog Specific ===== */
        blog: {
          text: "hsl(var(--blog-text))",
          "text-light": "hsl(var(--blog-text-light))",
          heading: "hsl(var(--blog-heading))",
          link: "hsl(var(--blog-link))",
          "link-hover": "hsl(var(--blog-link-hover))",
        },

        /* ===== Category Colors ===== */
        category: {
          luxury: "hsl(var(--category-luxury))",
          midscale: "hsl(var(--category-midscale))",
          economy: "hsl(var(--category-economy))",
          default: "hsl(var(--category-default))",
        },

        /* ===== Rating Colors ===== */
        rating: {
          excellent: "hsl(var(--rating-excellent))",
          good: "hsl(var(--rating-good))",
          average: "hsl(var(--rating-average))",
          poor: "hsl(var(--rating-poor))",
        },

        /* ===== Legacy MTW Colors (for backward compatibility) ===== */
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

      /* ===== Border Radius ===== */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        '83pt': '83pt',
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
        offsetGreen: '18px 18px 0 -4px rgba(187, 247, 208, .4)',  
        offsetRed: '18px 18px 0 -4px rgba(255, 241, 242, .3)',  
        offsetBlue: '18px 18px 0 -4px rgba(147, 197, 253, .3)',  
        offsetIndigo: '18px 18px 0 -4px rgba(199, 210, 254, 0.2)',  
        offsetYellow: '18px 18px 0 -4px rgba(253, 224, 71, 0.3)',  
        
      },
    },
  },
  plugins: [],
}
