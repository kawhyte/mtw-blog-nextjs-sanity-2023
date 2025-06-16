// src/components/PostPreview.tsx

import { inter } from 'app/fonts'; // Assuming fonts are correctly set up
import Date from 'components/PostDate';
import type { Post } from 'lib/sanity.queries'; // Make sure Post type is correctly imported
import Link from 'next/link';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoLocation } from 'react-icons/io5';

import CoverImage from './CoverImage'; // Assuming CoverImage component exists

// Define props for PostPreview
interface PostPreviewProps {
  title?: Post['title'];
  coverImage?: Post['coverImage'];
  hotelRating?: Post['hotelRating'];
  foodRating?: Post['foodRating'];
  takeoutRating?: Post['takeoutRating'];
  linkType?: Post['linkType'];
  diningType?: Post['diningType'];
  date?: Post['date'];
  showRating?: boolean;
  slug?: Post['slug'];
  location?: Post['location'];
  author?: Post['author']; // Included from original interface, though not used in JSX
  excerpt2?: Post['excerpt2']; // Included from original interface, though not used in JSX
  category?: Post['category'];
}

// Helper function to determine the link prefix based on post type
const getLinkPrefix = (linkType?: Post['linkType']): string => {
  switch (linkType) {
    case 'hotel':
      return '/hotel';
    case 'story':
      return '/guide';
    case 'food':
      return '/food';
    default:
      // Fallback link prefix
      return '/posts';
  }
};

// Updated getRating function to determine which rating object to use
const getRating = (
  linkType?: Post['linkType'],
  diningType?: Post['diningType'],
  hotelRating?: Post['hotelRating'],
  foodRating?: Post['foodRating'],
  takeoutRating?: Post['takeoutRating'],
): Post['hotelRating'] | Post['foodRating'] | Post['takeoutRating'] | undefined => {
  if (linkType === 'hotel' && hotelRating) {
    return hotelRating;
  }
  if (linkType === 'food') {
    if (diningType === 'takeout' && takeoutRating) {
      return takeoutRating;
    }
    if (foodRating) { // Assumes non-takeout is dine-in or fallback
      return foodRating;
    }
  }
  return undefined; // Default case
};


// The PostPreview Component - Modified for Grid Layout Compatibility
const PostPreview = ({
  title,
  coverImage,
  hotelRating,
  foodRating,
  takeoutRating,
  linkType,
  diningType,
  date,
  showRating,
  slug,
  location,
  category,
}: PostPreviewProps) => {
  // Ensure slug exists for link generation
  const safeSlug = slug ?? '';
  const href = `${getLinkPrefix(linkType)}/${safeSlug}`;

  // Get the relevant rating object
  const currentRating = getRating(
    linkType,
    diningType,
    hotelRating,
    foodRating,
    takeoutRating,
  );

  // Prevent rendering if essential data like slug or title is missing
  if (!safeSlug || !title) {
    console.warn('PostPreview skipped rendering due to missing slug or title', {
      slug,
      title,
    });
    return null;
  }

  return (
    // Main container: Removed fixed widths, added w-full, h-full, flex structure
    <div className="group z-10 flex h-full w-full  flex-col overflow-hidden rounded-3xl border-4 border-black bg-white shadow-md duration-300 dark:bg-gray-50">
      {/* Image container: Prevents shrinking */}
      <div className="flex-shrink-0"> {/* Removed mb-5 */}
        <CoverImage
          // Ensure CoverImage itself is responsive (e.g., w-full, aspect ratio)
          slug={safeSlug}
          title={title}
          image={coverImage}
          priority={false} // Previews are usually not priority LCP elements
          rating={currentRating}
          showRating={showRating}
          linkType={linkType}
          diningType={diningType}
          category={category}
        />
      </div>

      {/* Text content container: Takes remaining vertical space */}
      <div className="mx-2 mb-1 flex flex-grow flex-col pb-3">
        {/* Title/Details section: Also grows if needed */}
        <div className="flex-grow">
          <Link
            href={href}
            className={`${inter.variable} title-font font-secondary mt-3 font-light text-gray-700`}
            aria-label={`Read more about ${title}`}
          >
             {/* Title: Removed fixed width w-60, kept h-14 and line-clamp */}
                   <h1 className="font-montserrat pt-1 xl:pt-1.5  text-sm font-bold text-gray-900 no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline sm:text-lg lg:text-lg line-clamp-2 h-10 sm:h-16">
             {/* Ensure h-14 is appropriate for 2 lines of text at these font sizes */}
              {title}
            </h1>
          </Link>

          {/* Meta Info (Location, Date) */}
          <div className="mt-3 flex flex-col items-start justify-between gap-y-2 text-xs">
            {location && (
              <div className="flex items-center gap-x-2 text-gray-500">
                <IoLocation
                  className="h-5 w-5 flex-shrink-0 text-pink-500"
                  aria-hidden="true"
                />
                <p className="line-clamp-1">{location}</p>
              </div>
            )}

            {date && (
              <div className="flex items-center gap-x-2 text-gray-500">
                <FaRegCalendarAlt
                  className="h-5 w-5 flex-shrink-0 text-pink-500"
                  aria-hidden="true"
                />
                <Date dateString={date} />
              </div>
            )}
          </div>
        </div>

        {/* Placeholder for potential Button section */}
        {/* If a button was here, adding mt-auto to this div could push it down */}
        {/* <div className="mt-auto self-end"> ... Button ... </div> */}
      </div>
    </div>
  );
};

export default PostPreview;