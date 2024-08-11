import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import React from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import SectionTitle from './SectionTitle'

function Gallery({ posts, heading }) {
  return (
    <section className="body-font">
      <div className=" mx-6 md:container md:mx-auto">
        <div className="mb-8 flex w-full flex-col  font-medium lg:mb-9">
          {/* <div className="flex ">
            <p
              className={`${oswald.variable} text-left font-heading text-5xl font-semibold leading-tight tracking-tighter md:text-5xl md:leading-none lg:text-5xl`}
            >
              Photo Collage
            </p>
          </div> */}

          <SectionTitle header={"Photo Collage"} description={undefined}></SectionTitle>
        </div>

        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1000: 4 }}
        >
          <Masonry>
            {posts?.gallery?.map((item, i) => (
              <div key={i} className=" rounded-md  ">
                <Image
                  className=" h-full rounded-xl object-cover "
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
                  alt={item?.alt}
                  src={urlForImage(posts.gallery[i])
                    .width(1240)

                    .format('webp')
                    .url()}
                  width={'1240'}
                  height={'744'}
                  style={{ display: 'bloc', padding: '1px', margin: '4px' }}
                />

                <span className="mx-4 my-4 px-4 text-xs text-black sm:text-sm md:text-base">
                  {item?.alt}
                </span>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  )
}

export default Gallery
