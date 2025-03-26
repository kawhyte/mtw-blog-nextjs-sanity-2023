import React from 'react'

interface RatingBadgeProps {
  average: string
  textRating: string
  color?: string
}

const RatingBadge = ({average, textRating, color}:RatingBadgeProps) => 
    {
  return (
    <div className="absolute right-4 top-2 z-30 flex  flex-col  items-center justify-center  rounded-2xl  bg-black p-2"
              style={{ backgroundColor: color, opacity: 0.7 }} 
              >
                <div className=" text-white">
                  <span className="ml-1 mr-1 font-montserrat text-xl font-black leading-tight tracking-tighter text-gray-900 sm:text-xl md:text-left md:text-2xl md:leading-none lg:text-xl">
                    {' '}
                    {Number(average).toFixed(2)}
                  </span>
                  {/* <span className='text-xs '>/5</span> */}
                </div>
                <hr className="z-50 my-0.5 h-0.5 w-full border-0 bg-gray-900 dark:bg-gray-900" />
               
               
               
                {/* <Badge
                  size="md"
                  className="text-md mt-1 flex flex-col font-montserrat"
                  color="violet"
                >
                  {textRating}
                </Badge> */}
                <p className="font-montserrat text-sm font-bold text-gray-900 ">
                  {' '}
                  {textRating}
                </p>
              </div>
  )
}

export default RatingBadge