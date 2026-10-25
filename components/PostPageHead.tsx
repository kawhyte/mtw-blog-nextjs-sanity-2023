import { toPlainText } from '@portabletext/react'
import BlogMeta from 'components/BlogMeta'
import { cardName } from 'components/listing/ListingCard'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import {
  FoodReview,
  Guide,
  HotelReview,
  Post,
  Settings,
} from 'lib/sanity.queries'
import Head from 'next/head'

// Common fields that all content types should have for SEO
interface SEOContent {
  title?: string
  slug?: string
  excerpt2?: any
  coverImage?: any
  date?: string
  author?: any
}

export interface PostPageHeadProps {
  settings: Settings
  post: Post | Guide | HotelReview | FoodReview | SEOContent
  contentType?: 'post' | 'guide' | 'hotel' | 'food' | 'arena'
}
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export default function PostPageHead({
  settings,
  post,
  contentType,
}: PostPageHeadProps) {
  const siteTitle = settings?.title || demo.title

  // Titles stay near 60 characters so Google shows them whole. Hotel and
  // food titles often already end in "Hotel Review", so that's dropped
  // before adding "Review" back; renamed arenas lead with the new name,
  // which is what people search for
  let pageTitle = siteTitle
  if (post?.title) {
    if (contentType === 'hotel' || contentType === 'food') {
      pageTitle = `${cardName(post.title)} Review | Meet the Whytes`
    } else if (contentType === 'arena') {
      const currentName = (post as any).currentName as string | undefined
      const name = currentName ? `${currentName} (${post.title})` : post.title
      // No "Review" until we've been
      pageTitle = (post as any).visited
        ? `${name} Review: Seats, Food & Tips | Meet the Whytes`
        : `${name} | Meet the Whytes`
    } else {
      pageTitle = `${post.title} | Meet the Whytes`
    }
  }

  // --- Generate Description (Ensure it's always a string) ---
  let pageDescription: string // Explicitly type as string

  if (
    'summary' in post &&
    typeof (post as any).summary === 'string' &&
    (post as any).summary.trim()
  ) {
    // 1. Use guide summary field (plain string, SEO-optimized)
    pageDescription = (post as any).summary
  } else if (
    contentType === 'arena' &&
    typeof (post as any).excerpt === 'string' &&
    (post as any).excerpt.trim()
  ) {
    // 2a. Use editor-written excerpt from Sanity (highest quality)
    pageDescription = (post as any).excerpt.trim()
  } else if (
    contentType === 'arena' &&
    (post as any).location
  ) {
    // 2b. Auto-generate from structured fields as fallback
    const loc = (post as any).location as string
    const capacity = (post as any).capacity as number | undefined
    pageDescription = `Our honest tips and review of ${post.title} in ${loc}${capacity ? ` (${capacity.toLocaleString()} seats)` : ''}. Food, parking, sightlines, atmosphere and more from basketball fans who've been there.`
  } else if (
    'seoExcerpt' in post &&
    typeof (post as any).seoExcerpt === 'string' &&
    (post as any).seoExcerpt.trim()
  ) {
    // 3. Plain-text SEO excerpt for hotel/food reviews
    pageDescription = (post as any).seoExcerpt.trim()
  } else if (contentType === 'hotel' && post?.title && (post as any).location) {
    // 3b. Auto-generate hotel fallback from structured fields when seoExcerpt is missing
    const loc = (post as any).location as string
    const topPositive = Array.isArray((post as any).positives) && (post as any).positives[0]
    pageDescription = topPositive
      ? `${post.title} in ${loc}: ${topPositive}. Read our honest hotel review.`
      : `Our honest review of ${post.title} in ${loc}. Find out if it's worth booking for your NBA game trip.`
  } else if (contentType === 'food' && post?.title && (post as any).location) {
    // 3c. Auto-generate food fallback from structured fields when seoExcerpt is missing
    const loc = (post as any).location as string
    const topPositive = Array.isArray((post as any).positives) && (post as any).positives[0]
    const diningLabel = (post as any).diningType === 'takeout' ? 'takeout' : 'restaurant'
    pageDescription = topPositive
      ? `${post.title} in ${loc}: ${topPositive}. Read our honest ${diningLabel} review.`
      : `Our honest ${diningLabel} review of ${post.title} in ${loc}. Real food, real opinions from the Meet the Whytes.`
  } else if (
    settings?.description &&
    Array.isArray(settings.description) &&
    settings.description.length > 0
  ) {
    // 2. Fallback to site description if available and looks like Portable Text
    pageDescription = toPlainText(settings.description)
  } else if (post?.title) {
    // 3. Fallback to the post title itself (already a string)
    pageDescription = post.title
  } else {
    // 4. Final fallback to demo string or empty
    pageDescription = Array.isArray(demo.description)
      ? toPlainText(demo.description)
      : demo.description || ''
  }
  // Renamed arenas: put today's name next to the visit-era name, which is
  // what people search for now ("Our Amway Center (now Kia Center) review")
  const currentName = (post as any).currentName as string | undefined
  if (
    contentType === 'arena' &&
    currentName &&
    post?.title &&
    !pageDescription.includes(currentName)
  ) {
    pageDescription = pageDescription.includes(post.title)
      ? pageDescription.replace(post.title, `${post.title} (now ${currentName})`)
      : `Now called ${currentName}. ${pageDescription}`
  }

  // Ensure description isn't excessively long for meta tags, cutting at a
  // word so it doesn't end mid-word
  if (pageDescription.length > 160) {
    const cut = pageDescription.substring(0, 157)
    pageDescription = cut.substring(0, cut.lastIndexOf(' ')).replace(/[\s,.:;]+$/, '') + '...'
  }

  // --- Generate OG Image URL ---
  // Use the actual default image name from BlogLayout.tsx
  let ogImageUrl = `${SITE_URL}/MeettheWhytes.jpg`
  // Queries expand the asset (`asset->{ _id, ... }`), so there's no _ref
  if (post?.coverImage?.asset?._ref || post?.coverImage?.asset?._id) {
    ogImageUrl = urlForImage(post.coverImage)
      .width(1200)
      .height(630)
      .fit('crop') // Use 'crop' or 'cover' based on preference
      .url()
  }

  // Ensure the generated URL is absolute
  if (ogImageUrl && !ogImageUrl.startsWith('http')) {
    ogImageUrl = `${SITE_URL}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`
  }

  // --- Generate Page URL (Use contentType or infer from post data) ---
  let pathPrefix = '/posts' // Default prefix

  if (contentType) {
    // Use explicit contentType if provided
    switch (contentType) {
      case 'hotel':
        pathPrefix = '/hotel'
        break
      case 'food':
        pathPrefix = '/food'
        break
      case 'guide':
        pathPrefix = '/guide'
        break
      case 'arena':
        pathPrefix = '/arena'
        break
      case 'post':
      default:
        pathPrefix = '/posts'
        break
    }
  } else if ('linkType' in post && post.linkType) {
    // Fallback to linkType for legacy posts
    if (post.linkType === 'hotel') pathPrefix = '/hotel'
    else if (post.linkType === 'food') pathPrefix = '/food'
    else if (post.linkType === 'story') pathPrefix = '/guide'
  }

  const updatedAt = (post as any)?.updatedAt as string | undefined

  const pageUrl = post?.slug
    ? `${SITE_URL}${pathPrefix}/${post.slug}`
    : SITE_URL

  return (
    <Head>
      {/* --- Page Specific Head Tags --- */}
      <title>{pageTitle}</title>
      <BlogMeta />
      {/* Use the guaranteed string description */}
      <meta key="description" name="description" content={pageDescription} />
      {/* --- Open Graph Overrides --- */}
      <meta property="og:type" content="article" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={pageTitle} />
      {/* Use the guaranteed string description */}
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      {post?.date && (
        <meta property="article:published_time" content={post.date} />
      )}
      {(updatedAt || post?.date) && (
        <meta
          property="article:modified_time"
          content={updatedAt || post?.date}
        />
      )}
      {'tags' in post &&
        Array.isArray((post as any).tags) &&
        (post as any).tags.map((tag: string) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      {/* {post?.author?.name && <meta property="article:author" content={post.author.name} />} */}
      {/* --- Twitter Card Overrides --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@meetthewhytes" />
      <meta name="twitter:title" content={pageTitle} />
      {/* Use the guaranteed string description */}
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:url" content={pageUrl} />
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      {/* Article / Guide Structured Data, arena pages use ArenaStructuredData instead */}
      {contentType !== 'arena' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              contentType === 'guide'
                ? {
                    '@context': 'https://schema.org',
                    '@type': 'TravelGuide',
                    name: post?.title,
                    headline: post?.title,
                    description: pageDescription,
                    image: ogImageUrl,
                    url: pageUrl,
                    datePublished: post?.date,
                    dateModified: (post as any).updatedAt || post?.date,
                    inLanguage: 'en-US',
                    author: {
                      '@type': 'Organization',
                      name: 'Meet the Whytes',
                      url: SITE_URL,
                      sameAs: ['https://www.youtube.com/@mtwtravel'],
                    },
                    publisher: {
                      '@type': 'Organization',
                      name: 'Meet the Whytes',
                      url: SITE_URL,
                      logo: {
                        '@type': 'ImageObject',
                        url: `${SITE_URL}/MeettheWhytes.jpg`,
                      },
                    },
                    mainEntityOfPage: {
                      '@type': 'WebPage',
                      '@id': pageUrl,
                    },
                    touristType: [
                      'Basketball fans',
                      'Sports travelers',
                      'NBA enthusiasts',
                    ],
                    ...((post as any).location && {
                      destination: {
                        '@type': 'City',
                        name: (post as any).location,
                      },
                    }),
                    ...(Array.isArray((post as any).tags) &&
                      (post as any).tags.length > 0 && {
                        keywords: (post as any).tags.join(', '),
                      }),
                  }
                : {
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: post?.title,
                    description: pageDescription,
                    image: ogImageUrl,
                    url: pageUrl,
                    datePublished: post?.date,
                    dateModified: (post as any).updatedAt || post?.date,
                    inLanguage: 'en-US',
                    author: {
                      '@type': 'Organization',
                      name: 'Meet the Whytes',
                      url: SITE_URL,
                    },
                    publisher: {
                      '@type': 'Organization',
                      name: 'Meet the Whytes',
                      url: SITE_URL,
                      logo: {
                        '@type': 'ImageObject',
                        url: `${SITE_URL}/MeettheWhytes.jpg`,
                      },
                    },
                    mainEntityOfPage: {
                      '@type': 'WebPage',
                      '@id': pageUrl,
                    },
                  },
            ),
          }}
        />
      )}
      {/* Optional: Add Twitter creator handle if available */}
      {/* {post?.author?.twitterHandle && <meta name="twitter:creator" content={`@${post.author.twitterHandle}`} />} */}
    </Head>

  )
}
