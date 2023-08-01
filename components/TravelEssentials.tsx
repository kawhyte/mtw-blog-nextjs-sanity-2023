import { inter } from 'app/fonts'
import Image from 'next/image'
import React from 'react'

function Welcome() {
  return (
    <>
      <section className="body-font text-gray-600 bg-mtw-light-yellow-background">
        <div className="container mx-auto px-5 py-24">
          <div className="mb-20 flex w-full flex-col text-center">
            <h1 className="title-font mb-4 text-2xl font-medium text-gray-900 sm:text-3xl">
              Our Travel Essentials 
            </h1>
            <p className="mx-auto text-base leading-relaxed lg:w-2/3">
            Just a few thing we like for trips 
            </p>
          </div>
          <div className="-m-4 grid grid-cols-4 gap-4 content-center ">
         
              <div className=" h-full w-full object-scale-down object-center">
                <img
                  alt="gallery"
                  className=""
                  src="/shoes.png"
                  width={220}
                  height={220}
                />
        
              </div>
              <div className=" h-full w-full object-scale-down object-center">
                <img
                  alt="gallery"
                  className=""
                  src="/shoes.png"
                  width={220}
                  height={220}
                />
        
              </div>
              <div className=" h-full w-full object-scale-down object-center">
                <img
                  alt="gallery"
                  className=""
                  src="/shoes.png"
                  width={220}
                  height={220}
                />
        
              </div>
              <div className=" h-full w-full object-scale-down object-center">
                <img
                  alt="gallery"
                  className=""
                  src="/shoes.png"
                  width={220}
                  height={220}
                />
        
              </div>
 
         
           
            
          </div>
        </div>
      </section>
    </>
  )
}

export default Welcome
