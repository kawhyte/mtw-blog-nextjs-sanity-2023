export function categoryRating(category) {
  let hotelCategoryObj = {
    name: 'test',
    color: 'test',
    icon: 'red',
    variant: '',
  }

  if (category == 'economy') {
    hotelCategoryObj = {
      name: 'Economy Hotel',
      icon: '/icon/location.svg',
      color: 'blue',
      variant: 'light',
    }
  } else if (category == 'luxury') {
    hotelCategoryObj = {
      name: 'Luxury Hotel',
      icon: '/icon/clean.svg',
      color: 'yellow',
      variant: 'light',
    }
  } else if (category == 'mid-scale') {
    hotelCategoryObj = {
      name: 'Mid-Scale Hotel',
      icon: '/icon/clean.svg',
      color: 'green',
      variant: 'light',
    }
  } else {
    hotelCategoryObj = {
      name: 'NR',
      icon: '/icon/location.svg',
      color: 'red',
      variant: 'light',
    }
    // Fall through
  }

  return hotelCategoryObj
}
