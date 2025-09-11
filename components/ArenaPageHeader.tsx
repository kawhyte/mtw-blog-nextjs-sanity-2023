import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'

import { Progress } from '@/components/ui/progress'

import PostDate from './PostDate'

function ReviewHeader({ title, arenas, summary, animation }) {
  const filteredList = arenas.filter((item) => item.visited === true)

  const arenaLastVisited = filteredList.sort(function (a, b) {
    return new Date(b.date).valueOf() - new Date(a.date).valueOf()
  })

  const percentage = ((filteredList.length / arenas.length) * 100).toFixed(0)

  return (
    <div className="mb-10 flex flex-col items-center  justify-center bg-indigo-50 pt-10  lg:flex-row">
      <div className="container mx-auto">
        <section className="body-font text-gray-600">
          <div className=" flex flex-col items-center px-5 py-7 ">
            <div className="grid max-w-4xl grid-cols-9 place-content-center  place-items-center gap-2   ">
              {arenas.slice(0, 27).map((item, index: number) => (
                <div key={item.name}>
                  <Image
                    width={64}
                    height={64}
                    loading={index < 9 ? "eager" : "lazy"}
                    sizes="64px"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
                    className="object-cover object-center w-16 h-16"
                    alt={`${item.name} arena`}
                    src={
                      item?.firstGalleryImage?.asset?._ref || item?.gallery?.[0]?.asset?._ref
                        ? urlForImage(item?.firstGalleryImage?.asset?._ref || item?.gallery?.[0]?.asset?._ref)
                            .height(64)
                            .width(64)
                            .fit('crop')
                            .url()
                        : 'https://fakeimg.pl/64x64'
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex max-w-4xl flex-col items-center justify-center pt-8 text-center align-middle   md:items-start lg:grow  ">
              <Link href={''}> </Link>

              <h1 className="font-oswald container mx-auto  mb-1  font-heading text-4xl font-bold leading-tight tracking-tighter text-pink-500 sm:px-0  md:text-[4.3rem]">
                {title}
              </h1>
              <div className="container mx-auto flex flex-col items-center">
                <p className="mb-8  mt-4 max-w-2xl leading-relaxed">
                  {' '}
                  {summary}
                </p>

                {arenas.length > 1 && (
                  <div className=" container mx-auto    mb-8 md:w-full md:pr-6 lg:mb-0 lg:max-w-xl group ">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-4 border-black p-6">
                      <h2 className="title-font mb-1 text-sm font-medium tracking-widest">
                        ARENA LAST VISITED
                      </h2>

                      <Link href={`/arena/${arenaLastVisited[0].slug}`}>
                        <h1 className="mb-4  border-gray-200 text-5xl leading-none text-gray-900 group-hover:text-gray-600 group-hover:underline decoration-pink-500 decoration-dashed decoration-4">
                          {arenaLastVisited[0]?.name}
                        </h1>
                      </Link>
                      <div className="mb-4 flex flex-col md:flex-row items-center gap-y-3   justify-around border-b border-gray-200 pb-4 align-middle text-base leading-none text-gray-500">
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
                        <div className="mt-2 flex flex-row  justify-between">
                          <span className=" mb-2 text-sm  font-medium text-gray-500 ">
                            We&apos;ve visited{' '}
                            <span className=" font-black text-pink-500">
                              {' '}
                              {filteredList.length} of {arenas.length}{' '}
                            </span>{' '}
                            arenas so far
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-x-2">
                          <div className=" h-3 w-full rounded-full ">
                            <Progress
                              value={parseInt(percentage)}
                              className="h-4 rounded-lg bg-gray-200"
                            />
                          </div>
                          <div className="text-xs"> {percentage}%</div>
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
