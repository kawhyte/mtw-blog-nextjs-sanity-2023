import { urlForImage } from 'lib/sanity.image'
import { CalendarCheck, MapPin } from 'lucide-react'
import Image from 'next/image'

import { Skeleton } from '@/components/ui/skeleton'

import PostDate from './PostDate'
import RatingBadge from './RatingBadge'

interface NBAArenaCardProps {
  arenaImageSrc: any
  arenaName: string
  alt: string
  constructionDate: string
  capacity: number
  location: string
  dateVisited: string
  visited: boolean
  // visitedCount:string;
  // galleryCount:string;
  gallery: any
  id: string
  averageRating: string
  textRating: string
  ratingColor: string
  arenaReview?: any | null
  rank: number
  // ratings: ArenaRating;
}

const Arenas = ({
  location,
  id,
  visited,
  arenaName,
  alt,

  dateVisited,
  arenaImageSrc,

  averageRating,
  textRating,
  ratingColor,
  rank,
}: NBAArenaCardProps) => {
  return (
    <>
      <div
        key={id}
        className={`group relative  w-full  max-w-sm overflow-hidden rounded-3xl border-4 border-black  bg-indigo-50 text-gray-700 shadow-offsetIndigo transition-transform duration-500 ease-in-out   ${
          visited === false ? 'opacity-40 grayscale  ' : 'grayscale-0 '
        }  `}
      >
        {rank && (
          <div className="absolute left-2 top-12 z-10 rounded-full bg-black bg-opacity-70 px-2 py-1 text-xs font-bold text-white md:left-2 md:top-2">
            {rank === 1 ? '🏆 Best Arena' : `#${rank}`}
          </div>
        )}

        <div className="relative ">
          {averageRating > '0' ? (
            <RatingBadge
              average={averageRating}
              textRating={textRating}
              color={ratingColor}
            />
          ) : null}
          <Skeleton className="absolute inset-0 h-full w-full rounded-md" />

          <Image
            src={
              arenaImageSrc.asset?._ref
                ? urlForImage(arenaImageSrc.asset?._ref)
                    .height(200)
                    .width(320)
                    .fit('crop')
                    .url()
                : 'https://fakeimg.pl/1240x801'
            }
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
            width={320}
            height={200}
            className="w-full object-cover object-center brightness-[0.85] "
            alt={alt}
            loading="lazy"
          />
        </div>

        <div className=" flex justify-between text-gray-700  ">
          <div className="ml-2 mt-1 flex flex-col sm:mb-2 sm:ml-4 sm:gap-y-2 ">
            <h1 className=" font-heading line-clamp-1 pt-1 font-montserrat text-lg font-bold text-gray-900  decoration-purple-500 decoration-dashed decoration-4 group-hover:underline sm:line-clamp-2 sm:h-8 sm:text-xl lg:text-xl  xl:pt-1.5">
              {arenaName}
            </h1>

            {/* Use items-center for vertical alignment */}
            <div className="mt-2  flex flex-col gap-2 sm:flex-row sm:items-center md:flex-col md:items-start">
              {/* Child 1: Location */}
              <div className="flex items-center gap-x-2 text-gray-500">
                <MapPin className="h-5 w-5 shrink-0 text-gray-500" />
                <p className="">{location}</p>
              </div>

              {/* Child 2: Badge container - Add ml-auto here */}
              {/* This div will now be pushed to the right */}
              <div className="sm:ml-auto md:-ml-5 ">
                {' '}
                {/* Add ml-auto */}
                <span className="flex items-end text-gray-500">
                  <CalendarCheck className="mr-2 h-5 w-5 sm:ml-5" />
                  {visited ? (
                    <>
                      <span className="mr-1 hidden  lg:block">Visited on</span>
                      <PostDate dateString={dateVisited} />
                    </>
                  ) : (
                    <p className=" italic"> Not Visited Yet</p>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* <hr className=" mx-2 my-3" /> */}

        <div className="container mx-auto mt-auto flex items-center pt-4 my-3">
          <button
            className={`mx-auto mb-2 inline-block rounded-md px-3 py-1 text-sm font-semibold transition-colors duration-150 ease-in-out ${
              visited
                ? 'bg-accent text-primary hover:bg-primary hover:text-primary-foreground'
                : 'cursor-not-allowed bg-muted text-muted-foreground'
            }`}
            disabled={!visited}
            aria-hidden="true"
          >
            {visited ? 'View Details' : 'Not Visited Yet'}
          </button>
        </div>
        {/* </div> */}
      </div>

      {/* </div> */}
    </>
  )
}

export default Arenas
