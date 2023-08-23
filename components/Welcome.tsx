import { inter, oswald } from 'app/fonts'
import Image from 'next/image'
import React from 'react'

let stats = [
  {
    name: 'Countries Visited',
    value: 8,
    url: '/plane.svg',
  },
  {
    name: 'Hotel Stays',
    value: 14,
    url: '/palm.svg',
  },
  {
    name: 'Miles Walked',
    value: 14,
    url: '/travel.svg',
  },
]

function Welcome() {
  return (
    <>
      <section className="body-font text-gray-600 ">
        <div className="py container mx-auto px-5 pb-20 pt-48">
          <div className="-m-4 flex justify-evenly text-center ">
            {stats.map((item) => (
              <>
                <div key={item.name} className="w-full p-4 sm:w-1/2 md:w-1/4">
                  <div className=" flex flex-col items-center  border-gray-200 px-4 py-6">
                    <img src={item.url} alt={item.name} width={200} />

                    <h2
                      className={` ${oswald.variable}  pt-3 font-heading text-3xl font-medium  text-gray-900 md:text-5xl`}
                    >
                      {item.value}
                    </h2>
                    <p className="text-xs leading-relaxed md:text-xl ">
                      {item.name}
                    </p>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Welcome
