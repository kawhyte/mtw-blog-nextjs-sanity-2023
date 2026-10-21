import Link from 'next/link'
import type { ReactNode } from 'react'

import { ReviewActionButtons } from './ReviewActions'

export interface ReviewChip {
  label: string
  tone?: 'dark' | 'indigo' | 'muted' | 'success'
}

interface ReviewSummaryPanelProps {
  title: string
  /** Place name without "Review", used for Directions/Share */
  placeName: string
  location?: string
  score?: { displayRating: string; textRating: string }
  chips: ReviewChip[]
  /** Extra line under the chips, e.g. "Best for: Families · Couples" */
  footnote?: ReactNode
  arenasInCity: { name: string; slug: string }[]
  cityGuideHref?: string
}

const CHIP_TONES: Record<NonNullable<ReviewChip['tone']>, string> = {
  dark: 'bg-gray-900 text-white dark:bg-white dark:text-gray-900',
  indigo: 'bg-secondary-soft-background text-secondary',
  muted: 'bg-muted text-foreground',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
}

// Score circle colour follows the site's rating bands
const scoreCircleClass = (textRating: string) => {
  if (textRating === 'Excellent' || textRating === 'Great')
    return 'bg-green-600 text-white'
  if (textRating === 'Good' || textRating === 'Fair')
    return 'bg-amber-400 text-gray-900'
  return 'bg-red-600 text-white'
}
const scoreTextClass = (textRating: string) => {
  if (textRating === 'Excellent' || textRating === 'Great')
    return 'text-green-700 dark:text-green-400'
  if (textRating === 'Good' || textRating === 'Fair')
    return 'text-amber-700 dark:text-amber-400'
  return 'text-red-700 dark:text-red-400'
}

/**
 * Review summary in the style of The Infatuation: score, name, key facts and
 * actions. Sits in a sticky side column on large screens and under the
 * photos on phones (where the actions move to a pinned bottom bar).
 */
export default function ReviewSummaryPanel({
  title,
  placeName,
  location,
  score,
  chips,
  footnote,
  arenasInCity,
  cityGuideHref,
}: ReviewSummaryPanelProps) {
  return (
    <div className="flex flex-col gap-6 xl:rounded-[1.75rem] xl:border-4 xl:border-border-bold xl:bg-card xl:p-6 xl:shadow-brutalist">
      {/* One title, placed by the grid: beside the score on phones, below
          it (full width) on large screens */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1 xl:gap-y-4">
        {score && (
          <div
            // pt-[0.2em]: Epilogue's digits sit ~0.1em above the line box's
            // centre, so nudge them down to look optically centred
            className={`font-heading-family row-span-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-full pt-[0.2em] text-[1.75rem] font-extrabold tracking-tight xl:row-span-1 xl:h-[5.5rem] xl:w-[5.5rem] xl:text-[2.4rem] ${scoreCircleClass(score.textRating)}`}
            role="img"
            aria-label={`Rated ${score.displayRating} out of 5, ${score.textRating}`}
          >
            {score.displayRating}
          </div>
        )}
        <h1
          className={`text-2xl font-extrabold leading-tight sm:text-3xl xl:col-span-2 xl:row-start-2 ${score ? 'col-start-2' : 'col-span-2'}`}
        >
          {title}
        </h1>
        <div className="col-start-2 text-sm text-muted-foreground xl:row-start-1 xl:text-base">
          {score && (
            <span
              className={`font-heading-family font-extrabold ${scoreTextClass(score.textRating)} xl:block xl:text-xl`}
            >
              {score.textRating}
            </span>
          )}
          {location && (
            <span>
              <span className="xl:hidden">{score ? ' · ' : ''}</span>
              {location}
            </span>
          )}
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li
              key={chip.label}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${CHIP_TONES[chip.tone ?? 'muted']}`}
            >
              {chip.label}
            </li>
          ))}
        </ul>
      )}

      {footnote && <div className="text-sm text-muted-foreground">{footnote}</div>}

      <div className="hidden xl:block">
        <ReviewActionButtons placeName={placeName} location={location} />
      </div>

      {arenasInCity.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-2xl border-2 border-secondary/30 bg-secondary-soft-background px-4 py-3">
          <span className="text-xs font-bold tracking-[0.1em] text-secondary">
            GOING TO A GAME?
          </span>
          <span className="text-sm leading-relaxed text-foreground">
            {arenasInCity.length === 1
              ? `${arenasInCity[0].name} is in ${location?.split(',')[0] ?? 'town'}.`
              : `${arenasInCity
                  .map((a) => a.name)
                  .join(' and ')} are both in ${location?.split(',')[0] ?? 'town'}.`}
          </span>
          {cityGuideHref && (
            <Link
              href={cityGuideHref}
              className="flex min-h-11 items-center text-sm font-bold text-primary hover:underline xl:min-h-0"
            >
              {location?.split(',')[0]} game-day guide →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
