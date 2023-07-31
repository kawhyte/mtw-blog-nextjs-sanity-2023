import 'tailwindcss/tailwind.css'

import { AppProps } from 'next/app'
import { Oswald,Lora } from 'next/font/google'


const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})
const oswald = Oswald({
  weight:'500',
  subsets: ['latin'],
   variable: '--font-oswald',
  // variable:
})



export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${oswald.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  )
}
