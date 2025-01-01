import { Badge } from '@mantine/core'
import React from 'react'

function AreanaRating({ rating, text }) {
  const formattedValue = rating?.toFixed(2)
  return (
    <div className="  mb-3 w-full  flex items-end justify-between pr-6 align-bottom text-sm md:text-xs   ">
      <div className="mb-1 flex w-full  items-center justify-between md:flex-col md:items-start xl:flex-row  ">
        <p className="mb-1 mr-6  ">{text} </p>
        {formattedValue !== undefined ? (
          <Badge
          aria-label={`${text} rating: ${formattedValue}`} 
            className=""
            size=""
            color={rating > 8 ? 'green' : rating > 5 ? 'yellow' : 'red'}
          >
            {formattedValue}
          </Badge>
        ) : (
          <Badge size="xs" color="gray">
            Pending
          </Badge>
        )}
      </div>
    </div>
  )
}

export default AreanaRating
