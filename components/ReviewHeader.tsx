import { inter, oswald } from 'app/fonts' // Ensure fonts are correctly configured
import { urlForImage } from 'lib/sanity.image' // Note: urlForImage is imported but not used
import dynamic from 'next/dynamic'
import Image from 'next/image' // Note: Image is imported but not used
import React, { useEffect, useRef } from 'react' // Note: useEffect, useRef imported but not used
import { FaRegCalendarAlt } from 'react-icons/fa' // Note: FaRegCalendarAlt imported but not used
import { IoLocationOutline } from 'react-icons/io5' // Note: IoLocationOutline imported but not used

import { Progress } from '@/components/ui/progress' // Note: Progress is imported but not used in the provided JSX

import PostDate from './PostDate' // Note: PostDate imported but not used

// Dynamically import the Lottie Player component to avoid SSR issues
const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
)

// Define props for the component
interface ReviewHeaderProps {
  title: string
  summary: string
  img?: any // Prop for animation data/URL (currently unused in JSX below)
}

function ReviewHeader({ title, summary, img }: ReviewHeaderProps) {
  return (
    <div className="container mx-auto px-4 py-9 pb-16 sm:px-6 lg:px-8 max-w-7xl">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center px-5 pt-8 align-middle md:items-start lg:col-span-2">
          <h1
            className={`font-heading mb-1  font-oswald text-5xl font-bold leading-tight tracking-tighter text-pink-500 md:text-[4.3rem] lg:text-[4.7rem] ${oswald.variable}`} // Assuming oswald font variable is needed
          >
            {title}
          </h1>

          <p
            className={`mb-8 mt-4 max-w-xl leading-relaxed ${inter.variable}`} // Assuming inter font variable is needed
          >
            {summary}
          </p>
        </div>

        <div className="hidden items-center justify-center h-60 lg:col-span-2 lg:flex">
          <div className="w-full max-w-md h-60 flex items-center justify-center">
            <PlayerWithNoSSR
              autoplay
              keepLastFrame
              loop
              src={img}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewHeader
