// import "react-medium-image-zoom/dist/styles.css";

import { getImageDimensions } from '@sanity/asset-utils'
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
  return (
    <section className="body-font">
      <div className="container mx-auto px-5">
        <div className="mb-10 flex w-full flex-col text-center font-medium lg:mb-12">
          <div className="flex ">
            <p className="font-fancy text-left text-5xl font-semibold leading-tight tracking-tighter md:text-5xl md:leading-none lg:text-5xl">
              Photo Gallery
            </p>
          </div>
        </div>
        {/* <Masonry
					breakpointCols={breakpointColumnsObj}
					className='my-masonry-grid'
					columnClassName='my-masonry-grid_column'> */}

        {/* <div className="w-full max-w-7xl  p-5 pb-10 mx-auto mb-10 gap-5 columns-3 space-y-5">  */}
        <div className="p-4">
          <div className="columns-1 gap-2 sm:columns-2 sm:gap-4 md:columns-3 lg:columns-4 [&>img:not(:first-child)]:mt-4">
            {posts.gallery.images.map((item, i) => (
              <div key={i}>
                <div key={i} className=" rounded-3xl p-1 ">
                  {/* <Zoom> */}
                  <Image
                    className=" rounded-3xl object-cover "
                    // blurDataURL={imageBuilder(posts.gallery.images[i])
                    // .width(1000)
                    // .height(1000)
                    // .quality(1)
                    // .format("webp")
                    // .url()}
                    // placeholder='blur'
                    alt={item?.alt}
                    src={urlForImage(posts.gallery.images[i])
                      .height(1000)
                      .width(2000)
                      .url()}
                    width={getImageDimensions(posts.gallery.images[i]).width}
                    height={getImageDimensions(posts.gallery.images[i]).height}
                  />
                  {/* </Zoom> */}

                  <span className="mx-4 my-4 px-4 text-xs text-black sm:text-sm md:text-base">
                    {item?.alt}
                  </span>
                </div>
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
