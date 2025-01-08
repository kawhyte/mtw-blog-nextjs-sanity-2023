import { inter, oswald } from 'app/fonts'
import { calculateRating } from 'lib/calculateRating'
import { ratingWeights } from 'lib/ratingWeights'
import React from 'react'

import { ratingItem } from '../lib/getReviewType'
import ProgressRating from './ProgressRating'

const StarRating = ({ rating, linkType, diningType }) => {
  //  console.log('STAR RATING LinkType3', linkType)
  //  console.log('STAR RATING diningType3', diningType)
  //  console.log('STAR RATING rating2', rating)

  // let weights: { [category: string]: number } = {
  //   cleanliness: 0.2,
  //   service: 0.25,
  //   value: 0.2,
  //   location: 0.15,
  //   food: 0.2, // Default weight for food
  // }

  // switch (linkType) {
  //   case 'hotel':
  //     weights.Location = 0.2
  //     weights.Bed_Comfort = 0.2
  //     weights.Room_Cleanliness = 0.1
  //     weights.Gym = 0.05
  //     weights.Pool = 0.05
  //     weights.Service = 0.15
  //     weights.Internet_Speed = 0.05
  //     weights.Room_Amenities = 0.1
  //     weights.Value = 0.1
  //     break
  //   case 'food':
  //     switch (diningType) {
  //       case 'takeout':
  //         weights.tasteAndFlavor = 0.1
  //         weights.presentation = 0.3
  //         weights.accuracy = 0.1
  //         weights.packaging = 0.1
  //         weights.overallSatisfaction = 0.2
  //         weights.foodValue = 0.2
  //         break
  //       case 'dinein':
  //         weights.Restaurant_Location = 0.05
  //         weights.Restaurant_Service = 0.2
  //         weights.Food_Value = 0.15
  //         weights.Presentation_on_Plate = 0.05
  //         weights.Memorability = 0.15
  //         weights.Restaurant_Cleanliness = 0.2
  //         weights.Flavor_and_Taste = 0.2
  //         break

  //       default:
  //         weights.Restaurant_Location = 0.05
  //         weights.Restaurant_Service = 0.2
  //         weights.Food_Value = 0.15
  //         weights.Presentation_on_Plate = 0.05
  //         weights.Memorability = 0.15
  //         weights.Restaurant_Cleanliness = 0.2
  //         weights.Flavor_and_Taste = 0.2
  //         break
  //     }

  //     break

  //   default:
  //     weights.Restaurant_Location = 0.2
  //     weights.food = 0.4
  //     weights.packaging = 0.1
  //     break
  // }

  let rateWeights = ratingWeights(linkType, diningType)

 
  const overallRating = calculateRating(rating, rateWeights)
  //console.log('Hello2', overallRating)
  const propertyNames = Object.entries(rating).filter(
    ([key]) => key !== '_type'
  )

  // console.log("average",average)
  //console.log('propertyNames', propertyNames)
  return (
    <>
      <div className="mb-6   flex items-end justify-start align-top   ">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-pink-500 p-3">
          <h1
            className={` mx-2 text-4xl font-semibold leading-tight tracking-tighter text-white md:text-left md:text-6xl md:leading-none lg:text-6xl`}
          >
            {/*isFraction ? Math.floor(average) + ".5" : Math.floor(average)*/}
            {overallRating.numericalRating.toFixed(2)}
          </h1>
          <div className="flex items-center">
            <span className=" text-base uppercase text-white">out of 5</span>
            <span>
              <svg
                className="mb-1 ml-1 h-3 w-3  fill-current text-white"
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
        className={`   title-font my-3  mb-1  mt-2  text-base font-medium uppercase tracking-widest text-gray-700 `}
      >
        {linkType === 'hotel' ? 'Hotel' : 'Restaurant/Food'} rating breakdown{' '}
      </p>
      <div className="max-w-8xl grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 ">
        <div className="mt-3 grid  grid-cols-1 gap-x-8 gap-y-5  md:grid-cols-1  md:gap-x-10 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-4 ">
          {propertyNames.map(([categoryName, value]) => {
            //const text = item[0]

            return (
              <div
                key={categoryName}
                className={`flex flex-col justify-center rounded-2xl border p-3`}
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

                  {Number(value) > 0 ? (
                    <p
                      className={`${inter.variable} font-secondary text-sm font-extralight leading-loose md:text-base`}
                    >
                      {ratingItem[categoryName]?.name}
                    </p>
                  ) : (
                    <p
                      className={`${inter.variable} font-secondary text-sm font-extralight leading-loose md:text-base`}
                    >
                     {ratingItem[categoryName]?.name} not available
                    </p>
                  )}
                </div>
                {Number(value) > 0 && (
                  <div className="flex flex-1 flex-row items-center align-middle text-sm">
                    <p className="my-1 mr-2 text-sm font-medium md:text-base"></p>
                    <ProgressRating progress={value} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* {propertyNames.map((item) => {
            let text = item[0]

            return (
              <div
                key={item[0]}
                className={`  flex flex-col justify-center rounded-2xl border p-3 `}
              >
                <div className="flex flex-row items-center justify-start">
                  <span className=" pr-3">
                    <img
                      className=""
                      src={ratingItem[text]?.icon}
                      alt={'icon'}
                      width={20}
                      height={20}
                    />
                  </span>

                  {Number(item[1]) > 0
                    ? <p className={`${inter.variable} font-secondary text-sm font-extralight leading-loose md:text-base`}> {ratingItem[text]?.name}</p>
                    : <p className={`${inter.variable} font-secondary text-sm font-extralight leading-loose md:text-base`}> No on-site {ratingItem[text]?.name} availiable</p>}
                </div>
                {Number(item[1]) > 0 && (
                  <div className=" flex flex-1 flex-row items-center align-middle text-sm">
                    <p className="my-1 mr-2 text-sm font-medium md:text-base "></p>
                    <ProgressRating progress={item[1]} />
                  </div>
                )}
              </div>
            )
          })} */}
      </div>
    </>
  )
}

export default StarRating
