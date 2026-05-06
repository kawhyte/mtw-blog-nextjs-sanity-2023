import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'

import { Progress } from '@/components/ui/progress'

import PostDate from './PostDate'

/**
 * Get random subset of arenas without duplicates
 * Uses Fisher-Yates shuffle for true randomness
 * @param arenas - Array of all arenas
 * @param count - Number of random arenas to select (default: 12)
 * @returns Random subset of arenas
 */
const getRandomArenas = (arenas: any[], count: number = 12) => {
  // Create a copy to avoid mutating original array
  const shuffled = [...arenas]

  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, Math.min(count, arenas.length))
}

function ReviewHeader({ title, arenas, summary, animation }) {
  const filteredList = arenas.filter((item) => item.visited === true)

  // Memoize random arena selection to prevent re-shuffling on re-renders
  const displayArenas = useMemo(() => getRandomArenas(arenas, 12), [arenas])

  const arenaLastVisited = filteredList.sort(function (a, b) {
    return new Date(b.date).valueOf() - new Date(a.date).valueOf()
  })

  const percentage = ((filteredList.length / arenas.length) * 100).toFixed(0)

  return (
    <div className="mb-10 flex flex-col items-center  justify-center bg-indigo-50 pt-10  lg:flex-row">
      <div className="container mx-auto">
        <section className="body-font text-gray-600">
          <div className=" flex flex-col items-center px-5 py-7 ">
            <div className="grid max-w-4xl grid-cols-6 md:grid-cols-9 lg:grid-cols-12 place-content-center place-items-center gap-2">
              {displayArenas.map((item, index: number) => {
                // asset is dereferenced in query (_id present, _ref absent) — pass full image object
                const imageObj = item?.firstGalleryImage || item?.arenaImage
                let src: string | null = null
                if (imageObj?.asset?._id) {
                  try {
                    src = urlForImage(imageObj)
                      .height(64)
                      .width(64)
                      .fit('crop')
                      .format('webp')
                      .quality(85)
                      .url()
                  } catch (error) {
                    console.warn('Error creating image URL:', error)
                  }
                }
                const lqip = imageObj?.asset?.metadata?.lqip

                return (
                  <div key={item._id || item.name}>
                    {src ? (
                      <Image
                        width={64}
                        height={64}
                        loading={index < 6 ? 'eager' : 'lazy'}
                        sizes="64px"
                        placeholder={lqip ? 'blur' : 'empty'}
                        blurDataURL={lqip}
                        className="object-cover object-center w-16 h-16 rounded-full"
                        alt={`${item.name} arena`}
                        src={src}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                        {item.name?.substring(0, 3) || 'NBA'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex max-w-4xl flex-col items-center justify-center pt-8 text-center align-middle   md:items-start lg:grow  ">
              <Link href={''}> </Link>

              <h1 className="font-oswald container mx-auto  mb-1  font-heading text-4xl font-bold leading-tight tracking-tighter text-pink-500 sm:px-0  md:text-[4.3rem]">
                {title}
              </h1>
              <div className="container mx-auto flex flex-col items-center">
                <p className="mb-8  mt-4 max-w-2xl leading-relaxed">
                  {' '}
                  {summary}
                </p>

                {arenas.length > 1 && (
                  <div className=" container mx-auto    mb-8 md:w-full md:pr-6 lg:mb-0 lg:max-w-xl group ">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-lg border-4 border-black p-6">
                      <h2 className="title-font mb-1 text-sm font-medium tracking-widest">
                        ARENA LAST VISITED
                      </h2>

                      <Link href={`/arena/${arenaLastVisited[0].slug}`}>
                        <h1 className="mb-4  border-gray-200 text-5xl leading-none text-gray-900 group-hover:text-gray-600 group-hover:underline decoration-pink-500 decoration-dashed decoration-4">
                          {arenaLastVisited[0]?.name}
                        </h1>
                      </Link>
                      <div className="mb-4 flex flex-col md:flex-row items-center gap-y-3   justify-around border-b border-gray-200 pb-4 align-middle text-base leading-none text-gray-500">
                        <div className="flex items-center align-middle">
                          <FaRegCalendarAlt className="ml-1 mr-2 h-4 w-5   " />
                          <p className=" pr-2 text-sm ">
                            <PostDate dateString={arenaLastVisited[0]?.date} />
                          </p>
                        </div>
                        <div className="flex items-center align-middle">
                          <IoLocationOutline className="h-5 w-5" />
                          <p className="ml-2 text-sm">
                            {arenaLastVisited[0]?.location}
                          </p>
                        </div>
                      </div>

                      <div className="  ">
                        <div className="mt-2 flex flex-row  justify-between">
                          <span className=" mb-2 text-sm  font-medium text-gray-500 ">
                            We&apos;ve visited{' '}
                            <span className=" font-black text-pink-500">
                              {' '}
                              {filteredList.length} of {arenas.length}{' '}
                            </span>{' '}
                            arenas so far
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-x-2">
                          <div className=" h-3 w-full rounded-full ">
                            <Progress
                              value={parseInt(percentage)}
                              className="h-4 rounded-lg bg-gray-200"
                            />
                          </div>
                          <div className="text-xs"> {percentage}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ReviewHeader
