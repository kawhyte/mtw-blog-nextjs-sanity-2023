import { inter, oswald } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Button from 'ui/Button'

const SneakersIndexPage = ({ arenas }) => {
  //console.log('arenas 77 ', arenas[0])

  return (
    <>
      <div className=" pt-0 md:pt-1 container mx-auto   lg:pt-1 xl:p-10">
        <div className="hidden   -mb-72 md:mt-0 lg:block w-2/6 md:w-5/6 lg:w-full lg:max-w-xs">
          <PlayerWithNoSSR
            autoplay
            keepLastFrame
            loop
            src={'/basketball.json'}
          />
        </div>

        <div className="  container mx-auto mb-20   mt-44  flex rounded-xl  bg-linear-to-r from-indigo-200 via-pink-200 to-yellow-50 md:mt-52">
          <div className="z-20 w-full px-4  py-12 text-start sm:px-6 lg:w-3/5 lg:px-8 lg:py-16">
            <h1
              className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
            >
              Our Sneaker Collection
            </h1>
            <p
              className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
            >
              We are traveling near and far to every state/country to visit and
              rank all the NBA and WNBA arenas across the US and Canada. Follow
              us on this journey.
            </p>
            <div className="lg:mt-0 lg:shrink-0">
              <div className="mt-12 inline-flex ">
                <Button link={'/arenas'}>View Our Journey</Button>
              </div>
            </div>
          </div>
          <div className="max-w-2/5  right-12 mt-9  hidden h-full lg:block">
            <div className="grid grid-cols-3 gap-4 ml-2 place-items-center">
              {arenas?.map((item) => (
                <div
                  key={item._id}
                  className=" flex flex-row items-center justify-evenly"
                >
                  <div
                    key={item.gallery[0].name}
                    className="my-4 flex flex-col   items-center align-middle "
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
                      className="text-gray-500 ml-2 text-sm  mt-2  font-extralight text-center "
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
      </div>
    </>
  )
}

export default SneakersIndexPage

const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
)
