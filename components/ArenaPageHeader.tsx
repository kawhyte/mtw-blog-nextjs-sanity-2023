import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
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
  const shuffled = [...arenas]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, Math.min(count, arenas.length))
}

function ReviewHeader({ title, arenas, summary, animation }) {
  const filteredList = useMemo(
    () => arenas.filter((item) => item.visited === true),
    [arenas],
  )

  // Start with first 12 (stable for SSR), shuffle client-side after hydration
  const [displayArenas, setDisplayArenas] = useState<any[]>(() =>
    arenas.slice(0, 12),
  )
  useEffect(() => {
    setDisplayArenas(getRandomArenas(arenas, 12))
  }, [arenas])

  const arenaLastVisited = useMemo(
    () =>
      [...filteredList].sort(
        (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
      ),
    [filteredList],
  )

  const percentage =
    arenas.length > 0
      ? Math.round((filteredList.length / arenas.length) * 100)
      : 0

  return (
    <div className="mb-10 flex flex-col items-center justify-center bg-secondary-soft-background pt-10 lg:flex-row">
      <div className="container mx-auto">
        <section className="body-font text-foreground">
          <div className="flex flex-col items-center px-5 py-7">
            <div className="grid max-w-4xl grid-cols-6 place-content-center place-items-center gap-2 md:grid-cols-9 lg:grid-cols-12">
              {displayArenas.map((item, index: number) => {
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

                const imageEl = src ? (
                  <Image
                    width={64}
                    height={64}
                    loading={index < 6 ? 'eager' : 'lazy'}
                    sizes="64px"
                    placeholder={lqip ? 'blur' : 'empty'}
                    blurDataURL={lqip}
                    className="h-16 w-16 rounded-full object-cover object-center"
                    alt={`${item.name} arena`}
                    src={src}
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {item.name?.substring(0, 3) || 'NBA'}
                  </div>
                )

                if (item.visited && item.slug) {
                  return (
                    <Link
                      key={item._id || item.name}
                      href={`/arena/${item.slug}`}
                      title={item.name}
                      className="block rounded-full transition-all hover:-translate-y-1 hover:ring-2 hover:ring-primary ring-offset-2"
                    >
                      {imageEl}
                    </Link>
                  )
                }

                return (
                  <div key={item._id || item.name} className="opacity-60">
                    {imageEl}
                  </div>
                )
              })}
            </div>

            <div className="flex max-w-4xl flex-col items-center justify-center pt-8 text-center align-middle md:items-start lg:grow">
              <h1 className="container mx-auto mb-1 text-4xl font-bold leading-tight tracking-tighter text-primary sm:px-0 md:text-[4.3rem]">
                {title}
              </h1>

              <div className="container mx-auto flex flex-col items-center">
                <p className="mb-8 mt-4 max-w-2xl leading-relaxed">{summary}</p>

                {arenaLastVisited.length > 0 && (
                  <div className="container mx-auto mb-8 md:w-full md:pr-6 lg:mb-0 lg:max-w-xl">
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-4 border-border-bold bg-card p-6 shadow-brutalist transition-transform hover:-translate-y-1">
                      {/* Ghost link — entire card is the tap target */}
                      <Link
                        href={`/arena/${arenaLastVisited[0]?.slug}`}
                        className="absolute inset-0 z-10"
                      >
                        <span className="sr-only">
                          View {arenaLastVisited[0]?.name}
                        </span>
                      </Link>

                      <h2 className="title-font mb-1 text-sm font-medium tracking-widest text-muted-foreground">
                        ARENA LAST VISITED
                      </h2>

                      <h1 className="mb-4 text-5xl leading-none text-foreground group-hover:underline decoration-primary decoration-dashed decoration-4">
                        {arenaLastVisited[0]?.name}
                      </h1>

                      <div className="mb-4 flex flex-col items-center justify-around gap-y-3 border-b border-border pb-4 text-base leading-none text-muted-foreground md:flex-row">
                        <div className="flex items-center align-middle">
                          <FaRegCalendarAlt className="ml-1 mr-2 h-4 w-5" />
                          <p className="pr-2 text-sm">
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

                      <div>
                        <div className="mt-2 flex flex-row justify-between">
                          <span className="mb-2 text-sm font-medium text-muted-foreground">
                            We&apos;ve visited{' '}
                            <span className="font-black text-primary">
                              {filteredList.length} of {arenas.length}
                            </span>{' '}
                            arenas so far
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-x-2">
                          <div className="h-4 w-full overflow-hidden rounded-full border-2 border-border-bold shadow-brutalist-sm">
                            <Progress
                              value={percentage}
                              className="h-4 rounded-none"
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {percentage}%
                          </div>
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
