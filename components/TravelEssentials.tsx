import { inter } from 'app/fonts'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Welcome() {
  return (
    <>
      <section className="body-font bg-mtw-light-yellow-background text-gray-600">
        <div className="container mx-auto px-5 py-16">
          <div className="mb-20 flex w-full flex-col text-center">
            <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
              Our Travel Essentials
            </h1>
            <p
              className={` ${inter.variable} mx-auto font-secondary text-xl  leading-relaxed lg:w-2/3`}
            >
              Just a few thing we like for trips
            </p>

            <div className="mt-4 lg:flex-shrink-0">
              <div className=" inline-flex rounded-md shadow ">
                <Link href="/stuff_we_like" passHref legacyBehavior>
                  <button
                    type="button"
                    className={`${inter.variable} w-full rounded-lg bg-indigo-600 px-4 py-2 text-center font-secondary text-xs font-semibold text-white shadow-md transition duration-200 ease-in hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200  md:text-base `}
                  >
                    View more
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="-m-4 grid grid-cols-5 content-center gap-4 ">
            <div className="flex h-full w-full content-end justify-center  object-scale-down object-center align-bottom">
              <img
                alt="gallery"
                className=""
                src="/presto.webp"
                width={220}
                height={220}
                title="mammals"
              />
            </div>
            <div className="flex h-full w-full justify-center object-scale-down object-center align-bottom">
              <img
                alt="gallery"
                className=""
                src="/sunscreen.webp"
                width={220}
                height={220}
              />
            </div>
            <div className="flex h-full w-full justify-center object-scale-down object-center align-bottom">
              <img
                alt="gallery"
                className=""
                src="/wire_bag.png"
                width={220}
                height={220}
              />
            </div>
            <div className="flex h-full w-full justify-center object-scale-down object-center align-bottom">
              <img
                alt="gallery"
                className=""
                src="/kettle.png"
                width={220}
                height={220}
              />
            </div>
            <div className="flex h-full w-full justify-center object-scale-down object-center align-bottom">
              <img
                alt="gallery"
                className=""
                src="/anker.png"
                width={220}
                height={220}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Welcome
