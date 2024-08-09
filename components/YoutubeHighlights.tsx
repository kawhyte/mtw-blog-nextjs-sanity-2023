

import { oswald } from 'app/fonts'
import dynamic from 'next/dynamic'

import SectionTitle from './SectionTitle'

const ReactPlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})

let walking = [
  {
    url: 'https://youtu.be/ylK35CxiGtU',
  },
  {
    url: 'https://www.youtube.com/watch?v=2lOgqf0MDIQ',
  },
  {
    url: 'https://youtu.be/U1zTABvzInk',
  },
  {
    url: 'https://youtu.be/WOX5m1Z0DoY',
  },
  {
    url: 'https://youtu.be/YGXaztMYl3M',
  },
  {
    url: 'https://youtu.be/TietUAnVBoA',
  },
]

const YoutubeHighlights = () => {
  return (
    <div className="container mx-auto  rounded-xl   py-12 ">
      {/* <div className=" container mx-auto mb-10 flex w-full flex-wrap">
        <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
          <h1
            className={`${oswald.variable}  title-font  mb-2 font-heading text-2xl font-medium text-gray-900 sm:text-3xl`}
          >
            Featured Videos
          </h1>
          <div className="h-1 w-20 rounded bg-pink-500"></div>
        </div>
      </div> */}
      {/* <SectionTitle>{'Featured Videos'}</SectionTitle>
      <p className="pt-5 text-gray-700"> Walking Tour from our trips </p> */}

      <div className="grid-col-2   grid grid-cols-1 justify-items-center gap-9 rounded-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
        {walking.map((item) => (

          
          <div
            key={item.url}
            className=" w-full max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo dark:bg-gray-800"
          >
            <ReactPlayer
              className=""
              url={item.url}
              width={370}
              height={200}
              controls={false}
              light
              loop
              muted
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default YoutubeHighlights
