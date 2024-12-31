// utils/calculateAverageRating.ts

interface ArenaReview {
    [key: string]: number | string; // Index signature to allow any string key
    comments?: string;
    _type?: string;
  }
  
  export default function calculateAverageRating(arenaReview: ArenaReview): { average: string; textRating: string } {
    let sum = 0;
    let count = 0;
  
    for (const key in arenaReview) {
      if (
        arenaReview.hasOwnProperty(key) &&
        key !== 'comments' &&
        key !== '_type' &&
        typeof arenaReview[key] === 'number' // Type guard
      ) {
        sum += arenaReview[key] as number; // Type assertion
        count++;
      }
    }
  
    const average = count > 0 ? (sum / count).toFixed(2) : '0';

  // Determine text rating based on average score
  let textRating = '';
  if (parseFloat(average) >= 8) {
    textRating = 'Excellent';
  } else if (parseFloat(average) >= 6) {
    textRating = 'Good';
  } else if (parseFloat(average) >= 4) {
    textRating = 'Fair';
  } else {
    textRating = 'Poor';
  }

  return { average, textRating };

  }