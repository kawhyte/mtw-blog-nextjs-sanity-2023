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
    <div className="   mb-10 flex flex-col items-center justify-center bg-indigo-50 pt-10  lg:flex-row">
      <div className="container mx-auto">

      <section className="text-gray-600 body-font">
  <div className="container mx-auto flex px-5 py-20 md:flex-row flex-col items-center">
    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
      <img className="object-cover object-center rounded" alt="hero" src={animation}/>
    </div>
    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
      <h1 className={` ${oswald.variable} container mx-auto  mb-1 px-3 py-1  font-heading text-5xl font-bold leading-tight tracking-tighter text-pink-500 sm:px-0  md:text-[4.5rem]`}>{title}
       
      </h1>
      <p className="mb-8 leading-relaxed"> {summary}</p>
    
    </div>
  </div>
</section>














        {/* <div className=" container mx-auto hidden p-10  md:block lg:w-full lg:max-w-xl ">
          <img alt="" src={animation} />
        </div> */}
        <div className="container mx-auto flex flex-col items-center text-center md:items-start md:pl-16 md:text-left lg:pl-24">
          {/* <h1
            className={` ${oswald.variable} container mx-auto  mb-1 px-3 py-1 text-center font-heading text-5xl font-bold leading-tight tracking-tighter text-pink-500 sm:px-0  md:text-[6rem]`}
          >
            {title}
          </h1>
          <p
            className={` font-secondary container mx-auto my-12   px-5 text-center leading-relaxed md:px-0 md:text-base lg:text-lg`}
          >
            {summary}
          </p> */}
          <div className="container mx-auto hidden p-10  md:block lg:w-full lg:max-w-xl">
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
                      <span className="text-xs font-medium text-gray-500 ">
                        37
                      </span>
                    </div>
                    <div className=" h-4 w-full rounded-full bg-gray-900">
                      <div className="w-full rounded-full  dark:bg-gray-700">
                        <div
                          className="h-6  rounded-r-full bg-gradient-to-r  from-yellow-200 to-pink-500 p-1.5 text-center text-sm font-medium leading-none text-gray-600  "
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
      </div>
    </div>
  )
}

export default ReviewHeader
