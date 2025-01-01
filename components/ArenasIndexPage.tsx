import { inter } from 'app/fonts'
import { urlForImage } from 'lib/sanity.image'
import dynamic from 'next/dynamic'
import Button from 'ui/Button'

import SectionTitle from './SectionTitle'

const ArenasIndexPage = ({ arenas }) => {
  //console.log('arenasH ', arenas[0])

  return (
    <div className='relative '>
   
      <div className="absolute -left-36  -top-64 h-16   hidden w-2/6 md:mt-0 md:w-5/6 lg:block lg:w-full lg:max-w-xs   ">
        <PlayerWithNoSSR autoplay keepLastFrame loop src={'/basketball.json'} />
      </div>
      <div className=" ">
        <div className="   flex rounded-xl ">
          <div className="z-20 w-full  text-start  lg:w-3/5 ">
            <SectionTitle
              header={'Our Quest to Visit Every NBA & WNBA Arenas'}
              description={`We are traveling near and far to every state/country to visit and rank all
              the NBA and WNBA arenas across the US and Canada. Follow us on
              this journey.`}
            />
            <p
              className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
            ></p>
            <div className="lg:mt-0 lg:flex-shrink-0">
              <div className="mt-6 inline-flex ">
                <Button link={'/arenas'}>View Our Journey</Button>
              </div>
            </div>
          </div>
          <div className="max-w-2/5  right-12   hidden h-full lg:block ">
            <div className="ml-1 grid grid-cols-4 place-items-center gap-1">
              {arenas?.map((item) => (
                <div
                  key={item._id}
                  className=" flex flex-row items-center justify-evenly"
                >
                  <div
                    key={item.gallery[0].name}
                    className="my-2 flex flex-col   items-center align-middle "
                  >
                    <img
                      src={
                        item.gallery[0]?.asset?._ref
                          ? urlForImage(item.gallery[0])
                              .height(90)
                              .width(90)
                              .fit('crop')
                              .url()
                          : ''
                      }
                      className=" h-14  w-14  "
                      height={90}
                      width={90}
                      alt={`${item.gallery[0].name} logo`}
                    />

                    <p
                      className="ml-2 mt-1 text-center  text-sm  font-extralight text-gray-500 "
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
    </div>
  )
}

export default ArenasIndexPage

const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false }
)
