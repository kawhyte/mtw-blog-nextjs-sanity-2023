import '../styles/globals.css';

import { AppProps } from 'next/app';

import { inter, montserrat, oswald, raleway, roboto_mono, space } from '../app/fonts';

// Fonts are now imported from app/fonts.ts for better organization

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <main
        className={`${montserrat.variable} ${raleway.variable} ${inter.variable} ${space.variable} ${roboto_mono.variable} ${oswald.variable}`}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
}