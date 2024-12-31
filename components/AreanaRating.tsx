import { Progress } from '@mantine/core'
import React from 'react'

function AreanaRating({ rating, text }) {
  const formattedValue = rating?.toFixed(2); 
  return (
    <div className="  mb-3 w-full flex-row items-end pr-6 align-bottom text-base  md:text-sm  ">
      <div className="mb-1 flex  justify-between">
        <p className="mr-6  ">{text} </p>

        <p className="   ">{formattedValue} </p>
      </div>

      <Progress color={rating > 8 ? "green": rating > 5 ? "yellow" : "red"} radius="lg" size="lg" h={8} value={rating*10} />
    </div>
  )
}

export default AreanaRating
