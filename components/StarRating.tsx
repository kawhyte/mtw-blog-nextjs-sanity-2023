import { oswald } from 'app/fonts';
import { calculateRating } from 'lib/calculateRating';
import { getRatingWeights } from 'lib/ratingWeights';
import React from 'react';

import { ratingItem } from '../lib/getReviewType';
import ProgressRating from './ProgressRating';

interface StarRatingProps {
  rating: Record<string, number>;
  linkType: 'hotel' | 'food' | string; // Consider creating a more specific type
  diningType?: 'takeout' | 'dinein'; // Make optional as it's only relevant for 'food'
}

const StarRating: React.FC<StarRatingProps> = ({ rating, linkType, diningType }) => {
  const rateWeights = getRatingWeights(linkType, diningType);
  const overallRating = calculateRating(rating, rateWeights);
  const ratingEntries = Object.entries(rating).filter(([key]) => key !== '_type');

  return (
    <>
      <div className="mb-6 flex items-end justify-start align-top">
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-3 text-white"
          style={{ backgroundColor: overallRating.color }}
        >
          <h1
            className={`mx-2 text-4xl font-semibold leading-tight tracking-tighter md:text-left md:text-6xl md:leading-none lg:text-6xl`}
          >
            {overallRating.numericalRating.toFixed(2)}
          </h1>
          <div className="flex items-center">
            <span className="text-base uppercase">out of 5</span>
            <span>
              <svg
                className="mb-1 ml-1 h-3 w-3 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="3 3 18 18"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M20.83,9.15l-6-.52L12.46,3.08h-.92L9.18,8.63l-6,.52L2.89,10l4.55,4L6.08,19.85l.75.55L12,17.3l5.17,3.1.75-.55L16.56,14l4.55-4Z"></path>
              </svg>
            </span>
          </div>
        </div>
        <p
          className={`${oswald.variable} ml-4 font-heading text-3xl font-black`}
        >
          {overallRating.textRating}
        </p>
      </div>

      <p
        className={`title-font my-3 mb-1 mt-2 text-base font-medium uppercase tracking-widest text-gray-700`}
      >
        {linkType === 'hotel' ? 'Hotel' : 'Restaurant/Food'} rating breakdown
      </p>
      <div className="max-w-8xl grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-1 md:gap-x-10 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-4">
          {ratingEntries.map(([categoryName, value]) => (
            <div
              key={categoryName}
              className="flex flex-col justify-center rounded-2xl border p-3"
            >
              <div className="flex flex-row items-center justify-start">
                <span className="pr-3">
                  <img
                    className=""
                    src={ratingItem[categoryName]?.icon}
                    alt="icon"
                    width={20}
                    height={20}
                  />
                </span>
                <p className="font-inter text-sm leading-loose md:text-base">
                  {ratingItem[categoryName]?.name}{' '}
                  {Number(value) <= 0 && '(not available)'}
                </p>
              </div>
              {Number(value) > 0 && (
                <div className="flex flex-1 flex-row items-center align-middle text-sm">
                  <ProgressRating progress={value} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StarRating;