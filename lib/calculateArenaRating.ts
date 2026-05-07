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
  { rating: 'Fair', threshold: 3.0, color: '#F97316' },
  { rating: 'Poor', threshold: 1.5, color: '#EF4444' },
  { rating: 'Horrible', threshold: 0, color: '#991B1B' },
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
): { average: string; averageRaw: number; textRating: string; color: string } {
  let weightedSum = 0
  let totalWeight = 0
  const weights = { ...defaultWeights, ...customWeights } // Merge default and custom weights

  for (const key in arenaReview) {
    if (!Object.prototype.hasOwnProperty.call(weights, key)) continue
    const value = arenaReview[key]
    if (typeof value !== 'number' || isNaN(value)) continue
    const weight = weights[key]!
    weightedSum += value * weight
    totalWeight += weight
  }

  const averageRaw = totalWeight > 0 ? weightedSum / totalWeight / 2 : 0
  const average = (Math.round(averageRaw * 10) / 10).toFixed(1)
  const averageScore = averageRaw

  // Find the first matching threshold efficiently
  const matchingThreshold = ratingThresholds.find(
    (threshold) => averageScore >= threshold.threshold,
  )

  return {
    average,
    averageRaw,
    textRating: matchingThreshold?.rating || '',
    color: matchingThreshold?.color || '',
  }
}
