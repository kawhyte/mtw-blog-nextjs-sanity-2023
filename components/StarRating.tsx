import { oswald } from 'app/fonts' // Assuming font import is needed
import { calculateRating } from 'lib/calculateRating' // Assuming calculation function import
import { getRatingWeights } from 'lib/ratingWeights' // Assuming weights function import
import type { FoodReview,HotelReview, Post } from 'lib/sanity.queries'
import React from 'react'
// --- Import Star Icons ---
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5'

// Assuming ratingItem map import
import { ratingItem } from '../lib/getReviewType' // Adjust path if needed
// Import child components
import ProgressRating from './ProgressRating'
import StarDisplay from './StarDisplay'

// Define props for the component - now supports all schema types
interface StarRatingProps {
  rating?:
    | HotelReview['hotelRating']
    | FoodReview['foodRating']
    | FoodReview['takeoutRating']
    | Post['hotelRating']
    | Post['foodRating']
    | Post['takeoutRating']
  linkType?: 'hotel' | 'food' | 'story' | 'favorite'
  diningType?: FoodReview['diningType'] | Post['diningType']
}

// Define a type for the structure returned by calculateRating
type OverallRating = {
  numericalRating: number
  textRating: string
  color?: string // Color can be optional
}

// The StarRating functional component
const StarRating: React.FC<StarRatingProps> = ({
  rating,
  linkType,
  diningType,
}) => {
  // --- Early exit if no rating data is provided ---
  if (!rating) {
    return null // Don't render anything if there's no rating object
  }

  // --- Determine Weights based on type ---
  // getRatingWeights should return appropriate weights for hotel/food/takeout
  const rateWeights = getRatingWeights(linkType, diningType)

  // --- Process Rating based on type ---
  let overallRatingResult: OverallRating | null = null
  let ratingEntries: [string, number][] = [] // To store [key, value] pairs for breakdown

  // Conditionally calculate rating and get entries based on linkType and diningType
  if (linkType === 'hotel') {
    // Type assertion for clarity / safety
    const hotelRating = rating as NonNullable<Post['hotelRating']> // Assert non-null if check passed
    overallRatingResult = calculateRating(hotelRating, rateWeights)
    // Filter out Sanity's internal _type and non-numeric values
    ratingEntries = Object.entries(hotelRating).filter(
      ([key, value]) => key !== '_type' && typeof value === 'number',
    ) as [string, number][]
  } else if (linkType === 'food') {
    if (diningType === 'dinein') {
      const foodRating = rating as NonNullable<Post['foodRating']>
      overallRatingResult = calculateRating(foodRating, rateWeights)
      ratingEntries = Object.entries(foodRating).filter(
        ([key, value]) => key !== '_type' && typeof value === 'number',
      ) as [string, number][]
    } else if (diningType === 'takeout') {
      const takeoutRating = rating as NonNullable<Post['takeoutRating']>
      overallRatingResult = calculateRating(takeoutRating, rateWeights)
      ratingEntries = Object.entries(takeoutRating).filter(
        ([key, value]) => key !== '_type' && typeof value === 'number',
      ) as [string, number][]
    }
  }
  // Consider adding an 'else' block or default handling if other linkTypes might have ratings

  // --- Another check: If calculation failed for some reason, exit ---
  if (!overallRatingResult) {
    console.warn(
      'StarRating: Could not calculate overall rating for provided data.',
      { rating, linkType, diningType },
    )
    return null // Don't render if calculation fails
  }

  // --- Destructure results for rendering, providing default color ---
  const { numericalRating, textRating, color = '#808080' } = overallRatingResult

  // --- Helper Function to Render Stars ---
  const renderStars = (ratingValue: number) => {
    const stars = []
    // Ensure ratingValue is within a reasonable range (e.g., 0-5)
    const clampedRating = Math.max(0, Math.min(5, ratingValue))
    const fullStars = Math.floor(clampedRating)
    // Check if decimal part is >= 0.5 for half star
    const hasHalfStar = clampedRating - fullStars >= 0.5
    const filledStarsCount = fullStars + (hasHalfStar ? 1 : 0)
    const emptyStars = Math.max(0, 5 - filledStarsCount)

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IoStar key={`full-${i}`} className="h-5 w-5 text-yellow-400" />,
      )
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<IoStarHalf key="half" className="h-5 w-5 text-yellow-400" />)
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      // Consider using a different color for empty stars for contrast
      stars.push(
        <IoStarOutline key={`empty-${i}`} className="h-5 w-5 text-gray-300" />,
      )
    }
    // Return exactly 5 stars
    return stars.slice(0, 5)
  }

  // --- Render the component JSX ---
  return (
    <>
      {/* Overall Rating Display Section */}
      <div className="mb-8 md:mb-20 flex items-end">
        {/* Main Rating Box */}
        <div
          className="z-30 flex h-32 w-36 flex-col items-center justify-center rounded-2xl border-2 bg-gray-50 p-2 shadow-md" // Added shadow
          style={{ borderColor: color, opacity: 0.95 }} // Slightly adjusted opacity
        >
          {/* Numerical Rating */}
          <div className="text-gray-900">
            <span className="ml-1 mr-1 font-montserrat text-5xl font-black leading-tight tracking-tighter sm:text-5xl md:text-left md:text-5xl md:leading-none lg:text-5xl">
              {numericalRating.toFixed(2)}
            </span>
          </div>
          {/* Separator */}
          <hr className="z-50 my-2 h-0.5 w-[85%] border-0 bg-gray-200 " />{' '}
          {/* Adjusted width and color */}
          {/* Star Rendering Area */}
          <div className="mt-1 flex items-center">
            <StarDisplay ratingValue={numericalRating} />

            {/* {renderStars(numericalRating)} */}
          </div>
        </div>
        <div className="ml-6 flex flex-col ">
          <p
            className={`mb-3 font-montserrat text-6xl font-bold text-gray-900 ${oswald.variable} font-heading`}
          >
            {' '}
            {/* Added font styles */}
            {textRating}
          </p>

          <p className="text-xs">Based on weighted review scores.</p>
        </div>
      </div>

      {/* Rating Breakdown Section */}
      <p
        className={`title-font my-3 mb-4 mt-2 text-base font-medium uppercase tracking-widest text-gray-700`}
      >
        {' '}
        {/* Adjusted margin */}
        {linkType === 'hotel' ? 'Hotel' : 'Food/Restaurant'} rating breakdown
      </p>
      <div className="max-w-8xl grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-1 md:gap-x-10 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-4">
          {/* Map over the individual rating entries */}
          {ratingEntries.map(([categoryName, value]) => {
            // Look up display info (name, icon) for the category
            const itemInfo = ratingItem[categoryName]
            // Gracefully handle if a rating key isn't found in the map
            if (!itemInfo) {
              console.warn(
                `StarRating: No display info found in ratingItem for key: ${categoryName}`,
              )
              return null // Skip rendering this item
            }
            // Render individual rating item
            return (
              <div
                key={categoryName}
                className="flex flex-col justify-center rounded-2xl border p-3 shadow-sm"
              >
                {' '}
                {/* Added shadow-sm */}
                <div className="flex flex-row items-center justify-start">
                  {/* Icon */}
                  <span className="pr-3">
                    <img
                      className=""
                      src={itemInfo.icon}
                      alt={`${itemInfo.name} icon`} // Improved alt text
                      width={20}
                      height={20}
                    />
                  </span>
                  {/* Name and Availability Text */}
                  <p className="font-inter text-sm leading-loose md:text-base">
                    {itemInfo.name}{' '}
                    {Number(value) <= 0 && (
                      <span className="text-xs italic text-gray-500">
                        (not rated)
                      </span> // More descriptive text
                    )}
                  </p>
                </div>
                {/* Progress Bar (only if rated > 0) */}
                {Number(value) > 0 && (
                  <div className="mt-1 flex flex-1 flex-row items-center align-middle text-sm">
                    {' '}
                    {/* Added mt-1 */}
                    <ProgressRating progress={value} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// Export the component for use elsewhere
export default StarRating
