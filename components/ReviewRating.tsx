import { calculateRating } from 'lib/calculateRating'
import { FOOD_WEIGHTS, HOTEL_WEIGHTS } from 'lib/ratingWeights'
import { ReactElement } from 'react'

import ProgressRating from './ProgressRating'

// Helper function to format snake_case to Title Case
const formatRatingName = (name: string): string => {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface ReviewRatingProps {
  ratings: { [key: string]: number }
  ratingIcons: { [key: string]: ReactElement }
  title: string
  reviewType?: 'food' | 'hotel' // Add review type to determine weights
}

export default function ReviewRating({
  ratings,
  ratingIcons,
  title,
  reviewType = 'food', // Default to food if not specified
}: ReviewRatingProps) {
  if (!ratings) {
    return null
  }
  const ratingEntries = Object.entries(ratings).filter(
    ([key, value]) => key !== '_type' && value !== null && value !== undefined,
  )
  if (ratingEntries.length === 0) {
    return null
  }

  // Use weighted calculation based on review type
  const weights = reviewType === 'hotel' ? HOTEL_WEIGHTS : FOOD_WEIGHTS
  const { numericalRating: overallRating, textRating: textScore } =
    calculateRating(ratings, weights)

  return (
    <section className="bg-secondary-soft-background rounded-2xl p-6 sm:p-8 my-8">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left border-b-2 md:border-b-0 md:border-r-2 border-border pb-6 md:pb-0 md:pr-8 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-7xl font-bold text-secondary mb-2">
            {overallRating.toFixed(1)}
          </p>
          <p className="text-2xl font-semibold text-foreground mb-2">
            {textScore}
          </p>
          <div className="mt-4 text-sm text-muted-foreground italic">
            A comprehensive look at what makes this special.
          </div>
        </div>
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {ratingEntries.map(([name, value]) => (
              <div key={name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-foreground flex items-center">
                    {ratingIcons[name]}
                    {formatRatingName(name)}
                  </span>
                </div>
                <div className="flex items-center">
                  <ProgressRating progress={value} color="secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
