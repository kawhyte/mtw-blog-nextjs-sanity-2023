// import "react-medium-image-zoom/dist/styles.css";

import { getImageDimensions } from '@sanity/asset-utils'
import { oswald } from 'app/fonts'
// import Masonry from "react-masonry-css";
// import Zoom from "react-medium-image-zoom";
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import React from 'react'

// import { urlForImage } from 'lib/sanity.image'
//import cn from "classnames";
const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 2,
  500: 1,
}

function Gallery({ posts, heading }) {

  //console.log("NEW Gall posts gal ", posts.gallery)
  return (
    <section className="body-font">
      <div className="container mx-auto">
        <div className="mb-10 flex w-full flex-col text-center font-medium lg:mb-12">
          <div className="flex ">
            <p className={`${oswald.variable} font-heading text-left text-5xl font-semibold leading-tight tracking-tighter md:text-5xl md:leading-none lg:text-5xl`}>
              Photo Gallery
            </p>
          </div>
        </div>
        {/* <Masonry
					breakpointCols={breakpointColumnsObj}
					className='my-masonry-grid'
					columnClassName='my-masonry-grid_column'> */}

        {/* <div className="w-full max-w-7xl  p-5 pb-10 mx-auto mb-10 gap-5 columns-3 space-y-5">  */}
        <div className="">
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  ">
            {posts?.gallery?.map((item, i) => (
              
                <div key={i} className=" rounded-md  ">
                  {/* <Zoom> */}
                 
                  <img
                    className=" rounded-xl object-cover h-full "
                    // blurDataURL={imageBuilder(posts.gallery.images[i])
                    // .width(1000)
                    // .height(1000)
                    // .quality(1)
                    // .format("webp")
                    // .url()}
                    // placeholder='blur'
                    alt={item?.alt}
                    src={urlForImage(posts.gallery[i]).width(1240)
                        .height(744)
                        .format('webp')
                        .url()}
                    width={'1240'}
                    height={'744'}
                  />
                  {/* </Zoom> */}

                  <span className="mx-4 my-4 px-4 text-xs text-black sm:text-sm md:text-base">
                    {item?.alt}
                  </span>
                </div>
             
            ))}
          </div>
        </div>
        {/* </Masonry> */}
      </div>
    </section>
  )
}

export default Gallery
