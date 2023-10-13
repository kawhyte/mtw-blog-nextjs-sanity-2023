import { inter, oswald } from 'app/fonts'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

function ReviewHeader({ title, pattern, summary, animation }) {
  

  return (
    <div className="  flex flex-col pt-12 items-center justify-center lg:flex-row bg-indigo-50">
      <div className=" mx-auto container  lg:w-full lg:max-w-xl p-10 ">
        <img alt='' src={animation} />

      </div>
      <div className="flex  flex-col items-center text-center md:items-start md:pl-16 md:text-left lg:grow lg:pl-24">
        <h1 className={` ${oswald.variable}  font-heading mb-1 py-1 text-5xl font-bold leading-tight tracking-tighter text-pink-500  md:text-6xl`}>
          {title}
        </h1>
        <p
          className={` mb-8  font-secondary leading-relaxed md:text-base lg:text-lg`}
        >
          {summary}
        </p>
      </div>
    </div>
  )
}

export default ReviewHeader
