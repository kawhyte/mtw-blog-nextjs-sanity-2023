import { scoreCircleClass, scoreTextClass } from 'components/ui/score-circle'
import type { RatingResult } from 'lib/calculateRating'
import {
  cruiseLineName,
  formatSailingRange,
  LINE_TIER,
  REGION,
  SAIL_AGAIN,
  WIFI_VERDICT,
} from 'lib/cruiseFormat'
import { CRUISE_WEIGHTS } from 'lib/ratingWeights'
import type { CruiseReview } from 'lib/sanity.queries'
import { Play, Tv, Wifi } from 'lucide-react'

import { Eyebrow, Pill } from './parts'

const NAMES: Record<string, string> = { rene: 'René', kenny: 'Kenny' }

const SAIL_AGAIN_TEXT = {
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
}

/**
 * The cruise's score, name and key facts. Sits in the left column next to the
 * photos on large screens and under the photos on phones.
 */
export default function CruiseSummaryPanel({
  review,
  overall,
}: {
  review: CruiseReview
  overall: RatingResult | null
}) {
  const line = cruiseLineName(review.cruiseLine)
  const cabin = [review.cabinType, review.cabinNumber].filter(Boolean).join(' ')
  const dates = formatSailingRange(review.sailingDate, review.nights)
  const chips = [
    review.lineTier && LINE_TIER[review.lineTier],
    review.nights && `${review.nights} nights`,
    dates,
    review.departurePort && `From ${review.departurePort.split(' (')[0]}`,
    review.region && REGION[review.region],
  ].filter(Boolean) as string[]

  const wifi = review.wifi
  const wifiBadge =
    wifi?.usage && wifi.usage !== 'none' && wifi.verdict
      ? WIFI_VERDICT[wifi.verdict]
      : null
  const sports = review.cruiseRating?.Sports_Fan
  const sailAgain = review.wouldSailAgain && SAIL_AGAIN[review.wouldSailAgain]
  const scoredCount = Object.keys(CRUISE_WEIGHTS).filter(
    (key) => typeof review.cruiseRating?.[key] === 'number',
  ).length
  const sailed = review.sailingDate
    ? new Date(review.sailingDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : null
  const by = review.reviewedBy?.map((n) => NAMES[n] ?? n).join(' & ')

  return (
    <div className="flex flex-col gap-4 xl:rounded-3xl xl:border-[3px] xl:border-border-bold xl:bg-card xl:p-6">
      {overall && (
        <div className="flex items-center gap-4">
          <div
            role="img"
            aria-label={`Rated ${overall.displayRating} out of 5, ${overall.textRating}`}
            className={`font-heading-family flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center rounded-full pt-[0.2em] text-[1.9rem] font-extrabold xl:h-[5.5rem] xl:w-[5.5rem] xl:text-page ${scoreCircleClass(overall.textRating)}`}
          >
            {overall.displayRating}
          </div>
          <div>
            <div
              className={`font-heading-family text-title font-extrabold ${scoreTextClass(overall.textRating)}`}
            >
              {overall.textRating}
            </div>
            <div className="text-sm text-muted-foreground">
              Weighted across {scoredCount}{' '}
              {scoredCount === 1 ? 'category' : 'categories'}
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-section font-extrabold leading-tight xl:text-[2rem]">
          {review.shipName || review.title}
        </h1>
        <p className="mt-1.5 text-base text-muted-foreground">
          {[line, cabin, review.itineraryName].filter(Boolean).join(' · ')}
        </p>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {chips.map((chip, i) => (
            <li
              key={chip}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${i === 0 && review.lineTier ? 'bg-foreground text-background' : 'border border-border bg-stone-100 text-foreground'}`}
            >
              {chip}
            </li>
          ))}
        </ul>
      )}

      {(wifiBadge || typeof sports === 'number') && (
        <div className="flex flex-wrap gap-2">
          {wifiBadge && (
            <Pill
              className={`min-h-9 rounded-xl border px-3 text-sm ${wifiBadge.className}`}
            >
              <Wifi className="h-4 w-4" aria-hidden="true" />
              Wi-Fi: {wifiBadge.label}
            </Pill>
          )}
          {typeof sports === 'number' && (
            <Pill className="min-h-9 rounded-xl border border-border bg-card px-3 text-sm text-foreground">
              <Tv className="h-4 w-4" aria-hidden="true" />
              Sports fans: {(sports / 2).toFixed(1)}
            </Pill>
          )}
        </div>
      )}

      {sailAgain && (
        <div className="rounded-2xl bg-primary-soft-background px-4 py-3">
          <Eyebrow>Would we sail again?</Eyebrow>
          <div
            className={`font-heading-family mt-0.5 text-lg font-extrabold ${SAIL_AGAIN_TEXT[sailAgain.tone]}`}
          >
            {sailAgain.label}
          </div>
          {review.wouldSailAgainNote && (
            <p className="mt-0.5 text-sm leading-relaxed">
              {review.wouldSailAgainNote}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {review.youtube && (
          <a
            href="#cabin-tour"
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-border-bold bg-card text-sm font-bold transition-colors hover:bg-muted"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            Cabin tour
          </a>
        )}
        <a
          href="#cost"
          className={`flex min-h-11 items-center justify-center rounded-xl border-2 border-border-bold bg-card text-sm font-bold transition-colors hover:bg-muted ${review.youtube ? '' : 'col-span-2'}`}
        >
          Jump to cost
        </a>
      </div>

      {(by || sailed) && (
        <p className="text-sm text-muted-foreground">
          {[by && `Reviewed by ${by}`, sailed && `Sailed ${sailed}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
    </div>
  )
}
