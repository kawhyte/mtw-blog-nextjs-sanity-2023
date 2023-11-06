import { inter, oswald } from 'app/fonts'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

function ReviewHeader({ title, arenas, summary, animation }) {
  const totalDistance = arenas.reduce(
    (total, item) => total + item.galleryCount,
    0
  )

  const filteredList = arenas.filter((item) => item.visited === true)

  const arenaLastVisited = filteredList.sort(function (a, b) {
    return new Date(b.date).valueOf() - new Date(a.date).valueOf()
  })

  const percentage = ((arenas[0]?.visitedCount / totalDistance) * 100).toFixed(
    2
  )

  return (
    <div className="  flex flex-col items-center justify-center bg-indigo-50 pt-12 lg:flex-row">
      <div className=" container mx-auto  p-10 lg:w-full lg:max-w-xl ">
        <img alt="" src={animation} />
      </div>
      <div className="flex  flex-col items-center text-center md:items-start md:pl-16 md:text-left lg:grow lg:pl-24">
        <h1
          className={` ${oswald.variable}  mb-1 py-1 font-heading text-5xl font-bold leading-tight tracking-tighter text-pink-500  md:text-6xl`}
        >
          {title}
        </h1>
        <p
          className={` font-secondary mb-8 px-5  leading-relaxed md:px-0 md:text-base lg:text-lg`}
        >
          {summary}
        </p>

        {arenas.length > 1 && (
          <div className="    mb-8 md:w-full md:pr-6 lg:mb-0 lg:max-w-xl ">
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-gray-300 p-6">
              <h2 className="title-font mb-1 text-sm font-medium tracking-widest">
                ARENA LAST VISITED
              </h2>
              <h1 className="mb-4  border-gray-200 text-5xl leading-none text-gray-900">
                {arenaLastVisited[0]?.name}
              </h1>
              <p className="mb-4 border-b border-gray-200 pb-4 text-base leading-none text-gray-500">
                {arenaLastVisited[0]?.location}
              </p>

              <div className=" ">
                <div className="mt-2 flex flex-row  justify-between">
                  <span className="title-font mb-1 text-xs  font-medium tracking-widest text-gray-500 ">
                    Arenas visited
                  </span>
                  <span className="text-xs font-medium text-gray-500 ">37</span>
                </div>
                <div className=" h-4 w-full rounded-full bg-gray-900">
                  <div className="w-full rounded-full  dark:bg-gray-700">
                    <div
                      className="h-6  rounded-r-full bg-gradient-to-r  from-green-500 to-blue-500 p-1.5 text-center text-xs font-medium leading-none text-gray-100  "
                      style={{ width: `${percentage}%` }}
                    >
                      {arenas[4]?.visitedCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewHeader
