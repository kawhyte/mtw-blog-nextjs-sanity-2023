interface ArenaReview {
  [key: string]: number | string; // Index signature to allow any string key
  comments?: string;
  _type?: string;
}

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

  const average = totalWeight > 0 ? (sum / totalWeight).toFixed(2) : '0';

  // Determine text rating based on average score
  let textRating = '';
  if (parseFloat(average) >= 9.3) {
    textRating = 'Excellent';
  }else if (parseFloat(average) >= 8.3) {
    textRating = 'Great';
  } else if (parseFloat(average) >= 7.0) {
    textRating = 'Good';
  } else if (parseFloat(average) >= 6.0) {
    textRating = 'Fair';
  } else if (parseFloat(average) >= 4) {
    textRating = 'Poor';
  } else {
    textRating = 'Horrible';
  }

  return { average, textRating };
}