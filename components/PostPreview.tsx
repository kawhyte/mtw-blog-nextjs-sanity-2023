import { inter, oswald } from 'app/fonts'
import Date from 'components/PostDate'
import { categoryRating } from 'lib/getHotelCategory'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { IoLocation } from 'react-icons/io5'

import CoverImage from './CoverImage'

export default function PostPreview({
  title,
  coverImage,
  date,
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

  return (
    <>
      <div
        className={
          `group z-10  w-full max-w-sm overflow-hidden shadow-md rounded-3xl border-4 border-black    bg-white  duration-300 dark:bg-gray-50 ` 
          
        }
      >
        <div className="mb-5">
          <CoverImage
            slug={slug}
            title={''}
            image={coverImage}
            priority={false}
            category={category}
          />
        </div>

        <Link
          href={`/posts/${slug}`}
          className={`${inter.variable} title-font  font-secondary mt-3 font-light text-gray-700 `}
        >
          <div className="mx-4 my-4 mb-6 mt-1 flex flex-col ">
            <h1
              className={`${oswald.variable}  h-14   line-clamp-2 font-heading text-lg font-medium text-gray-700 no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline  `}
            >
              {title}
            </h1>

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
        </Link>
      </div>
    </>
  )
}
