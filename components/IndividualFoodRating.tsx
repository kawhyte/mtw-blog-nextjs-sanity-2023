// import { webp } from '@cloudinary/url-gen/qualifiers/format'
import { Badge } from '@/components/ui/badge'
import { calculateTextRating } from 'lib/calculateTextRating'
import { urlForImage } from 'lib/sanity.image'
import { Oswald } from 'next/font/google'

import React from 'react'

import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5'



import SectionTitle from './SectionTitle'

const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating)
  const halfStar = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  const stars = []

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<IoStar key={`full-${i}`} className="h-5 w-5 text-yellow-400" />)
  }

  // Half star
  if (halfStar) {
    stars.push(<IoStarHalf key="half" className="h-5 w-5 text-yellow-400" />)
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<IoStar key={`empty-${i}`} className="h-5 w-5 text-gray-300" />)
  }

  return <div className="flex items-center">{stars}</div>
}

const individualFoodRating = ({ food }: { food: any[] }) => {
  return (
    <>
      <div className="mx-7 pt-9">
        <SectionTitle header={'Food/Drink We Tried'} description={undefined} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {food?.map((item, i) => {
            const dishRating = item.rating?.Dish || 0 // Ensure rating exists
            return (
              <div
                key={i}
                className="my-4 w-full max-w-md h-[35.4rem] overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo dark:bg-gray-50"
              >
                <div className="mb-5">
                  <img
                    width={400}
                    height={200}
                    className="h-96 w-full max-w-md object-cover object-center brightness-[0.9]"
                    src={urlForImage(item.asset._ref).format('webp').url()}
                    alt={item?.name}
                  />
                </div>

                <div className="mx-4 mb-6 mt-1">
                  <div className="flex flex-col gap-y-4">
                    <div>
                      <h1
                        className="font-heading line-clamp-2 text-lg font-medium text-gray-700"
                      >
                        {item.name}
                      </h1>
                    </div>

                    <div className="flex flex-row items-end justify-evenly gap-y-4 border-b border-t py-2 align-bottom text-base text-gray-400">
                      <div className='flex flex-row items-end'>
                        <div
                          className={`${oswald.variable} font-heading flex  text-lg`}
                        >
                          <p className="mr-3 pt-1 text-gray-600">{dishRating}</p>
                          {/* <span className="text-sm uppercase text-gray-400">out of 5</span> */}
                          <StarRating rating={dishRating} />
                        </div>
                        
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-sm px-3 py-1 ${
                          calculateTextRating(dishRating).backgroundColor === 'red' ? 'border-rating-poor text-rating-poor bg-rating-poor/10' :
                          calculateTextRating(dishRating).backgroundColor === 'gray' ? 'border-muted-foreground text-muted-foreground bg-muted' :
                          calculateTextRating(dishRating).backgroundColor === 'blue' ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/10' :
                          calculateTextRating(dishRating).backgroundColor === 'yellow' ? 'border-rating-good text-rating-good bg-rating-good/10' :
                          calculateTextRating(dishRating).backgroundColor === 'indigo' ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/10' :
                          calculateTextRating(dishRating).backgroundColor === 'lime' ? 'border-rating-excellent text-rating-excellent bg-rating-excellent/10' :
                          calculateTextRating(dishRating).backgroundColor === 'green' ? 'border-rating-excellent text-rating-excellent bg-rating-excellent/10' :
                          'border-muted-foreground text-muted-foreground bg-muted'
                        }`}
                      >
                        {calculateTextRating(dishRating).textRating}
                      </Badge>
                    </div>

                    <p className="h-8 text-sm text-gray-500">{item?.review}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <SectionSeparator />
    </>
  )
}

// const SectionTitle = ({ header, description }: { header: string, description?: string }) => {
//     return (
//         <div className="text-center mb-8">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">{header}</h2>
//             {description && <p className="text-gray-500 dark:text-gray-400">{description}</p>}
//         </div>
//     )
// }

const SectionSeparator = () => {
  return (
    <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>
  )
}

export default individualFoodRating
