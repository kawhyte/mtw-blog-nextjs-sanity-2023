import '../styles/globals.css'
import '../styles/nprogress.css'

import { AppProps } from 'next/app'
import Script from 'next/script'

import NProgressBar from '../components/NProgressBar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="eaac332f-08e9-4b09-8d7a-66ff636cfcd9"
        data-domains="www.meetthewhytes.com"
        strategy="afterInteractive"
      />
      <NProgressBar />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}
