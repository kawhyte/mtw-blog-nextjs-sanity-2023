import { inter, oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'

import PostDate from './PostDate'

function ReviewHeader({ title, arenas, summary, animation }) {
  // const totalDistance = arenas.reduce(
  //   (total, item) => total + item.galleryCount,
  //   0
  // )

  const filteredList = arenas.filter((item) => item.visited === true)

  const arenaLastVisited = filteredList.sort(function (a, b) {
    return new Date(b.date).valueOf() - new Date(a.date).valueOf()
  })

  const percentage = ((arenas[0]?.visitedCount / arenas.length) * 100).toFixed(
    0
  )

  return (
    <div className="mb-10 flex flex-col items-center justify-center bg-indigo-50 pt-10  lg:flex-row">
      <div className="container mx-auto">
        <section className="body-font text-gray-600">
          <div className=" flex flex-col items-center px-5 py-7 ">
            <div className="grid max-w-4xl grid-cols-9 place-content-center  place-items-center gap-2   ">
              {arenas.slice(0, 27).map((item) => (
                <div key={item.name}>
                  <Image
                    width={189}
                    height={189}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
                    className="  object-cover object-center md:h-16 md:w-16"
                    alt="hero"
                    src={
                      item?.gallery[0].asset?._ref
                        ? urlForImage(item?.gallery[0].asset?._ref)
                            .height(200)
                            .width(200)
                            .fit('crop')
                            .url()
                        : 'https://fakeimg.pl/1240x801'
                    }
                  />
                </div>
              ))}
              {/* <div>
              <Image
              width={389}
              height={288}
              placeholder='blur'
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII='

                className=" object-cover object-center h-full"
                alt="hero"
                 src={animation}
              /></div> */}
            </div>
            <div className="flex max-w-4xl flex-col items-center justify-center pt-8 text-center align-middle   md:items-start lg:flex-grow  ">
              <h1
                className={` ${oswald.variable} container mx-auto  mb-1  font-heading text-4xl font-bold leading-tight tracking-tighter text-pink-500 sm:px-0  md:text-[3.3rem]`}
              >
                {title}
              </h1>
              <div>
                <p className="mb-8 mt-4 max-w-2xl leading-relaxed">
                  {' '}
                  {summary}
                </p>

                {arenas.length > 1 && (
                  <div className=" container mx-auto    mb-8 md:w-full md:pr-6 lg:mb-0 lg:max-w-xl ">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-4 border-black p-6">
                      <h2 className="title-font mb-1 text-sm font-medium tracking-widest">
                        ARENA LAST VISITED
                      </h2>
                      <h1 className="mb-4  border-gray-200 text-5xl leading-none text-gray-900">
                        {arenaLastVisited[0]?.name}
                      </h1>
                      <div className="mb-4 flex items-center   justify-around border-b border-gray-200 pb-4 align-middle text-base leading-none text-gray-500">
                        <div className="flex items-center align-middle">
                          <FaRegCalendarAlt className="ml-1 mr-2 h-4 w-5   " />
                          <p className=" pr-2 text-sm ">
                            <PostDate dateString={arenaLastVisited[0]?.date} />
                          </p>
                        </div>
                        <div className="flex items-center align-middle">
                          <IoLocationOutline className="h-5 w-5" />
                          <p className="ml-2 text-sm">
                            {arenaLastVisited[0]?.location}
                          </p>
                        </div>
                      </div>

                      <div className="  ">
                        {/* <div className="mt-2 flex flex-row  justify-between">
                          <span className="title-font mb-1 text-sm  font-medium text-gray-500 ">
                          {arenas[4]?.visitedCount} of 37 arenas visited
                          </span>
                          
                        </div> */}
                        <div className="mt-2 flex flex-row  justify-between">
                          <span className=" mb-2 text-sm  font-medium text-gray-500 ">
                            We&apos;ve visited{' '}
                            <span className=" font-black text-pink-500">
                              {' '}
                              {arenas[4]?.visitedCount}
                            </span>{' '}
                            arenas so far
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-x-2">
                          <div className=" h-3 w-full rounded-full bg-gray-200">
                            <div className="w-full rounded-full  dark:bg-gray-200">
                              <div
                                className="h-3  rounded-r-full bg-gradient-to-r  from-yellow-200 to-pink-500 p-0 text-center text-sm font-black leading-none text-gray-600  "
                                style={{ width: `${percentage}%` }}
                              >
                                {/* {Math.round((arenas[4]?.visitedCount/37) *100)}%  */}
                                {/* {percentage}% */}
                                {/* {totalDistance} */}
                              </div>
                            </div>
                          </div>
                        <div className='text-xs'> {percentage}%</div>  
                        </div>
                      </div>
                      <div className="  ">
                        {/* <div className="mt-2 flex flex-row  justify-between">
                          <span className="title-font mb-1 text-sm  font-medium text-gray-500 ">
                          {arenas[4]?.visitedCount} of 37 arenas visited
                          </span>
                          
                        </div> */}
                        <div className="mt-2 flex flex-row  justify-between">
                          <span className=" mb-2 text-sm  font-medium text-gray-500 ">
                            We&apos;ve seen{' '}
                            <span className=" font-black text-indigo-500">
                              {' '}
                              {arenas[4]?.visitedCount}
                            </span>{' '}
                            WNBA teams
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-x-2">
                          <div className=" h-3 w-full rounded-full bg-gray-200">
                            <div className="w-full rounded-full  dark:bg-gray-200">
                              <div
                                className="h-3  rounded-r-full bg-indigo-500/80 p-0 text-center text-sm font-black leading-none text-gray-600  "
                                style={{ width: `${22}%` }}
                              >
                                {/* {Math.round((arenas[4]?.visitedCount/37) *100)}%  */}
                                {/* {percentage}% */}
                                {/* {totalDistance} */}
                              </div>
                            </div>
                          </div>
                        <div className='text-xs'> {22.8}%</div>  
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ReviewHeader
