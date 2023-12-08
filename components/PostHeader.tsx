import { Alert, Blockquote, Skeleton } from '@mantine/core'
import { inter } from 'app/fonts'
import Avatar from 'components/AuthorAvatar'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import type { Post } from 'lib/sanity.queries'
import { HiOutlineLightBulb } from 'react-icons/hi2'
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
      <div className=" pt-12 ml-3 sm:ml-0 ">
        <PostTitle>{title}</PostTitle>
        {/* <div className="hidden md:mb-12 md:block">
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div> */}

        <div
          className={` mt-1 flex flex-col justify-start align-middle leading-relaxed md:flex-row`}
        >
          <div>
            <section className=" text-gray-700 md:text-left md:text-base lg:text-lg ">
              {location && (
                <span className=" capitalize">
                  <span className=" text-pink-500  ">Location: </span>{' '}
                  {location ? location : ''}{' '}
                </span>
              )}
            </section>
            <section className="   text-pink-500 md:text-left  ">
              {linkType === 'hotel' || linkType === 'food'
                ? 'Date Visited: '
                : 'Published on '}
              <span className="text-gray-700">
                {' '}
                <Date dateString={date} />
              </span>
            </section>
            {room && (
              <section className=" text-pink-500 md:text-left  ">
                <span className=" text-center  text-pink-500    md:text-left ">
                  Room:{' '}
                </span>
                <span className=" text-center   text-gray-700  md:text-left ">
                  {linkType === 'hotel' ? `${room || 'test'}` : ''}{' '}
                </span>
              </section>
            )}

            {category && (
              <section className="  text-pink-500 md:text-left  ">
                <span className=" pr-1  text-center    text-pink-500  md:text-left">
                  Hotel Type:
                </span>
                <span className=" text-center  capitalize text-gray-700   md:text-left ">
                  {category}
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
                className={`${inter.variable} font-secondary  my-8 max-w-7xl text-justify lg:text-lg`}
              >
                {/* {excerpt2} */}
                <Blockquote color="pink">
                  <PostBody content={excerpt2} />
                </Blockquote>
              </div>
            </div>
            <BodySectionSeparator />

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
              {/* <Alert
                variant="light"
                color="yellow"
                className="  text-base md:text-xl  mx-6 sm:mx-0 text-sky-500 border-dashed border-2 border-sky-500 font-normal md:leading-relaxed"
                title={`Quick tip: `}
                icon={<HiOutlineLightBulb />}
              >
                <PostBody content={tip} />
              </Alert> */}
{/* 
<div className="flex flex-col rounded-lg  border-opacity-50 bg-gradient-to-b from-gray-100 via-gray-200 to-green-100 p-2 md:p-5  ">
<p> Quick Tip:</p>
<PostBody content={tip} />
</div> */}

<div className="flex flex-col w-full max-w-[1000px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
         <span><HiOutlineLightBulb className='text-indigo-400' /></span>
         <span className="text-md font-normal text-indigo-400">Quick Tip:</span>
      </div>
      <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white"><PostBody content={tip} /></p>
   
   </div>
</>
            )}

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
