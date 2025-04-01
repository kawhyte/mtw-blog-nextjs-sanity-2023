import { oswald } from 'app/fonts';
import { calculateRating } from 'lib/calculateRating';
import { getRatingWeights } from 'lib/ratingWeights';
import React from 'react';
import type { Post } from 'lib/sanity.queries'; // Or import specific rating types

// Assuming ratingItem can handle keys from ALL rating types (hotel, food, takeout)
// If not, this map might need to be adjusted or generated dynamically.
import { ratingItem } from '../lib/getReviewType';
import ProgressRating from './ProgressRating';

interface StarRatingProps {
  // rating prop now accepts any of the relevant rating structures
  rating?: Post['hotelRating'] | Post['foodRating'] | Post['takeoutRating'];
  linkType?: Post['linkType'];
  diningType?: Post['diningType'];
}

// Define a type for the expected result of calculateRating
type OverallRating = {
  numericalRating: number;
  textRating: string;
  color?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, linkType, diningType }) => {
  // --- Early exit if no rating data is provided ---
  if (!rating) {
    // Optionally render a 'Rating not available' message instead of null
    return null;
  }

  // --- Determine Weights (already correctly uses discriminators) ---
  const rateWeights = getRatingWeights(linkType, diningType);

  // --- Process Rating based on type ---
  let overallRatingResult: OverallRating | null = null;
  let ratingEntries: [string, number][] = [];

  // Use linkType and diningType to determine the structure and process accordingly
  if (linkType === 'hotel') {
    // Within this block, TypeScript should infer 'rating' as Post['hotelRating']
    // We use type assertion `as` for explicit clarity and safety if inference isn't perfect.
    const hotelRating = rating as Post['hotelRating'];
    overallRatingResult = calculateRating(hotelRating, rateWeights);
    // Filter out non-numeric values and _type before mapping
    ratingEntries = Object.entries(hotelRating)
      .filter(([key, value]) => key !== '_type' && typeof value === 'number') as [string, number][];

  } else if (linkType === 'food') {
    if (diningType === 'dinein') {
      // Type Guard: Inferred as Post['foodRating']
      const foodRating = rating as Post['foodRating'];
      overallRatingResult = calculateRating(foodRating, rateWeights);
      ratingEntries = Object.entries(foodRating)
        .filter(([key, value]) => key !== '_type' && typeof value === 'number') as [string, number][];

    } else if (diningType === 'takeout') {
      // Type Guard: Inferred as Post['takeoutRating']
      const takeoutRating = rating as Post['takeoutRating'];
      overallRatingResult = calculateRating(takeoutRating, rateWeights);
      ratingEntries = Object.entries(takeoutRating)
        .filter(([key, value]) => key !== '_type' && typeof value === 'number') as [string, number][];
    }
  }
  // Add else/default case if other linkTypes might have ratings

  // --- Another check: If processing failed for some reason, exit ---
  if (!overallRatingResult) {
    console.warn("StarRating: Could not calculate overall rating for provided data.", { rating, linkType, diningType });
    return null; // Or render error/message
  }

  // --- Destructure results for rendering ---
  const { numericalRating, textRating, color } = overallRatingResult;

  // --- Render the component ---
  return (
    <>
      {/* Overall Rating Display */}
      <div className="mb-6 flex items-end justify-start align-top">
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-3 text-white"
          style={{ backgroundColor: color }} // Use calculated color
        >
          <h1
            className={`mx-2 text-4xl font-semibold leading-tight tracking-tighter md:text-left md:text-6xl md:leading-none lg:text-6xl`}
          >
            {/* Use calculated numerical rating */}
            {numericalRating.toFixed(2)}
          </h1>
          <div className="flex items-center">
            <span className="text-base uppercase">out of 5</span>
            <span>
              <svg /* SVG icon code */ >...</svg>
            </span>
          </div>
        </div>
        <p
          className={`${oswald.variable} ml-4 font-heading text-3xl font-black`}
        >
          {/* Use calculated text rating */}
          {textRating}
        </p>
      </div>

      {/* Rating Breakdown Section */}
      <p
        className={`title-font my-3 mb-1 mt-2 text-base font-medium uppercase tracking-widest text-gray-700`}
      >
        {/* Dynamic title based on linkType */}
        {linkType === 'hotel' ? 'Hotel' : 'Food/Restaurant'} rating breakdown
      </p>
      <div className="max-w-8xl grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-1 md:gap-x-10 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-4">
          {/* Map over the correctly determined ratingEntries */}
          {ratingEntries.map(([categoryName, value]) => {
            // IMPORTANT: Ensure ratingItem contains entries for ALL possible keys
            // from hotelRating, foodRating, and takeoutRating (e.g., 'Value', 'Flavor_and_Taste', 'tasteAndFlavor')
            const itemInfo = ratingItem[categoryName];

            // Handle cases where a rating key might not be in ratingItem
            if (!itemInfo) {
              console.warn(`StarRating: No display info found in ratingItem for key: ${categoryName}`);
              return null; // Skip rendering this item
            }

            return (
              <div
                key={categoryName}
                className="flex flex-col justify-center rounded-2xl border p-3"
              >
                <div className="flex flex-row items-center justify-start">
                  <span className="pr-3">
                    <img
                      className=""
                      src={itemInfo.icon}
                      alt="icon"
                      width={20}
                      height={20}
                    />
                  </span>
                  {/* Use name from itemInfo */}
                  <p className="font-inter text-sm leading-loose md:text-base">
                    {itemInfo.name}{' '}
                    {/* Value check remains the same */}
                    {Number(value) <= 0 && '(not available)'}
                  </p>
                </div>
                {/* Value check remains the same */}
                {Number(value) > 0 && (
                  <div className="flex flex-1 flex-row items-center align-middle text-sm">
                    {/* ProgressRating expects a number 0-5 */}
                    <ProgressRating progress={value} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StarRating;