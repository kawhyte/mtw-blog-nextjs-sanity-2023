// import "react-medium-image-zoom/dist/styles.css";

import { getImageDimensions } from '@sanity/asset-utils'
import { oswald } from 'app/fonts'
// import Masonry from "react-masonry-css";
// import Zoom from "react-medium-image-zoom";
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import React from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'


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
      <div className=" mx-6 md:container md:mx-auto">
        <div className="mb-10 flex w-full flex-col text-center font-medium lg:mb-12">
          <div className="flex ">
            <p className={`${oswald.variable} font-heading text-left text-5xl font-semibold leading-tight tracking-tighter md:text-5xl md:leading-none lg:text-5xl`}>
              Photo Collage
            </p>
          </div>
        </div>
        {/* <Masonry
					breakpointCols={breakpointColumnsObj}
					className='my-masonry-grid'
					columnClassName='my-masonry-grid_column'> */}

        {/* <div className="w-full max-w-7xl  p-5 pb-10 mx-auto mb-10 gap-5 columns-3 space-y-5">  */}
  

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1000:4 }}>
          <Masonry>
            {posts?.gallery?.map((item, i) => (
              
                <div key={i} className=" rounded-md  ">
                  {/* <Zoom> */}
                 
                  <Image
                    className=" rounded-xl object-cover h-full "
                    // blurDataURL={imageBuilder(posts.gallery.images[i])
                    // .width(1000)
                    // .height(1000)
                    // .quality(1)
                    // .format("webp")
                    // .url()}
                     placeholder='blur'
                     blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII='

                    alt={item?.alt}
                    src={urlForImage(posts.gallery[i]).width(1240)
                        
                        .format('webp')
                        .url()}
                    width={'1240'}
                    height={'744'}
                    style={{ display: 'bloc',  padding: '1px', margin: '4px' }}

                  />
                  {/* </Zoom> */}

                  <span className="mx-4 my-4 px-4 text-xs text-black sm:text-sm md:text-base">
                    {item?.alt}
                  </span>
                </div>
             
            ))}
 </Masonry>
        </ResponsiveMasonry>

        </div>
        {/* </Masonry> */}
   
    </section>
  )
}

export default Gallery
