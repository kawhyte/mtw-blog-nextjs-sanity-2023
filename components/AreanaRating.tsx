import { Progress } from '@mantine/core'
import React from 'react'

function AreanaRating({ rating, text }) {
  const formattedValue = rating?.toFixed(2); 
  return (
    <div className="  mb-3 w-full flex-row items-end pr-6 align-bottom text-base  md:text-sm  ">
        <p className="mr-6 mb-1  ">{text} </p>
      <div className="mb-1 flex  justify-between items-center">

      <Progress color={rating > 8 ? "green": rating > 5 ? "yellow" : "red"} radius="lg" size="lg" h={8} w={149} value={rating*10} />
        <p className="   ">{formattedValue} </p>
      </div>

    </div>
  )
}

export default AreanaRating
