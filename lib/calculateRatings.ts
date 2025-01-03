import { ratingItem } from './getReviewType'

export function calculateRating(rating) {
  let textRating = 'NR'

  let isFraction = false

  // Getting sum of numbers
  let sum = rating.reduce(function (a, b) {
    return a + b[1] * ratingItem[b[0]]?.rate
  }, 0)

  let average = sum

  if (average >= 0 && average < 2) {
    textRating = 'Horrible'
  } else if (average >= 2 && average < 3) {
    textRating = 'Poor'
  } else if (average >= 3 && average < 3.75) {
    textRating = 'Fair'
  } else if (average >= 3.75 && average < 4) {
    textRating = 'Good'
  } else if (average >= 4 && average < 4.5) {
    textRating = 'Great'
  } else if (average >= 4.5) {
    textRating = 'Excellent'
  } else {
    textRating = 'HMMMM'
    // Fall through
  }

  return { average, textRating }
}
