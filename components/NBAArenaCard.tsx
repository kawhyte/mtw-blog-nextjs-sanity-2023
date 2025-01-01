import { Badge } from '@mantine/core'
import { oswald } from 'app/fonts'
import calculateAverageRating from 'lib/calculateArenaRating'
import { urlForImage } from 'lib/sanity.image'
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
  visited: any
  // visitedCount:string
  // galleryCount:string
  gallery: any
  key: string
  arenaReview?: any
  // ratings: ArenaRating
}



const Arenas = ({
  location,
  key,
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
  return (
    <>
      <div
        key={key}
        className={` w-full  max-w-md overflow-hidden rounded-3xl border-4 border-black bg-white shadow-offsetIndigo dark:bg-gray-800  ${
          visited === false ? 'opacity-40 grayscale ' : 'grayscale-0 '
        } `}
      >
        <div className=" ">
          <div className="relative  md:h-full ">
            {average !== '0' ? (
              <div className=" absolute right-0 top-0  z-10 mb-4 mr-3  flex flex-col items-center justify-between ">
                <span className="  mt-1   text-xl font-bold text-white ">
                  {average}
                </span>

                <Badge
                  className=" z-30  flex flex-col"
                  size="md"
                  color={
                    average > '8' ? 'green' : average > '5' ? 'yellow' : 'red'
                  }
                >
                  {' '}
                  {textRating}
                </Badge>
              </div>
            ) : null}
            <div className="absolute  inset-x-0 top-20  z-10 ml-5 md:top-16 lg:top-20  ">
              <h1
                className={`${oswald.variable}  line-clamp-2 font-heading  text-xl font-medium text-gray-100 no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline xl:mb-3  `}
              >
                {arenaName}
              </h1>

              <div className="grid grid-cols-2  text-sm text-gray-200 md:text-xs lg:gap-y-2  lg:text-xs">
                <div className="my-4 flex items-center xl:my-0  ">
                  <IoHammer className="mr-2 h-5 w-5 text-pink-500  " />
                  <p className=" md:hidden xl:block ">Constructed in</p>
                  <p className="pl-1">
                    <PostYear dateString={constructionDate} />
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <FaUserGroup className="mr-1 h-5 w-5 text-pink-500 " />
                  <p className=" md:hidden xl:block ">Capacity:</p>
                  <p className="">{new Intl.NumberFormat().format(capacity)}</p>
                </div>
                {/* </div> */}

                <div className="flex items-end gap-x-2  text-gray-500">
                  <IoLocation className=" h-5 w-5 text-pink-500 " />
                  <p className="line-clamp-1 text-white ">
                    {' '}
                    {location ? location : ''}
                  </p>
                </div>

                {visited  ? (
                  <>
                    <div className="  flex flex-row items-end justify-start rounded-full align-middle ">
                      <FaRegCalendarAlt className="  h-5 w-5 text-pink-500    " />

                      <p className=" ml-2 md:hidden xl:block">Visited on </p>
                      <p className=" line-clamp-1 pl-2 pr-2  text-white">
                        <PostDate dateString={dateVisited} />
                      </p>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="bg-muted">
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
                className="w-full object-cover brightness-[0.35]  "
                height={502}
                width={203}
                alt={`${arenaName} arena`}
                loading='lazy'
              />
            </div>{' '}
            {/**/}
          </div>

          <div className=" mb-2 ml-6 mt-6 grid grid-cols-2  items-center  gap-y-1 align-middle text-xs font-bold  text-gray-700 dark:text-gray-200 md:text-xs lg:mt-20 xl:mt-3 ">
            <AreanaRating
              rating={arenaReview?.transportation}
              text={'Transportation'}
            />
            <AreanaRating
              rating={arenaReview?.walkability}
              text={'Walkability'}
            />
            <AreanaRating rating={arenaReview?.food} text={'Food options'} />
            <AreanaRating rating={arenaReview?.view} text={'Seat View'} />
            <AreanaRating rating={arenaReview?.vibes} text={'Arena Vibes'} />
            <AreanaRating
              rating={arenaReview?.seatComfort}
              text={'Seat Comfort'}
            />
          </div>
        </div>
        {arenaReview?.comments && (
          <div className="ml-6 mt-2 text-sm">
            <blockquote className="relative my-2 w-[500px] px-8 py-3 font-serif text-lg italic leading-relaxed text-gray-700">
              <span className="absolute left-[-20px] top-[-20px] text-6xl text-gray-500 before:block before:pl-4 before:content-['\201C']"></span>
              <p className="text-gray-400">{arenaReview?.comments}</p>
            </blockquote>
          </div>
        )}

        <div className="text-sm md:text-xs">
          <div className="mr-4 mt-2  border-t border-gray-500"></div>
          <h3 className=" ml-5 mt-4 text-sm  font-semibold text-gray-200  ">
            Team(s) Viewed
          </h3>
          <div className=" mx-3  flex flex-row flex-wrap justify-start gap-x-2 align-top   md:gap-x-6 ">
            {gallery?.map((photo) => (
              <div
                key={photo.name}
                className="  mb-3 mt-4 flex flex-col items-center justify-between pr-2 "
              >
                <div className="flex flex-row gap-x-3">
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
                    className=" h-10 w-10 rounded-full border-2 p-1 md:h-7 md:w-7   "
                    height={96}
                    width={96}
                    loading='lazy'
                    alt={`${photo.name} logo`}
                  />

                  <div className="flex flex-col ">
                    <p className="mx-1  cursor-pointer font-bold text-gray-700 dark:text-gray-200   ">
                      {photo.name}
                    </p>

                    {photo.played === true ? (
                      <div className="flex items-center">
                        <IoMdEye className="mx-1 h-6 w-6 text-green-300 md:h-4  md:w-4" />
                        <p className="my-1 cursor-pointer font-bold text-gray-400 dark:text-gray-400  ">
                          Watched
                        </p>
                      </div>
                    ) : (
                      <IoMdEyeOff className="mx-1 my-1 h-6 w-6 text-gray-300 md:h-4   md:w-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* </Container> */}
    </>
  )
}

export default Arenas
