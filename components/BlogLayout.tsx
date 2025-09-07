import AlertBanner from 'components/AlertBanner'
import { CMS_DESCRIPTION, CMS_NAME } from 'lib/constants' // Or fetch from settings
// components/BlogLayout.tsx (or your main layout file)
import Head from 'next/head'

// Assuming you have access to global settings if needed
// import { Settings } from 'lib/sanity.queries';

// --- Define Base URL and Default Image ---
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '' // Fallback to empty string if not set
// Create a default OG image (e.g., 1200x630px) and place it in your /public folder
const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/MeettheWhytes.png` // Adjust filename as needed

export default function BlogLayout({
  preview,
  loading,
  children,
}: {
  preview: boolean
  loading?: boolean
  children: React.ReactNode
}) {
  // --- Use settings or fallbacks for default title/description ---
  // const siteTitle = settings?.title || demo.title;
  // const siteDescription = settings?.description ? toPlainText(settings.description) : demo.description;
  // For simplicity here, using demo data. Fetch/pass settings for real data.
  const siteTitle = CMS_NAME
  const siteDescription = CMS_DESCRIPTION

  return (
    <>
      <Head>
        {/* Standard Meta */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta
          name="theme-color"
          content="hsl(330, 81%, 62%)"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="hsl(209, 34%, 12%)"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Meet the Whytes" />
        {/* Resource hints for mobile performance */}
        <link rel="dns-prefetch" href="//cdn.sanity.io" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="//cdn.sanity.io" crossOrigin="anonymous" />
        <link
          rel="preconnect"
          href="//fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="//fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Default SEO */}
        <title>{siteTitle}</title> {/* Default title */}
        <meta name="description" content={siteDescription} />{' '}
        {/* Default description */}
        {/* Default Open Graph Tags */}
        <meta property="og:site_name" content={siteTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} /> {/* Default */}
        <meta property="og:description" content={siteDescription} />{' '}
        {/* Default */}
        <meta property="og:image" content={DEFAULT_OG_IMAGE_URL} />{' '}
        {/* Default */}
        <meta property="og:image:width" content="1200" />{' '}
        {/* Standard OG width */}
        <meta property="og:image:height" content="630" />{' '}
        {/* Standard OG height */}
        {/* og:url should be set per page */}
        {/* Default Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        {/* Optional: <meta name="twitter:site" content="@YourTwitterHandle" /> */}
        <meta name="twitter:title" content={siteTitle} /> {/* Default */}
        <meta name="twitter:description" content={siteDescription} />{' '}
        {/* Default */}
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE_URL} />{' '}
        {/* Default */}
        {/* twitter:url should be set per page */}
      </Head>
      <div className="min-h-screen  ">
        <AlertBanner preview={preview} loading={loading} />
        <main>{children}</main>
      </div>
    </>
  )
}
