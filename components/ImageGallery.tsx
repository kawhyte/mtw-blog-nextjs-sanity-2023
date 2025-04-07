// Suggested Filename: components/ImageGallery.tsx

import { urlForImage } from 'lib/sanity.image'; // Ensure this path is correct for your project
import Image from 'next/image';
import SectionTitle from './SectionTitle';

// --- Interfaces (Exported for potential reuse) ---

/**
 * Defines the expected shape of an image item from Sanity.
 * Adjust based on your actual Sanity schema if needed.
 */
export interface GalleryImage {
  _key?: string; // Sanity's unique key for array items
  alt?: string; // Alt text for the image
  asset?: {
    _ref: string;
    _type: 'reference';
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
      lqip?: string; // Low Quality Image Placeholder (blurDataURL)
    };
  };
  // Add any other custom fields associated with the image if needed
  // e.g., caption?: string;
}

/**
 * Defines the props accepted by the ImageGallery component.
 */
export interface ImageGalleryProps {
  /** The array of image objects to display. */
  images?: GalleryImage[];
  /** Optional title to display above the gallery. */
  title?: string;
  /** Optional class name for the main section container */
  className?: string;
}

// --- Reusable Component ---

function ImageGallery({ images, title, className }: ImageGalleryProps) {
  // Check if there are valid images to display
  const hasImages = images && images.length > 0;

  return (
    <section className={`body-font w-full ${className || ''}`}>
      <div className="mx-6 md:container md:mx-auto py-8 sm:py-12">
        {/* --- Title --- */}
        {title && (
<div className='pb-10'>

<SectionTitle header={title || "Photo Collage"} description={undefined} />

</div>
           
            
        //   <div className="mb-8 flex w-full flex-col text-start font-medium lg:mb-12">
        //     <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
        //       {title}
        //     </h2>
        //     {/* If you have a standard SectionTitle component, you could use it here instead: */}
        //     {/* <SectionTitle header={title} description={undefined} /> */}
        //   </div>
        )}

        {/* --- Masonry Grid Container --- */}
        {hasImages ? (
          <div
            className="
              columns-1 gap-4 space-y-4
              sm:columns-2
              md:columns-3
              lg:columns-4
              xl:columns-5
            "
          >
            {images.map((item, i) => {
              // Ensure item and asset exist before proceeding
              if (!item?.asset) {
                console.warn(`Gallery item at index ${i} is missing asset data.`);
                return null; // Skip rendering this item if asset is missing
              }

              const key = item._key || `gallery-item-${i}`;

              // Generate image URL
              const imageUrl = urlForImage(item)
                .width(800) // Adjust base width as needed for quality/performance trade-off
                .auto('format')
                .url();

              const imageAlt = item.alt || `Gallery image ${i + 1}`; // Fallback alt text

              // Get dimensions and blur data if available
              const imageWidth = item.asset.metadata?.dimensions?.width;
              const imageHeight = item.asset.metadata?.dimensions?.height;
              const blurData = item.asset.metadata?.lqip;

              return (
                <div key={key} className="break-inside-avoid group relative mb-4"> {/* Added mb-4 to ensure space-y works correctly */}
                  <Image
                    className="h-auto w-full rounded-lg object-cover shadow-md transition-shadow duration-300 group-hover:shadow-xl"
                    src={imageUrl}
                    alt={imageAlt}
                    width={imageWidth || 800} // Use fetched width or fallback
                    height={imageHeight || 600} // Use fetched height or fallback (adjust aspect ratio if needed)
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 18vw" // Refine based on your actual column layout and gaps
                    placeholder={blurData ? 'blur' : 'empty'}
                    blurDataURL={blurData}
                  />

                  {/* Optional Caption - uncomment/adjust if needed */}
                  {/* {item.alt && (
                    <span className="mt-2 block px-1 text-center text-xs text-gray-600 sm:text-sm">
                      {item.alt}
                    </span>
                  )} */}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">The gallery is currently empty.</p>
        )}
        {/* --- End Masonry Grid Container --- */}
      </div>
    </section>
  );
}

export default ImageGallery;