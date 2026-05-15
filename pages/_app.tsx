import '../styles/globals.css'
import '../styles/nprogress.css'

import { AppProps } from 'next/app'
import Script from 'next/script'

import NProgressBar from '../components/NProgressBar'

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="eaac332f-08e9-4b09-8d7a-66ff636cfcd9"
        data-domains="www.meetthewhytes.com"
        strategy="afterInteractive"
      />
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </Script>
        </>
      )}
      <NProgressBar />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}

export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    })
  }
}
