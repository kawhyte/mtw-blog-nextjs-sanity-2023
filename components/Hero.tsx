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
    




<div className="relative w-full">

    <div className="relative bg-yellow-50">
        <div className="container m-auto px-6 pt-32 md:px-12 lg:pt-[.1rem] lg:px-7">
            <div className="flex items-center flex-wrap px-2 md:px-0">
                <div className="relative lg:w-6/12 lg:py-24 xl:py-32">
                    <h1 className="font-bold text-4xl text-yellow-900 md:text-5xl lg:w-10/12 uppercase"> Travel. Eat. Exlpore.</h1>
                    <h1 className="font-bold text-4xl text-yellow-900 md:text-5xl lg:w-10/12 uppercase"> Travel. Eat. Exlpore.</h1>
                    <h1 className="font-bold text-4xl text-yellow-900 md:text-5xl lg:w-10/12 uppercase"> Travel. Eat. Exlpore.</h1>
                    
                    <p className="mt-8 text-gray-700 lg:w-10/12">Our journey in discovering and reviewing food, hotels and interesting locations. .</p>
                </div>
                <div className="ml-auto -mb-24 lg:-mb-56 lg:w-6/12">
                    <img src="https://tailus.io/sources/blocks/food-delivery/preview/images/food.webp" className="relative" alt="food illustration" loading="lazy" width="4500" height="4500" />
                </div>
            </div>
        </div>
    </div>
</div>



	  
    
	</>
  )
}

export default Hero
