import AlertBanner from 'components/AlertBanner'
import { CMS_DESCRIPTION, CMS_NAME } from 'lib/constants' // Or fetch from settings
// components/BlogLayout.tsx (or your main layout file)
import Head from 'next/head'

// Assuming you have access to global settings if needed
// import { Settings } from 'lib/sanity.queries';


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
        {/* Default SEO - Social tags are handled per page */}
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
      </Head>
      <div className="min-h-screen  ">
        <AlertBanner preview={preview} loading={loading} />
        <main>{children}</main>
      </div>
    </>
  )
}
