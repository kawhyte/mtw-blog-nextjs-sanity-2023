import { Progress } from '@mantine/core'
import React from 'react'

function AreanaRating({ rating, text }) {
  return (
    <div className="  mb-3 w-full flex-row items-end pr-6 align-bottom text-base  md:text-sm  ">
      <div className="mb-1 flex  justify-between">
        <p className="mr-6  ">{text} </p>

        <p className="   ">{4.3} </p>
      </div>

      <Progress color="green" radius="lg" size="lg" h={8} value={rating} />
    </div>
  )
}

export default AreanaRating
