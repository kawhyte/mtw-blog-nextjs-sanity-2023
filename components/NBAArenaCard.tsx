import { Badge, Blockquote, Skeleton } from '@mantine/core'
import { oswald } from 'app/fonts'
import RatingBadge from './RatingBadge'
import calculateAverageRating from 'lib/calculateArenaRating'
import { urlForImage } from 'lib/sanity.image'
import {
  Binoculars,
  Calendar,
  CalendarCheck,
  Car,
  Check,
  Eye,
  EyeOff,
  FlipHorizontal2,
  Footprints,
  MapPin,
  Music,
  Pizza,
  RotateCcw,
  RotateCw,
  SeparatorHorizontal,
  Sofa,
  Users,
  Wrench,
} from 'lucide-react'
import { useState } from 'react'
import Button from 'ui/Button'
import Image from 'next/image'

import AreanaRating from './AreanaRating'
import PostDate, { PostYear } from './PostDate'

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
  // ratings: ArenaRating;
}

const Arenas = ({
  location,
  id,
  visited,
  arenaName,
  alt,
  constructionDate,
  capacity,
  dateVisited,
  arenaImageSrc,
  gallery,
  arenaReview,
  averageRating,
  textRating,
  ratingColor,
}: NBAArenaCardProps) => {
  // const { average, textRating, color } = calculateAverageRating(arenaReview)
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <>
      <div
        key={id}
        className={`relative h-[19.9rem] w-full  max-w-sm overflow-hidden rounded-3xl border-4 border-black  bg-indigo-50 text-gray-700 shadow-offsetIndigo transition-transform duration-500 ease-in-out  sm:h-[33.5rem]  sm:max-w-md md:h-[34rem] lg:h-[36.5rem] xl:h-[35rem]   ${
          visited === false ? 'opacity-40 grayscale ' : 'grayscale-0 '
        } ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* <button
          className="absolute bottom-3 right-4 z-40 flex flex-row items-center rounded-lg px-2 py-1  " // Added flex-col and items-center
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {isFlipped ? (
            <>
              <Button size="xs" icon={<RotateCcw size={20} />}>
                View Card Front
              </Button>
            
            </>
          ) : (
            <>
              <Button size="xs" icon={<RotateCw size={20} />}>
                View Details
              </Button>

            
            </>
          )}
        </button> */}

        {/* Front of the card */}
        <div
          className={`backface-hidden absolute inset-0 h-full w-full ${
            isFlipped ? 'hidden' : ''
          }`}
        >
          <div className="relative md:h-[219px] md:w-[350px]">
            {averageRating > '0' ? (
              <RatingBadge
                average={averageRating}
                textRating={textRating}
                color={ratingColor}
              />
            ) : null}
            <Skeleton
              visible
              className="absolute inset-0 h-full w-full rounded-md"
            />
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
              className="w-full object-cover brightness-[0.65] md:h-56  "
              alt={alt}
              loading="lazy"
            />
          </div>

          <div className=" flex justify-between text-gray-700  ">
            <div className="sm:mb-2 ml-2 sm:ml-4 mt-4 flex flex-col sm:gap-y-2 ">
              <h1 className=" font-montserrat pt-1 xl:pt-1.5 font-heading text-sm font-bold text-gray-900 no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline sm:text-xl lg:text-xl line-clamp-2 h-10 sm:h-16">
                {arenaName}
              </h1>

              {/* Use items-center for vertical alignment */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {/* Child 1: Location */}
                <p className="text-sm">{location}</p>

                {/* Child 2: Badge container - Add ml-auto here */}
                {/* This div will now be pushed to the right */}
                <div className="sm:ml-auto">
                  {' '}
                  {/* Add ml-auto */}
                  {
                    visited ? (
                      <span className="flex  text-sm">
                        {' '}
                        <CalendarCheck className="sm:ml-5 mr-2 h-5 w-5 text-green-500" />{' '}
                        <span className="mr-1 hidden sm:block"> Visited on</span>{' '}
                        <PostDate dateString={dateVisited} />
                      </span> // No need for nested flex here unless specifically required for badge alignment
                    ) : // <div>
                    //   <Badge color="indigo" variant="filled" size="sm" pr={9}>
                    //     Visited on <PostDate dateString={dateVisited} />
                    //   </Badge>
                    // </div>
                    // Render nothing, but the parent div with ml-auto still ensures spacing
                    null // Or simply omit the else block
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-3 hidden sm:block">
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="flex items-center">
                <Wrench className="mr-2 h-5 w-5 text-gray-500" />
                <span className="mr-1"> Constructed:</span>{' '}
                <PostYear dateString={constructionDate} />
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-500" />
                Capacity: {new Intl.NumberFormat().format(capacity)}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-700 md:text-xs ">
            <h3 className="hidden sm:block ml-3 mt-5 text-base   font-bold  ">
              Team(s) Viewed
            </h3>
            <div className="hidden  mx-3  sm:flex flex-row flex-wrap justify-start gap-x-7 align-top   md:gap-x-6 ">
              {gallery?.map((photo) => (
                <div
                  key={photo.name}
                  className="  mb-1 mt-4 flex flex-col items-center justify-between "
                >
                  <div className="flex flex-row items-center align-bottom">
                    <img
                      src={
                        photo?.asset?._ref
                          ? urlForImage(photo)
                              .height(86)
                              .width(86)
                              .fit('crop')
                              .url()
                          : 'https://dummyimage.com/96x96/000/aeb0d9.jpg&text=Image'
                      }
                      className=" h-11 w-11 rounded-full bg-gray-200  p-0.5 sm:h-10 sm:w-10   md:h-11 md:w-11 lg:h-9 lg:w-9 xl:h-11 xl:w-11"
                      height={96}
                      width={96}
                      loading="lazy"
                      alt={`${photo.name} logo`}
                    />

                    <div className="flex items-center align-bottom text-xs  md:text-sm ">
                      <p className="mx-1  text-sm   leading-none text-gray-500 sm:text-sm   ">
                        {photo.name}
                      </p>
                      {photo.played === true ? (
                        <div className="flex items-center">
                          <Eye className="mx-1 h-5 w-5 text-green-500 sm:h-3 sm:w-3 md:h-4  md:w-4" />
                          {/* <p className="my-2  text-[0.70rem] leading-none text-gray-500 ">
                            Watched
                          </p> */}
                        </div>
                      ) : (
                        <EyeOff className="mx-1 my-1 h-5 w-5 text-gray-500 sm:h-3 sm:w-3 md:h-4   md:w-4" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className=" mx-2 sm:mx-20 mt-4 " // Added flex-col and items-center
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {isFlipped ? (
                <>
                  <Button
                    size="xs"
                    align="center"
                    icon={<RotateCcw size={20} />}
                  >
                    View Card Front
                  </Button>

                  {/* <FlipHorizontal2 size={20} />
              <span className="mt-1 ml-2 text-xs">View Card Front</span>{' '} */}
                </>
              ) : (
                <>
                  <Button
                    size="xs"
                    align="center"
                    icon={<RotateCw size={20} />}
                  >
                    View Details
                  </Button>

                  {/* <FlipHorizontal2 size={20} />
              <span className="mt-1 ml-2 text-xs">View Rating Details</span> */}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Back of the card */}
        <div
          className={`backface-hidden rotate-y-180 absolute inset-0 h-full w-full transform text-gray-700 ${
            isFlipped ? '' : 'hidden'
          }`}
        >
          {/* Add your additional data here */}
          <div className="justify flex h-full w-full flex-col items-center ">
            <h2 className=" pt-6 text-xl font-bold">Arena Rating Breakdown </h2>
            {/* <p>Overall Rating: {Number(average).toFixed(2)}  </p> */}

            <div className=" mt-2 grid w-full grid-cols-1  items-center pb-2 align-middle  text-xs font-bold text-gray-700  md:text-xs ">
              <AreanaRating
                rating={arenaReview?.transportation}
                text={'Transit to Arena'}
                icon={<Car className="text-pink-500" />}
              />
              <AreanaRating
                rating={arenaReview?.walkability}
                text={'Walkability around the Arena'}
                icon={<Footprints className="text-pink-500" />}
              />
              <AreanaRating
                rating={arenaReview?.vibes}
                text={'Arena Vibes'}
                icon={<Music className="text-pink-500" />}
              />
              <AreanaRating
                rating={arenaReview?.food}
                text={'Food Options'}
                icon={<Pizza className="text-pink-500" />}
              />
              <AreanaRating
                rating={arenaReview?.view}
                text={'View from our Seat'}
                icon={<Binoculars className="text-pink-500" />}
              />
              <AreanaRating
                rating={arenaReview?.seatComfort}
                text={'Seat Comfort'}
                icon={<Sofa className="text-pink-500" />}
              />
            </div>

            <div
              className="   mx-20 " // Added flex-col and items-center
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {isFlipped ? (
                <>
                  <Button
                    size="xs"
                    align="center"
                    icon={<RotateCcw size={20} />}
                  >
                    View Card Front
                  </Button>

                  {/* <FlipHorizontal2 size={20} />
              <span className="mt-1 ml-2 text-xs">View Card Front</span>{' '} */}
                </>
              ) : (
                <>
                  <Button
                    size="xs"
                    align="center"
                    icon={<RotateCw size={20} />}
                  >
                    View Details
                  </Button>

                  {/* <FlipHorizontal2 size={20} />
              <span className="mt-1 ml-2 text-xs">View Rating Details</span> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Arenas
