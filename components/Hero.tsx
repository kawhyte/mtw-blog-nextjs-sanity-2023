import { inter } from 'app/fonts'
import Image from 'next/image'
import React from 'react'
import { useEffect, useRef } from 'react'


function Hero() {
  // const videoRef = useRef(null);
  // useEffect(() => {
  // 	if (videoRef) {
  // 		videoRef.current.play();
  // 	}
  // }, []);

  return (
    <>
      <div className="relative w-full mb-12">
        <div className="relative rounded bg-mtw-light-yellow-background">
          <div className="container m-auto px-6  md:px-12 lg:px-7 lg:pt-[.01rem]">
            <div className="flex flex-wrap items-center px-2 md:px-0">
              <div className="relative lg:w-5/12 lg:py-24 xl:py-32">
                <div className="text-6xl  font-bold text-gray-700  md:text-7xl lg:text-8xl lg:w-10/12">
                  
                <h1>Travel.<span className='text-mtw-pink' >Eat.</span>Explore.</h1>
                </div>
        

                <p className={ ` ${inter.variable} font-secondary mt-8 md:text-lg lg:text-xl text-gray-700 lg:w-10/12`}>
                  Our journey in discovering and reviewing food, hotels and
                  interesting locations.
                </p>

                <div></div>
              </div>
              <div className="-mb-24 ml-auto lg:-mb-56 lg:w-7/12">
                <img
                  src="https://tailus.io/sources/blocks/food-delivery/preview/images/food.webp"
                  className="relative"
                  alt="food illustration"
                  loading="lazy"
                  width="4500"
                  height="4500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
