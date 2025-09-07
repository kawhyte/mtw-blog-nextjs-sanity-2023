import BlogMeta from 'components/BlogMeta'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import { Settings } from 'lib/sanity.queries'
import Head from 'next/head'

export interface CategoryPageHeadProps {
  settings: Settings
  categoryType: 'hotels' | 'food' | 'guides' | 'arenas'
  totalCount?: number
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export default function CategoryPageHead({
  settings,
  categoryType,
  totalCount = 0,
}: CategoryPageHeadProps) {
  const { ogImage } = settings || {}

  // SEO-optimized titles and descriptions for each category
  const categoryData = {
    hotels: {
      title: 'NBA & WNBA Arena Hotel Reviews | Best Places to Stay Near Arenas',
      description: `Honest hotel reviews from our quest to visit every NBA & WNBA arena. Find the best hotels near basketball arenas with insider tips from fellow sports fans. ${totalCount > 0 ? `${totalCount} detailed reviews.` : ''}`,
    },
    food: {
      title:
        'NBA & WNBA Arena Food Reviews | Local Dining Near Basketball Venues',
      description: `Discover the best restaurants and local food near NBA & WNBA arenas. Real reviews from basketball fans traveling the arena circuit. ${totalCount > 0 ? `${totalCount} food reviews.` : ''}`,
    },
    guides: {
      title: "NBA & WNBA Arena Travel Guides | Basketball Fan's Travel Tips",
      description: `Complete travel guides for visiting NBA & WNBA arenas. Planning tips, local attractions, and insider knowledge from our arena quest. ${totalCount > 0 ? `${totalCount} comprehensive guides.` : ''}`,
    },
    arenas: {
      title: 'NBA & WNBA Arena Reviews | Complete Arena Quest Guide',
      description: `Reviews and guides for every NBA & WNBA arena from our quest to visit them all. Stadium tips, seating guides, and game day experiences. ${totalCount > 0 ? `${totalCount} arena reviews.` : ''}`,
    },
  }

  const { title: pageTitle, description: pageDescription } =
    categoryData[categoryType]

  // Generate OG Image URL
  let ogImageUrl = `${SITE_URL}/MeettheWhytes.jpg` // Fallback
  if (ogImage?.asset?._ref) {
    ogImageUrl = urlForImage(ogImage).width(1200).height(630).fit('crop').url()
  }

  // Ensure the generated URL is absolute
  if (ogImageUrl && !ogImageUrl.startsWith('http')) {
    ogImageUrl = `${SITE_URL}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`
  }

  const pageUrl = `${SITE_URL}/${categoryType}`

  return (
    <Head>
      <BlogMeta />
      <title>{pageTitle}</title>
      <meta key="description" name="description" content={pageDescription} />

      {/* Open Graph tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@meetthewhytes" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:url" content={pageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name:
                  categoryType === 'hotels'
                    ? 'Hotel Reviews'
                    : categoryType === 'food'
                      ? 'Food Reviews'
                      : categoryType === 'guides'
                        ? 'Travel Guides'
                        : 'Arena Reviews',
                item: pageUrl,
              },
            ],
          }),
        }}
      />

      {/* ItemList Structured Data for Category Pages */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name:
              categoryType === 'hotels'
                ? 'NBA Arena Hotel Reviews'
                : categoryType === 'food'
                  ? 'NBA Arena Food Reviews'
                  : categoryType === 'guides'
                    ? 'NBA Arena Travel Guides'
                    : 'NBA Arena Reviews',
            description: pageDescription,
            url: pageUrl,
            numberOfItems: totalCount,
          }),
        }}
      />

      {/* Additional SEO meta tags */}
      <meta
        name="keywords"
        content={
          categoryType === 'hotels'
            ? 'NBA hotel reviews, WNBA arena hotels, basketball travel, sports travel hotels, arena hotels'
            : categoryType === 'food'
              ? 'NBA arena food, WNBA arena restaurants, basketball game food, sports venue dining'
              : categoryType === 'guides'
                ? 'NBA arena travel guide, WNBA venue guide, basketball travel tips, sports arena guide'
                : 'NBA arena reviews, WNBA venue reviews, basketball stadium guide, sports arena experiences'
        }
      />
    </Head>
  )
}
