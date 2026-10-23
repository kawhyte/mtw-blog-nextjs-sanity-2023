import AlertBanner from 'components/AlertBanner'
// components/BlogLayout.tsx (or your main layout file)
import Head from 'next/head'

// Assuming you have access to global settings if needed
// import { Settings } from 'lib/sanity.queries';

export default function BlogLayout({
  preview,
  loading,
  children,
}: {
  preview?: boolean
  loading?: boolean
  children: React.ReactNode
}) {
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
        {/* The default title and description live in _app.tsx: a <Head>
            tag rendered last wins, and this layout renders after each
            page's own head, so defaults here hid every page's title */}
      </Head>
      {/* Flex column so the footer (rendered last inside <main>) can sit at the
          bottom of the screen on short pages via its mt-auto */}
      <div className="flex min-h-screen flex-col">
        <AlertBanner preview={preview} loading={loading} />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </>
  )
}
