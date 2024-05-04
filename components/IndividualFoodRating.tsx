import { webp } from '@cloudinary/url-gen/qualifiers/format'
import { Badge } from '@mantine/core'
import { getImageDimensions } from '@sanity/asset-utils'
import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import React from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import SectionSeparator from './SectionSeparator'

const individualFoodRating = ({ food }) => {
  //console.log('Mom', food)
  return (
    <>
      <div className="mx-7 pt-9">
        <h1
          className={`${oswald.variable} py-8 text-center font-heading text-6xl font-bold leading-tight tracking-tighter md:text-left md:text-5xl md:leading-none lg:text-5xl`}
        >
          Food/Drink we tried
        </h1>

        {/* <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3"> */}
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry>
            {food?.map((item, i) => (
              <div
                key={i}
                className="m-4 overflow-hidden rounded bg-slate-100 p-2"
              >
                <div className="relative mr-2">
                  <Image
                  width={502}
                  height={203}
                  placeholder='blur'
                  blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII='
      
                    className="w-full"
                    src={urlForImage(item.asset._ref).format('webp').url()}
                    alt={item?.name}
                    style={{ display: 'bloc', padding: '1px', margin: '5px' }}
                  />
                  {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-gray-900 opacity-25 transition duration-300 hover:bg-transparent"></div> */}

                  <div className="absolute right-0 top-0 mr-2 mt-2 flex  h-10 w-10 flex-col items-center justify-center rounded-xl bg-gray-50 px-3 text-sm font-black text-black   ">
                    <span className="font-bold"> {item.rating.Dish}/5</span>
                    {/* <small>out of 5</small>  */}
                  </div>
                </div>
                <div className=" p-2">
                  <p className="inline-bloc text-black-500 text-lg  font-black">
                    {item?.name}
                  </p>
                  <p className="text-sm text-gray-500">{item?.review}</p>
                </div>
              </div>
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
