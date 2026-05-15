import calculateAverageRating from 'lib/calculateArenaRating'
import { urlForImage } from 'lib/sanity.image'
import { Arena } from 'lib/sanity.queries'
import Head from 'next/head'

interface ArenaStructuredDataProps {
  arena: Arena
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export default function ArenaStructuredData({ arena }: ArenaStructuredDataProps) {
  if (!arena?.name || !arena?.slug) return null

  const pageUrl = `${SITE_URL}/arena/${arena.slug}`
  const imageUrl = arena.arenaImage
    ? urlForImage(arena.arenaImage).width(1200).height(630).url()
    : `${SITE_URL}/MeettheWhytes.jpg`

  const ratingResult = arena.arenaReview
    ? calculateAverageRating(arena.arenaReview as any)
    : null

  const sportsLocationData = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: arena.name,
    url: pageUrl,
    image: imageUrl,
    ...(arena.location && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: arena.location,
      },
    }),
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
            ...(arena.location && {
              address: {
                '@type': 'PostalAddress',
                addressLocality: arena.location,
              },
            }),
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
          dateModified: arena.date,
          reviewBody: `Tips, food, transportation, sightlines, and atmosphere review for ${arena.name}${arena.location ? ` in ${arena.location}` : ''}. Written by basketball fans who visited the arena.`,
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
