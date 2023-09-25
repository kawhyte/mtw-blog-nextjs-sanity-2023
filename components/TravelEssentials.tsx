import { Box, Group, Image, Text } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import Link from 'next/link'
import React from 'react'

let essentials = [
  {
    name: 'Nike Presto',
    url: '/presto.webp',
    bg: ' bg-yellow-50',
  },
  {
    name: 'Sunscreen',
    url: '/sunscreen.webp',
    bg: ' bg-green-50',
  },
  {
    name: 'Kettle',
    url: '/kettle.png',
    bg: ' bg-pink-50',
  },
  {
    name: 'Wire Bag',
    url: '/wire_bag.png',
    bg: ' bg-blue-50',
  },
  {
    name: 'Portable Charger',
    url: '/anker.png',
    bg: ' bg-indigo-50',
  },
]

function Welcome() {
  return (
    <>
      <section className="container mx-auto  text-gray-600 py-14 ">
        <div className="container mx-auto px-5 py-24 pt-16">
          <div className="mb-20 flex w-full  justify-between">
            <div>
              <h1
                className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Our Travel Essentials
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
              <p
                className={` ${inter.variable} font-secondary mt-4 leading-relaxed  lg:text-xl `}
              >
                Just a few thing we like to take on our trips
              </p>
            </div>

            {/* <div className="mt-4 lg:flex-shrink-0">
              <div className=" inline-flex  ">
                <Link href="/stuff_we_like" passHref legacyBehavior>
                  <button
                    type="button"
                    className={`${inter.variable} font-secondary py-2 px-4 text-gray-500 hover:underline  w-full transition ease-in duration-200 text-center text-xs md:text-base font-semibold`}
                  >
                  Show all
                  </button>
                </Link>
              </div>
            </div>  */}
          </div>

          <div className="  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 content-center gap-4 ">
            {essentials.map((item) => (
              <>
                <div className="mx-auto max-w-2xl">
                  <div
                    className={`${item.bg}  max-w-sm rounded-lg shadow-md  dark:border-gray-700 `}
                  >
                    <a href="#">
                      <img
                        className="rounded-t-lg p-8 transition-all  hover:translate-x-3 hover:translate-y-2 hover:duration-700"
                        src={item.url}
                        alt="product image"
                      />
                    </a>
                    <div className="px-5 pb-5">
                      <a href="#">
                        <h3 className="text-xl font-semibold tracking-tight text-gray-900 ">
                          {item.name}
                        </h3>
                      </a>
                      <div className="mb-5 mt-2.5 flex items-center">
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <svg
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="ml-3 mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
                          5.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div key={item.name} className="group  relative cursor-pointer overflow-hidden ">
                  <div className=" hidden pt-30 absolute   inset-x-0 z-50 cursor-pointer  items-end rounded-xl bg-transparent  text-black opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 lg:block">
                    <div className="translate-y-2   transform  space-y-3 p-4 pb-10 text-xs transition duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 md:text-sm">
                      <div className="flex content-center text-xs  justify-center rounded-lg bg-red-50 align-middle font-bold">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <img
                    alt={item.name}
                    className="flex h-full w-full content-end justify-center  object-scale-down object-center align-bottom"
                    src={item.url}
                  />
                </div> */}
                {/* <Box maw={240} mx="auto">
                  <Image
                    radius="md"
                    src={item.url}
                    alt={item.name}
                    caption={item.name}
                  />
                </Box> */}
              </>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Welcome
