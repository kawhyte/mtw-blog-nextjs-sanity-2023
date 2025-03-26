interface RatingObject {
  [key: string]: number; // Enforce number type for rating values
}

interface RatingWeights {
  [key: string]: number; // Enforce number type for weight values
}

interface RatingThresholds {
  [threshold: number]: string;
}

interface RatingResult {
  numericalRating: number;
  textRating: string;
  color?: string;
}

const defaultRatingThresholds: RatingThresholds = {
  4.5: 'Excellent',
  4: 'Great',
  3.75: 'Good',
  3: 'Fair',
  2: 'Poor',
  0: 'Horrible',
};

const ratingColorMap: { [threshold: number]: string } = {
  4.5: '#34D319',   // Excellent
  4: '#4ADE99',     // Great
  3.75: '#FBBF24',  // Good
  3: 'Orange',    // Fair
  2: '#EF4444',       // Poor
  0: 'DarkRed',     // Horrible
};

export function calculateRating(
  ratingObject: RatingObject,
  weights: RatingWeights,
  ratingThresholds: RatingThresholds = defaultRatingThresholds
): RatingResult {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const key in ratingObject) {
    if (Object.prototype.hasOwnProperty.call(ratingObject, key) && key in weights) {
      const rating = ratingObject[key];
      const weight = weights[key];
      weightedSum += rating * weight;
      totalWeight += weight;
    }
  }

  const numericalRating = totalWeight > 0 ? weightedSum / totalWeight : 0;

  // Convert the numerical rating to a text rating (more efficient lookup)
  const sortedThresholds = Object.keys(ratingThresholds)
    .map(Number)
    .sort((a, b) => b - a);

  let textRating = ratingThresholds[sortedThresholds[sortedThresholds.length - 1]]; // Default to the lowest

  for (const threshold of sortedThresholds) {
    if (numericalRating >= threshold) {
      textRating = ratingThresholds[threshold];
      break;
    }
  }

  // Determine the color based on numericalRating (more efficient lookup)
  let color: string | undefined;
  for (const threshold of Object.keys(ratingColorMap)
    .map(Number)
    .sort((a, b) => b - a)) {
    if (numericalRating >= threshold) {
      color = ratingColorMap[threshold];
      break;
    }
  }

  return {
    numericalRating,
    textRating,
    color,
  };
}