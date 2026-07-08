import BlogMeta from 'components/BlogMeta'
import { urlForImage } from 'lib/sanity.image'
import { Settings } from 'lib/sanity.queries'
import Head from 'next/head'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export interface StaticPageHeadProps {
  settings: Settings
  title: string
  description: string
  /** Path starting with '/', e.g. '/top-hotel-picks' */
  path: string
}

export default function StaticPageHead({
  settings,
  title,
  description,
  path,
}: StaticPageHeadProps) {
  const { ogImage } = settings || {}

  let ogImageUrl = `${SITE_URL}/MeettheWhytes.jpg`
  if (ogImage?.asset?._ref) {
    ogImageUrl = urlForImage(ogImage)
      .width(1200)
      .height(630)
      .fit('crop')
      .url()
  }
  if (ogImageUrl && !ogImageUrl.startsWith('http')) {
    ogImageUrl = `${SITE_URL}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`
  }

  const pageUrl = `${SITE_URL}${path}`

  return (
    <Head>
      <BlogMeta />
      <title>{title}</title>
      <meta key="description" name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@meetthewhytes" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:url" content={pageUrl} />

      <link rel="canonical" href={pageUrl} />
    </Head>
  )
}
