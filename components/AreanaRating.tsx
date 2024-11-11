import { Progress } from '@mantine/core'
import React from 'react'

function AreanaRating({rating, text}) {
  return (
    <div className=" grid grid-cols-2 w-full flex-row items-end align-bottom  ">
                  <p className="mr-6  text-start">{text}  </p>
                  <Progress
                    color="green"
                    radius="lg"
                    size="lg"
                    w={135}
                    h={8}
                    value={rating}
                  />
                </div>
  )
}

export default AreanaRating