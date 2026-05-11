import Date from 'components/PostDate'
import type { FoodReview, Guide, HotelReview, Post } from 'lib/sanity.queries'
import { ArrowRight, Calendar, MapPin, RefreshCw } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import {
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'

import CoverImage from './CoverImage'

interface DynamicPostCardProps {
  title?: string
  coverImage?: any
  hotelRating?: HotelReview['hotelRating']
  foodRating?: FoodReview['foodRating']
  takeoutRating?: FoodReview['takeoutRating']
  linkType?: 'hotel' | 'food' | 'story' | 'favorite'
  diningType?: FoodReview['diningType']
  date?: string
  showRating?: boolean
  slug?: string
  location?: string
  author?: any
  excerpt2?: any
  category?: string
  visited?: boolean
  revisitCount?: number
  calculatedRating?: number
}

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

const getRating = (
  linkType?: 'hotel' | 'food' | 'story' | 'favorite',
  diningType?: FoodReview['diningType'],
  hotelRating?: HotelReview['hotelRating'],
  foodRating?: FoodReview['foodRating'],
  takeoutRating?: FoodReview['takeoutRating'],
):
  | HotelReview['hotelRating']
  | FoodReview['foodRating']
  | FoodReview['takeoutRating']
  | undefined => {
  if (linkType === 'hotel' && hotelRating) {
    return hotelRating
  }
  if (linkType === 'food') {
    if (diningType === 'takeout' && takeoutRating) {
      return takeoutRating
    }
    if (foodRating) {
      return foodRating
    }
  }
  return undefined
}

const DynamicPostCard = ({
  title,
  coverImage,
  hotelRating,
  foodRating,
  takeoutRating,
  linkType,
  diningType,
  date,
  showRating,
  slug,
  location,
  category,
  visited,
  revisitCount,
  calculatedRating,
}: DynamicPostCardProps) => {
  const safeSlug = slug ?? ''
  const href = `${getLinkPrefix(linkType)}/${safeSlug}`

  const currentRating = getRating(
    linkType,
    diningType,
    hotelRating,
    foodRating,
    takeoutRating,
  )

  if (!safeSlug || !title) {
    console.warn(
      'DynamicPostCard skipped rendering due to missing slug or title',
      { slug, title },
    )
    return null
  }

  const scoreDisplay =
    calculatedRating != null ? calculatedRating.toFixed(1) : null

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-4xl border-4 border-border-bold bg-card text-foreground shadow-offsetIndigo transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-brutalist ${
        visited === false ? 'opacity-40 grayscale' : 'grayscale-0'
      }`}
    >
      {/* Ghost link — makes the whole card clickable without nested <a> tags */}
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">View {title}</span>
      </Link>

      <div className="relative">
        <CoverImage
          slug={safeSlug}
          title={title}
          image={coverImage}
          rating={currentRating}
          showRating={showRating}
          linkType={linkType}
          diningType={diningType}
          category={category}
        />
      </div>

      <CardContent className="flex grow flex-col justify-between p-4">
        <div className="flex flex-col sm:mb-2 sm:ml-2 sm:gap-y-2">
          {revisitCount && revisitCount > 0 ? (
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <RefreshCw className="h-3 w-3" />
              <span>
                {revisitCount === 1 ? 'Revisited' : `${revisitCount + 1} visits`}
              </span>
            </div>
          ) : null}

          <CardTitle className="line-clamp-1 pt-1 text-sm font-bold text-foreground no-underline decoration-primary decoration-dashed decoration-4 group-hover:underline sm:line-clamp-2 sm:h-8 sm:text-xl lg:text-xl xl:pt-1.5">
            {title}
          </CardTitle>

          {/* Score badge */}
          {scoreDisplay && (
            <div className="mt-2">
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5"
              >
                {scoreDisplay}/10
              </Badge>
            </div>
          )}

          {/* Meta info */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
            {location && (
              <div className="flex items-center gap-x-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <p className="text-sm">{location}</p>
              </div>
            )}
            <span className="flex items-center gap-x-2 text-xs">
              <Calendar className="h-4 w-4" />
              <Date dateString={date} />
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="container mx-auto mt-auto flex items-center pt-1">
        <span className="mx-auto mb-2 flex items-center gap-1 font-semibold text-primary">
          View Details
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </CardFooter>
    </div>
  )
}

export default DynamicPostCard
