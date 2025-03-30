import { inter } from 'app/fonts';
import Date from 'components/PostDate';
import type { Post } from 'lib/sanity.queries';
import Link from 'next/link';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoLocation } from 'react-icons/io5';
import Button from 'ui/Button';

import CoverImage from './CoverImage';

interface PostPreviewProps extends Omit<Post, '_id'> {}

const getLinkPrefix = (linkType?: PostPreviewProps['linkType']): string => {
  switch (linkType) {
    case 'hotel':
      return '/hotel';
    case 'story':
      return '/guide';
    case 'food':
      return '/food';
    default:
      return '/posts';
  }
};

const getRating = (
  linkType?: PostPreviewProps['linkType'],
  diningType?: PostPreviewProps['diningType'],
  hotelRating?: PostPreviewProps['hotelRating'],
  foodRating?: PostPreviewProps['foodRating'],
  takeoutRating?: PostPreviewProps['takeoutRating'],
):
  | {
      Value?: number;
      Gym?: number;
      Internet_Speed?: number;
      Service?: number;
      Room_Cleanliness?: number;
      Bed_Comfort?: number;
      Room_Amenities?: number;
      Pool?: number;
      Location?: number;
    }
  | {
      Flavor_and_Taste?: number;
      Food_Value?: number;
      Restaurant_Location?: number;
      Presentation_on_Plate?: number;
      Restaurant_Service?: number;
      Memorability?: number;
      Restaurant_Cleanliness?: number;
    }
  | number
  | undefined => {
  if (linkType === 'hotel' && hotelRating) {
    return hotelRating;
  }
  if (linkType === 'food') {
    if (diningType === 'takeout') {
      return takeoutRating;
    }
    if (foodRating) {
      return foodRating;
    }
  }
  return undefined;
};

const PostPreview = ({
  title,
  coverImage,
  hotelRating,
  foodRating,
  takeoutRating,
  linkType = 'test',
  diningType,
  date,
  showRating,
  slug,
  location,
  
}: PostPreviewProps) => {
  const href = `${getLinkPrefix(linkType)}/${slug}`;
  const currentRating = getRating(
    linkType,
    diningType,
    hotelRating,
    foodRating,
    takeoutRating,
  );

  return (
    <div className="group z-10 w-[18.5rem] sm:w-[17.5rem] md:w-[20rem] lg:w-[18.9rem] 2xl:w-[20.5rem]  max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-md duration-300 dark:bg-gray-50">
      <div className="mb-5">
        <CoverImage
          slug={slug}
          title=""
          image={coverImage}
          priority={false}
          rating={currentRating}
          showRating={showRating}
          linkType={linkType}
          diningType={diningType}
        />
      </div>

      <div className="mx-4 mb-2 mt-1 flex flex-col">
        <div>
          <Link
            href={href}
            className={`${inter.variable} title-font font-secondary mt-3 font-light text-gray-700`}
          >
            <h1 className="font-montserrat font-bold text-gray-900 sm:text-xl lg:text-xl line-clamp-2 h-14 font-heading text-lg no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline">
              {title}
            </h1>
          </Link>

          <div className="mt-3 flex flex-col items-start justify-between gap-y-2">
            {location && (
              <div className="flex gap-x-2 text-sm text-gray-500">
                <IoLocation className="h-5 w-5 text-pink-500" />
                <p className="line-clamp-1">{location}</p>
              </div>
            )}

            {date && (
              <div className="flex gap-x-2 text-sm text-gray-500">
                <FaRegCalendarAlt className="h-5 w-5 text-pink-500" />
                <Date dateString={date} />
              </div>
            )}
          </div>
        </div>

        <div className="self-end mt-4 text-sm z-40 flex flex-row items-center rounded-lg px-2 py-1">
          <Button iconSize={10} noBorder={false} size="xs" link={`/posts/${slug}`}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
