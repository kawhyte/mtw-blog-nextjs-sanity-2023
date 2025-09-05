import { urlForImage } from 'lib/sanity.image' // Assuming this correctly generates image URLs from Sanity objects
import Image from 'next/image'

import SectionTitle from './SectionTitle' // Assuming this component is correctly defined

// Define the expected shape of an image item from Sanity gallery
// Adjust based on your actual Sanity schema if needed
interface GalleryImage {
  _key?: string // Sanity usually adds a unique _key
  alt?: string
  // Add other properties if necessary, e.g., asset dimensions if available
  asset?: {
    _ref: string
    _type: 'reference'
    // You might have metadata stored here via sanity-plugin-asset-source
    metadata?: {
      dimensions?: {
        width: number
        height: number
        aspectRatio: number
      }
      lqip?: string // Low Quality Image Placeholder (like the blurDataURL)
    }
  }
}

// Define the expected shape of the 'posts' prop
interface GalleryProps {
  posts?: {
    gallery?: GalleryImage[] // An array of image objects
  }
  heading?: string // Keep heading if used, though it's not in the current snippet usage
}

function Gallery({ posts, heading }: GalleryProps) {
  const images = posts?.gallery

  return (
    <section className="body-font w-full">
      <div className="mx-6 md:container md:mx-auto py-8 sm:py-12">
        {' '}
        {/* Added some vertical padding */}
        <div className="mb-8 flex w-full flex-col font-medium lg:mb-12">
          {' '}
          {/* Increased bottom margin */}
          {/* Using SectionTitle - Ensure it renders correctly */}
          <SectionTitle header={'Photo Collage'} description={undefined} />
          {/* Or a simple heading if SectionTitle isn't the focus: */}
          {/* <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
            Photo Collage
          </h2> */}
        </div>
        {/* --- Masonry Grid Container --- */}
        {images && images.length > 0 ? (
          <div
            className="
              columns-1 gap-4 space-y-4
              sm:columns-2
              md:columns-3
              lg:columns-4
              xl:columns-5
            "
            // `space-y-4` adds vertical space between items in the same column
            // `gap-4` adds horizontal space between columns
          >
            {images.map((item, i) => {
              // Prefer using Sanity's unique _key if available, otherwise fallback to index
              const key = item?._key || `gallery-item-${i}`

              // Generate image URL - adjust width/height as needed or remove if using fill/sizes
              const imageUrl = item?.asset // Check if item and asset exist before calling urlForImage
                ? urlForImage(item)
                    // Consider removing fixed width/height or adjusting based on column count
                    // For true masonry with variable heights, often better to only set width constraint
                    // or use next/image 'fill' prop with aspect ratio.
                    // Let's keep width for now as it was in original code.
                    .width(800) // Reduced width slightly, 1240 might be too large for smaller columns
                    .auto('format') // Use auto format (webp, avif, etc.)
                    .url()
                : '/placeholder.png' // Fallback image URL

              const imageAlt = item?.alt || 'Gallery image'

              // Get dimensions if available in metadata for next/image optimization
              const imageWidth = item?.asset?.metadata?.dimensions?.width
              const imageHeight = item?.asset?.metadata?.dimensions?.height
              const blurData = item?.asset?.metadata?.lqip // Use LQIP from Sanity if available

              return (
                <div key={key} className="break-inside-avoid group relative">
                  {' '}
                  {/* Item Wrapper */}
                  {/*
                    Using Next/Image:
                    - If you have width/height from Sanity, provide them for optimization.
                    - If not, you might need to use `fill` and control aspect ratio via CSS/parent div.
                    - Using a fixed width/height (like 1240/744) for ALL images might lead to
                      distortion or large empty spaces if aspect ratios vary wildly.
                    - Let's try providing dimensions if available, otherwise fallback.
                  */}
                  <Image
                    className="h-auto w-full rounded-lg object-cover shadow-md transition-shadow duration-300 group-hover:shadow-xl"
                    src={imageUrl}
                    alt={imageAlt}
                    // Provide width/height if known for better performance & less layout shift
                    width={imageWidth || 800} // Fallback width
                    height={imageHeight || 600} // Fallback height (adjust aspect ratio as needed)
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 18vw" // Example sizes prop - refine based on your column counts/gaps!
                    placeholder={blurData ? 'blur' : 'empty'} // Use blur only if LQIP is available
                    blurDataURL={blurData} // Use LQIP from Sanity
                    // Removed inline styles - use Tailwind classes
                  />
                  {/* Optional Caption */}
                  {item?.alt && (
                    <span className="mt-2 block px-1 text-center text-xs text-gray-600 sm:text-sm">
                      {item.alt}
                    </span>
                  )}
                  {/* Example of overlay caption on hover
                      <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                         <span className="text-xs font-medium text-white sm:text-sm">
                           {item.alt}
                        </span>
                       </div>
                      */}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            The gallery is currently empty.
          </p>
        )}
        {/* --- End Masonry Grid Container --- */}
      </div>
    </section>
  )
}

export default Gallery
