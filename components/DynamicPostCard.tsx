import Date from 'components/PostDate'
import { categoryRating } from 'lib/getHotelCategory'
import type { FoodReview, HotelReview } from 'lib/sanity.queries'
import {
  ArrowRight,
  Calendar,
  MapPin,
  RefreshCw,
  Trophy,
} from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { CardContent, CardFooter, CardTitle } from '@/components/ui/card'

import { getRankBadgeStyle } from 'utils/arena/rankBadgeStyles'

import CoverImage from './CoverImage'
import SanityImage from './SanityImage'

const GUIDE_CATEGORY_LABELS: Record<string, string> = {
  city: 'City Guide',
  tips: 'Travel Tips',
  transport: 'Transportation',
  culture: 'Culture & History',
  adventure: 'Adventure',
  family: 'Family Travel',
  budget: 'Budget Travel',
  luxury: 'Luxury Travel',
}

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
  excerpt2?: any
  author?: any
  summary?: string
  category?: string
  visited?: boolean
  revisitCount?: number
  calculatedRating?: number
  rank?: number
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

const getMobileTypeBadge = (
  linkType?: string,
  diningType?: string,
  category?: string,
): { label: string; className: string } | null => {
  if (linkType === 'hotel') {
    const cat = category ? categoryRating(category) : null
    const name = cat?.name ?? 'Hotel'
    return { label: name, className: 'bg-zinc-800 text-white' }
  }
  if (linkType === 'food') {
    return diningType === 'takeout'
      ? {
          label: 'Takeout',
          className: 'bg-amber-100 text-amber-800 border border-amber-300',
        }
      : {
          label: 'Dine-In',
          className: 'bg-rose-100 text-rose-800 border border-rose-300',
        }
  }
  if (linkType === 'story' && category && GUIDE_CATEGORY_LABELS[category]) {
    return {
      label: GUIDE_CATEGORY_LABELS[category],
      className: 'bg-secondary/10 text-secondary border border-secondary/20',
    }
  }
  return null
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
  summary,
  category,
  visited,
  revisitCount,
  calculatedRating,
  rank,
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

  const mobileBadge = getMobileTypeBadge(linkType, diningType, category)
  const hasImage =
    coverImage?.asset?._ref != null || coverImage?.asset?._id != null

  return (
    <>
      {/* ── MOBILE CARD (< 640px) ──────────────────────────────────────── */}
      <div
        className={`sm:hidden group relative flex w-full flex-row overflow-hidden rounded-3xl border-2 border-border-bold bg-card text-foreground shadow-offsetIndigo transition-all duration-200 active:scale-95 active:shadow-none ${
          visited === false ? 'opacity-40 grayscale' : ''
        }`}
      >
        <Link href={href} className="absolute inset-0 z-10">
          <span className="sr-only">View {title}</span>
        </Link>

        {/* Thumbnail — self-stretch so it fills the full card height regardless of content length */}
        <div className="relative self-stretch w-[96px] shrink-0 overflow-hidden rounded-l-[22px] bg-muted">
          {hasImage ? (
            <SanityImage
              image={coverImage}
              width={96}
              height={96}
              alt={title}
              className="h-full w-full object-cover"
              sizes="96px"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}

          {/* Compact rank badge */}
          {rank != null && (
            <span
              className={`absolute left-1.5 top-1.5 z-20 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${getRankBadgeStyle(rank)}`}
            >
              {rank === 1 && <Trophy className="h-2.5 w-2.5" />}
              {rank === 1 ? 'Best' : `#${rank}`}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3 py-2.5">
          {mobileBadge && (
            <span
              className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${mobileBadge.className}`}
            >
              {mobileBadge.label}
            </span>
          )}

          <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground decoration-primary decoration-dashed decoration-2 group-hover:underline">
            {title}
          </p>

          {linkType === 'story' && summary && (
            <p className="line-clamp-1 text-[11px] italic leading-snug text-muted-foreground">
              {summary}
            </p>
          )}

          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            {showRating && scoreDisplay && (
              <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                {scoreDisplay}/10
              </span>
            )}
            {revisitCount != null && revisitCount > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <RefreshCw className="h-2.5 w-2.5" />
                {revisitCount === 1 ? 'Revisited' : `${revisitCount + 1}x`}
              </span>
            )}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0 text-[11px] text-muted-foreground">
            {location && (
              <span className="flex shrink-0 items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="max-w-[110px] truncate">{location}</span>
              </span>
            )}
            {date && (
              <span className="flex shrink-0 items-center gap-1">
                <Calendar className="h-3 w-3 shrink-0" />
                <Date dateString={date} />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── DESKTOP / TABLET CARD (≥ 640px) — unchanged ────────────────── */}
      <div
        className={`hidden sm:block group relative w-full overflow-hidden rounded-4xl border-4 border-border-bold bg-card text-foreground shadow-offsetIndigo transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-brutalist ${
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
                  {revisitCount === 1
                    ? 'Revisited'
                    : `${revisitCount + 1} visits`}
                </span>
              </div>
            ) : null}

            {/* Guide category badge */}
            {linkType === 'story' &&
              category &&
              GUIDE_CATEGORY_LABELS[category] && (
                <Badge
                  variant="secondary"
                  className="w-fit text-[10px] uppercase tracking-wider font-semibold mb-1"
                >
                  {GUIDE_CATEGORY_LABELS[category]}
                </Badge>
              )}

            <CardTitle className="line-clamp-1 pt-1 text-sm font-bold text-foreground no-underline decoration-primary decoration-dashed decoration-4 group-hover:underline sm:line-clamp-2 sm:h-8 sm:text-xl lg:text-xl xl:pt-1.5">
              {title}
            </CardTitle>

            {/* Guide summary excerpt */}
            {linkType === 'story' && summary && (
              <p className="line-clamp-2 text-xs text-muted-foreground mt-1 leading-relaxed">
                {summary}
              </p>
            )}

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
    </>
  )
}

export default DynamicPostCard
