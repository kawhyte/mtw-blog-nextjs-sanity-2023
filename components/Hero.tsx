import { oswald } from 'app/fonts'
import lottie from 'lottie-web'
import Image from 'next/image'
import React from 'react'
import { useEffect, useRef } from 'react'

let animation = [
  {
    name: 'Bath',
    url: '/bath.json',
    bg: ' bg-indigo-50',
  },
  {
    name: 'Bath',
    url: '/bath.json',
    bg: ' bg-indigo-50',
  },
  {
    name: 'Bath',
    url: '/bath.json',
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
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: animation[randomNum].url,
    })
  }, [])

  // console.log("anim", animation[0].url)
  return (
    <>
      <div className="relative  mb-12 w-full md:-mt-12 lg:-mt-32">
        <div className={`relative rounded  ${animation[randomNum].bg}`}>
          <div className="container m-auto px-6  md:px-12 lg:px-7 lg:pt-[.01rem]">
            <div className="flex flex-wrap items-center justify-center px-2 align-middle md:px-0">
              <div className="relative lg:w-5/12 lg:py-24 xl:py-32">
                <div
                  className={`  ${oswald.variable}  font-heading text-6xl  font-bold text-gray-700  md:text-7xl lg:w-10/12 lg:text-8xl`}
                >
                  <h1>
                    Travel.<span className="text-mtw-pink">Eat.</span>Explore.
                  </h1>
                </div>

                <p
                  className={`  mt-8 text-gray-700 md:text-lg lg:w-10/12 lg:text-xl`}
                >
                  Hi! We are the Whytes. <br></br> Welcome to our space on the{' '}
                  <span className="text-pink-500">interwebs. </span> We&apos;re
                  a husband 👖 and wife 👗 duo. We love to travel, relax & try
                  new food.
                </p>

                <div></div>
              </div>
              <div
                ref={container}
                className="-mb-24 -mt-28 ml-auto lg:-mb-56 lg:w-7/12"
              >
                {/* <div
                ref={container}
                className="-mb-24 ml-auto lg:-mb-56 lg:w-7/12"
              > */}
                {/* <img
                  src="https://tailus.io/sources/blocks/food-delivery/preview/images/food.webp"
                  className="relative"
                  alt="food illustration"
                  loading="lazy"
                  width="4500"
                  height="4500"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
