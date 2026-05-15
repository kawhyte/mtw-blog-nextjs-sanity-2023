import { calculateRating } from 'lib/calculateRating'
import { FOOD_WEIGHTS, HOTEL_WEIGHTS, TAKEOUT_WEIGHTS } from 'lib/ratingWeights'
import { ReactElement } from 'react'

import ProgressRating from './ProgressRating'

// Maps a text rating label to design-system Tailwind classes.
// Three semantic bands: success (green) / warning (orange) / destructive (red).
// Both text and bg variants returned so the same mapping drives text labels and the accent bar.
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

// Helper function to format snake_case and camelCase to Title Case
const formatRatingName = (name: string): string => {
  // Handle camelCase (e.g., "foodValue" -> "Food Value", "tasteAndFlavor" -> "Taste And Flavor")
  if (name.includes('_')) {
    // snake_case handling
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  } else {
    // camelCase handling
    return name
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before uppercase letters
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

// Helper function to get display text for amenities that are not available
const getUnavailableText = (name: string): string => {
  const amenityMap: { [key: string]: string } = {
    Pool: 'No Pool',
    Gym: 'No Gym',
    Internet_Speed: 'No Internet',
  }
  return amenityMap[name] || 'Not Available'
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

  // Determine weights based on review type and field names
  let weights:
    | typeof HOTEL_WEIGHTS
    | typeof FOOD_WEIGHTS
    | typeof TAKEOUT_WEIGHTS
  if (reviewType === 'hotel') {
    weights = HOTEL_WEIGHTS
  } else {
    // For food reviews, detect if it's takeout based on field names
    const isTakeoutRating = Object.keys(ratings).some((key) =>
      [
        'tasteAndFlavor',
        'foodValue',
        'packaging',
        'accuracy',
        'overallSatisfaction',
      ].includes(key),
    )
    weights = isTakeoutRating ? TAKEOUT_WEIGHTS : FOOD_WEIGHTS
  }

  const {
    numericalRating: overallRating,
    displayRating,
    textRating: textScore,
  } = calculateRating(ratings, weights)

  const ratingClasses = getRatingClasses(textScore)

  const activeCategoryCount = ratingEntries.filter(([name, value]) => {
    if (['Pool', 'Gym', 'Internet_Speed'].includes(name) && value === 0)
      return false
    return true
  }).length

  return (
    <section className="bg-secondary-soft-background rounded-2xl p-6 sm:p-8 my-8">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-x-12">
        <div className="md:col-span-4 flex flex-col items-center text-center border-b-2 md:border-b-0 md:border-r-2 border-border pb-6 md:pb-0 md:pr-8 mb-6 md:mb-0">
          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>

          {/* Score — centered, fills remaining space */}
          <div className="flex flex-col items-center gap-2 flex-1 justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-9xl font-bold text-secondary leading-none">
                {displayRating}
              </span>
              <span className="text-2xl font-normal text-muted-foreground">
                / 5.0
              </span>
            </div>
            <p className={`text-2xl font-bold ${ratingClasses.text}`}>
              {textScore}
            </p>
          </div>

          {/* Bottom anchor */}
          <div className="w-full mt-6">
            <div
              className={`h-1 w-full rounded-full mb-1.5 ${ratingClasses.bg}`}
            />
            <p className="text-xs text-muted-foreground mt-5">
              Weighted across {activeCategoryCount}{' '}
              {activeCategoryCount === 1 ? 'category' : 'categories'}
            </p>
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
                  {value === 0 &&
                  ['Pool', 'Gym', 'Internet_Speed'].includes(name) ? (
                    <span className="text-sm text-muted-foreground italic">
                      {getUnavailableText(name)}
                    </span>
                  ) : (
                    <ProgressRating progress={value / 2} color="secondary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
