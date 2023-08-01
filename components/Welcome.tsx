import { inter } from 'app/fonts'
import Image from 'next/image'
import React from 'react'

function Welcome() {
  return (
    <>
      <section className="body-font text-gray-600">
        <div className="container mx-auto px-5 py-24">
          <div className=" flex w-full flex-col py-12 text-center   ">
            <h2
              className={` font-fancy z-10  mb-2 text-4xl font-bold leading-tight tracking-tighter md:text-6xl`}
            >
              Hi! We are the Whytes. <br></br> Welcome to our space on the{' '}
              <span className="text-pink-500">interwebs </span>
            </h2>

            <p
              className={` ${inter.variable} z-10 mx-auto  font-secondary text-2xl leading-relaxed lg:w-2/3`}
            >
              We&apos;re a husband 👖 and wife 👗 duo. We love to travel & try
              new food.
            </p>
          </div>
          <div className="-m-4 flex flex-wrap justify-evenly text-center ">
            <div className="w-full p-4 sm:w-1/2 md:w-1/4">
              <div className=" flex flex-col items-center  border-gray-200 px-4 py-6">
                <img src="/plane.svg" width={120} />

                <h2 className="title-font pt-3 text-3xl font-medium text-gray-900 ">
                  7
                </h2>
                <p className="leading-relaxed">Countries Visited</p>
              </div>
            </div>
            <div className="w-full p-4 sm:w-1/2 md:w-1/4">
              <div className=" flex flex-col items-center  border-gray-200 px-4 py-6">
                <img src="/travel.svg" width={110} />
                <h2 className="title-font pt-3 text-3xl font-medium text-gray-900">
                  130
                </h2>
                <p className="leading-relaxed">Miles Walked</p>
              </div>
            </div>
            <div className="w-full p-4 sm:w-1/2 md:w-1/4">
              <div className="flex flex-col items-center border-gray-200 px-4 py-6">
                <img src="/palm.svg" width={100} />

                <h2 className="title-font pt-3 text-3xl font-medium text-gray-900">
                  14
                </h2>
                <p className="leading-relaxed">Hotel Stays</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Welcome
