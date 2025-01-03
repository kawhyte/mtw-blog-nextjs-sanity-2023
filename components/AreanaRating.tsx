import { Badge } from '@mantine/core'
import React from 'react'

function AreanaRating({ rating, text }) {
  const formattedValue = rating?.toFixed(1)
  return (
    <div className="  mb-3 flex  w-full justify-between align-bottom text-sm   ">
      <div className="mb-1 flex w-full flex-col  items-center justify-between   ">
        <p className="mb-1  text-sm md:mr-0 md:pt-2  ">{formattedValue ?formattedValue : "Pending" }</p>

        <Badge className=''>{text}</Badge>

        {/* {formattedValue !== undefined ? (
          <Badge
          aria-label={`${text} rating: ${formattedValue}`} 
            className="w-14 md:w-1/2 text-sm lg:full"
            size=""
            color={rating > 8 ? 'green' : rating > 5 ? 'yellow' : 'red'}
          >
            {formattedValue}
          </Badge>
        ) : (
          <Badge className='w-16 md:w-2/3 text-sm' size="xs" color="gray">
            Pending
          </Badge>
        )} */}
      </div>
    </div>
  )
}

export default AreanaRating
