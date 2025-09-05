import {
  Inter,
  Montserrat,
  Oswald,
  Raleway,
  Roboto_Mono,
  Space_Grotesk,
} from 'next/font/google'

export const inter = Inter({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const space = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export const oswald = Oswald({
  weight: '600',
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

// New Adventure-Ready Font Pairing
export const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'], // Include Black (900)
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true, // Prioritize loading for headings
})

export const raleway = Raleway({
  weight: ['300', '400', '500', '600'], // Light to Semi-bold
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  preload: true, // Prioritize loading for body text
})
