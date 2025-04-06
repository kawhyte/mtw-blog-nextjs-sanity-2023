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
    <div className="  text-gray-700 ">
      <div
        className={`flex w-full flex-col justify-center rounded-2xl border  p-2`}
      >
        <div className="flex flex-row items-center justify-start">
          <div className="flex items-center justify-center px-2 ">
            {icon && <span className="mr-2">{icon}</span>}
            <h2 className="font-montserrat text-sm font-normal text-gray-700">
              {text}
            </h2>
          </div>
        </div>
        {Number(rating) > 0 && (
          <div className="flex w-full flex-1 flex-row items-center px-2 align-middle  text-sm ">
            {/* <p className="text-xs font-medium md:text-xs"></p> */}

            <ProgressRating progress={displayRating} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ArenaRating
