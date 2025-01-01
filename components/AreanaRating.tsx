import { Badge, Progress } from '@mantine/core'
import React from 'react'

function AreanaRating({ rating, text }) {

  console.log("Kenny", rating)
  const formattedValue = rating?.toFixed(2)
  return (
    <div className="  mb-3 w-full flex-row items-end pr-6 align-bottom text-sm md:text-xs   ">
      <div className="mb-1 flex  items-center justify-between md:flex-col md:items-start xl:flex-row  ">
      <p className="mb-1 mr-6  ">{text} </p>
     {formattedValue!==undefined?<Badge className='' size='' color={rating > 8 ? 'green' : rating > 5 ? 'yellow' : 'red'}>{formattedValue} </Badge>:  <Badge size="xs" color="gray">Pending</Badge>  } 
        {/* <Progress
          color={rating > 8 ? 'green' : rating > 5 ? 'yellow' : 'red'}
          radius="lg"
          size="lg"
          h={8}
          w={149}
          value={rating * 10}
        /> */}
        {/* <p className=" text-sm  ">{formattedValue} </p> */}
      </div>
    </div>
  )
}

export default AreanaRating
