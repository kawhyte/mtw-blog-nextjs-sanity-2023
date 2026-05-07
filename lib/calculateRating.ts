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
  6: '#F97316', // Fair
  4: '#EF4444', // Poor
  0: '#991B1B', // Horrible
}

// Pre-computed at module scope — avoids re-sorting on every call
const _sortedDefaultThresholds = Object.keys(defaultRatingThresholds)
  .map(Number)
  .sort((a, b) => b - a)

const _sortedDefaultColors = Object.keys(ratingColorMap)
  .map(Number)
  .sort((a, b) => b - a)

export function calculateRating(
  ratingObject: RatingObject,
  weights: RatingWeights,
  ratingThresholds: RatingThresholds = defaultRatingThresholds,
): RatingResult {
  let weightedSum = 0
  let totalWeight = 0

  /**
   * Amenities that treat an exact `0` value as "Not Available" rather than a
   * legitimate rock-bottom score.
   *
   * Preferred signal: leave the Sanity field blank (null/undefined) — the
   * `typeof rating !== 'number'` guard above already excludes those safely.
   *
   * This list is a legacy fallback for documents that were saved with `0`
   * before the schema enforced optional fields. Because `shouldExcludeZero`
   * uses strict equality (`=== 0`), a score of `0.1` still flows through as a
   * real (very poor) rating — intentional, so reviewers can tank an amenity
   * without hitting the legacy `0` trap.
   *
   * WARNING: Adding a field here means no reviewer can ever legitimately
   * award a 0/10 for that amenity. Only include fields where `0` carries no
   * meaningful score semantics.
   */
  const excludableHotelAmenities = ['Pool', 'Gym', 'Internet_Speed']

  for (const key in ratingObject) {
    if (
      Object.prototype.hasOwnProperty.call(ratingObject, key) &&
      key in weights
    ) {
      const rating = ratingObject[key]
      const weight = weights[key]

      // Guard against null/undefined/NaN values from unpopulated Sanity fields
      if (typeof rating !== 'number' || isNaN(rating)) continue

      // Strict equality: 0.1 is a real score; only exact 0 triggers legacy exclusion
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

  const sortedThresholds =
    ratingThresholds === defaultRatingThresholds
      ? _sortedDefaultThresholds
      : Object.keys(ratingThresholds)
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
  for (const threshold of _sortedDefaultColors) {
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
