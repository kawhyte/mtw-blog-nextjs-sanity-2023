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
import CoverImage from './CoverImage'

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
        className={`relative group  w-full  max-w-sm overflow-hidden rounded-3xl border-4 border-black  bg-indigo-50 text-gray-700 shadow-offsetIndigo transition-transform duration-500 ease-in-out   ${
          visited === false ? 'opacity-40 grayscale  ' : 'grayscale-0 '
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
        {/* <div
          className={`backface-hidden absolute inset-0 h-full w-full ${
            isFlipped ? 'hidden' : ''
          }`}
        > */}
          <div className="relative ">
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
              className="w-full object-cover object-center brightness-[0.85] "
              alt={alt}
              loading="lazy"
            />
          </div>

          <div className=" flex justify-between text-gray-700  ">
            <div className="ml-2 mt-1 flex flex-col sm:mb-2 sm:ml-4 sm:gap-y-2 ">
              <h1 className=" font-heading line-clamp-1 pt-1 font-montserrat text-sm font-bold text-gray-900  decoration-pink-500 decoration-dashed decoration-4 group-hover:underline sm:line-clamp-2 sm:h-8 sm:text-xl lg:text-xl  xl:pt-1.5">
                {arenaName}
              </h1>

              {/* Use items-center for vertical alignment */}
              <div className="mt-2  flex flex-col gap-2 sm:flex-row md:flex-col sm:items-center md:items-start">
                {/* Child 1: Location */}
                <div className="flex items-center gap-x-2 text-gray-500">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-gray-500" />
                  <p className="text-xs">{location}</p>
                </div>

                {/* Child 2: Badge container - Add ml-auto here */}
                {/* This div will now be pushed to the right */}
                <div className="sm:ml-auto md:-ml-5 ">
                  {' '}
                  {/* Add ml-auto */}
                  <span className="flex items-end  text-xs text-gray-500">
                    <CalendarCheck className="mr-2 h-5 w-5 text-green-500 sm:ml-5" />
                    {visited ? (
                      <>
                        <span className="mr-1 hidden text-xs lg:block">
                          Visited on
                        </span>
                        <PostDate dateString={dateVisited} />
                      </>
                    ) : <p className=' italic'> Not Visited Yet</p>}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden space-y-4 p-3 3xl:block">
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
          <hr className=" mx-2 my-3" />
          <div className="text-sm text-gray-700 md:text-xs ">
            <h3 className="ml-3 text-xs sm:block     ">Team(s) Viewed</h3>
            <div className="  ml-2 mb-2 flex flex-row flex-wrap justify-start gap-x-4 align-top   md:gap-x-6 ">
              {gallery?.map((photo) => (
                <div
                  key={photo.name}
                  className="  mb-1 mt-2 flex flex-col items-start justify-between "
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
                      className=" h-7 w-7 rounded-full bg-gray-200  p-0.5 sm:h-7 sm:w-7  lg:h-6 lg:w-6 xl:h-8 xl:w-8"
                      height={96}
                      width={96}
                      loading="lazy"
                      alt={`${photo.name} logo`}
                    />

                    <div className="flex items-center align-bottom text-xs  lg:text-xs ">
                      <p className="mx-0.5 hidden text-xs  leading-none   text-gray-500 sm:block sm:text-xs   ">
                        {photo.name}
                      </p>
                      {photo.played === true ? (
                        <div className="flex items-center">
                          <Eye className="mx-1 h-4 w-4 text-green-500 sm:h-3 sm:w-3 md:h-3  md:w-3" />
                          {/* <p className="my-2  text-[0.70rem] leading-none text-gray-500 ">
                            Watched
                          </p> */}
                        </div>
                      ) : (
                        <EyeOff className="mx-1 my-1 h-4 w-4 text-gray-500 sm:h-3 sm:w-3 md:h-3   md:w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <div
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

                </>
              )}
            </div> */}
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

            {/* <div
              className="   mx-20 " 
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

               
                </>
              )}
            </div> */}
          </div>
        </div>
      {/* </div> */}
    </>
  )
}

export default Arenas
