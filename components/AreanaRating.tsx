import { Badge } from '@mantine/core'
import React from 'react'

function AreanaRating({ rating, text, icon }) {
  const formattedValue = rating?.toFixed(2)
  return (
    <>
      <div className="flex items-center p-2 text-gray-700 ">
        <div className="flex w-40 sm:w-32 md:w-36 flex-col items-center rounded-lg border-2 border-gray-700 px-2 py-1">
          {/* <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
        <path d="M8 17l4 4 4-4m-4-5v9"></path>
        <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"></path>
      </svg> */}
       <p className='sm:hidden md:block'>{icon}</p>   
          {/* <img alt='name' className='h-12 w-12' src={icon}/> */}

          <h2 className="title-font text-xl  text-gray-700">
            {formattedValue ? (formattedValue / 2).toFixed(2) : 'Pending'}
          </h2>
          <p className="leading-relaxed text-gray-500">{text}</p>
        </div>
      </div>

      
    </>
  )
}

export default AreanaRating
