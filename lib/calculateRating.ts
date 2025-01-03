interface RatingObject {
    [key: string]: number | string;
  }
  
  interface RatingWeights {
    [key: string]: number;
  }
  
  interface RatingResult {
    numericalRating: number;
    textRating: string;
  }
  


 export function calculateRating(
    ratingObject: RatingObject,
    weights: RatingWeights,
    ratingThresholds: { [key: number]: string } = {
      4.5: 'Excellent',
      3.5: 'Very Good',
      2.5: 'Good',
      1.5: 'Fair',
      0: 'Poor', // Default for any rating below 1.5
    }
  ): RatingResult {
    // Calculate the weighted average rating
    let weightedSum = 0;
    for (const key in ratingObject) {
      if (key in weights && typeof ratingObject[key] === 'number') {
        weightedSum += ratingObject[key] * weights[key];
      }
    }
  
    // Convert the numerical rating to a text rating
    const thresholds = Object.keys(ratingThresholds)
      .map(Number)
      .sort((a, b) => b - a); // Sort thresholds in descending order
  
    let textRating = ratingThresholds[thresholds[thresholds.length - 1]]; // Default to the lowest rating
    for (const threshold of thresholds) {
      if (weightedSum >= threshold) {
        textRating = ratingThresholds[threshold];
        break;
      }
    }
  
    // Return an object containing both the numerical and text ratings
    return {
      numericalRating: weightedSum,
      textRating: textRating,
    };
  }