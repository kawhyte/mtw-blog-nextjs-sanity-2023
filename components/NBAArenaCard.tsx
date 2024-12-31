import { Badge, Progress } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import MoreStories from 'components/MoreStories'
import calculateAverageRating from 'lib/calculateArenaRating'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import type { Post, Settings } from 'lib/sanity.queries'
import { useState } from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FaPersonWalking } from 'react-icons/fa6'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { IoHammer, IoLocation, IoLocationOutline } from 'react-icons/io5'

import AreanaRating from './AreanaRating'
import Container from './BlogContainer'
import BlogHeader from './BlogHeader'
import Layout from './BlogLayout'
import Footer from './Footer'
import PostDate, { PostYear } from './PostDate'

interface NBAArenaCardProps {
  arenaImageSrc: any
  arenaName: string
  constructionDate: string
  capacity: number
  location: string
  dateVisited: string
  visited: any
  // visitedCount:string
  // galleryCount:string
  gallery: any
  key: string
  arenaReview?: any
  // ratings: ArenaRating
}

const Arenas = ({
  location,
  key,
  visited,
  arenaName,
  constructionDate,
  capacity,
  dateVisited,
  arenaImageSrc,
  gallery,
  arenaReview,
}: NBAArenaCardProps) => {
  //console.log('Arena gallery ', gallery)
  const { average, textRating } = calculateAverageRating(arenaReview)
  return (
    <>
      {/* <div className="container mx-auto   mt-14 grid grid-cols-1  place-content-center place-items-center gap-x-6 gap-y-10  px-3 sm:grid-cols-1 md:grid-cols-1 md:gap-10 md:gap-x-5 md:px-6  lg:grid-cols-2 2xl:grid-cols-4"> */}

      <div
        key={key}
        className={`max-w- w-full overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo dark:bg-gray-800  ${
          visited === false ? 'opacity-40 grayscale ' : 'grayscale-0 '
        } `}
      >
        <div className=" ">
          <div className="relative  md:h-full ">
            <div className=" absolute right-0 top-4  z-10 mb-4 mr-6  flex items-end justify-between ">
         
             {average !== "0" ?  <div className="flex flex-row justify-center items-center rounded-2xl bg-indigo-500">
               
                  <span className=" mx-4   text-4xl font-bold text-white md:text-3xl">
                    {average}
                  </span>
                  <span className=" rounded-full border bg-gray-100 px-2 py-0.5 my-2 mx-2 text-sm text-black">
                    {textRating}
                  </span>
                </div> : ""}
              
            </div>
            <div className="absolute  inset-x-0 top-1/3 z-10 ml-5  ">
              <h1
                className={`${oswald.variable}  mb-2 font-heading text-5xl font-medium text-gray-50 md:text-6xl lg:text-3xl xl:text-4xl  `}
              >
                {arenaName}
              </h1>

              <div className="grid grid-cols-2 text-lg text-gray-200 md:text-lg xl:grid-cols-1">
                {/* <div className=" flex   text-xs font-bold text-gray-700 dark:</div> md:text-xs w-full flex-row items-center bg-red-200  "> */}
                <div className="my-4 flex items-center xl:my-0  ">
                  {/* <IoHammer className=" h-5 w-5 text-red-50 md:h-5 md:w-5" /> */}
                  <p>Constructed:</p>
                  <p className="pl-2">
                    <PostYear dateString={constructionDate} />
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {/* <FaPersonWalking className=" h-5 w-5 text-red-50 md:h-5 md:w-5" /> */}
                  <p>Capacity:</p>
                  <p className="px-1">
                    {new Intl.NumberFormat().format(capacity)}
                  </p>
                </div>
                {/* </div> */}

                <div className="mr-9 flex items-baseline ">
                  {/* <IoLocation className=" h-5 w-5 text-red-50 md:h-5 md:w-5" /> */}
                  <p>Location:</p>
                  <h1 className="line-clamp-1 px-1  text-white ">{location}</h1>
                </div>

                {visited === true ? (
                  <>
                    <div className="  flex flex-row items-center justify-start rounded-full align-middle ">
                      {/* <FaRegCalendarAlt className=" mr-2 h-5 w-5 text-white md:h-5    md:w-5" /> */}

                      <p>Visited: </p>
                      <p className=" line-clamp-1 pl-2 pr-2  text-white">
                        <PostDate dateString={dateVisited} />
                      </p>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </div>

              {/* <div className=" z-40 mx-3 mt-2 flex flex-row flex-wrap justify-start  gap-x-2  align-top ">
              {gallery?.map((photo) => (
                <div
                  key={photo.name}
                  className="  mb-3 mt-4 flex flex-col items-center justify-between pr-2 "
                >
                  <div className="flex flex-row gap-x-1">
                    <img
                      src={
                        photo?.asset?._ref
                          ? urlForImage(photo)
                              .height(86)
                              .width(86)
                              .fit('crop')
                              .url()
                          : 'https://source.unsplash.com/96x96/?face'
                      }
                      className=" h-8 w-8 rounded-full border-2 p-1 md:h-9 md:w-9   "
                      height={96}
                      width={96}
                      // @TODO add alternative text to avatar image schema
                      alt={`${photo.name} logo`}
                    />

                    <div className="flex flex-col ">
                      <p className="mx-1  cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs">
                        {photo.name}
                      </p>

                      {photo.played === true ? (
                        <div className="flex items-center">
                          <IoMdEye className="mx-1 h-4 w-4 text-green-300" />
                          <p className="my-1 cursor-pointer text-xs font-bold text-gray-400 dark:text-gray-400 md:text-xs">
                            {' '}
                            Watched
                          </p>
                        </div>
                      ) : (
                        <IoMdEyeOff className="mx-1 my-1 h-4 w-4 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div> */}
            </div>
            <div className="bg-muted">
              <img
                src={
                  arenaImageSrc.asset?._ref
                    ? urlForImage(arenaImageSrc.asset?._ref)
                        .height(801)
                        .width(1240)
                        .fit('crop')
                        .url()
                    : 'https://fakeimg.pl/1240x801'
                }
                className="  w-full  object-cover   brightness-[0.35] md:block md:h-full   "
                height={200}
                width={224}
                alt={`${arenaName} arena`}
              />
            </div>{' '}
            {/**/}
          </div>

          {/* <div className="flex flex-col items-center">
                <p>Overall Rating:</p>
                <p className="text-6xl"> 8.5 </p>
              </div> */}

          <div className=" mb-2 ml-6 mt-6  grid  grid-cols-2 items-center gap-y-1 align-middle  text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs ">
            {/* <div className="mb-4  mr-6 flex items-end  justify-between">
              <h3 className="text-xl font-semibold md:text-2xl">
                Overall Score
              </h3>

              <div className="flex flex-row items-baseline justify-center rounded-2xl bg-indigo-500 px-1">
                <div className="flex items-center flex-col">
                  <span className=" pt-2 px-2 mx-2 pr-1 text-4xl font-bold md:text-3xl">
                    {average }
                  </span>
                  <span className='text-sm mb-2 mt-1 border px-2 rounded-full bg-gray-100 text-black' >{textRating}</span>
                </div>

           
              </div>
            </div> */}

            <AreanaRating
              rating={arenaReview?.transportation}
              text={'Transportation to Arena'}
            />
            <AreanaRating
              rating={arenaReview?.walkability}
              text={'Arena Walkability'}
            />
            <AreanaRating rating={arenaReview?.food} text={'Food options'} />
            <AreanaRating
              rating={arenaReview?.view}
              text={'View from our seat'}
            />
            <AreanaRating rating={arenaReview?.vibes} text={'Arena Vibes'} />
            <AreanaRating
              rating={arenaReview?.seatComfort}
              text={'Seat Comfort'}
            />

            {/* <div className=" flex w-full flex-row items-end justify-between align-bottom  ">
                  <p className="mr-1 px-1 text-center">Transportation to Arena  </p>
                  <Progress
                    color="green"
                    radius="lg"
                    size="lg"
                    w={100}
                    h={8}
                    value={60}
                  />
                </div> 
                <div className=" flex w-full flex-row items-end justify-between align-bottom  ">
                  <p className="px-1 text-center">Arena Walkability </p>

                  <Progress
                    color="green"
                    radius="lg"
                    size="lg"
                    w={100}
                    value={60}
                    h={8}
                  />
                </div>
                <div className="flex flex-col items-center ">
                  <p className="text-lg text-green-300">8/10</p>
                  <p className="px-1 text-center">Food options </p>
                </div>
                <div className="flex flex-col items-center ">
                  <p className="text-lg text-green-300">8/10</p>
                  <p className="px-1 text-center">View from our seat </p>
                </div>
                <div className="flex flex-col items-center ">
                  <p className="text-lg text-green-300">8/10</p>
                  <p className="px-1 text-center">Arena Vibes </p>
                </div>
                <div className="flex flex-col items-center ">
                  <p className="text-lg text-green-300">8/10</p>
                  <p className="px-1 text-center">Seat Comfort</p>
                </div>*/}
          </div>
        </div>
        <div className="ml-6 mt-2">
          <blockquote className="relative my-2 w-[500px] px-8 py-3 font-serif text-lg italic leading-relaxed text-gray-700">
            <span className="absolute left-[-20px] top-[-20px] text-6xl text-gray-500 before:block before:pl-4 before:content-['\201C']"></span>
            <p className="text-gray-400">{arenaReview?.comments}</p>
          </blockquote>
        </div>

        {/* <p className='border-t border-gray-500 text-white'>{arenaReview?.comments}</p> */}

        <div>
          <div className="mr-4 mt-2  border-t border-gray-500"></div>
          <h3 className="mb-2 ml-5 mt-4 text-xl  font-semibold text-gray-200 md:text-lg ">
            Team(s) Viewed
          </h3>
          <div className=" mx-3  flex flex-row flex-wrap justify-start gap-x-2 align-top   md:gap-x-6 ">
            {gallery?.map((photo) => (
              <div
                key={photo.name}
                className="  mb-3 mt-4 flex flex-col items-center justify-between pr-2 "
              >
                <div className="flex flex-row gap-x-3">
                  <img
                    src={
                      photo?.asset?._ref
                        ? urlForImage(photo)
                            .height(86)
                            .width(86)
                            .fit('crop')
                            .url()
                        : 'https://source.unsplash.com/96x96/?face'
                    }
                    className=" h-11 w-11 rounded-full border-2 p-1 md:h-10 md:w-10   "
                    height={96}
                    width={96}
                    // @TODO add alternative text to avatar image schema
                    alt={`${photo.name} logo`}
                  />

                  <div className="flex flex-col ">
                    <p className="mx-1  cursor-pointer font-bold text-gray-700 dark:text-gray-200 md:text-sm   ">
                      {photo.name}
                    </p>

                    {photo.played === true ? (
                      <div className="flex items-center">
                        <IoMdEye className="mx-1 h-6 w-6 text-green-300 md:h-4  md:w-4" />
                        <p className="my-1 cursor-pointer font-bold text-gray-400 dark:text-gray-400 md:text-sm  ">
                          {' '}
                          Watched
                        </p>
                      </div>
                    ) : (
                      <IoMdEyeOff className="mx-1 my-1 h-6 w-6 text-gray-300 md:h-4   md:w-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className='pb-10 '> 

              <div className="mx-4  border-t border-gray-500"></div>

              <div className=" mx-3 mt-2 flex flex-row flex-wrap justify-start gap-x-2  align-top ">
                {gallery?.map((photo) => (
                  <div
                    key={photo.name}
                    className="  mb-3 mt-4 flex flex-col items-center justify-between pr-2 "
                  >
                    <div className="flex flex-row gap-x-1">
                      <img
                        src={
                          photo?.asset?._ref
                            ? urlForImage(photo)
                                .height(86)
                                .width(86)
                                .fit('crop')
                                .url()
                            : 'https://source.unsplash.com/96x96/?face'
                        }
                        className=" h-8 w-8 rounded-full border-2 p-1 md:h-9 md:w-9   "
                        height={96}
                        width={96}
                        // @TODO add alternative text to avatar image schema
                        alt={`${photo.name} logo`}
                      />

                      <div className="flex flex-col ">
                        <p className="mx-1  cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs">
                          {photo.name}
                        </p>

                        {photo.played === true ? (
                          <div className="flex items-center">
                            <IoMdEye className="mx-1 h-4 w-4 text-green-300" />
                            <p className="my-1 cursor-pointer text-xs font-bold text-gray-400 dark:text-gray-400 md:text-xs">
                              {' '}
                              Watched
                            </p>
                          </div>
                        ) : (
                          <IoMdEyeOff className="mx-1 my-1 h-4 w-4 text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div> */}
      {/* </div> */}
      {/* </Container> */}
    </>
  )
}

export default Arenas
