import { Badge } from '@mantine/core'
import { getImageDimensions } from '@sanity/asset-utils'
import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import React from 'react'

import SectionSeparator from './SectionSeparator'

const individualFoodRating = ({ food }) => {
  console.log('Mom', food)
  return (
    <>
      <div className="mx-7 pt-9">
        <h1
          className={`${oswald.variable} py-8 text-center font-heading text-6xl font-bold leading-tight tracking-tighter md:text-left md:text-5xl md:leading-none lg:text-5xl`}
        >
          Food/Drink we tried
        </h1>
        <div className="  grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 ">
          {food?.map((item, i) => (
            <div key={i} className=" rounded-md my-5  ">
          
              <div className="absolute flex flex-col align-bottom justify-between">
                <Badge
                  size="lg"
                  variant="gradient"
                  className="  z-10 m-3 text-sm "
                  gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                >
                  {item.rating.Dish}
                </Badge>
                {/* <h2 className="z-10 mt-4 pb-2 text-sm font-extrabold text-pink-500 sm:text-base md:text-lg">
                  {item?.name}
                </h2> */}
              </div>
      <div className='relative w-full h-48'> 
              <img
                className=" h-full rounded-xl object-cover "
                alt={item?.name}
                src={urlForImage(item.asset._ref)
                  .width(940)
                  .height(480)
                  .format('webp')
                  .url()}
                width={'440'}
                height={'480'}
              /></div>

               <section className="  mt-3 md:block ">
                <h2 className=" mt-4 pb-2 text-base font-extrabold text-pink-500 sm:text-base md:text-lg">
                  {item?.name}
                </h2>
               <p className=" mb-2 text-sm text-ellipsis line-clamp-5  font-light text-gray-500  lg:text-base">
                  {item?.review}
                </p>
              </section> 
            </div>
          ))}
        </div>
      </div>
      <SectionSeparator />
    </>
  )
}

export default individualFoodRating
