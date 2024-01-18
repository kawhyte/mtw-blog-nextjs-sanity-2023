import { webp } from '@cloudinary/url-gen/qualifiers/format'
import { Badge } from '@mantine/core'
import { getImageDimensions } from '@sanity/asset-utils'
import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import React from 'react'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

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
        <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}> 
            <Masonry>
         
          {food?.map((item, i) => (
            <div key={i} className="overflow-hidden rounded m-4 p-2 bg-slate-100">
              <div className="relative mr-2">
                <img
                  className="w-full"
                  src={urlForImage(item.asset._ref).format('webp').url()}
               
                  alt={item?.name}
                  style={{display:"bloc", padding:"1px", margin:"5px"}}
                />
                {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-gray-900 opacity-25 transition duration-300 hover:bg-transparent"></div> */}

                <div className="absolute right-0 top-0 mr-3 mt-3 flex  h-14 w-14 flex-col items-center justify-center rounded-2xl bg-indigo-500 px-4 text-sm text-white    ">
                  <span className="font-bold"> {item.rating.Dish}/5</span>
                  {/* <small>out of 5</small>  */}
                </div>
              </div>
              <div className=" p-2">
                <p
                  
                  className="inline-bloc text-lg font-semibold  text-indigo-500"
                >
                  {item?.name}
                </p>
                <p className="text-sm text-gray-500">
                {item?.review}
                </p>
              </div>
            </div>

            //       <div key={i} className=" rounded-md my-5  ">

            //         <div className="absolute flex flex-col align-bottom justify-between">
            //           <Badge
            //             size="lg"
            //             variant="gradient"
            //             className="  z-10 m-3 text-sm "
            //             gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            //           >
            //             {item.rating.Dish}
            //           </Badge>

            //         </div>
            // <div className='relative w-full h-48'>
            //         <img
            //           className="   object-contain h-48 w-96"
            //           alt={item?.name}
            //           src={urlForImage(item.asset._ref)
            //             .width(940)
            //             .height(480)
            //             .format('webp')
            //             .url()}
            //           width={'440'}
            //           height={'480'}
            //         /></div>

            //          <section className="  mt-3 md:block ">
            //           <h2 className=" mt-4 pb-2 text-base font-extrabold text-pink-500 sm:text-base md:text-lg">
            //             {item?.name}
            //           </h2>
            //          <p className=" mb-2 text-sm text-ellipsis line-clamp-5  font-light text-gray-500  lg:text-base">
            //             {item?.review}
            //           </p>
            //         </section>
            //       </div>
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
