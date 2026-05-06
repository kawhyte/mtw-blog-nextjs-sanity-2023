interface RatingObject {
  [key: string]: number
}

interface RatingWeights {
  [key: string]: number
}

interface RatingThresholds {
  [threshold: number]: string
}

interface RatingResult {
  numericalRating: number
  displayRating: string // 5-point formatted string, e.g. "4.3"
  textRating: string
  color?: string
}

// Thresholds operate on the 10-point scale stored in the database
const defaultRatingThresholds: RatingThresholds = {
  9: 'Excellent',
  8: 'Great',
  7.5: 'Good',
  6: 'Fair',
  4: 'Poor',
  0: 'Horrible',
}

const ratingColorMap: { [threshold: number]: string } = {
  9: '#34D319', // Excellent
  8: '#4ADE99', // Great
  7.5: '#FBBF24', // Good
  6: 'Orange', // Fair
  4: '#EF4444', // Poor
  0: 'DarkRed', // Horrible
}

export function calculateRating(
  ratingObject: RatingObject,
  weights: RatingWeights,
  ratingThresholds: RatingThresholds = defaultRatingThresholds,
): RatingResult {
  let weightedSum = 0
  let totalWeight = 0

  // These hotel amenities use 0 to mean "Not Available", not a poor rating
  const excludableHotelAmenities = ['Pool', 'Gym', 'Internet_Speed']

  for (const key in ratingObject) {
    if (
      Object.prototype.hasOwnProperty.call(ratingObject, key) &&
      key in weights
    ) {
      const rating = ratingObject[key]
      const weight = weights[key]

      const shouldExcludeZero =
        rating === 0 && excludableHotelAmenities.includes(key)

      if (!shouldExcludeZero) {
        weightedSum += rating * weight
        totalWeight += weight
      }
    }
  }

  const numericalRating = totalWeight > 0 ? weightedSum / totalWeight : 0

  // Convert 10-point score to 5-point display value with strict 1-decimal formatting
  const displayRating = (Math.round((numericalRating / 2) * 10) / 10).toFixed(1)

  const sortedThresholds = Object.keys(ratingThresholds)
    .map(Number)
    .sort((a, b) => b - a)

  let textRating =
    ratingThresholds[sortedThresholds[sortedThresholds.length - 1]]

  for (const threshold of sortedThresholds) {
    if (numericalRating >= threshold) {
      textRating = ratingThresholds[threshold]
      break
    }
  }

  let color: string | undefined
  for (const threshold of Object.keys(ratingColorMap)
    .map(Number)
    .sort((a, b) => b - a)) {
    if (numericalRating >= threshold) {
      color = ratingColorMap[threshold]
      break
    }
  }

  return {
    numericalRating,
    displayRating,
    textRating,
    color,
  }
}
