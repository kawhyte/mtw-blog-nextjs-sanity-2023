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
    bg: ' bg-indigo-50',
  },
  {
    name: 'Kettle',
    url: '/kettle.png',
    bg: ' bg-pink-50',
  },
  {
    name: 'Wire Bag',
    url: '/wire_bag.png',
    bg: ' bg-pink-50',
  },
  {
    name: 'Portable Charger',
    url: '/anker.png',
    bg: ' bg-pink-50',
  },
]

function Welcome() {
  return (
    <>
      <section className="container mx-auto  bg-mtw-light-yellow-background text-gray-600">
        <div className="container mx-auto px-5 py-24 pt-16">
          <div className="mb-20 flex w-full  justify-between">
            <div>
              <h1 className={`${oswald.variable}  font-heading title-font mb-3 text-3xl font-medium text-gray-900 sm:text-4xl`}>
                Our Travel Essentials
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
              <p
                className={` ${inter.variable} mt-4 font-secondary leading-relaxed  lg:text-xl `}
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

          <div className="-m-4 grid grid-cols-5 content-center gap-4 ">
            {essentials.map((item) => (
              <>
                <div key={item.name} className="group  relative cursor-pointer overflow-hidden ">
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
                </div>
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
