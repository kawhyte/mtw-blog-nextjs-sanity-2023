interface ArenaReview {
  [key: string]: number | string; // Index signature to allow any string key
  comments?: string;
  _type?: string;
}

interface RatingThreshold {
  rating: string;
  threshold: number;
}

const ratingThresholds: RatingThreshold[] = [
  { rating: 'Excellent', threshold: 4.5 },
  { rating: 'Great', threshold: 4 },
  { rating: 'Good', threshold: 3.75 },
  { rating: 'Fair', threshold: 3 },
  { rating: 'Poor', threshold: 2.0 },
  { rating: 'Horrible', threshold: 0 }, // Catch-all for anything below 5.0
];

export default function calculateAverageRating(arenaReview: ArenaReview): { average: string; textRating: string } {
  let sum = 0;
  let totalWeight = 0;

  const weights: { [key: string]: number } = {
    "vibes": 0.1,  // Example weights - adjust as needed
    "food": 0.2,
    "transportation": 0.1,
    "walkability": 0.2,
    "view": 0.2,
    "seatComfort": 0.2 
  };

  for (const key in arenaReview) {
    if (
      arenaReview.hasOwnProperty(key) &&
      key !== 'comments' &&
      key !== '_type' &&
      typeof arenaReview[key] === 'number' 
    ) {
      const weight = weights[key] || 1; // Default weight of 1 if not specified
      sum += (arenaReview[key] as number) * weight;
      totalWeight += weight;
    }
  }

  const average = totalWeight > 0 ? ((sum / totalWeight)/2).toFixed(2) : '0';
  const averageScore = parseFloat(average);

  // Determine text rating using the ratingThresholds array
  let textRating = '';
  for (const threshold of ratingThresholds) {
    if (averageScore >= threshold.threshold) {
      textRating = threshold.rating;
      break; // Exit the loop once a match is found
    }
  }

  return { average, textRating };
}