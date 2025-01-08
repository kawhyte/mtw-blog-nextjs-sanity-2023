import { Badge } from '@mantine/core'
import { oswald } from 'app/fonts'
import calculateAverageRating from 'lib/calculateArenaRating'
import { urlForImage } from 'lib/sanity.image'
import { Binoculars, Car,Eye, EyeOff, Footprints, Music,Pizza,RotateCw, Sofa } from 'lucide-react'
import { useState } from 'react'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FaUserGroup } from 'react-icons/fa6'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { IoHammer, IoLocation } from 'react-icons/io5'

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
        className={`relative h-[36.4rem] w-full max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo transition-transform duration-500 ease-in-out dark:bg-gray-800 sm:h-[36.4rem] md:h-[36.9rem]  ${
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
            <RotateCw className="absolute right-6 top-3 z-40 text-white" />
            {/* <div className="absolute right-4 top-4 z-30 ">
              {visited ? (
                <>
                  <div className="  flex flex-row items-end justify-start rounded-full align-middle  ">
                    
                    
                    <Badge>
                      Visited Arena on <PostDate dateString={dateVisited} />
                    </Badge>
                  </div>
                </>
              ) : (
                ''
              )}
            </div> */}

            {average > '0' ? (
              <div className="absolute bottom-3 right-6 z-30 flex w-[4.8rem] flex-col  items-center justify-center  rounded-2xl p-2">
                <h1
                  className={` mx-2 text-3xl font-black leading-tight tracking-tighter text-gray-100 sm:text-3xl md:text-left md:text-3xl md:leading-none lg:text-3xl`}
                >
                  {/*isFraction ? Math.floor(average) + ".5" : Math.floor(average)*/}
                  {Number(average).toFixed(1)}
                </h1>

                <Badge
                  size="lg"
                  className="flex flex-col mt-1"
                  variant="gradient"
                  gradient={
                    average > '8'
                      ? { from: 'teal', to: 'lime', deg: 105 }
                      : average > '6'
                      ? { from: '#FFD400', to: '#FED44B', deg: 60 }
                      : average > '4'
                      ? { from: '#ed6ea0', to: '#ec8c69', deg: 35 }
                      : { from: 'orange', to: 'red' }
                  }
                >
                  {textRating}
                </Badge>

                <div className="flex items-center text-sm font-black text-white">
                  {/* <span className=" text-sm uppercase text-white">out of 5</span>
            <span>
              <svg
                className="mb-1 ml-1 h-3 w-3  fill-current text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="3 3 18 18"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M20.83,9.15l-6-.52L12.46,3.08h-.92L9.18,8.63l-6,.52L2.89,10l4.55,4L6.08,19.85l.75.55L12,17.3l5.17,3.1.75-.55L16.56,14l4.55-4Z"></path>
              </svg>
            </span> */}
                </div>
              </div>
            ) : null}

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
              className="w-full object-cover brightness-[0.55] sm:h-56  "
              height={502}
              width={203}
              alt={`${arenaName} arena`}
              loading="lazy"
            />
          </div>

          <div className=" flex justify-between  ">
            <div className="mb-2 ml-4 mt-4 ">
              <h1
                className={`${oswald.variable}  line-clamp-2 font-heading  text-3xl font-medium  text-gray-100 no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline md:text-2xl lg:text-3xl xl:mb-3  `}
              >
                {arenaName}
              </h1>
            </div>
            <div className="  ">
              {average !== '0' ? (
                <div className="  right-0 top-0  z-10 mb-4 mr-5 mt-3   flex flex-row items-end justify-between ">
                  {/* <span className="    mb-1 text-xl font-bold text-white ">
                    {average}
                  </span> */}

                  {/* <div className="flex flex-col items-center justify-center rounded-2xl bg-pink-500 p-2">
          <h1
            className={` mx-2 text-2xl font-black leading-tight tracking-tighter text-white md:text-left md:text-6xl md:leading-none lg:text-6xl`}
          >
            
            {(average*10).toFixed(1)}%
          </h1>
          <div className="flex items-center text-white text-xl font-black">
          {textRating}
           
          </div>


        </div> */}

                  {/* <p className='ml-3 text-xl text-white'>{textRating}</p> */}

                  {/* <Badge
                    size="lg"
                    className='flex flex-col'
                    variant="gradient"
                    gradient={
                      average > '8'
                        ? { from: 'teal', to: 'lime', deg: 105 }
                        : average > '6'
                        ? { from: '#FFD400', to: '#FED44B', deg: 60 }
                        : average > '4'
                        ? { from: '#ed6ea0', to: '#ec8c69', deg: 35 }
                        : { from: 'orange', to: 'red' }
                    }
                  >
                  100  {textRating}
                  </Badge> */}
                </div>
              ) : null}
            </div>

            {/* <div>
            {visited ? (
              <>
                <div className="  flex flex-row items-end justify-start rounded-full align-middle ">
                  <p className=" ">Visited: </p>
                  <p className=" line-clamp-1 pl-1 pr-2  text-white">
                    <PostDate dateString={dateVisited} />
                  </p>
                </div>
              </>
            ) : (
              ''
            )}</div> */}

            {/* <div className="absolute inset-x-0 top-20   z-10 ml-3 md:top-24  ">
                <h1
                  className={`${oswald.variable}  line-clamp-2 font-heading  text-xl md:text-2xl  lg:text-3xl font-medium text-gray-100 no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline xl:mb-3  `}
                >
                  {arenaName}
                </h1>

                <div className="grid grid-cols-2   gap-x-2 text-sm   jus text-gray-200 md:text-xs  lg:gap-y-4  lg:text-xs ">
                  <div className="flex items-center gap-x-1 w-36 lg:w-full ">
                    <p className=" ">Location:</p>
                    <p className="line-clamp-1 text-white ">
                      {location ? location : ''}
                    </p>
                  </div>
                  <div className="my-4 flex jus xl:my-0  ">
                    <p className="  ">Constructed:</p>
                    <p className="pl-1">
                      <PostYear dateString={constructionDate} />
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <p className="  ">Capacity:</p>
                    <p className="">{new Intl.NumberFormat().format(capacity)}</p>
                  </div>

                  {visited ? (
                    <>
                      <div className="  flex flex-row items-end justify-start rounded-full align-middle ">
                        <p className=" ">Visited: </p>
                        <p className=" line-clamp-1 pl-1 pr-2  text-white">
                          <PostDate dateString={dateVisited} />
                        </p>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </div>
              </div> */}

            {/* <div className=" my-3 grid grid-cols-2  items-center  gap-y-1 align-middle text-xs font-bold  text-gray-700 dark:text-gray-200 md:text-xs  ">
              <AreanaRating rating={arenaReview?.transportation} text={'Transit to'} />
              <AreanaRating rating={arenaReview?.walkability} text={'Walkability'} />
              <AreanaRating rating={arenaReview?.vibes} text={'Vibes'} />
              <AreanaRating rating={arenaReview?.food} text={'Food Options'} />
              <AreanaRating rating={arenaReview?.view} text={'View from Seat'} />
              <AreanaRating rating={arenaReview?.seatComfort} text={'Seat Comfort'} />
            </div> */}
          </div>

          <div className="text-sm md:text-xs">
            <div className="flex flex-row justify-between text-white">
              <div className="my-3 ml-6 grid w-full grid-cols-2  items-center  gap-y-5  pb-2  align-middle text-xs  text-gray-700  dark:text-gray-200  md:text-xs">
                <div className=" flex w-32 flex-col items-center  gap-y-1.5 xl:my-0  ">
                  <p className=" text-sm font-bold">
                    <PostYear dateString={constructionDate} />
                  </p>
                  <Badge color="green" size="sm">
                    Constructed
                  </Badge>
                </div>

                <div className=" flex w-32 flex-col items-center   gap-y-1.5 xl:my-0  ">
                  <p className=" text-sm font-bold">
                    {new Intl.NumberFormat().format(capacity)}
                  </p>
                  <Badge color="green" size="sm">
                    Capacity
                  </Badge>
                </div>

                <div className=" flex w-32  flex-col items-center   gap-y-1.5 xl:my-0  ">
                  <p className=" text-sm font-bold">
                    {location ? location : ''}
                  </p>
                  <Badge color="green" size="sm">
                    Location
                  </Badge>
                </div>

                {visited ? (
                  <div className=" flex w-32 flex-col items-center   gap-y-1.5 xl:my-0  ">
                    <p className=" text-sm font-bold">
                      <PostDate dateString={dateVisited} />
                    </p>
                    <Badge color="green" size="sm">
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
                      className=" h-9 w-9 rounded-full border-2 p-1 md:h-7 md:w-7   "
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
                          <Eye className="mx-2 h-5 w-5 text-green-300 md:h-4  md:w-4" />
                          <p className="my-1 cursor-pointer font-bold text-gray-400 dark:text-gray-400  ">
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
            {/* ... more content */}

            <div className=" my-3 grid w-full grid-cols-2 place-items-center  items-center pb-2 align-middle  text-xs font-bold text-gray-700 dark:text-gray-200 md:text-xs ">
              <AreanaRating
                rating={arenaReview?.transportation}
                text={'Transit to'}
                icon={ <Car />}
              />
              <AreanaRating
                rating={arenaReview?.walkability}
                text={'Walkability'}
                icon={<Footprints />}
              />
              <AreanaRating rating={arenaReview?.vibes} text={'Vibes'}  icon={<Music />} />
              <AreanaRating rating={arenaReview?.food} text={'Food Options'}  icon={<Pizza />}/>
              <AreanaRating
                rating={arenaReview?.view}
                text={'View from Seat'}  icon={<Binoculars />}
              />
              <AreanaRating
                rating={arenaReview?.seatComfort}
                text={'Seat Comfort'}  icon={<Sofa/>}
              />
            </div>

            {/* <p className="text-xl font-bold text-gray-200 ">Arena Stats </p> */}

            {/* <div className="my-3 ml-6 grid w-full grid-cols-2  items-center  gap-y-3  pb-2  align-middle text-xs  text-gray-700  dark:text-gray-200  md:text-xs">
              
              
              
              <div className=" flex flex-col items-center  xl:my-0 w-28  ">
                <p className=" mb-1 text-base font-bold">
                  <PostYear dateString={constructionDate} />
                </p>
                <Badge color='green' size='sm'>Constructed</Badge>
              </div>

              <div className=" flex flex-col items-center  xl:my-0 w-28  ">
                <p className=" mb-1 text-base font-bold">
                {new Intl.NumberFormat().format(capacity)}
                </p>
                <Badge color='green' size='sm'>Capacity</Badge>
              </div>
              
              <div className=" flex flex-col items-center  xl:my-0 w-36  ">
                <p className=" mb-1 text-base font-bold">
                {location ? location : ''}
                </p>
                <Badge color='green' size='sm'>Location</Badge>
              </div>


              {visited ? (
              <div className=" flex flex-col items-center  xl:my-0 w-28  ">
                <p className=" mb-1 text-base font-bold">
                <PostDate dateString={dateVisited} />
                </p>
                <Badge color='green' size='sm'>Visited</Badge>
              </div>
               ) : (
                ''
              )} */}

            {/* <div className="flex items-center gap-1">
                <p className="  ">Capacity:</p>
                <p className="">{new Intl.NumberFormat().format(capacity)}</p>
              </div> */}
            {/* <div className="flex items-center gap-x-1 lg:w-full ">
                <p className=" ">Location:</p>
                <p className="line-clamp-1 text-white ">
                  {location ? location : ''}
                </p>
              </div> */}
            {/* {visited ? (
                <>
                  <div className="  flex flex-row items-end justify-start rounded-full align-middle ">
                    <p className=" ">Visited: </p>
                    <p className=" line-clamp-1 pl-1 pr-2  text-white">
                      <PostDate dateString={dateVisited} />
                    </p>
                  </div>
                </>
              ) : (
                ''
              )} */}
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  )
}

export default Arenas
