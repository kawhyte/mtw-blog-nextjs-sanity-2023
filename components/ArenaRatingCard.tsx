import calculateAverageRating from 'lib/calculateArenaRating'
import { ReactElement } from 'react'

import ProgressRating from './ProgressRating'

function getRatingClasses(textScore: string): { text: string; bg: string } {
  switch (textScore) {
    case 'Excellent':
    case 'Great':
      return { text: 'text-success', bg: 'bg-success' }
    case 'Good':
    case 'Fair':
      return { text: 'text-warning', bg: 'bg-warning' }
    case 'Poor':
    case 'Horrible':
      return { text: 'text-destructive', bg: 'bg-destructive' }
    default:
      return { text: 'text-muted-foreground', bg: 'bg-muted' }
  }
}

interface ArenaRatingCardProps {
  effectiveArenaReview: Record<string, number | undefined>
  ratingIcons: Record<string, ReactElement>
  ratingLabels: Record<string, string>
  categoryOrder?: string[]
}

export default function ArenaRatingCard({
  effectiveArenaReview,
  ratingIcons,
  ratingLabels,
  categoryOrder,
}: ArenaRatingCardProps) {
  const allEntries = Object.entries(effectiveArenaReview).filter(
    ([, v]) => typeof v === 'number',
  ) as [string, number][]

  const ratingEntries = categoryOrder
    ? [...allEntries].sort(
        (a, b) =>
          (categoryOrder.indexOf(a[0]) + 1 || categoryOrder.length + 1) -
          (categoryOrder.indexOf(b[0]) + 1 || categoryOrder.length + 1),
      )
    : allEntries

  if (ratingEntries.length === 0) return null

  const {
    average: displayRating,
    textRating,
    color,
  } = calculateAverageRating(effectiveArenaReview as any)

  const ratingClasses = getRatingClasses(textRating)

  return (
    <section className="bg-secondary-soft-background rounded-2xl p-6 sm:p-8 my-8">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-12">
        {/* LEFT — overall score */}
        <div className="md:col-span-4 flex flex-col items-center text-center border-b-2 md:border-b-0 md:border-r-2 border-border pb-6 md:pb-0 md:pr-8 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Arena Rating
          </h2>

          <div className="flex flex-col items-center gap-2 flex-1 justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-7xl font-bold text-secondary leading-none">
                {displayRating}
              </span>
              <span className="text-xl font-normal text-muted-foreground">
                / 5.0
              </span>
            </div>
            <p className={`text-2xl font-bold ${ratingClasses.text}`}>
              {textRating}
            </p>
          </div>

          <div className="w-full mt-6">
            <div
              className={`h-1 w-full rounded-full mb-1.5 ${ratingClasses.bg}`}
            />
            <p className="text-xs text-muted-foreground mt-5">
              Weighted across {ratingEntries.length}{' '}
              {ratingEntries.length === 1 ? 'category' : 'categories'}
            </p>
          </div>
        </div>

        {/* RIGHT — category breakdown */}
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {ratingEntries.map(([key, value]) => {
              return (
                <div key={key} className="rounded-lg px-2 py-1.5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-foreground flex items-center">
                      {ratingIcons[key]}
                      {ratingLabels[key] ?? key}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ProgressRating progress={value / 2} color="secondary" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
