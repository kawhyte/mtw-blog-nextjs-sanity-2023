import { scoreCircleClass, scoreTextClass } from 'components/ui/score-circle'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { ReviewActionButtons } from './ReviewActions'

export interface ReviewChip {
  label: string
  tone?: 'dark' | 'indigo' | 'muted' | 'success' | 'amber' | 'pink'
}

interface ReviewSummaryPanelProps {
  title: string
  /** Place name without "Review", used for Directions/Share */
  placeName: string
  location?: string
  score?: { displayRating: string; textRating: string }
  chips: ReviewChip[]
  /** Line under the title, e.g. "Now called Kia Center" */
  subtitle?: ReactNode
  /** Extra line under the chips, e.g. "Best for: Families · Couples" */
  footnote?: ReactNode
  arenasInCity: { name: string; slug: string }[]
  cityGuideHref?: string
  /** Extra box at the bottom, e.g. the arena page's "Game day in …" */
  children?: ReactNode
}

const CHIP_TONES: Record<NonNullable<ReviewChip['tone']>, string> = {
  dark: 'bg-foreground text-background',
  indigo: 'border border-border bg-stone-100 text-foreground',
  muted: 'border border-border bg-card text-foreground',
  success: 'border border-green-200 bg-green-50 text-success',
  amber: 'border border-amber-200 bg-amber-50 text-amber-900',
  pink: 'border border-pink-200 bg-pink-50 text-pink-700',
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
  subtitle,
  footnote,
  arenasInCity,
  cityGuideHref,
  children,
}: ReviewSummaryPanelProps) {
  return (
    <div className="flex flex-col gap-6 xl:rounded-3xl xl:border-[3px] xl:border-border-bold xl:bg-card xl:p-6 xl:shadow-brutalist">
      {/* One title, placed by the grid: beside the score on phones, below
          it (full width) on large screens */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1 xl:gap-y-4">
        {score && (
          <div
            // pt-[0.2em]: Epilogue's digits sit ~0.1em above the line box's
            // centre, so nudge them down to look optically centred
            className={`font-heading-family row-span-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-full pt-[0.2em] text-section font-extrabold tracking-tight xl:row-span-1 xl:h-[5.5rem] xl:w-[5.5rem] xl:text-page ${scoreCircleClass(score.textRating)}`}
            role="img"
            aria-label={`Rated ${score.displayRating} out of 5, ${score.textRating}`}
          >
            {score.displayRating}
          </div>
        )}
        <h1
          className={`text-title font-extrabold leading-tight sm:text-section xl:col-span-2 xl:row-start-2 ${score ? 'col-start-2' : 'col-span-2'}`}
        >
          {title}
        </h1>
        <div className="col-start-2 text-sm text-muted-foreground xl:row-start-1 xl:text-base">
          {score && (
            <span
              className={`font-heading-family font-extrabold ${scoreTextClass(score.textRating)} xl:block xl:text-title`}
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

      {subtitle && <div className="-mt-2">{subtitle}</div>}

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

      {footnote && (
        <div className="text-sm text-muted-foreground">{footnote}</div>
      )}

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
                  .join(
                    ' and ',
                  )} are both in ${location?.split(',')[0] ?? 'town'}.`}
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

      {children}
    </div>
  )
}
