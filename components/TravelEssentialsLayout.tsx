import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import { Esssential } from 'lib/sanity.queries'
import Link from 'next/link'

import PostBody from './PostBody'

const TravelEssentialLayout = ({ posts }: { posts: Esssential[] }) => {
  //console.log('KENNY Essentials 2', posts)

  return (
    <>
      <div className="mt-10 sm:container sm:mx-auto sm:mt-20 mb-5  sm:px-3 sm:py-3 text-gray-600">
        <div className="  grid grid-cols-2 mx-3 content-center gap-5   md:gap-6 lg:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4  ">
          {posts?.map((item) => (
            <div key={item._id}>
              <div className={` bg-gray-50 hover:bg-gradient-to-r from-pink-200  to-yellow-50' flex   flex-col  border justify-center items-center align-middle md:items-center  max-w-lg overflow-hidden rounded-lg `}>
                
                   <Link
                    href={item.link}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  > 
                <div className="p-2 sm:p-0 bg-cover">              
                  <img
                    width={1500}
                    height={1500}
                    alt={`Cover Image for ${item.name}`}
                    className=" transition-all hover:translate-x-3   hover:translate-y-2 hover:duration-700 md:px-4 md:py-4 lg:rounded-l-2xl md:mt-0"
                    src={urlForImage(item.productImage.asset._ref)
                      .width(400)
                      .height(400)
                      .format('webp')
                      .url()}
                  />
               
                </div>

                <div className="flex flex-col justify-center sm:mt-5 px-2 align-middle sm:p-4">
                  <h1 className={` mb-3 pb-2 font-heading text-sm sm:text-base  font-normal text-gray-900 md:text-base  lg:text-base  xl:text-sm`}>
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
