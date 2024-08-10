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
          `w-full max-w-sm overflow-hidden rounded-3xl z-10 border-4 group duration-300     border-black bg-white shadow-offsetIndigo dark:bg-gray-50 ` +
          ` ${colorVariants[categoryType.color]}`
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
          <div className="mx-4 mb-6 mt-1 ">
            <h1
              className={`${oswald.variable}     line-clamp-2 no-underline group-hover:underline decoration-pink-500 decoration-4 decoration-dashed font-heading text-lg font-medium text-gray-700  `}
            >
              {title}
            </h1>

            <div className="align-start mt-3 flex flex-col items-start justify-between gap-y-2">
           {  location &&  <div className="flex gap-x-2 text-sm text-gray-500">
                <IoLocation className=" h-5 w-5 text-pink-500 " />
                <p className="line-clamp-1 "> {location ? location : ''}</p>
              </div>}

            { date &&  <div className=" flex gap-x-2 text-sm text-gray-500 ">
                <FaRegCalendarAlt className=" h-5 w-5 text-pink-500   " />

                <Date dateString={date} />
              </div>}
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}
