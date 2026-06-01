import { ArrowRight, Calendar, MapPin, RefreshCw, Trophy } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { getRankBadgeStyle } from 'utils/arena/rankBadgeStyles'

import PostDate from './PostDate'
import RatingBadge from './RatingBadge'
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
  gallery: any
  id: string
  slug: string
  averageRating: string
  textRating: string
  ratingColor: string
  arenaReview?: any | null
  rank?: number
  priority?: boolean
  revisitCount?: number
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
    ratingColor,
    rank,
    priority = false,
    revisitCount,
  }: NBAArenaCardProps) => {
    const hasImage =
      arenaImageSrc?.asset?._ref != null || arenaImageSrc?.asset?._id != null
    const hasRating = Number(averageRating) > 0

    return (
      <>
        {/* ── MOBILE CARD (< 640px) ─────────────────────────────────────── */}
        <div
          className={`sm:hidden group relative flex w-full flex-row overflow-hidden rounded-3xl border-2 border-black bg-card text-foreground shadow-offsetIndigo transition-all duration-200 active:scale-95 active:shadow-none ${
            visited === false ? 'opacity-50 grayscale' : ''
          }`}
        >
          {visited && (
            <Link href={`/arena/${slug}`} className="absolute inset-0 z-10">
              <span className="sr-only">View {arenaName} review</span>
            </Link>
          )}

          {/* Thumbnail — self-stretch so it fills the full card height regardless of content length */}
          <div className="relative self-stretch w-[96px] shrink-0 overflow-hidden rounded-l-[22px] bg-muted">
            {hasImage ? (
              <SanityImage
                image={arenaImageSrc}
                width={96}
                height={96}
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
                {rank === 1 && <Trophy className="h-2.5 w-2.5" />}
                {rank === 1 ? 'Best' : `#${rank}`}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3 py-2.5">
            <span className="inline-flex w-fit rounded-full bg-secondary/10 border border-secondary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
              NBA Arena
            </span>

            <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground decoration-primary decoration-dashed decoration-2 group-hover:underline">
              {arenaName}
            </p>

            {hasRating && (
              <span
                className="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: ratingColor, opacity: 0.9 }}
              >
                <span className="text-foreground">{Number(averageRating).toFixed(1)}</span>
                <span className="h-3 w-px bg-black/25" />
                <span className="text-foreground truncate max-w-[60px]">{textRating}</span>
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

        {/* ── DESKTOP / TABLET CARD (≥ 640px) — unchanged ──────────────── */}
        <div
          className={`hidden sm:block group relative w-full overflow-hidden rounded-3xl border-4 border-black bg-card text-foreground shadow-offsetIndigo transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-lg ${
            visited === false ? 'opacity-50 grayscale' : 'grayscale-0'
          }`}
        >
          {/* Ghost link — makes the entire card clickable without nested <a> tags */}
          {visited && (
            <Link href={`/arena/${slug}`} className="absolute inset-0 z-10">
              <span className="sr-only">View {arenaName} review</span>
            </Link>
          )}

          <div className="relative">
            {!!rank && (
              <div
                className={`absolute left-3 top-3 z-30 rounded-full px-2 py-1 text-xs font-bold min-h-[32px] flex items-center gap-1 ${getRankBadgeStyle(rank)}`}
                role="status"
                aria-label={
                  rank === 1 ? 'Best Arena ranking' : `Arena rank: ${rank}`
                }
              >
                {rank === 1 && <Trophy className="h-3.5 w-3.5" />}
                {rank === 1 ? 'Best Arena' : `#${rank}`}
              </div>
            )}

            {Number(averageRating) > 0 && (
              <div
                className="absolute right-3 top-3 z-30"
                style={{ maxWidth: 'calc(100% - 120px)' }}
              >
                <RatingBadge
                  average={averageRating}
                  textRating={textRating}
                  color={ratingColor}
                />
              </div>
            )}

            <Skeleton className="absolute inset-0 h-full w-full rounded-md" />

            {hasImage ? (
              <SanityImage
                image={arenaImageSrc}
                width={320}
                height={200}
                className="w-full object-cover object-center brightness-[0.85]"
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <img
                src="https://fakeimg.pl/320x200?text=Arena+Image&font=georgia"
                width={320}
                height={200}
                className="w-full object-cover object-center brightness-[0.85]"
                alt={alt}
              />
            )}
          </div>

          <div className="flex justify-between text-foreground">
            <div className="ml-2 mt-1 flex flex-col sm:mb-2 sm:ml-4 sm:gap-y-2">
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

              <h2 className="line-clamp-1 pt-1 text-lg font-bold text-foreground decoration-primary decoration-dashed decoration-4 group-hover:underline sm:line-clamp-2 sm:h-8 sm:text-xl lg:text-xl xl:pt-1.5">
                {arenaName}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                {location && (
                  <div className="flex items-center gap-x-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <p className="text-sm">{location}</p>
                  </div>
                )}
                {visited && dateVisited && (
                  <span className="flex items-center gap-x-2 text-xs">
                    <Calendar className="h-4 w-4" />
                    <PostDate dateString={dateVisited} />
                  </span>
                )}
              </div>
            </div>
          </div>

          {visited && (
            <CardFooter className="container mx-auto mt-auto flex items-center pt-1 my-3">
              <span className="mx-auto mb-2 flex items-center gap-1 font-semibold text-primary">
                View Review
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </CardFooter>
          )}
        </div>
      </>
    )
  },
)

// Set display name for React DevTools
Arenas.displayName = 'NBAArenaCard'

export default Arenas
