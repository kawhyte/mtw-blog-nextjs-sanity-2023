import 'tailwindcss/tailwind.css'

import { MantineProvider } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import { AppProps } from 'next/app'
import { Antonio } from 'next/font/google';

const antonio = Antonio({
  subsets: ['latin'],
  variable: '--antonio-font',
});

// const lora = Lora({
//   subsets: ['latin'],
//   variable: '--font-lora',
// })
// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
// })



export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider> 
    <main className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
    </MantineProvider>
  )
}
