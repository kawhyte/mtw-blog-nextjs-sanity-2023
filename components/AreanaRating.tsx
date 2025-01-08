import { Badge } from '@mantine/core'
import React from 'react'

function AreanaRating({ rating, text, icon }) {
  const formattedValue = rating?.toFixed(1)
  return (


<>


    <div className="p-4 flex items-center ">
    <div className="border-2 flex flex-col items-center border-gray-200 px-4 py-3 rounded-lg w-32">
      {/* <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
        <path d="M8 17l4 4 4-4m-4-5v9"></path>
        <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"></path>
      </svg> */}
      {icon}
      {/* <img alt='name' className='h-12 w-12' src={icon}/> */}

      <h2 className="title-font font-medium text-xl text-gray-200">{formattedValue ?formattedValue : "Pending" }</h2>
      <p className="leading-relaxed">{text}</p>
    </div>
  </div>


 



    {/* <div className="  mb-3 flex  w-full justify-between align-bottom text-sm   ">
      <div className="mb-1 flex w-full flex-col  items-center justify-between   ">
        <p className="mb-1  text-lg md:mr-0 md:pt-2  ">{formattedValue ?formattedValue : "Pending" }</p>

        <Badge size='sm' className=''>{text}</Badge> */}

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
      {/* </div>
    </div> */}
    </>
  )
}

export default AreanaRating
