import { oswald } from 'app/fonts'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})

let walking = [
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
    <div className="container mx-auto  my-12 rounded-xl bg-pink-50 px-10 py-12 ">
      <div className=" container mx-auto mb-10 flex w-full flex-wrap">
        <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
          <h1
            className={`${oswald.variable}  title-font  mb-2 font-heading text-2xl font-medium text-gray-900 sm:text-3xl`}
          >
            Featured Videos
          </h1>
          <div className="h-1 w-20 rounded bg-pink-500"></div>
        </div>
      </div>
      <div className="grid-col-2 grid justify-items-center gap-9 rounded-lg sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        {walking.map((item) => (
          <div key={item.url}>
            <ReactPlayer
              // className="react-player"
              url={item.url}
              width={451}
              height={297}
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
