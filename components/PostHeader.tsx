import { Badge, Blockquote } from '@mantine/core';
import { inter, oswald } from 'app/fonts';
import Date from 'components/PostDate';
import PostTitle from 'components/PostTitle';
import type { Post } from 'lib/sanity.queries';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoBed, IoLocation, IoStorefront } from 'react-icons/io5';

import BodySectionSeparator from './body-section-separator';
import CoverImagePost from './CoverImagePost';
import PostBody from './PostBody';
import StarRating from './StarRating';

export default function PostHeader(
  props: Pick<
    Post,
    | 'title'
    | 'coverImage'
    | 'date'
    | 'slug'
    | 'location'
    | 'linkType'
    | 'diningType'
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
    slug,
    location,
    linkType,
    diningType,
    room,
    excerpt2,
    hotelRating,
    gallery,
    category,
    tip,
  } = props;

  return (
    <>
      <div className="pl-4  pt-5 md:pt-12 sm:ml-0">
        <PostTitle>{title}</PostTitle>

        <div className="max-w-4xl mt-2">
          <div className="grid grid-cols-2 gap-y-3 md:grid-cols-4">
            {(linkType === 'hotel' || linkType === 'food') && (
              <section className="flex flex-row items-center justify-start text-gray-700 md:text-left">
                <IoLocation className="mr-2 h-4 w-4 md:h-5 md:w-5 text-pink-500" />
                {location && (
                  <span className="capitalize text-sm">{location}</span>
                )}
              </section>
            )}

            <section className="flex flex-row items-center justify-start text-gray-700 md:text-left">
              <FaRegCalendarAlt className="mr-2 h-4 w-4 md:h-5 md:w-5 text-pink-500" />
              <span className="capitalize text-sm">
                <Date dateString={date} />
              </span>
            </section>

            {linkType === 'food' && (
              <Badge color="pink" variant="filled" size="lg">
                {diningType?.slice(0, 4) + '-' + diningType?.slice(4)}
              </Badge>
            )}

            {linkType === 'hotel' && category && (
              <section className="flex flex-row items-center justify-start text-gray-700 md:text-left">
                <IoStorefront className="mr-2 h-4 w-4 md:h-5 md:w-5 text-pink-500" />
                <span className="capitalize text-sm">
                  {category} Hotel
                </span>
              </section>
            )}

            {room && (
              <section className="flex flex-row items-center justify-start text-gray-700 md:text-left">
                <IoBed className="mr-2 h-5 w-5 md:h-5 md:w-5 text-pink-500" />
                <span className="text-nowrap line-clamp-1 md:line-clamp-none capitalize text-sm text-gray-700 md:text-left">
                  {linkType === 'hotel' ? `${room || 'NA'}` : ''}
                </span>
              </section>
            )}
          </div>
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
                className={`${inter.variable} font-secondary my-8 max-w-6xl text-justify lg:text-lg`}
              >
                <Blockquote color="pink">
                  <PostBody content={excerpt2} />
                </Blockquote>
              </div>
            </div>

            <BodySectionSeparator />
          </>
        )}

        {(linkType === 'hotel' || linkType === 'food') && (
          <div className="mx-6 my-6 block text-base md:mx-0 md:mb-12">
            <StarRating
              rating={hotelRating}
              diningType={diningType}
              linkType={linkType}
            />
          </div>
        )}

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
  );
}