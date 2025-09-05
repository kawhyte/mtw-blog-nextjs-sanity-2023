interface ArenaReview {
  comments?: string
  _type?: string
  [key: string]: number | string | undefined // More specific index signature
}

interface RatingThreshold {
  rating: string
  threshold: number
  color: string
}

const ratingThresholds: RatingThreshold[] = [
  { rating: 'Excellent', threshold: 4.5, color: '#34D319' },
  { rating: 'Great', threshold: 4.0, color: '#4ADE99' },
  { rating: 'Good', threshold: 3.75, color: '#FBBF24' },
  { rating: 'Fair', threshold: 3.0, color: 'Orange' },
  { rating: 'Poor', threshold: 0, color: '#EF4444' },
]

const defaultWeights: { [key: string]: number } = {
  vibes: 0.1,
  food: 0.2,
  transportation: 0.1,
  walkability: 0.2,
  view: 0.2,
  seatComfort: 0.2,
}

export default function calculateAverageRating(
  arenaReview: ArenaReview,
  customWeights?: { [key: string]: number },
): { average: string; textRating: string; color: string } {
  let weightedSum = 0
  let totalWeight = 0
  const weights = { ...defaultWeights, ...customWeights } // Merge default and custom weights

  for (const key in arenaReview) {
    if (typeof arenaReview[key] === 'number' && weights.hasOwnProperty(key)) {
      const weight = weights[key]! // '!' because hasOwnProperty ensures the key exists
      weightedSum += (arenaReview[key] as number) * weight // '!' because typeof check ensures it's a number
      totalWeight += weight
    }
  }

  const average =
    totalWeight > 0 ? (weightedSum / totalWeight / 2).toFixed(2) : '0'
  const averageScore = parseFloat(average)

  // Find the first matching threshold efficiently
  const matchingThreshold = ratingThresholds.find(
    (threshold) => averageScore >= threshold.threshold,
  )

  return {
    average,
    textRating: matchingThreshold?.rating || '',
    color: matchingThreshold?.color || '',
  }
}
