import '../styles/globals.css'
import '../styles/nprogress.css'

import { AppProps } from 'next/app'
import Script from 'next/script'

import {
  inter,
  montserrat,
  oswald,
  raleway,
  roboto_mono,
  space,
} from '../app/fonts'
import NProgressBar from '../components/NProgressBar'

// Fonts are now imported from app/fonts.ts for better organization

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="eaac332f-08e9-4b09-8d7a-66ff636cfcd9"
        strategy="afterInteractive"
      />
      <NProgressBar />
      <main
        className={`${montserrat.variable} ${raleway.variable} ${inter.variable} ${space.variable} ${roboto_mono.variable} ${oswald.variable}`}
      >
        <Component {...pageProps} />
      </main>
    </>
  )
}
