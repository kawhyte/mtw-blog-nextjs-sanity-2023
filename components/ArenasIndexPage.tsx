import { inter, oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import Link from 'next/link'

const ArenasIndexPage = ({ arenas }) => {
  //console.log('arenas 77 ', arenas[0])

  return (
    <>
      <div className=" container mx-auto mb-20   mt-44  flex rounded-xl  bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-50 md:mt-52">
        <div className="z-20 w-full px-4  py-12 text-start sm:px-6 lg:w-1/2 lg:px-8 lg:py-16">
          <h1
            className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
          >
            Our Quest to Visit Every NBA & WNBA Arena 🏀
          </h1>
          <p
            className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
          >
            We are traveling near and far to every state/country to visit all
            the NBA and WNBA arena across the US and Canada. Follow us on this
            journey.
          </p>
          <div className="lg:mt-0 lg:flex-shrink-0">
            <div className="mt-12 inline-flex rounded-md shadow ">
              <Link href="/arenas" passHref legacyBehavior>
                <button
                  type="button"
                  className="w-full rounded-lg  bg-yellow-400 px-6 py-2 text-center text-base font-semibold text-black shadow-md transition duration-200 ease-in hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2  focus:ring-offset-yellow-200 "
                >
                  View Our Journey ⛹🏾‍♀️
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-1/2  right-12 mt-9 mr-9  hidden h-full lg:block">
          <div className="grid grid-cols-3 gap-3 ml-2">
            {arenas?.map((item) => (
              <div
                key={item._id}
                className=" flex flex-row items-center justify-evenly"
              >
                <div
                  key={item.gallery[0].name}
                  className="my-4 flex   items-center align-middle "
                >
                  <img
                    src={
                      item.gallery[0]?.asset?._ref
                        ? urlForImage(item.gallery[0])
                            .height(96)
                            .width(96)
                            .fit('crop')
                            .url()
                        : ''
                    }
                    className=" h-16  w-16  "
                    height={96}
                    width={96}
                    alt={`${item.gallery[0].name} logo`}
                  />

                  <p
                    className="text-gray-4=500 ml-2  mt-2 cursor-pointer font-extralight "
                    role="link"
                  >
                    {item.gallery[0].name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ArenasIndexPage
