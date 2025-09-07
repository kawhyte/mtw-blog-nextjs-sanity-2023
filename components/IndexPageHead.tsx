import { toPlainText } from '@portabletext/react'
import BlogMeta from 'components/BlogMeta'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import { Settings } from 'lib/sanity.queries'
import Head from 'next/head'

export interface IndexPageHeadProps {
  settings: Settings
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export default function IndexPageHead({ settings }: IndexPageHeadProps) {
  const {
    title = demo.title,
    description = demo.description,
    ogImage,
  } = settings
  const ogImageTitle = ogImage?.title || demo.ogImageTitle

  // --- Generate OG Image URL ---
  let ogImageUrl = `${SITE_URL}/MeettheWhytes.jpg` // Fallback
  if (ogImage?.asset?._ref) {
    // If an image is set in Sanity settings, use it
    ogImageUrl = urlForImage(ogImage)
      .width(1200)
      .height(630)
      .fit('crop') // or 'cover'
      .url()
  } else {
    // --- Alternative: Keep Vercel OG Image API if preferred ---
    // Ensure the title passed to the API is reasonable
    // const ogApiTitle = ogImage?.title || title || demo.ogImageTitle;
    // ogImageUrl = `${SITE_URL}/api/og?${new URLSearchParams({ title: ogApiTitle })}`;
    // Note: Ensure your /api/og route generates a valid image and handles errors.
    // Using a direct image from Sanity is often simpler and more reliable.
  }

  // Ensure the generated URL is absolute (urlForImage might already do this depending on config)
  // If urlForImage provides a relative path, prepend SITE_URL
  if (ogImageUrl && !ogImageUrl.startsWith('http')) {
    ogImageUrl = `${SITE_URL}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`
  }

  // SEO-optimized title for NBA/WNBA arena travel blog
  const pageTitle =
    'NBA & WNBA Arena Travel Guide | Hotels, Food & Reviews - Meet the Whytes'

  // SEO-optimized description focusing on the arena quest niche
  const pageDescription =
    'Join our quest to visit every NBA & WNBA arena! Honest hotel reviews, local food guides, and travel tips from fellow basketball fans. Plan your arena road trip with insider knowledge.'

  const pageUrl = SITE_URL + '/' // URL of the homepage

  return (
    <Head>
      {/* <title>{title}</title> */}
      <BlogMeta />
      <title>{pageTitle}</title>
      <meta key="description" name="description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@meetthewhytes" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:url" content={pageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Meet the Whytes',
            description:
              'NBA & WNBA Arena Travel Blog - Join our quest to visit every basketball arena!',
            url: SITE_URL,
            logo: `${SITE_URL}/MeettheWhytes.jpg`,
            sameAs: [
              // Add social media profiles when available
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
            },
          }),
        }}
      />

      {/* Website Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Meet the Whytes - NBA & WNBA Arena Travel Guide',
            description: pageDescription,
            url: SITE_URL,
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </Head>
  )
}
