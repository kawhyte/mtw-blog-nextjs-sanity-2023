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
      <div className="mx-7 pt-9 ">
      

        <SectionTitle header={ "Food/Drink we tried"} description={undefined}/>

      
        {/* <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry> */}

          <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'> 
            {food?.map((item, i) => (
              <div key={i}>
                <div
                  className={`my-4 w-full max-w-md overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo dark:bg-gray-50 `}
                >
                  {/* <CoverImage title={''} image={item}/> */}

                  <div className="mb-5">

                    {/* <CoverImage title={''} image={item}/> */}
                    <img
                      width={400}
                      height={200}
               
                      className=" w-full max-w-md  h-96 object-cover object-center brightness-[0.9]  "
                      src={urlForImage(item.asset._ref).format('webp').url()}
                      alt={item?.name}
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

                      <p className="text-sm text-gray-500 h-8 ">{item?.review}</p>
                    </div>
                  </div>
                </div>

                
              </div>
            ))}
            </div>
          {/* </Masonry>
        </ResponsiveMasonry> */}
      </div>
      {/* </div> */}

      <SectionSeparator />
    </>
  )
}

export default individualFoodRating
