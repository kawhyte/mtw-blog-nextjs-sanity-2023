import { Calendar, MapPin, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { getRankBadgeStyle } from 'utils/arena/rankBadgeStyles'

import { PhotoScore } from '@/components/ui/score-circle'
import { Skeleton } from '@/components/ui/skeleton'

import HighlightText from './HighlightText'
import PostDate, { formatDate } from './PostDate'
import SanityImage from './SanityImage'

interface NBAArenaCardProps {
  arenaImageSrc: any
  arenaName: string
  alt: string
  constructionDate: string
  capacity: number
  location: string
  dateVisited: string
  visited: boolean
  id: string
  slug: string
  averageRating: string
  textRating: string
  /** No longer drawn: scores use the design system colours */
  ratingColor?: string
  arenaReview?: any | null
  rank?: number
  priority?: boolean
  revisitCount?: number
  /** Search words to highlight in the arena name (search results page). */
  highlightWords?: string[]
}


/**
 * NBA Arena Card Component - Optimized with React.memo
 * Prevents unnecessary re-renders when parent components update
 * Significantly improves performance during filtering/sorting
 */
const Arenas = React.memo(
  ({
    location,
    id,
    slug,
    visited,
    arenaName,
    alt,
    dateVisited,
    arenaImageSrc,
    averageRating,
    textRating,
    rank,
    priority = false,
    revisitCount,
    highlightWords,
  }: NBAArenaCardProps) => {
    const hasImage =
      arenaImageSrc?.asset?._ref != null || arenaImageSrc?.asset?._id != null
    const hasRating = Number(averageRating) > 0

    return (
      <>
        {/* ── MOBILE CARD (< 640px) ─────────────────────────────────────── */}
        <div
          className={`sm:hidden group relative flex w-full flex-row overflow-hidden rounded-2xl border-[3px] border-border-bold bg-border-bold text-foreground shadow-brutalist-sm transition-all duration-200 active:scale-95 active:shadow-none ${
            visited === false ? 'opacity-50 grayscale' : ''
          }`}
        >
          {visited && (
            <Link href={`/arena/${slug}`} className="absolute inset-0 z-10">
              <span className="sr-only">View {arenaName} review</span>
            </Link>
          )}

          {/* Thumbnail, self-stretch so it fills the full card height regardless of content length */}
          <div className="relative self-stretch w-[96px] shrink-0 overflow-hidden bg-border-bold -my-px -ml-px">
            {hasImage ? (
              <SanityImage
                image={arenaImageSrc}
                width={240}
                height={320}
                alt={alt}
                className="h-full w-full object-cover object-center brightness-[0.9]"
                sizes="96px"
                loading={priority ? 'eager' : 'lazy'}
                priority={priority}
              />
            ) : (
              <img
                src="https://fakeimg.pl/96x96?text=Arena&font=georgia"
                width={96}
                height={96}
                className="h-full w-full object-cover"
                alt={alt}
              />
            )}

            {/* Compact rank badge */}
            {rank != null && (
              <span
                className={`absolute left-1.5 top-1.5 z-20 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${getRankBadgeStyle(rank)}`}
                role="status"
                aria-label={
                  rank === 1 ? 'Best Arena' : `Arena rank: ${rank}`
                }
              >
                {rank === 1 ? 'Best' : `#${rank}`}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 bg-card px-3 py-2.5">
            <span className="inline-flex w-fit rounded-full bg-secondary/10 border border-secondary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
              NBA Arena
            </span>

            <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground decoration-primary decoration-dashed decoration-2 group-hover:underline">
              <HighlightText text={arenaName} words={highlightWords} />
            </p>

            {hasRating && (
              <span className="text-xs font-semibold text-foreground">
                <span aria-hidden="true">★</span>{' '}
                {Number(averageRating).toFixed(1)}
                <span className="font-normal text-muted-foreground">
                  {' '}
                  · {textRating}
                </span>
              </span>
            )}

            {revisitCount != null && revisitCount > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <RefreshCw className="h-2.5 w-2.5" />
                {revisitCount === 1 ? 'Revisited' : `${revisitCount + 1}x`}
              </span>
            )}

            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0 text-[11px] text-muted-foreground">
              {location && (
                <span className="flex shrink-0 items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="max-w-[110px] truncate">{location}</span>
                </span>
              )}
              {visited && dateVisited && (
                <span className="flex shrink-0 items-center gap-1">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <PostDate dateString={dateVisited} />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── DESKTOP / TABLET CARD (≥ 640px) ───────────────────────────── */}
        <div
          className={`hidden sm:block group relative w-full overflow-hidden rounded-3xl border-[3px] border-border-bold bg-border-bold text-foreground shadow-brutalist transition-transform duration-200 ease-out hover:-translate-y-1 ${
            visited === false ? 'opacity-50 grayscale' : 'grayscale-0'
          }`}
        >
          {/* Ghost link, makes the entire card clickable without nested <a> tags */}
          {visited && (
            <Link href={`/arena/${slug}`} className="absolute inset-0 z-10">
              <span className="sr-only">View {arenaName} review</span>
            </Link>
          )}

          {/* -mx-px -mt-px: the image runs 1px under the border so fractional card
              widths can't leave a sliver of card background at its edges */}
          <div className="relative -mx-px -mt-px aspect-[19/10] overflow-hidden">
            {!!rank && (
              <div
                className={`absolute left-3 top-3 z-30 flex min-h-[28px] items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${getRankBadgeStyle(rank)}`}
                role="status"
                aria-label={
                  rank === 1 ? 'Best Arena ranking' : `Arena rank: ${rank}`
                }
              >
                {rank === 1 ? 'Best Arena' : `#${rank}`}
              </div>
            )}

            {hasRating && (
              <PhotoScore
                score={Number(averageRating)}
                textRating={textRating}
                className="right-3 top-3"
              />
            )}

            <Skeleton className="absolute inset-0 h-full w-full" />

            {hasImage ? (
              <SanityImage
                image={arenaImageSrc}
                width={800}
                height={420}
                className="relative h-full w-full object-cover object-center brightness-[0.85]"
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <img
                src="https://fakeimg.pl/320x200?text=Arena+Image&font=georgia"
                width={320}
                height={168}
                className="relative h-full w-full object-cover object-center brightness-[0.85]"
                alt={alt}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5 bg-card px-5 pb-5 pt-4">
            <h2 className="line-clamp-1 text-xl font-bold leading-tight text-foreground decoration-primary decoration-dashed decoration-4 group-hover:underline">
              <HighlightText text={arenaName} words={highlightWords} />
            </h2>
            <p className="text-sm text-muted-foreground">
              {[
                location,
                visited && dateVisited ? formatDate(dateVisited) : null,
                revisitCount && revisitCount > 0
                  ? revisitCount === 1
                    ? 'Revisited'
                    : `${revisitCount + 1} visits`
                  : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
        </div>
      </>
    )
  },
)

// Set display name for React DevTools
Arenas.displayName = 'NBAArenaCard'

export default Arenas
