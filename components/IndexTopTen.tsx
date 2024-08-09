import { inter, oswald } from 'app/fonts'
import Link from 'next/link'
import Button from 'ui/Button'
import SectionTitle from './SectionTitle'

export default function IndexTopTen() {
  return (
    <div className=" flex justify-between">
      {/* <div className=" container mx-auto flex flex-row justify-between  relative my-8  overflow-hidden md:my-20  pr-3 rounded-xl"> */}
      <div className="  flex w-full flex-col    lg:w-1/2">
        {/* <h2 className={` ${oswald.variable}  font-heading text-2xl font-extrabold text-black  sm:text-3xl`}>
          <span className="font-fancy block ">
            
            Our top Hotels & Restaurants recommendations.
         
          </span>
        </h2> */}
        <SectionTitle
          header={'Our top Hotels & Restaurants recommendations.'}
          description={
            'Our very own curated list of places you should consider visiting.'
          }
        />
        {/* <p className={`${inter.variable} font-secondary  mt-4 text-sm md:text-base lg:text-lg text-gray-600`}>
          Our very own curated list of places you should consider visiting.
        </p> */}

        {/* <Link href="/top_picks" passHref legacyBehavior> */}
        {/* <button
                type="button"
                className="w-full rounded-lg  bg-yellow-400 px-6 py-2 text-center text-base font-semibold text-black shadow-md transition duration-200 ease-in hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2  focus:ring-offset-yellow-200 "
              >
                Top Picks
              </button> */}
        {/* <button
                    className={`${inter.variable} inline-flex items-center rounded-lg bg-pink-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:bg-pink-500 dark:hover:bg-pink-600 dark:focus:ring-pink-800 `}
                  >
                   Our Top Picks
                    <svg
                      className="ml-2 h-3.5 w-3.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button> */}
        <div className="flex   pt-9 lg:mt-0 lg:flex-shrink-0">
          <div className=" inline-flex ">
            <Button link={'/top_picks'}>Our Top Picks</Button>
          </div>
        </div>

        {/* </Link> */}
      </div>
      <div className=" mt-12 hidden h-full lg:block">
        <img
          src="/relaxing.svg"
          width={356}
          height={255}
          alt="Lady on beach
          ball"
        />
      </div>
    </div>
    // </div>
  )
}
