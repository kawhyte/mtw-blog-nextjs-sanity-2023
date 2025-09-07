import { FoodReview, HotelReview } from 'lib/sanity.queries'
import Head from 'next/head'

import { calculateRating } from '../lib/calculateRating'
import { getRatingWeights } from '../lib/ratingWeights'

interface ReviewStructuredDataProps {
  review: HotelReview | FoodReview
  reviewType: 'hotel' | 'food'
  pageUrl: string
  imageUrl: string
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export default function ReviewStructuredData({
  review,
  reviewType,
  pageUrl,
  imageUrl,
}: ReviewStructuredDataProps) {
  // Calculate overall rating
  const rating =
    reviewType === 'hotel'
      ? calculateRating((review as HotelReview).hotelRating, getRatingWeights('hotel'))
      : calculateRating(
          (review as FoodReview).diningType === 'takeout'
            ? (review as FoodReview).takeoutRating
            : (review as FoodReview).foodRating,
          getRatingWeights('food', (review as FoodReview).diningType)
        )

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': pageUrl,
    itemReviewed: {
      '@type': reviewType === 'hotel' ? 'Hotel' : 'Restaurant',
      name: review.title,
      ...(review.location && { address: review.location }),
      ...(reviewType === 'hotel' && {
        starRating: {
          '@type': 'Rating',
          ratingValue: rating.numericalRating.toFixed(1),
          bestRating: '10',
          worstRating: '1',
        },
      }),
      ...(reviewType === 'food' && {
        servesCuisine: 'Various',
        priceRange: '$-$$$$',
      }),
      image: imageUrl,
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
        url: `${SITE_URL}/MeettheWhytes.png`,
      },
    },
    datePublished: review.date,
    dateModified: review.date,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating.numericalRating.toFixed(1),
      bestRating: '10',
      worstRating: '1',
      description: rating.textRating,
    },
    headline: `${review.title} Review - NBA Arena ${reviewType === 'hotel' ? 'Hotel' : 'Food'} Guide`,
    reviewBody: review.excerpt2
      ? Array.isArray(review.excerpt2)
        ? review.excerpt2
            .map((block: any) =>
              block._type === 'block'
                ? block.children?.map((child: any) => child.text).join('')
                : '',
            )
            .join(' ')
        : review.excerpt2
      : `Detailed review of ${review.title} for NBA arena travelers.`,
    url: pageUrl,
    image: imageUrl,
    ...(reviewType === 'hotel' && {
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Location Rating',
          value: (review as HotelReview).hotelRating?.Location || 'N/A',
        },
        {
          '@type': 'PropertyValue',
          name: 'Service Rating',
          value: (review as HotelReview).hotelRating?.Service || 'N/A',
        },
        {
          '@type': 'PropertyValue',
          name: 'Value Rating',
          value: (review as HotelReview).hotelRating?.Value || 'N/A',
        },
      ],
    }),
    ...(reviewType === 'food' && {
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Food Quality',
          value:
            (review as FoodReview).foodRating?.FoodQuality ||
            (review as FoodReview).takeoutRating?.FoodQuality ||
            'N/A',
        },
        {
          '@type': 'PropertyValue',
          name: 'Service',
          value:
            (review as FoodReview).foodRating?.Service ||
            (review as FoodReview).takeoutRating?.Service ||
            'N/A',
        },
        {
          '@type': 'PropertyValue',
          name: 'Value',
          value:
            (review as FoodReview).foodRating?.Value ||
            (review as FoodReview).takeoutRating?.Value ||
            'N/A',
        },
      ],
    }),
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </Head>
  )
}
