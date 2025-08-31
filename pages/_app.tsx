import '../styles/globals.css';

import { AppProps } from 'next/app';
import { Inter, Oswald,Montserrat, Roboto_Mono, Space_Grotesk, Antonio } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

// Define your font objects
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-oswald',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  // Optionally specify weights if needed, e.g.,
   
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

const space = Space_Grotesk({
  subsets: ['latin'],
  
  variable: '--font-space-grotesk',
});

const antonio = Antonio({
  subsets: ['latin'],
  variable: '--font-antonio',
});

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
          className={`${inter.variable} ${space.variable} ${roboto_mono.variable} ${oswald.variable} ${antonio.variable}`}
        >
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </>
  );
}