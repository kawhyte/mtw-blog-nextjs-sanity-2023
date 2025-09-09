interface RatingObject {
  [key: string]: number // Enforce number type for rating values
}

interface RatingWeights {
  [key: string]: number // Enforce number type for weight values
}

interface RatingThresholds {
  [threshold: number]: string
}

interface RatingResult {
  numericalRating: number
  textRating: string
  color?: string
}

const defaultRatingThresholds: RatingThresholds = {
  4.5: 'Excellent',
  4: 'Great',
  3.75: 'Good',
  3: 'Fair',
  2: 'Poor',
  0: 'Horrible',
}

const ratingColorMap: { [threshold: number]: string } = {
  4.5: '#34D319', // Excellent
  4: '#4ADE99', // Great
  3.75: '#FBBF24', // Good
  3: 'Orange', // Fair
  2: '#EF4444', // Poor
  0: 'DarkRed', // Horrible
}

export function calculateRating(
  ratingObject: RatingObject,
  weights: RatingWeights,
  ratingThresholds: RatingThresholds = defaultRatingThresholds,
): RatingResult {
  let weightedSum = 0
  let totalWeight = 0

  // Define which hotel amenities should be excluded when they have value 0
  // These represent "Not Available" amenities rather than "Poor" ratings
  const excludableHotelAmenities = ['Pool', 'Gym', 'Internet_Speed']

  for (const key in ratingObject) {
    if (
      Object.prototype.hasOwnProperty.call(ratingObject, key) &&
      key in weights
    ) {
      const rating = ratingObject[key]
      const weight = weights[key]
      
      // Only exclude zero values for specific hotel amenities that represent "Not Available"
      // For all other ratings (including food reviews), include zero as a valid poor rating
      const shouldExcludeZero = rating === 0 && excludableHotelAmenities.includes(key)
      
      if (!shouldExcludeZero) {
        weightedSum += rating * weight
        totalWeight += weight
      }
    }
  }

  // When amenities are excluded (value 0), the remaining weights should still add up to a proper weighted average
  // The numericalRating calculation automatically handles this by only including positive ratings in both 
  // the weighted sum and total weight, maintaining the proportional importance of available amenities
  const numericalRating = totalWeight > 0 ? weightedSum / totalWeight : 0

  // Convert the numerical rating to a text rating (more efficient lookup)
  const sortedThresholds = Object.keys(ratingThresholds)
    .map(Number)
    .sort((a, b) => b - a)

  let textRating =
    ratingThresholds[sortedThresholds[sortedThresholds.length - 1]] // Default to the lowest

  for (const threshold of sortedThresholds) {
    if (numericalRating >= threshold) {
      textRating = ratingThresholds[threshold]
      break
    }
  }

  // Determine the color based on numericalRating (more efficient lookup)
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
    textRating,
    color,
  }
}
