import '../styles/globals.css';

import { AppProps } from 'next/app';
import { montserrat, raleway, inter, oswald, roboto_mono, space } from '../app/fonts';
import { ThemeProvider } from '@/components/theme-provider';

// Fonts are now imported from app/fonts.ts for better organization

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main
          className={`${montserrat.variable} ${raleway.variable} ${inter.variable} ${space.variable} ${roboto_mono.variable} ${oswald.variable}`}
        >
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </>
  );
}