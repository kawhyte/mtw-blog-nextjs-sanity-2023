import { Badge, Blockquote } from '@mantine/core'
import { oswald } from 'app/fonts'
import calculateAverageRating from 'lib/calculateArenaRating'
import { urlForImage } from 'lib/sanity.image'
import {
  Binoculars,
  Car,
  Check,
  Eye,
  EyeOff,
  Footprints,
  MapPin,
  Music,
  Pizza,
  Sofa,
  Users,
  Wrench,
} from 'lucide-react'
import { useState } from 'react'

import AreanaRating from './AreanaRating'
import PostDate, { PostYear } from './PostDate'

interface NBAArenaCardProps {
  arenaImageSrc: any
  arenaName: string
  constructionDate: string
  capacity: number
  location: string
  dateVisited: string
  visited: boolean
  // visitedCount:string;
  // galleryCount:string;
  gallery: any
  id: string
  arenaReview?: any | null
  // ratings: ArenaRating;
}

const Arenas = ({
  location,
  id,
  visited,
  arenaName,
  constructionDate,
  capacity,
  dateVisited,
  arenaImageSrc,
  gallery,
  arenaReview,
}: NBAArenaCardProps) => {
  const { average, textRating } = calculateAverageRating(arenaReview)
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <>
      <div
        key={id}
        className={`relative h-[33.0rem]  w-full max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo transition-transform duration-500 ease-in-out dark:bg-gray-800 sm:h-[31.4rem]  sm:max-w-md md:h-[33.9rem]  ${
          visited === false ? 'opacity-40 grayscale ' : 'grayscale-0 '
        } ${isFlipped ? 'rotate-y-180' : ''}`}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        {/* Front of the card */}
        <div
          className={`backface-hidden absolute inset-0 h-full w-full ${
            isFlipped ? 'hidden' : ''
          }`}
        >
          <div className="relative">
            {average > '0' ? (
              <div className="absolute right-4 top-2 z-30 flex w-[4.8rem] flex-col  items-center justify-center  rounded-2xl p-2">
                <h1
                  className={` mx-2 text-3xl font-black leading-tight tracking-tighter text-gray-100 sm:text-3xl md:text-left md:text-3xl md:leading-none lg:text-3xl`}
                >
                  {Number(average).toFixed(1)}
                </h1>

                <Badge
                  size="lg"
                  className="mt-1 flex flex-col"
                  variant="gradient"
                  gradient={
                    average > '9.3'
                      ? { from: '#228B22', to: '#228B22', deg: 105 }
                      : average >= '8.3'
                      ? { from: '#8b8422', to: '#8b8422', deg: 60 }
                      : average >= '7.0'
                      ? { from: 'yellow', to: '#FFA500', deg: 35 }
                      : average >= '6.0'
                      ? { from: 'pink', to: 'pink', deg: 35 }
                      : average >= '4'
                      ? { from: '#FF0000', to: '#FF0000', deg: 35 }
                      : { from: 'orange', to: 'red' }
                  }
                >
                  {textRating}
                </Badge>
              </div>
            ) : null}

            {arenaReview?.comments && (
              <Blockquote
                color="pink"
                className="absolute inset-x-3 bottom-2 z-30 text-white"
              >
                {arenaReview?.comments}
              </Blockquote>
            )}

            <img
              src={
                arenaImageSrc.asset?._ref
                  ? urlForImage(arenaImageSrc.asset?._ref)
                      .height(203)
                      .width(402)
                      .fit('crop')
                      .url()
                  : 'https://fakeimg.pl/1240x801'
              }
              className="w-full object-cover brightness-[0.55] md:h-56  "
              height={502}
              width={203}
              alt={`${arenaName} arena`}
              loading="lazy"
            />
          </div>

          <div className=" flex justify-between  ">
            <div className="mb-2 ml-4 mt-4 ">
              <h1
                className={`${oswald.variable}  line-clamp-2 font-heading text-2xl font-medium  text-gray-100 no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline sm:text-lg md:text-xl lg:text-xl xl:mb-3 xl:text-lg  `}
              >
                {arenaName}
              </h1>
            </div>
          </div>

          <div className="text-sm md:text-xs">
            <div className="flex flex-row justify-between text-white">
              <div className="my-3 ml-6 grid w-full grid-cols-2  items-center  gap-y-5  pb-2  align-middle text-xs  text-gray-700  dark:text-gray-200  md:text-xs">
                <div className=" flex w-32 flex-col items-center  gap-y-1.5 xl:my-0  ">
                  <p className=" text-sm font-bold">
                    <PostYear dateString={constructionDate} />
                  </p>
                  <Badge
                    color="green"
                    size="sm"
                    pr={9}
                    leftSection={<Wrench className="-mr-1 h-4" />}
                  >
                    Constructed
                  </Badge>
                </div>

                <div className=" flex w-32 flex-col items-center   gap-y-1.5 xl:my-0  ">
                  <p className=" text-sm font-bold">
                    {new Intl.NumberFormat().format(capacity)}
                  </p>
                  <Badge
                    color="green"
                    size="sm"
                    pr={9}
                    leftSection={<Users className="-mr-1 h-4 " />}
                  >
                    Capacity
                  </Badge>
                </div>

                <div className=" flex w-32  flex-col items-center   gap-y-1.5 xl:my-0  ">
                  <p className=" text-sm font-bold">
                    {location ? location : ''}
                  </p>
                  <Badge
                    color="green"
                    size="sm"
                    pr={9}
                    leftSection={<MapPin className="-mr-1 h-4 " />}
                  >
                    Location
                  </Badge>
                </div>

                {visited ? (
                  <div className=" flex w-32 flex-col items-center   gap-y-1.5 xl:my-0  ">
                    <p className=" text-sm font-bold">
                      <PostDate dateString={dateVisited} />
                    </p>
                    <Badge
                      color="green"
                      size="sm"
                      pr={9}
                      leftSection={<Check className="-mr-1 h-4 " />}
                    >
                      Visited
                    </Badge>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>

            <div className=" mt-4 border-t  border-gray-500 md:mt-0"></div>
            <h3 className=" ml-5 mt-5 text-sm  font-bold text-gray-200  ">
              Team(s) Viewed
            </h3>
            <div className=" mx-3  flex flex-row flex-wrap justify-start gap-x-7 align-top   md:gap-x-6 ">
              {gallery?.map((photo) => (
                <div
                  key={photo.name}
                  className="  mb-1 mt-4 flex flex-col items-center justify-between "
                >
                  <div className="flex flex-row">
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
                      className=" h-9 w-9 rounded-full  p-0.5 md:h-8 md:w-8   "
                      height={96}
                      width={96}
                      loading="lazy"
                      alt={`${photo.name} logo`}
                    />

                    <div className="flex flex-col text-xs ">
                      <p className="mx-2  cursor-pointer font-bold text-gray-700 dark:text-gray-200   ">
                        {photo.name}
                      </p>

                      {photo.played === true ? (
                        <div className="flex items-center">
                          <Eye className="mx-1 h-5 w-5 text-green-300 md:h-4  md:w-4" />
                          <p className="my-1 cursor-pointer text-[0.70rem] font-bold text-gray-400 dark:text-gray-400  ">
                            Watched
                          </p>
                        </div>
                      ) : (
                        <EyeOff className="mx-1 my-1 h-5 w-5 text-gray-300 md:h-4   md:w-4" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back of the card */}
        <div
          className={`backface-hidden rotate-y-180 absolute inset-0 h-full w-full transform ${
            isFlipped ? '' : 'hidden'
          }`}
        >
          {/* Add your additional data here */}
          <div className="flex h-full w-full flex-col items-center justify-center bg-gray-800">
            <p className="text-xl font-bold text-gray-200">Rating Breakdown </p>

            <div className=" my-3 grid w-full grid-cols-2 place-items-center  items-center pb-2 align-middle  text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs ">
              <AreanaRating
                rating={arenaReview?.transportation}
                text={'Transit to'}
                icon={<Car />}
              />
              <AreanaRating
                rating={arenaReview?.walkability}
                text={'Walkability'}
                icon={<Footprints />}
              />
              <AreanaRating
                rating={arenaReview?.vibes}
                text={'Vibes'}
                icon={<Music />}
              />
              <AreanaRating
                rating={arenaReview?.food}
                text={'Food Options'}
                icon={<Pizza />}
              />
              <AreanaRating
                rating={arenaReview?.view}
                text={'View from Seat'}
                icon={<Binoculars />}
              />
              <AreanaRating
                rating={arenaReview?.seatComfort}
                text={'Seat Comfort'}
                icon={<Sofa />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Arenas
