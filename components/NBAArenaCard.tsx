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
  FlipHorizontal2,
  Footprints,
  MapPin,
  Music,
  Pizza,
  RotateCcw,
  RotateCw,
  Sofa,
  Users,
  Wrench,
} from 'lucide-react'
import { useState } from 'react'
import Button from 'ui/Button'

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
}: NBAArenaCardProps) => {
  const { average, textRating } = calculateAverageRating(arenaReview)
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <>
      <div
        key={id}
        className={`relative h-[28.9rem] w-full  max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white text-gray-700 shadow-offsetIndigo transition-transform duration-500 ease-in-out  sm:h-[25.9rem]  sm:max-w-md md:h-[28rem] lg:h-[30.7rem]  ${
          visited === false ? 'opacity-40 grayscale ' : 'grayscale-0 '
        } ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        <button
          className="absolute bottom-3 right-4 z-40 flex flex-row items-center rounded-lg px-2 py-1  " // Added flex-col and items-center
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {isFlipped ? (
            <>
              <Button size="xs" icon={<RotateCcw size={20} />}>
                View Card Front
              </Button>
              {/* <FlipHorizontal2 size={20} />
              <span className="mt-1 ml-2 text-xs">View Card Front</span>{' '} */}
            </>
          ) : (
            <>
              <Button size="xs"  icon={<RotateCw size={20} />}>
                View Rating Details
              </Button>

              {/* <FlipHorizontal2 size={20} />
              <span className="mt-1 ml-2 text-xs">View Rating Details</span> */}
            </>
          )}
        </button>

        {/* Front of the card */}
        <div
          className={`backface-hidden absolute inset-0 h-full w-full ${
            isFlipped ? 'hidden' : ''
          }`}
        >
          <div className="relative">
            {average > '0' ? (
              <div className="absolute right-4 top-2 z-30 flex  flex-col  items-center justify-center  rounded-2xl bg-black bg-opacity-50 p-2">
                <h2
                  className={` mx-2 text-2xl font-black leading-tight tracking-tighter text-gray-100 sm:text-2xl md:text-left md:text-2xl md:leading-none lg:text-2xl`}
                >
                  {Number(average).toFixed(2)}
                </h2>

                <Badge size="md" className="mt-1 flex flex-col" color="violet">
                  {textRating}
                </Badge>
              </div>
            ) : null}

            <div className="absolute bottom-3 left-4 z-30 text-sm font-bold text-white">
              <div className="flex  flex-col gap-y-1">
                <div className=" flex  flex-row items-center  gap-y-1 xl:my-0  ">
                  {visited ? (
                    <div className=" flex  flex-col items-center   gap-y-1 xl:my-0  ">
                      {/* <p className=" text-sm font-bold">
                      <PostDate dateString={dateVisited} />
                    </p> */}
                      <Badge
                        color="green"
                        variant="filled"
                        size="sm"
                        pr={9}
                        leftSection={<Check className="-mr-1 h-4 " />}
                      >
                        Visited on <PostDate dateString={dateVisited} />
                      </Badge>
                    </div>
                  ) : (
                    ''
                  )}
                </div>

                <div className=" flex  flex-row items-center  gap-y-1 xl:my-0  ">
                  <p className=" text-sm font-bold"></p>
                  <Badge
                    color="violet"
                    variant="filled"
                    size="sm"
                    pr={9}
                    leftSection={<Wrench className="-mr-1 h-4" />}
                  >
                    Arena Constructed in{' '}
                    <PostYear dateString={constructionDate} />
                  </Badge>
                </div>
                <div className=" flex  flex-row items-center  gap-y-1 xl:my-0  ">
                  <p className=" text-sm font-bold"></p>
                  <Badge
                    color="blue"
                    variant="filled"
                    size="sm"
                    pr={9}
                    leftSection={<Wrench className="-mr-1 h-4" />}
                  >
                      Arena Capacity{' '}
                      {new Intl.NumberFormat().format(capacity)}
                  </Badge>
                </div>




          
              </div>
            </div>

            {/* {arenaReview?.comments && (
              <Blockquote
                color="gray"
                className="absolute inset-x-3 bottom-2 z-30 bg-black bg-opacity-50 text-sm text-white sm:text-xs md:text-base"
              >
                {arenaReview?.comments}
              </Blockquote>
            )} */}

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
              className="w-full object-cover brightness-[0.65] md:h-56  "
              height={502}
              width={203}
              alt={alt}
              loading="lazy"
            />
          </div>

          <div className=" flex justify-between text-gray-700  ">
            <div className="mb-2 ml-4 mt-4 ">
              <h1
                className={`${oswald.variable}  line-clamp-2 font-heading text-2xl font-medium   no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline sm:text-xl md:text-2xl lg:text-xl xl:mb-3 xl:text-2xl  `}
              >
                {arenaName} | {location}
              </h1>
            </div>
          </div>

          <div className="text-sm text-gray-700 md:text-xs">


          {/* {arenaReview?.comments && (
              <Blockquote
                color="gray"
                className="absolute  z-30  text-black bg-opacity-50 text-sm  sm:text-xs md:text-base"
              >
                {arenaReview?.comments}
              </Blockquote>
            )} */}



            {/* <div className="flex flex-row justify-between ">
              <div className="my-3 ml-6 grid w-full grid-cols-2  items-center  gap-y-5  pb-2  align-middle text-xs  text-gray-700 md:text-xs">
                <div className=" flex w-32 flex-col items-center  gap-y-1 xl:my-0  ">
                  <p className=" text-sm font-bold">
                    <PostYear dateString={constructionDate} />
                  </p>
                  <Badge
                    color="pink"
                    variant="filled"
                    size="sm"
                    pr={9}
                    leftSection={<Wrench className="-mr-1 h-4" />}
                  >
                    Constructed
                  </Badge>
                </div>

                <div className=" flex w-32 flex-col items-center   gap-y-1 xl:my-0  ">
                  <p className=" text-sm font-bold">
                    {new Intl.NumberFormat().format(capacity)}
                  </p>
                  <Badge
                    color="pink"
                    variant="filled"
                    size="sm"
                    pr={9}
                    leftSection={<Users className="-mr-1 h-4 " />}
                  >
                    Capacity
                  </Badge>
                </div>

                <div className=" flex w-32  flex-col items-center   gap-y-1 xl:my-0  ">
                  <p className=" text-sm font-bold">
                    {location ? location : ''}
                  </p>
                  <Badge
                    color="pink"
                    size="sm"
                    variant="filled"
                    pr={9}
                    leftSection={<MapPin className="-mr-1 h-4 " />}
                  >
                    Location
                  </Badge>
                </div>

                {visited ? (
                  <div className=" flex w-32 flex-col items-center   gap-y-1 xl:my-0  ">
                    <p className=" text-sm font-bold">
                      <PostDate dateString={dateVisited} />
                    </p>
                    <Badge
                      color="pink"
                      variant="filled"
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
            </div> */}

            <div className=" mt-4 border-t border-gray-500  text-gray-700 md:mt-0"></div>
            <h3 className=" ml-5 mt-5 text-sm  font-bold   ">Team(s) Viewed</h3>
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
                      className=" h-11 w-11 rounded-full bg-gray-200  p-0.5 sm:h-10 sm:w-10   md:h-11 md:w-11   "
                      height={96}
                      width={96}
                      loading="lazy"
                      alt={`${photo.name} logo`}
                    />

                    <div className="flex flex-col text-xs  md:text-sm ">
                      <p className="mx-2  cursor-pointer font-bold text-gray-700   ">
                        {photo.name}
                      </p>

                      {photo.played === true ? (
                        <div className="flex items-center">
                          <Eye className="mx-1 h-5 w-5 text-green-500 md:h-4  md:w-4" />
                          <p className="my-1 cursor-pointer text-[0.70rem] font-bold text-gray-700 ">
                            Watched
                          </p>
                        </div>
                      ) : (
                        <EyeOff className="mx-1 my-1 h-5 w-5 text-gray-500 md:h-4   md:w-4" />
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
          className={`backface-hidden rotate-y-180 absolute inset-0 h-full w-full transform text-gray-700 ${
            isFlipped ? '' : 'hidden'
          }`}
        >
          {/* Add your additional data here */}
          <div className="flex h-full w-full flex-col items-center justify-center ">
            <p className="text-xl font-bold">Arena Rating Breakdown </p>

            <div className=" my-2 grid w-full grid-cols-2 place-items-center  items-center pb-2 align-middle  text-xs font-bold text-gray-700  md:text-xs ">
              <AreanaRating
                rating={arenaReview?.transportation}
                text={'Transit to Arena'}
                icon={<Car className="text-pink-500" />}
              />
              <AreanaRating
                rating={arenaReview?.walkability}
                text={'Walkability'}
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
                text={'View from Seat'}
                icon={<Binoculars className="text-pink-500" />}
              />
              <AreanaRating
                rating={arenaReview?.seatComfort}
                text={'Seat Comfort'}
                icon={<Sofa className="text-pink-500" />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Arenas
