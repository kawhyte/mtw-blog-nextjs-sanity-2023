import { webp } from '@cloudinary/url-gen/qualifiers/format'
import { Badge } from '@mantine/core'
import { getImageDimensions } from '@sanity/asset-utils'
import { oswald } from 'app/fonts'
import { calculateTextRating } from 'lib/calculateTextRating'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import React from 'react'
import { FaStar } from "react-icons/fa";
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import CoverImage from './CoverImage'
import SectionSeparator from './SectionSeparator'
import SectionTitle from './SectionTitle'

const individualFoodRating = ({ food }) => {
  //console.log('Mom', food)

  return (
    <>
      <div className="mx-7 pt-9">
        {/* <h1
          className={`${oswald.variable} py-8 text-center font-heading text-6xl font-bold leading-tight tracking-tighter md:text-left md:text-5xl md:leading-none lg:text-5xl`}
        >
          Food/Drink we tried
        </h1> */}

        <SectionTitle> Food/Drink we tried</SectionTitle>

        {/* <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3  bg-red-200"> */}
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry>
            {food?.map((item, i) => (
              <>
                <div
                  className={`my-4 w-full max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo dark:bg-gray-50 `}
                >
                  {/* <CoverImage title={''} image={item}/> */}

                  <div className="mb-5">
                    <img
                      width={502}
                      height={203}
                      // placeholder='blur'
                      // blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII='

                      className=" w-full object-cover object-center brightness-[0.9]  "
                      src={urlForImage(item.asset._ref).format('webp').url()}
                      alt={item?.name}
                      // style={{ display: 'bloc', padding: '1px', margin: '5px' }}
                    />
                  </div>

                  <div className="mx-4 mb-6 mt-1 ">
                    <div className="flex flex-col  gap-y-4">
                      <div>
                        <h1
                          className={`${oswald.variable}  line-clamp-2  font-heading text-2xl font-medium text-gray-700  `}
                        >
                          {item.name}
                        </h1>
                      </div>

                      <div className="  flex flex-row justify-evenly  align-bottom items-end gap-y-4 border-b border-t py-2 text-base text-gray-400">
                        <div
                          className={`${oswald.variable} flex items-baseline text-center font-heading text-2xl font-bold md:text-left md:text-2xl md:leading-none lg:text-2xl`}
                        >
                     
                          <p className='mr-1 text-gray-600 '> {item.rating.Dish}</p> 
                          
                          
                          <span className=" text-sm uppercase text-gray-400">out of 5</span>
                        
                          <FaStar className='h-3 w-3' />
                        
                        </div>
                        <Badge
                          variant="outline"
                       
                          color={
                            calculateTextRating(item.rating.Dish)
                              .backgroundColor
                          }
                          size="lg"
                        >
                          {calculateTextRating(item.rating.Dish).textRating}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-500">{item?.review}</p>
                    </div>
                  </div>
                </div>

                {/* <div
                  key={i}
                  className="w-full max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo"
                >
                  <div className="relative mr-2">
                    <img
                      width={502}
                      height={203}
                   
                      className="h-42  w-full object-cover object-center brightness-[0.9] "
                      src={urlForImage(item.asset._ref).format('webp').url()}
                      alt={item?.name}
                      style={{ display: 'bloc', padding: '1px', margin: '5px' }}
                    />

                    <div className="absolute right-0 top-0 mr-2 mt-2 flex  h-10 w-10 flex-col items-center justify-center rounded-xl bg-gray-50 px-3 text-sm font-black text-black   ">
                      <span className="font-bold"> {item.rating.Dish}/5</span>
                   
                    </div>
                  </div>
                  <div className=" p-2">
                    <p className="inline-bloc text-black-500 text-lg  font-black">
                      {item?.name}
                    </p>
                    <p className="text-sm text-gray-500">{item?.review}</p>
                  </div>
                </div> */}
              </>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
      {/* </div> */}

      <SectionSeparator />
    </>
  )
}

export default individualFoodRating
