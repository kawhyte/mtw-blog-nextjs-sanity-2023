import { inter, oswald } from 'app/fonts'
import { Volleyball } from 'lucide-react'
import dynamic from 'next/dynamic'
//import lottie from 'lottie-web'
import Image from 'next/image'
import React from 'react'
import { useEffect, useRef } from 'react'
import { LiaBasketballBallSolid } from 'react-icons/lia'
import Button from 'ui/Button'

let animation = [
  {
    name: 'watermelon',
    // url: 'watermelon.json',
    url: 'basketball2.json',
    // url: 'https://static3.lottiefiles.com/lotties/01_ramen_character.json',
    bg: ' bg-indigo-50',
  },
  {
    name: 'Bath',
    // url: 'https://lottie.host/f2f04f90-3319-4ccc-87c8-c7a609e54179/HfnKsEY8ST.json',
    // url: 'bath.json',
    url: 'basketball2.json',
    bg: ' bg-indigo-50',
  },
  // {
  //   name: 'Ramen',
  //   url: 'ramen.json',
  //   // url: 'https://lottie.host/abe85d6d-bbcd-42ca-aa12-6cab9a41c9f5/kpy5UMuVu8.json',
  //   bg: ' bg-indigo-50',
  // },
  {
    name: 'Sundae',
    // url: 'sundae.json',
    url: 'basketball2.json',
    // url: 'https://lottie.host/2ed631e4-1bf8-46bc-8702-bf19c933f21f/XN2AoNzMMY.json',
    bg: ' bg-indigo-50',
  },
]

let randomNum = Math.floor(Math.random() * 3)

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
      <section className="body-font  container mx-auto  text-gray-600 max-w-[81rem]">

      
        <div className="container mx-auto flex flex-col justify-between  pt-12 md:flex-row">
          <div className="flex  flex-col mx-6 md:mx-0   sm:mb-0 md:pl-8  xl:mb-0 xl:w-full xl:items-start xl:pr-16 xl:text-left 2xl:pr-5">
            <div
              className={`  ${oswald.variable}  z-30 mb-6 flex  flex-col font-heading text-[3.5rem] font-bold  uppercase leading-none text-gray-700  md:text-[3.9rem] lg:w-10/12 lg:text-[5.2rem] xl:text-[5.3rem] 2xl:text-[5.9rem]  whitespace-nowrap  `}
            >
              <p className="">Our Quest   </p>
              <p className=""> to Visit Every  </p>
              <p className="text-pink-500 md:text-blue-500 lg:text-green-500 xl:text-yellow-500 2xl:text-pink-500">
                {' '}
                NBA & WNBA
              </p>
              <p className="">  Arena</p>
            </div>

            <p
              className={` ${inter.variable} z-30 max-w-2xl font-sans text-lg  leading-relaxed md:text-lg xl:text-xl`}
            >
              We are traveling near and far to every state/country to visit and rank all
              the NBA and WNBA arenas across the US and Canada. Follow us on
              this journey.
            </p>

            <div className="flex   pt-9 lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex  ">
                <Button icon={<LiaBasketballBallSolid className="h-7 w-8  text-pink-500" />} link={'/arenas'}>follow our Journey</Button>
              </div>
            </div>

            {/* <div
              className={`  ${oswald.variable}  z-30 w-full  bg-red-200 leading-none  font-heading text-7xl font-bold  uppercase  text-gray-700 md:text-7xl  lg:text-[8rem]  `}
            >
              
              <p className='text-7xl'>Adventues</p>
              <p>of the</p>
              <p>Whytes</p>
                
            </div> */}
          </div>
          <div className="-mt-12 hidden    w-5/6 max-w-sm md:block  md:mt-0 lg:w-full  lg:max-w-md xl:max-w-lg">
            <PlayerWithNoSSR
              autoplay
              keepLastFrame
              loop
              src={animation[randomNum]?.url}
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
