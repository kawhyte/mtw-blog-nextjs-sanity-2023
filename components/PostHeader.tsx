import { Alert, Blockquote, Skeleton } from '@mantine/core'
import { inter, oswald } from 'app/fonts'
import Avatar from 'components/AuthorAvatar'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import type { Post } from 'lib/sanity.queries'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { HiOutlineLightBulb } from 'react-icons/hi2'
import {
  IoBed,
  IoCalendarNumber,
  IoLocation,
  IoStorefront,
} from 'react-icons/io5'
import { LiaCrownSolid } from 'react-icons/lia'

import BodySectionSeparator from './body-section-separator'
import CoverImage from './CoverImage'
import CoverImagePost from './CoverImagePost'
import PostBody from './PostBody'
import StarRating from './StarRating'

export default function PostHeader(
  props: Pick<
    Post,
    | 'title'
    | 'coverImage'
    | 'date'
    | 'author'
    | 'slug'
    | 'location'
    | 'linkType'
    | 'room'
    | 'excerpt2'
    | 'hotelRating'
    | 'gallery'
    | 'category'
    | 'tip'
  >
) {
  const {
    title,
    coverImage,
    date,
    author,
    slug,
    location,
    linkType,
    room,
    excerpt2,
    hotelRating,
    gallery,
    category,
    tip,
  } = props

  return (
    <>
      <div className=" ml-3 pt-12 sm:ml-0 ">
        <PostTitle>{title}</PostTitle>
        {/* <div className="hidden md:mb-12 md:block">
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div> */}

        <div className={` max-w-4xl `}>
          <div className=" mt-3.5 grid w-full max-w-6xl   grid-cols-2 gap-4   text-sm md:mt-5 md:grid-cols-4 md:gap-4">
            <section className=" flex flex-row items-end text-gray-700 md:text-left ">
              <IoLocation className="mr-2 h-5 w-5 text-pink-500 " />
              {location && (
                <span className=" capitalize   ">
                  {location ? location : ''}{' '}
                </span>
              )}
            </section>

            <section className="flex flex-row items-end text-gray-700 md:text-left">
              {linkType === 'hotel' || linkType === 'food' ? (
                <FaRegCalendarAlt className="h-5 w-5 text-pink-500 " />
              ) : (
                <FaRegCalendarAlt className="h-5 w-5 text-pink-500 " />
              )}
              <span className="ml-2 text-gray-700 ">
                {' '}
                <Date dateString={date} />
              </span>
            </section>

            {category && (
              <section className="  flex flex-row items-end text-gray-700 md:text-left  ">
                <IoStorefront className="mr-2 h-5  w-5 text-pink-500" />
                <span className=" text-center  capitalize text-gray-700   md:text-left ">
                  {category} Hotel
                </span>
              </section>
            )}
            {room && (
              <section className=" flex flex-row items-end text-gray-700 md:text-left  ">
                <IoBed className="mr-2 h-5 w-5  text-pink-500" />

                <span className=" text-nowrap line-clamp-1 w-full capitalize    text-gray-700  md:text-left ">
                  {linkType === 'hotel' ? `${room || 'NA'}` : ''}
                </span>
              </section>
            )}
          </div>

          {/* <ShareButtons shareURL={shareURL}></ShareButtons> */}
        </div>
      </div>

      <div className="mb-8 sm:mx-0 md:mb-16">
        <CoverImagePost
          title={title}
          image={coverImage}
          priority
          slug={slug}
          gallery={gallery}
        />

        {excerpt2 && (
          <>
            <div>
              <div
                className={`${inter.variable} font-secondary  my-8 max-w-6xl text-justify lg:text-lg`}
              >
                {/* {excerpt2} */}
                <Blockquote color="pink">
                  <PostBody content={excerpt2} />
                </Blockquote>
              </div>
            </div>

            <BodySectionSeparator />
          </>
        )}

        {/* {hotelRating && ( */}
        <div className=" mx-6 my-6 block text-base md:mx-0 md:mb-12">
          <StarRating
            rating={hotelRating}
            // amenities={amenities}
            // categories={categories}
            linkType={linkType}
          />
        </div>

        {tip && (
          <>
      
            <div className="max-w-4xl rounded-lg border-l-4 border-green-500 bg-green-100 p-4 text-gray-600">
              <p
                className={`${oswald.variable} flex items-baseline text-center mb-2 font-heading text-2xl font-bold md:text-left md:text-2xl md:leading-none lg:text-2xl`}
              >
                Quick Tip
              </p>
              <p>
                <PostBody content={tip} />
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}
