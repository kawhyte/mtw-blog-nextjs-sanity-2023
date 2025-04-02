import { inter } from 'app/fonts';
import Date from 'components/PostDate';
import type { Post } from 'lib/sanity.queries'; // Make sure Post type is correctly imported
import Link from 'next/link';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoLocation } from 'react-icons/io5';
// Removed Button import as it wasn't used in the final JSX provided
// import Button from 'ui/Button';

import CoverImage from './CoverImage'; // Assuming CoverImage component exists

// Define props for PostPreview, omitting _id maybe not needed if Post already excludes it?
// Using Pick might be clearer if you only need specific fields from Post
// interface PostPreviewProps extends Omit<Post, '_id'> {}
// Or define explicitly:
interface PostPreviewProps {
  title?: Post['title'];
  coverImage?: Post['coverImage'];
  hotelRating?: Post['hotelRating'];
  foodRating?: Post['foodRating'];
  takeoutRating?: Post['takeoutRating'];
  linkType?: Post['linkType'];
  diningType?: Post['diningType'];
  date?: Post['date'];
  showRating?: boolean; // Assuming this comes from somewhere or is part of Post
  slug?: Post['slug']; // Assuming slug is a string after projection
  location?: Post['location'];
  author?: Post['author'];
  excerpt2?: Post['excerpt2'];
  category?: Post['category'];
}


const getLinkPrefix = (linkType?: Post['linkType']): string => {
  switch (linkType) {
    case 'hotel':
      return '/hotel';
    case 'story':
      return '/guide';
    case 'food':
      return '/food';
    default:
      // Fallback link prefix if linkType is undefined or doesn't match
      return '/posts';
  }
};

// Updated getRating function with correct return type and existence checks
const getRating = (
  linkType?: Post['linkType'],
  diningType?: Post['diningType'],
  hotelRating?: Post['hotelRating'],
  foodRating?: Post['foodRating'],
  takeoutRating?: Post['takeoutRating'],
): // Corrected Return Type Annotation:
  | Post['hotelRating']   // Keep hotel rating type
  | Post['foodRating']    // Keep food rating type
  | Post['takeoutRating'] // *** ADD the takeout rating type ***
  | undefined => {         // Keep undefined for the default return
                           // 'number' type removed as it didn't match object structures
  if (linkType === 'hotel' && hotelRating) {
    // Only return if hotelRating object exists
    return hotelRating;
  }
  if (linkType === 'food') {
    // Check for takeout first if that's the priority
    if (diningType === 'takeout' && takeoutRating) {
       // Only return if takeoutRating object exists
      return takeoutRating; // Now matches the updated return type
    }
    // Check for dine-in food rating
    // (Optional: be more specific like diningType === 'dinein')
    if (foodRating) { // Add check for dinein type if necessary: diningType === 'dinein' && foodRating
       // Only return if foodRating object exists
      return foodRating;
    }
  }
  // Default case if no relevant rating is found
  return undefined;
};


// The PostPreview Component
const PostPreview = ({
  title,
  coverImage,
  hotelRating,
  foodRating,
  takeoutRating,
  linkType, // Removed default 'test' as it might hide type issues
  diningType,
  date,
  showRating, // Pass this down to CoverImage
  slug,
  location,
  category
}: PostPreviewProps) => {
  // Default slug handling might be needed if it can be undefined/null
  const safeSlug = slug ?? '';
  const href = `${getLinkPrefix(linkType)}/${safeSlug}`;

  // Get the relevant rating object based on type
  const currentRating = getRating(
    linkType,
    diningType,
    hotelRating,
    foodRating,
    takeoutRating,
  );

  // Prevent rendering if essential data like slug or title is missing
  if (!safeSlug || !title) {
    // Optionally log an error or return a placeholder
    console.warn("PostPreview skipped rendering due to missing slug or title", { slug, title });
    return null;
  }

  return (
    // Consider using <Link href={href}> wrapping the whole card for better UX
    <div className="group z-10 w-[18.5rem] sm:w-[17.5rem] md:w-[20rem] lg:w-[18.9rem] 2xl:w-[20.5rem] max-w-sm overflow-hidden rounded-3xl border-4 border-black bg-white shadow-md duration-300 dark:bg-gray-50">
      <div className="mb-5">
        {/* Ensure CoverImage accepts the union type for 'rating' */}
        <CoverImage
          slug={safeSlug} // Pass the safe slug
          title={title} // Pass title for alt text
          image={coverImage}
          priority={false} // Previews are usually not priority
          rating={currentRating} // Pass the determined rating object/undefined
          showRating={showRating} // Pass down showRating prop
          linkType={linkType}     // Pass down linkType if CoverImage needs it
          diningType={diningType} // Pass down diningType if CoverImage needs it
          category={category}
        />
      </div>

      <div className="mx-4 mb-2 mt-1 flex flex-col pb-3">
        <div>
          <Link
            href={href}
            className={`${inter.variable} title-font font-secondary mt-3 font-light text-gray-700`}
          >
            {/* Added hover effect directly to the heading */}
            <h1 className="font-montserrat font-bold text-gray-900 sm:text-xl lg:text-xl line-clamp-2 h-14 font-heading text-lg no-underline decoration-pink-500 decoration-dashed decoration-4 group-hover:underline">
              {title}
            </h1>
          </Link>

          <div className="mt-3 flex flex-col items-start justify-between gap-y-2">
            {location && (
              <div className="flex items-center gap-x-2 text-sm text-gray-500">
                <IoLocation className="h-5 w-5 flex-shrink-0 text-pink-500" />
                <p className="line-clamp-1">{location}</p>
              </div>
            )}

            {date && (
              <div className="flex items-center gap-x-2 text-sm text-gray-500">
                <FaRegCalendarAlt className="h-5 w-5 flex-shrink-0 text-pink-500" />
                <Date dateString={date} />
              </div>
            )}
          </div>
        </div>

        {/* Button section commented out as per original provided JSX */}
        {/* <div className="self-end mt-4 text-sm z-40 flex flex-row items-center rounded-lg px-2 py-1">
          <Button iconSize={10} noBorder={false} size="xs" link={href}>
            View Details
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default PostPreview;