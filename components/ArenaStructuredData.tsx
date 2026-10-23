import { toPlainText } from '@portabletext/react'
import { urlForImage } from 'lib/sanity.image'
import { Arena } from 'lib/sanity.queries'
import Head from 'next/head'
import {
  arenaCountry,
  arenaSharePhoto,
  getArenaDisplayRating,
} from 'utils/arena/arenaUtils'

interface ArenaStructuredDataProps {
  arena: Arena
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export default function ArenaStructuredData({ arena }: ArenaStructuredDataProps) {
  if (!arena?.name || !arena?.slug) return null

  const pageUrl = `${SITE_URL}/arena/${arena.slug}`
  const photo = arenaSharePhoto(arena)
  const imageUrl = photo
    ? urlForImage(photo).width(1200).height(630).fit('crop').url()
    : `${SITE_URL}/MeettheWhytes.jpg`

  const address = arena.location && {
    '@type': 'PostalAddress',
    addressLocality: arena.location,
    addressCountry: arenaCountry(arena.location),
  }

  // Our own words: the verdict, else the excerpt
  const verdict = arena.prosConsVerdict?.verdict
    ? toPlainText(arena.prosConsVerdict.verdict as any).trim()
    : ''
  const reviewBody =
    verdict ||
    arena.excerpt?.trim() ||
    `Tips, food, transportation, sightlines, and atmosphere review for ${arena.name}${arena.location ? ` in ${arena.location}` : ''}.`

  const ratingResult = arena.arenaReview
    ? getArenaDisplayRating(arena)
    : null

  const sportsLocationData = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: arena.name,
    ...(arena.currentName && { alternateName: arena.currentName }),
    url: pageUrl,
    image: imageUrl,
    ...(address && { address }),
    ...(arena.capacity && { numberOfSeats: arena.capacity }),
  }

  // Only emit Review schema if the arena has been visited and has ratings
  const reviewData =
    arena.visited && ratingResult && ratingResult.averageRaw > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'Review',
          '@id': pageUrl,
          itemReviewed: {
            '@type': 'SportsActivityLocation',
            name: arena.name,
            ...(arena.currentName && { alternateName: arena.currentName }),
            ...(address && { address }),
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: ratingResult.averageRaw.toFixed(1),
            bestRating: '5',
            worstRating: '0',
          },
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
          datePublished: arena.date,
          dateModified: arena.updatedAt || arena.date,
          reviewBody,
          image: imageUrl,
          url: pageUrl,
        }
      : null

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsLocationData) }}
      />
      {reviewData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewData) }}
        />
      )}
    </Head>
  )
}
