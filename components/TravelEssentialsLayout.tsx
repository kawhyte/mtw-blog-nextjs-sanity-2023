import { Badge, Card, Group, Image, Text } from '@mantine/core'
import { oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import { Esssential } from 'lib/sanity.queries'
import Link from 'next/link'
import { CldImage } from 'next-cloudinary'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa6'
import Button from 'ui/Button'

import PostBody from './PostBody'
import PostDate from './PostDate'
import StarRating from './StarRating'

const TravelEssentialLayout = ({ posts }: { posts: Esssential[] }) => {
  console.log('Essential', posts)
  return (
    <>
          <div className="container mx-auto  mt-14 grid grid-cols-1 place-content-center place-items-center gap-x-16 gap-y-10 px-3 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:px-6 lg:grid-cols-3 2xl:grid-cols-4">
          {/* <div className=" mx-3 grid grid-cols-1  place-content-center gap-10   sm:grid-cols-1 md:grid-cols-2 md:gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-3  "> */}
          {posts?.map((item) => (
            <div key={item._id}>
              <div
                className={` w-full max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo   `}
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
                  <div className="relative   my-4 flex justify-center ">
                    <Image
                      width={250}
                      height={250}
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
                      className=" h-42 h- w-full object-cover object-center brightness-[0.95]  "
                    />
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

                <div className="bg-gray-100/50 pt-3">
                  <div className="mx-6 flex flex-col align-middle   ">
                    <div
                      className={` ${oswald.variable} flex justify-between  font-heading  text-2xl text-gray-700`}
                    >
                      <h1>{item.name}</h1>
                      <p>{item.price > 0 ? `$${item.price}` : 'FREE'}</p>
                    </div>
                    <div className=" my-5 border-t border-gray-500"></div>
                    <div className="flex justify-between ">
                      {/* <p className=" text-base leading-6 text-gray-500 ">
                        {item.price > 0 ? `$${item.price}` : 'FREE'}
                      </p> */}

                      <div className="  my-1 flex flex-row items-center justify-start rounded-full   py-1 align-middle ">
                        <FaRegCalendarAlt className="ml-1 mr-2 h-5 w-5    text-pink-500" />
                        <p className=" line-clamp-1 pr-2 text-sm text-gray-500">
                          <PostDate dateString={item.date} />
                        </p>
                      </div>
<div className='flex items-center'> 
                      {item.recommend ? (
                        <Badge
                          pl={0}
                          size="md"
                          color="green"
                          variant='outline'
                          radius="xl"
                          leftSection={
                            <FaRegThumbsUp className="ml-1 p-1 h-10 w-6" />
                          }
                        >
                          Recommended
                        </Badge>
                      ) : (
                        <Badge
                          pl={0}

                          size="md"
                          color="red"
                          variant='outline'
                          radius="xl"
                          leftSection={
                            <FaRegThumbsDown className="ml-1 p-1 h-10 w-6" />
                          }
                        >
                          Disapprove
                        </Badge>
                      )}
                      </div>

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
                    </div>
                  </div>

                  <div className="mx-6 my-2 border-t border-gray-500"></div>

                  <div className="my-6 ml-6">
                    <PostBody content={item.description} />
                  </div>
                  <div className="mx-20 my-6">
                    {' '}
                    <Button link={item.link}> Get Item</Button>
                  </div>
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
