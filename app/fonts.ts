// Font configuration using CSS custom properties
// Fonts are loaded via Google Fonts link in _document.tsx to avoid build-time network issues

export const fontVariables = {
  montserrat: '--font-montserrat',
  raleway: '--font-raleway',
  inter: '--font-inter', 
  space: '--font-space-grotesk',
  roboto_mono: '--font-roboto-mono',
  oswald: '--font-oswald',
}

// For backwards compatibility with existing imports
export const montserrat = { variable: '--font-montserrat' }
export const raleway = { variable: '--font-raleway' }
export const inter = { variable: '--font-inter' }
export const space = { variable: '--font-space-grotesk' }
export const roboto_mono = { variable: '--font-roboto-mono' }
export const oswald = { variable: '--font-oswald' }
