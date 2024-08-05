export function calculateTextRating(value) {
  let rating = {
    textRating: '',
    backgroundColor: '',
  }

  console.log("Value ",value)

  if (value >= 0 && value < 2) {
    rating.textRating = 'Horrible'
    rating.backgroundColor = 'red'
  } else if (value >= 2 && value < 3) {
    rating.textRating = 'Poor'
    rating.backgroundColor = 'orange'
  } else if (value >= 3 && value < 3.75) {
    rating.textRating = 'Fair'
    rating.backgroundColor = 'yellow'
  } else if (value >= 3.75 && value < 4) {
    rating.textRating = 'Good'
    rating.backgroundColor = 'blue'
  } else if (value >= 4 && value < 4.5) {
    rating.textRating = 'Great'
    rating.backgroundColor = 'indigo'
  } else if (value >= 4.5) {
    rating.textRating = 'Excellent'
    rating.backgroundColor = 'green'
  } else {
    rating.textRating = 'HMMMM'
    // Fall through
  }

  console.log("Test Rating ",rating)

  return rating
}
