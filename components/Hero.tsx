import { oswald, inter } from 'app/fonts'
import dynamic from 'next/dynamic'
//import lottie from 'lottie-web'
import Image from 'next/image'
import React from 'react'
import { useEffect, useRef } from 'react'



let animation = [
  {
    name: 'watermelon',
    url: 'watermelon.json',
    // url: 'https://static3.lottiefiles.com/lotties/01_ramen_character.json',
    bg: ' bg-indigo-50',
  },
  {
    name: 'Bath',
    // url: 'https://lottie.host/f2f04f90-3319-4ccc-87c8-c7a609e54179/HfnKsEY8ST.json',
    url: 'bath.json',
    bg: ' bg-indigo-50',
  },
  {
    name: 'Ramen',
    url: 'ramen.json',
    // url: 'https://lottie.host/abe85d6d-bbcd-42ca-aa12-6cab9a41c9f5/kpy5UMuVu8.json',
    bg: ' bg-indigo-50',
  },
  {
    name: 'Sundae',
    url: 'sundae.json',
    // url: 'https://lottie.host/2ed631e4-1bf8-46bc-8702-bf19c933f21f/XN2AoNzMMY.json',
    bg: ' bg-indigo-50',
  },
]

let randomNum = Math.floor(Math.random() * 4)

function Hero() {
  // const videoRef = useRef(null);
  // useEffect(() => {
  // 	if (videoRef) {
  // 		videoRef.current.play();
  // 	}
  // }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const container = useRef(null)

  useEffect(() => {
    // lottie.loadAnimation({
    //   container: container.current,
    //   renderer: 'svg',
    //   loop: true,
    //   autoplay: true,
    //   path: animation[randomNum].url,
    // })
  }, [])

  // console.log("anim", animation[0].url)
  return (
    <>
      <section className="body-font container mx-auto max-w-6xl text-gray-600">
        <div className="container mx-auto flex flex-col  items-center px-5  pt-12 md:flex-row">
          <div className="sm:mb-0 flex flex-col  items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-5">
            <div
              className={`  ${oswald.variable}  flex flex-col -space-y-8    lg:-space-y-12  z-30 font-heading text-7xl  font-bold  uppercase text-gray-700  md:text-7xl lg:w-10/12 lg:text-[9rem]  xl:-space-y-20`}
            >
              <p className="">Food.</p>
              <p className="text-pink-500"> Travel.</p>
              <p className="">Explore.</p>
            </div>

            <p className={` ${inter.variable} font-sans  mb-8 text-lg xl:text-xl max-w-2xl  leading-relaxed z-30`}>
              {' '}
              Hi! We are the Whytes. Welcome to our space on the{' '}
              <span className="text-pink-500">interwebs. </span> We&apos;re a
              husband 👖 and wife 👗 duo. We love to travel, relax & try new
              food.
            </p>
          </div>
          <div className="hidden max-w-sm   -mt-12 lg:-ml-10 md:mt-0  sm:block w-5/6 md:w-1/2 lg:w-full  lg:max-w-md">
          <PlayerWithNoSSR
                  autoplay
                  keepLastFrame
                  loop
                  src={animation[randomNum].url}
                />
          </div>
        </div>
      </section>

      
    </>
  )
}

export default Hero

const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false }
)
