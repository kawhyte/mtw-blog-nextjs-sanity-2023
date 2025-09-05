// src/components/CoverImage.tsx

// Import shadcn/ui components
import cn from 'classnames'
// Your existing imports
import { calculateRating } from 'lib/calculateRating'
import { getRatingWeights } from 'lib/ratingWeights'
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
  priority?: boolean
  excerpt2?: any
  rating: any
  linkType?: 'hotel' | 'food' | 'story' | 'favorite'
  diningType: any
  showRating: boolean
}

export default function CoverImage(props: CoverImageProps) {
  const {
    title,
    slug,
    showRating,
    rating,
    category,
    image: source,
    priority,
    linkType,
    diningType,
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
          alt={`Cover Image for ${title}`}
          src={urlForImage(source)?.height(200)?.width(320)?.fit('crop').url()}
          loading="lazy"
        />
      </div>
    ) : (
      <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
    )

  const overallRating = calculateRating(
    rating,
    getRatingWeights(linkType, diningType),
  )
  const href = slug ? `${getLinkPrefix(linkType)}/${slug}` : '#'

  const categoryType = categoryRating(category)

  const badgeColorClasses = {
    blue: 'bg-blue-200 text-blue-800',
    yellow: 'bg-yellow-200 text-yellow-800', 
    green: 'bg-green-200 text-green-800',
    red: 'bg-red-200 text-red-800',
  }

  const badgeClasses =
    badgeColorClasses[categoryType.color] || 'bg-gray-500 text-white'

  // Debug logging
  if (category === 'mid-scale') {
    console.log('Mid-scale hotel debug:', {
      category,
      categoryType,
      badgeClasses,
    })
  }

  return (
    <div className="relative overflow-hidden rounded-t-3xl">
      <div className="relative">
        {slug ? (
          <Link href={href} aria-label={title}>
            {image}
            {linkType === 'hotel' && category && (
              <Badge
                className={`absolute top-4 left-4 z-30 ${badgeClasses} border-transparent`}
              >
                <Hotel className="h-3 w-3 mr-1" /> {categoryType.name}
              </Badge>
            )}

            {showRating && linkType !== 'story' && (
              <div className="absolute right-4 top-4 z-30 flex items-center justify-center rounded-full bg-background/20 text-foreground backdrop-blur-sm">
                <RatingBadge
                  average={overallRating.numericalRating.toFixed(2)}
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
