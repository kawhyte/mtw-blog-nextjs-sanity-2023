import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import { Esssential } from 'lib/sanity.queries'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'

import PostBody from './PostBody'

const TravelEssentialLayout = ({ posts }: { posts: Esssential[] }) => {
 

  return (
    <>
      <div className="mb-5 mt-10 text-gray-600 sm:container sm:mx-auto  sm:mt-20 sm:px-3 sm:py-3">
        <div className="  mx-3 grid grid-cols-2 content-center gap-5   sm:grid-cols-2 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:grid-cols-4  ">
          {posts?.map((item) => (
            <div key={item._id}>
              <div
                className={` to-yellow-50 flex max-w-lg  flex-col items-center   justify-center  overflow-hidden rounded-lg border bg-gray-50 from-pink-200  align-middle hover:bg-gradient-to-r md:items-center `}
              >
                <Link
                  href={item.link}
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-cover p-2 sm:p-0">
                    <CldImage
                      deliveryType="fetch"
                      width="960"
                      height="600"
                      className=" transition-all hover:translate-x-3   hover:translate-y-2 hover:duration-700 md:mt-0 md:px-4 md:py-4 lg:rounded-l-2xl"
                      format="webp"
                   
                     

                      src={urlForImage(item.productImage.asset._ref).url()}
                      sizes="(max-width: 640px) 100vw,
          (max-width: 768px) 80vw,
          (max-width: 1024px) 60vw,
          50vw"
                      alt={`Cover Image for ${item.name}`}
                      // loading="lazy"
                    />
                    {/* <img
                    width={1500}
                    height={1500}
                    alt={`Cover Image for ${item.name}`}
                    className=" transition-all hover:translate-x-3   hover:translate-y-2 hover:duration-700 md:px-4 md:py-4 lg:rounded-l-2xl md:mt-0"
                    src={urlForImage(item.productImage.asset._ref)
                      .width(400)
                      .height(400)
                      .format('webp').blur(20)
                      .url()}
                  /> */}
                  </div>

                  <div className="flex flex-col justify-center px-2 align-middle sm:mt-5 sm:p-4">
                    <h1
                      className={` mb-3 pb-2 font-heading text-sm font-normal  text-gray-900 sm:text-base md:text-base  lg:text-base  xl:text-sm`}
                    >
                      {item.name}
                    </h1>

                    {/*  <div className="-mt-4 text-xs md:text-sm -mx-6 text-gray-500 ">
                  <PostBody content={item.description} />
                  </div> */}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TravelEssentialLayout
