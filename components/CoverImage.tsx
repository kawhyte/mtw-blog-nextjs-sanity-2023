// src/components/CoverImage.tsx

// Import shadcn/ui components
import cn from 'classnames'
// Your existing imports
import { calculateRating } from 'lib/calculateRating'
import { FOOD_WEIGHTS, HOTEL_WEIGHTS, TAKEOUT_WEIGHTS } from 'lib/ratingWeights'
import { urlForImage } from 'lib/sanity.image'
import { Calendar, Hotel, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

import { categoryRating } from '../lib/getHotelCategory'
import RatingBadge from './RatingBadge'

// Helper function to determine the link prefix based on post type
const getLinkPrefix = (
  linkType?: 'hotel' | 'food' | 'story' | 'favorite',
): string => {
  switch (linkType) {
    case 'hotel':
      return '/hotel'
    case 'story':
      return '/guide'
    case 'food':
      return '/food'
    case 'favorite':
    default:
      return '/posts'
  }
}

interface CoverImageProps {
  title: string
  slug?: string
  date?: any
  location?: string
  image: any
  category?: string
  excerpt2?: any
  rating: any
  linkType?: 'hotel' | 'food' | 'story' | 'favorite'
  diningType: any
  showRating: boolean
  priority?: boolean // Add priority prop for above-the-fold images
}

export default function CoverImage(props: CoverImageProps) {
  const {
    title,
    slug,
    showRating,
    rating,
    category,
    image: source,
    linkType,
    diningType,
    priority = false,
    location,
  } = props

  const image =
    source?.asset?._ref || source?.asset?._id ? (
      <div className="relative h-full w-full">
        <Skeleton className="absolute inset-0 h-full w-full rounded-md" />
        <Image
          className={cn(
            'w-full object-cover object-center brightness-[0.85] rounded-t-3xl',
            {
              ' relative z-20 transition-all ': slug,
            },
          )}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
          width={320}
          height={200}
          alt={
            linkType === 'hotel'
              ? `${title} - NBA Arena Hotel Review${location ? ` in ${location}` : ''}`
              : linkType === 'food'
                ? `${title} - NBA Arena Food Review${location ? ` in ${location}` : ''}`
                : linkType === 'story'
                  ? `${title} - NBA Arena Travel Guide${location ? ` for ${location}` : ''}`
                  : `${title} - NBA Arena Travel Review`
          }
          src={urlForImage(source)?.height(200)?.width(320)?.fit('crop').url()}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
        />
      </div>
    ) : (
      <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
    )

  // Determine the correct weights based on linkType and rating field names
  let weights:
    | typeof HOTEL_WEIGHTS
    | typeof FOOD_WEIGHTS
    | typeof TAKEOUT_WEIGHTS
  if (linkType === 'hotel') {
    weights = HOTEL_WEIGHTS
  } else {
    // For food reviews, detect if it's takeout based on field names or diningType
    const isTakeoutRating =
      diningType === 'takeout' ||
      Object.keys(rating || {}).some((key) =>
        [
          'tasteAndFlavor',
          'foodValue',
          'packaging',
          'accuracy',
          'overallSatisfaction',
        ].includes(key),
      )
    weights = isTakeoutRating ? TAKEOUT_WEIGHTS : FOOD_WEIGHTS
  }

  const overallRating = calculateRating(rating, weights)
  const href = slug ? `${getLinkPrefix(linkType)}/${slug}` : '#'

  const categoryType = categoryRating(category)

  const badgeColorClasses = {
    blue: 'bg-badge-blue text-badge-blue-foreground',
    yellow: 'bg-badge-yellow text-badge-yellow-foreground',
    green: 'bg-badge-green text-badge-green-foreground',
    red: 'bg-badge-red text-badge-red-foreground',
  }

  const badgeClasses =
    badgeColorClasses[categoryType.color] || 'bg-gray-500 text-white'

  return (
    <div className="relative overflow-hidden rounded-t-3xl">
      <div className="relative">
        {slug ? (
          <Link href={href} aria-label={title}>
            {image}
            {linkType === 'hotel' && category && (
              <Badge
                className={`absolute top-3 left-3 z-30 ${badgeClasses} border-transparent min-h-[32px] flex items-center`}
                role="status"
                aria-label={`Hotel category: ${categoryType.name}`}
              >
                <Hotel className="h-3 w-3 mr-1" aria-hidden="true" />
                <span className="truncate max-w-[80px]">
                  {categoryType.name}
                </span>
              </Badge>
            )}

            {showRating && linkType !== 'story' && (
              <div
                className="absolute right-3 top-3 z-30"
                style={{ maxWidth: 'calc(100% - 120px)' }}
              >
                <RatingBadge
                  average={(
                    Math.floor(overallRating.numericalRating * 100) / 100
                  ).toString()}
                  textRating={overallRating.textRating}
                  color={overallRating.color}
                />
              </div>
            )}
          </Link>
        ) : (
          image
        )}
      </div>
    </div>
  )
}
