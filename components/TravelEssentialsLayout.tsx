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
      <div className="container mx-auto mt-20 mb-5  px-3 py-3 text-gray-600">
        <div className="  grid grid-cols-1 content-center gap-10   md:gap-16 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  ">
          {posts?.map((item) => (
            <div key={item._id}>
              <div className={`${item.background} flex flex-col justify-center items-center align-middle md:items-center  md:flex-row  max-w-lg overflow-hidden rounded-lg `}>
                <div className=" w-1/2 md:w-2/3 bg-cover">
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
                    className=" transition-all hover:translate-x-3   hover:translate-y-2 hover:duration-700 md:p-2    lg:rounded-l-2xl mt-4 md:mt-0"
                    src={urlForImage(item.productImage.asset._ref)
                      .width(300)
                      .height(300)
                      .format('webp')
                      .url()}
                  />
                  </Link>
                </div>

                <div className="flex flex-col justify-center mt-5  align-middle md:w-2/3 p-4 md:p-4">
                  <h1 className={`${oswald.variable}  title-font mb-3 font-heading text-xl  font-normal text-gray-900  sm:text-xl`}>
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
