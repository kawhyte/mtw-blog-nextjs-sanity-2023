import { Badge, Card, Group, Image, Text } from '@mantine/core'
import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import { Essential } from 'lib/sanity.queries'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa6'
import Button from 'ui/Button'

import { CircleDollarSign, Calendar, ThumbsDown,ThumbsUp } from 'lucide-react';


import PostBody from './PostBody'
import PostDate from './PostDate'
import StarRating from './StarRating'

const TravelEssentialLayout = ({ posts }: { posts: Essential[] }) => {
  // console.log('Essential', posts)
  return (
    <>
      <div className="container mx-auto  mt-14 grid grid-cols-1 place-content-center place-items-center gap-x-16 gap-y-10 px-3 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:px-6 lg:grid-cols-3 2xl:grid-cols-4">
        {/* <div className=" mx-3 grid grid-cols-1  place-content-center gap-10   sm:grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-3  "> */}
        {posts?.map((item) => (
          <div key={item._id}>
            <div
              className={` w-[20rem] max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo   `}
            >
              <div>
                {/*           
                  {item.recommend ? (
                    <Badge color="green" className=" ml-3 mt-3">
                      <p className={`${oswald.variable} text-xs uppercase`}>
                        {'Recommended'}
                      </p>
                    </Badge>
                  ) : (
                    <Badge color="red" className=" ml-3 mt-3">
                      <p className={`${oswald.variable} text-xs uppercase`}>
                        {'Not Recommended'}
                      </p>
                    </Badge>
                  )} */}
                <div className="relative   mb-4 flex justify-center bg-gray-100">
                  <Image
                    width={200}
                    height={200}
                    placeholder="blur"
                    //blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="

                    alt="product"
                    src={
                      item?.productImage?.asset?._ref
                        ? urlForImage(item?.productImage?.asset?._ref)
                            .height(250)
                            .width(250)
                            .fit('crop')
                            .url()
                        : 'https://fakeimg.pl/1240x801'
                    }
                    className=" h-42 h- w-full object-cover object-center brightness-[0.95] my-5  "
                  />

                  <div className="absolute  right-3  top-3  flex items-center">
                    {item.recommend ? (
                      <Badge
                        pl={0}
                        size="md"
                        color="green"
                        variant="filled"
                        radius="xl"
                        leftSection={
                          <ThumbsUp className="ml-1 h-10 w-6 p-1" />
                        }
                      >
                        Recommended
                      </Badge>
                    ) : (
                      <Badge
                        pl={0}
                        size="md"
                        color="red"
                        variant="filled"
                        radius="xl"
                        leftSection={
                          <ThumbsDown className="ml-1 h-10 w-6 p-1" />
                        }
                      >
                        Disapprove
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
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

              <div className=" ">
                <div className="mx-6 flex flex-col align-middle   ">
                  <div className="flex  justify-between  text-2xl text-gray-700">
                    <h1 className="font-montserrat font-bold">{item.name}</h1>
                    {/* <p>{item.price > 0 ? `$${item.price}` : 'FREE'}</p> */}
                  </div>

                  <div className="  mt-3 flex flex-row items-center justify-start rounded-full    align-middle ">
                      <Calendar className=" mr-2 h-5 w-5    text-pink-500" />

                      
                      <p className=" line-clamp-1 pr-2 text-sm text-gray-500">
                      Purchased on  <PostDate dateString={item.date} />
                      </p>
                    </div>
                  <div className="  my-1 flex flex-row items-center justify-start rounded-full   py-1 align-middle ">
                   

                      <CircleDollarSign className='text-pink-500 mr-2' />
                      <p className=" line-clamp-1 pr-2 text-sm text-gray-500">
                        <p>{item.price > 0 ? `$${item.price}` : 'FREE'}</p>
                      </p>
                    </div>

                
                  {/* <div className=" my-5 border-t border-gray-500"></div> */}
                  {/* <div className="flex justify-between ">
                

                    <div className="  my-1 flex flex-row items-center justify-start rounded-full   py-1 align-middle ">
                      <FaRegCalendarAlt className="ml-1 mr-2 h-5 w-5    text-pink-500" />
                      <p className=" line-clamp-1 pr-2 text-sm text-gray-500">
                        <PostDate dateString={item.date} />
                      </p>
                    </div>
                    <div className="flex items-center">
                      {item.recommend ? (
                        <Badge
                          pl={0}
                          size="md"
                          color="green"
                          variant="outline"
                          radius="xl"
                          leftSection={
                            <FaRegThumbsUp className="ml-1 h-10 w-6 p-1" />
                          }
                        >
                          Recommended
                        </Badge>
                      ) : (
                        <Badge
                          pl={0}
                          size="md"
                          color="red"
                          variant="outline"
                          radius="xl"
                          leftSection={
                            <FaRegThumbsDown className="ml-1 h-10 w-6 p-1" />
                          }
                        >
                          Disapprove
                        </Badge>
                      )}
                    </div>

                
                  </div> */}
                </div>

                {/* <div className="mx-6 my-2 border-t border-gray-500"></div> */}

                <div className="my-2 ml-6 mr-2 line-clamp-4 h-16">
                  <PostBody content={item.description} />
                </div>
              </div>
              <div className="mx-20 mb-4">
                {' '}
                <Button size='xs' link={item.link}> Get Item</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* </div> */}
    </>
  )
}

export default TravelEssentialLayout
