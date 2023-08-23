import { Blockquote } from '@mantine/core'
import { inter } from 'app/fonts'
import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import type { Post } from 'lib/sanity.queries'

import BodySectionSeparator from './body-section-separator'
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
  } = props

  return (
    <>
      <PostTitle>{title}</PostTitle>
      {/* <div className="hidden md:mb-12 md:block">
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div> */}

      <div className={` ${inter.variable} font-secondary flex flex-col justify-start align-middle md:flex-row`}>
        <div>
          <p className=" text-center  text-gray-700 md:text-left md:text-sm ">
            <span className="text-lg capitalize">
              {location ? location : ''}{' '}
            </span>
            {' '}
            <span className="ml-1 text-lg  text-gray-700">
              {linkType === 'hotel' || linkType === 'food'
                ? 'Visited '
                : 'Published on '}{' '}
              <Date dateString={date} />
            </span>
          </p>
          {room && (
            <p className=" text-center   text-gray-700  md:text-left md:text-lg">
              {linkType === 'hotel' ? `${room || 'test'}` : ''}{' '}
            </p>
          )}
        </div>

        {/* <ShareButtons shareURL={shareURL}></ShareButtons> */}
      </div>

      <div className="mb-8 sm:mx-0 md:mb-16">
        <CoverImagePost title={title} image={coverImage} priority slug={slug} gallery={gallery} />

        {excerpt2 && (
          <>
            <div>
              <div className={ `${inter.variable} font-secondary  my-8 max-w-7xl text-justify lg:text-lg` }>
                {/* {excerpt2} */}
                <Blockquote color="pink" cite="– Google">
                <PostBody content={excerpt2} />
                </Blockquote>
              </div>
            </div>
            <BodySectionSeparator />

            {/* {hotelRating && ( */}
              <div className=" mb-6 mt-4 block text-base md:mb-12">
                <StarRating
                  rating={hotelRating}
                  // amenities={amenities}
                  // categories={categories}
                  linkType={linkType}
                />
              </div>
           
            {/* } */}
            {/* {rating && (
				<div className=' block mt-4 text-base mb-6 md:mb-12'>
					<StarRating
						rating={rating}
						amenities={amenities}
						categories={categories}
						linkType={linkType}
					/>
				</div>
			)} */}
          </>
        )}
      </div>
      {/* <div className="mx-auto max-w-2xl">
        <div className="mb-6 block md:hidden">
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
        <div className="mb-6 text-lg">
          <Date dateString={date} />
        </div>
      </div> */}
    </>
  )
}
