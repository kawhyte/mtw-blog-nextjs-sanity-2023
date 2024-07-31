import { Blockquote } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import Image from 'next/image'
import React from 'react'
import { FaCode } from 'react-icons/fa6'
import { FiCoffee } from 'react-icons/fi'
import { IoGameControllerOutline } from 'react-icons/io5'
import { PiBarbell } from 'react-icons/pi'
import { PiHamburger } from 'react-icons/pi'
import { PiSuitcaseRolling } from 'react-icons/pi'
import { SiNike } from 'react-icons/si'
import { SlNotebook } from 'react-icons/sl'

let duo = [
  {
    id: 1,
    color: 'indigo',
    name: 'Mr.',

    image: '/avatar_mr.png',
    favorite: [
      { id: 3, name: 'Coding', img: <FaCode className="h-7 w-7 " /> },
      {
        id: 4,
        name: 'Retro Games',
        img: <IoGameControllerOutline className="h-7 w-7 " />,
      },
      { id: 5, name: 'Coffee', img: <FiCoffee className="h-7 w-7 " /> },
      { id: 6, name: 'Sneakers', img: <SiNike className="h-7 w-7" /> },
    ],
    quote_by: ' - Oscar Wilde',
    quote: 'Be yourself; everyone else is already taken.',
  },
  {
    id: 2,
    color: 'pink',
    name: 'Mrs.',
    image: '/avatar_mrs.png',
    favorite: [
      { id: 7, name: 'Burgers', img: <PiHamburger className="h-7 w-7" /> },
      { id: 8, name: 'Reading', img: <SlNotebook className="h-7 w-6" /> },
      { id: 3, name: 'Travel', img: <PiSuitcaseRolling className="h-7 w-7" /> },
      { id: 6, name: 'Weightlifting', img: <PiBarbell className="h-7 w-7 " /> },
    ],
    quote_by: '- Frank Zappa',
    quote: 'So many books, so little time',
  },
]



function Welcome() {
  return (
    <>
      <div className=" lg:container   lg:mx-auto mt-20  md:mt-40  lg:flex ">
        <div className="lg:container lg:mx-auto rounded-xl  px-4 pb-6 xl:max-w-6xl">
          <header className="  m mx-auto mt-12 mb-16 text-center">
            <h2 className="mb-2 text-2xl font-bold leading-normal text-gray-800 dark:text-gray-900">
              <span
                className={`${oswald.variable}  title-font mb-6 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Meet the Dynamic Duo
              </span>
            </h2>
          </header>

          <div className="h-1 lg:h-16"></div>

          <div className=" mb-3 grid md:ml-20 lg:ml-0  lg:h-96 grid-cols-1  gap-3  justify-items-center md:gap-y-52 md:w-5/6 md:grid-cols-2  md:gap-x-20">
            {duo.map((person) => (
              <div key={person.id}>
                <div className="bg-white">
                  <div className="flex min-w-full items-center justify-center">
                    <div className="flex lg:relative">
                      
                   
                          <div className="lg:absolute hidden -left-4 -top-4 h-96 w-72  transform rounded-lg bg-yellow-100 transition-all"></div>
                          <div className="-left-8 -top-8 hidden h-96 w-72 transform rounded-lg  bg-green-100 transition-all lg:absolute lg:block"></div>
                          <div className="-left-12 -top-12 hidden h-96 w-72 transform rounded-lg  bg-purple-100 transition-all lg:absolute lg:block"></div>
                          <div className="-left-16 -top-16 hidden h-96 w-72 transform rounded-lg  bg-gray-300 transition-all lg:absolute lg:block"></div>
                          <div className="-left-20 -top-20   lg:flex  h-72 lg:h-96 w-72 transform  flex-col items-center justify-center rounded-lg border-4  border-black bg-white transition-all lg:absolute">
                     
                        
                        <div className="flex flex-col items-center  overflow-hidden pb-12 lg:relative  ">
                          <img
                            src={person.image}
                            className="mx-auto h-auto w-32 mt-3 max-w-full rounded-full bg-gray-200 p-3 grayscale"
                            alt="title image"
                          />

                          <p
                            className={`${oswald.variable}  title-font my-2  font-heading text-3xl font-medium text-${person.color}-500 text-gray-900 sm:text-4xl`}
                          >
                            {person.name}
                          </p>
                        </div>

                        <div className="-mt-10 px-3">
                          <span className=" ml-2 mt-2 text-center  text-sm  font-extralight text-gray-500">
                            &quot;{person.quote}&quot; {person.quote_by}
                          </span>
                        </div>
                        <div className=" mb-2 mt-4 hidden  p-2  lg:block border-t">
                          <p className=" ml-2 mt- text-start  text-sm  font-extralight text-gray-500">
                            Likes:
                          </p>
                          <div className="text-nowrap mt-2 grid grid-cols-4 gap-x-4 gap-y-1 px-3">
                            {person.favorite?.map((item) => (
                              <div
                                key={item.id}
                                className=" text-nowrap flex flex-col items-center gap-x-2 text-center font-light leading-relaxed text-gray-500"
                              >
                                <span>{item.img} </span>
                                <span
                                  className={`text-nowrap rounded-full   px-2 py-1 text-xs    font-extralight  text-gray-500 `}
                                >
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <section className="body-font text-gray-600 pt-24 md:pt-32 ">
        <div className=" container mx-auto px-5 ">
          <div className="-m-4 flex justify-evenly text-center ">
            {stats.map((item) => (
              <div key={item.id} className="w-full p-4 sm:w-1/2 md:w-1/4">
                <div key={item.id} className=" flex flex-col items-center  border-gray-200 px-4 py-6">
                  <img src={item.url} alt={item.name} width={200} />

                  <h2
                    className={` ${oswald.variable}  py-3 font-heading text-2xl font-medium  text-gray-900 md:text-4xl`}
                  >
                    {item.value}
                  </h2>
                  <p className="text-xs leading-relaxed md:text-base font-light ">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </>
  )
}

export default Welcome
