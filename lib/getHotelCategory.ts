export function categoryRating(category) {
  let hotelCategoryObj = {
    name: 'test',
    color: 'test',
    icon: 'red',
    variant: '',
    HEX: ' shadow-offsetGreen ',
  }

  if (category == 'economy') {
    hotelCategoryObj = {
      name: 'Economy Hotel',
      icon: '/icon/location.svg',
      color: 'blue',
      variant: 'light',
      HEX: ' shadow-offsetGreen ',
    }
  } else if (category == 'luxury') {
    hotelCategoryObj = {
      name: 'Luxury Hotel',
      icon: '/icon/clean.svg',
      color: 'yellow',
      variant: 'light',
	  HEX: ' shadow-offsetYellow ',
    }
  } else if (category == 'mid-scale') {
    hotelCategoryObj = {
      name: 'Mid-Scale Hotel',
      icon: '/icon/clean.svg',
      color: 'green',
      variant: 'light',
      HEX: ' shadow-offsetGreen ',
    }
  } else {
    hotelCategoryObj = {
      name: 'NR',
      icon: '/icon/location.svg',
      color: 'blue',
      variant: 'light',
      HEX: ' shadow-offsetGreen ',
    }
    // Fall through
  }

  // console.log("categoryRating", category)
  // console.log("hotelCategoryObj", hotelCategoryObj)

  return hotelCategoryObj
}

//  const categoryObj = {

//     economy: {
// 		name: "Economy",
// 		icon: "/icon/location.svg",
// 		color:.20
// 	},
// 	Mid_sclale: {
// 		name: "Mid Scale",
// 		icon: "/icon/bed.svg",
// 		color:.20
// 	},
// 	Luxury: {
// 		name: "Luxury",
// 		icon: "/icon/clean.svg",
// 		color:.10
// 	},

//  }
