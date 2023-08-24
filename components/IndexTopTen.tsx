import { inter, oswald } from 'app/fonts'
import Image from 'next/image'
import Link from 'next/link'

export default function IndexTopTen() {
  return (
    <div className=" container mx-auto  relative my-8  flex-col overflow-hidden md:my-20 bg-green-50 pr-3 rounded-xl">
      <div className="z-20 w-full px-4  py-12 text-start sm:px-6 lg:w-1/2 lg:px-8 lg:py-16">
        <h2 className={` ${oswald.variable}  font-heading text-3xl font-extrabold text-black  sm:text-4xl`}>
          <span className="font-fancy block">
            
            Check out our top{' '}
            <span className="font-fancy text-mtw-yellow ">
              Hotels and Restaurants
            </span>{' '}
            recommendations.
          </span>
        </h2>
        <p className={`${inter.variable} font-secondary  mt-4 text-xl text-gray-600`}>
          Our very own curated list of places you should consider visiting.
        </p>
        <div className="lg:mt-0 lg:flex-shrink-0">
          <div className="mt-12 inline-flex rounded-md shadow ">
            <Link href="/top_picks" passHref legacyBehavior>
              <button
                type="button"
                className="w-full rounded-lg  bg-yellow-400 px-6 py-2 text-center text-base font-semibold text-black shadow-md transition duration-200 ease-in hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2  focus:ring-offset-yellow-200 "
              >
                Top Picks
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-1/2 absolute right-12 top-0  hidden h-full lg:block">
        <Image
          src="/beach.svg"
          width={356}
          height={255}
          alt="beach
          ball"
          blurDataURL="/passport.svg"
          placeholder="blur"
        />
      </div>
    </div>
  )
}
