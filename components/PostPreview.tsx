import { inter, oswald } from 'app/fonts'
import Date from 'components/PostDate'
import { categoryRating } from 'lib/getHotelCategory'
import type { Post } from 'lib/sanity.queries'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoLocation } from 'react-icons/io5'
import Button from 'ui/Button'

import CoverImage from './CoverImage'

export default function PostPreview({
  title,
  coverImage,
  hotelRating,
  foodRating,
  takeoutRating,
  linkType,
  diningType,
  date,
  showRating,
  excerpt2,
  category,
  author,
  slug,
  location,
}: Omit<Post, '_id'>) {
  const categoryType = categoryRating(category)
  const colorVariants = {
    blue: 'shadow-offsetBlue',
    yellow: '',
    green: 'shadow-offsetGreen',
    red: 'shadow-offsetRed',
  }

  let currentRating =
    linkType === 'food'
      ? diningType === 'takeout'
        ? takeoutRating
        : foodRating
      : hotelRating

  return (
    <>
    <div className="group z-10  w-full max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white    shadow-md  duration-300 dark:bg-gray-50 ">
  <div className="mb-5">
    <CoverImage
      slug={slug}
      title={''}
      image={coverImage}
      priority={false}
      category={category}
      rating={currentRating}
      showRating={showRating}
      // hotelRating={hotelRating}
      // foodRating={foodRating}
      linkType={linkType}
      diningType={diningType}
    />
  </div>

  <div className="mx-4  mb-2 mt-1 flex flex-col ">
    <div>
      <Link
        href={`/posts/${slug}`}
        className={`${inter.variable} title-font  font-secondary mt-3 font-light text-gray-700 `}
      >
        <h1
          className={`${oswald.variable}  line-clamp-2   h-14 font-heading text-lg font-medium text-gray-700 no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline  `}
        >
          {title}
        </h1>
      </Link>

      <div className="align-end mt-3 flex flex-col items-start justify-between gap-y-2">
        {location && (
          <div className="flex gap-x-2 text-sm text-gray-500">
            <IoLocation className=" h-5 w-5 text-pink-500 " />
            <p className="line-clamp-1 "> {location ? location : ''}</p>
          </div>
        )}

        {date && (
          <div className=" flex gap-x-2 text-sm text-gray-500 ">
            <FaRegCalendarAlt className=" h-5 w-5 text-pink-500   " />
            <Date dateString={date} />
          </div>
        )}
      </div>
    </div>

    <div className="self-end mt-4 text-sm z-40 flex flex-row items-center rounded-lg   px-2 py-1 "> 
<Button iconSize={10} noBorder={true} size='xs'  link={`/posts/${slug}`}>View Details</Button></div>
    {/* <button className="self-end mr-4 text-sm z-40 flex flex-row items-center rounded-lg border border-gray-300 px-2 py-1 text-gray-500 transition-colors duration-200 hover:bg-pink-200"> 
      View Details
    </button>  */}
  </div>
</div>
    </>
  )
}
