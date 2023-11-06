import { Badge, Button, Card, Group, Image, Text } from '@mantine/core'
import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import { Esssential } from 'lib/sanity.queries'
import Link from 'next/link'

import PostBody from './PostBody'

const TravelEssentialLayout = ({ posts }: { posts: Esssential[] }) => {
  //console.log('KENNY Essentials 2', posts)

 const  bgcolor="bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-50"
 const  bgcolor2="bg-gradient-to-r from-green-200 via-indigo-200 to-pink-50"
 const  bgcolor3="bg-gradient-to-r from-blue-200 via-pink-50 to-green-50"
  return (
    <>
      <div className="mt-10 sm:container sm:mx-auto sm:mt-20 mb-5  sm:px-3 sm:py-3 text-gray-600">
        <div className="  grid grid-cols-1 content-center gap-5   md:gap-6 lg:gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6  ">
          {posts?.map((item) => (
            <div key={item._id}>
              <div className={`hover:${item.background} hover:${bgcolor3} flex   flex-col  border justify-center items-center align-middle md:items-center  max-w-lg overflow-hidden rounded-lg `}>
                <div className="p-8 sm:p-0 bg-cover">
                  {/* <img src='https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80'  /> */}
                  <Link
                    href={item.link}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  <img
                    width={400}
                    height={400}
                    alt={`Cover Image for ${item.name}`}
                    className=" transition-all hover:translate-x-3   hover:translate-y-2 hover:duration-700 md:p-2    lg:rounded-l-2xl md:mt-0"
                    src={urlForImage(item.productImage.asset._ref)
                      .width(300)
                      .height(300)
                      .format('webp')
                      .url()}
                  />
                  </Link>
                </div>

                <div className="flex flex-col justify-center sm:mt-5  align-middle sm:p-4">
                  <h1 className={` mb-3 font-heading text-base  font-normal text-gray-900 md:text-base  lg:text-base  xl:text-sm`}>
                    {item.name}
                  </h1>

                  {/* <div className="-mt-4 text-xs md:text-sm -mx-6 text-gray-500 ">
                  <PostBody content={item.description} />
                  </div> */}

                  

                   <div className="item-center mt-3 flex justify-between">
                  {/*  <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200 md:text-xl">
                      $220
                    </h1>*/}
                       <Link
                    href={item.link}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* <button className="transform rounded bg-gray-800 px-4 py-2 text-xs font-bold uppercase text-white transition-colors duration-300 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600">
                      Get Item
                    </button>
                     */}
                    </Link>
                  </div> 
                </div>
              </div>

              {/* <div key={item.name} className="relative mx-auto   max-w-sm ">
                <div
                  className={` ${item.background}  max-w-sm rounded-lg shadow-md  dark:border-gray-700 `}
                >
                  <Link
                    href={item.link}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  >
               
                    <div className="pb-5"></div>
                    <div className=" mx-20 md:mx-0 md:pt-0  ">
                      <img
                        width={400}
                        height={400}
                        alt={`Cover Image for ${item.name}`}
                        className=" transition-all hover:translate-x-3   hover:translate-y-2 hover:duration-700 md:p-6    lg:rounded-l-2xl"
                        src={urlForImage(item.productImage.asset._ref)
                          .width(400)
                          .height(400)
                          .format('webp')
                          .url()}
                      />
                    </div>
                    <section className="flex flex-col justify-center">
                      <Badge
                        size="lg"
                        className=" mx-5 mt-6"
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                      >
                        {item.name}
                      </Badge>
                      <Text className="pb-1" fw={500}>
                        <PostBody content={item.description} />
                      </Text>
                    </section>
                  </Link>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TravelEssentialLayout
