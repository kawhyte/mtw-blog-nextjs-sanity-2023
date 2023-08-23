import 'tailwindcss/tailwind.css'

import { MantineProvider } from '@mantine/core'
import { AppProps } from 'next/app'
import { Inter, Lora,Oswald } from 'next/font/google'


const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})


export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider> 
    <main className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
    </MantineProvider>
  )
}
