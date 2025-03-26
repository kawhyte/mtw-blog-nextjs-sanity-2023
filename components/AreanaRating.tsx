import { Badge, Progress } from '@mantine/core'
import React from 'react'

import ProgressRating from './ProgressRating'

function ArenaRating({ rating, text, icon }) {
  const formattedValue = rating?.toFixed(2)
  const progressValue = formattedValue
    ? parseFloat(((formattedValue / 10) * 100).toString())
    : 0 // Assuming a max rating of 10
  const displayRating = formattedValue
    ? (formattedValue / 2).toFixed(2)
    : 'Pending'

  return (
    <div className=" py-1.5 px-6 text-gray-700 ">
      {/* <div className="flex w-full sm:w-[8rem] flex-col items-center rounded-lg border-2 border-gray-700 px-2 py-2">
        <div className="flex items-center justify-center mb-2">
          {icon && <span className="mr-2">{icon}</span>}
          <h2 className="title-font text-xl text-gray-700">{displayRating}</h2>
        </div>ll
        <Progress value={20} color="indigo" size="md" radius="sm" label={`${progressValue}%`} />
        <p className="leading-relaxed mt-2 text-sm text-gray-500">{text}</p>
      </div> */}

      <div className={`flex flex-col justify-center rounded-2xl border p-1  w-full`}>
        <div className="flex flex-row items-center justify-start">
          <div className="flex items-center justify-center px-2 ">
            {icon && <span className="mr-2">{icon}</span>}
            <h2 className="text-sm font-montserrat font-normal text-gray-700">{text}</h2>
          </div>
        </div>
        {Number(rating) > 0 && (
          <div className="flex flex-1 flex-row items-center align-middle text-sm w-full  px-2 ">
            {/* <p className="text-xs font-medium md:text-xs"></p> */}

            <ProgressRating progress={displayRating} />

            
      
          </div>
        )}
      </div>
    </div>
  )
}

export default ArenaRating
