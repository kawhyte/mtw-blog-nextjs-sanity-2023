import { oswald } from 'app/fonts'
import dynamic from 'next/dynamic'
import React from 'react'

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
    <div className="container mx-auto py-12 px-6">
      <SectionTitle
        header="Featured Videos"
        description="A selection of walking tours and highlights from our trips. Click to watch our journey unfold!"
      />

      {/* Unified Grid for all videos */}
      <div className="grid grid-cols-1 gap-9 md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
        {walking.map((item, index) => (
          <div
            key={item.url}
            className={`w-full overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo dark:bg-gray-800 
            ${index === 0 ? 'md:col-span-2 lg:col-span-3' : ''} `}
          >
            <ReactPlayer
              url={item.url}
              width="100%"
              height="100%"
              className="aspect-video "
              controls={index === 0} // Only show controls for the featured video
              light={index !== 0} // Use light mode for all other videos
            />
            {index === 0 && (
              <h3
                className={`${oswald.variable} mt-4 text-xl font-medium text-gray-900`}
              >
                Featured Highlight
              </h3>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default YoutubeHighlights
