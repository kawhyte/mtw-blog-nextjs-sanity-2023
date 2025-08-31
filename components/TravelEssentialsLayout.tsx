import { Badge } from '@mantine/core' // Keep Mantine Badge as you're using it
// Removed Mantine Card, Group, Text, Image as we'll use divs and next/image primarily
// import { oswald } from 'app/fonts' // Keep if used elsewhere, otherwise optional for this component
import { urlForImage } from 'lib/sanity.image'
import { Essential } from 'lib/sanity.queries'
import Link from 'next/link' // Keep if Button component doesn't handle Link internally
import Image from 'next/image'; // Use Next.js Image for optimization
// import { CldImage } from 'next-cloudinary' // Removed as Sanity image is used
// Removed Fa icons as lucide-react is used
import { CircleDollarSign, Calendar, ThumbsDown, ThumbsUp } from 'lucide-react'; // Keep lucide icons

import Button from 'ui/Button' // Keep your Button component
import PostBody from './PostBody' // Keep your PostBody component
import PostDate from './PostDate' // Keep your PostDate component
// import StarRating from './StarRating' // Removed, wasn't in the provided code snippet

const TravelEssentialLayout = ({ posts }: { posts: Essential[] }) => {
  return (
    <>
      {/* Responsive Grid Container - Your existing setup is good */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
        {posts?.map((item) => (
          // Card Container - Applying structure and styling
          <div
            key={item._id}
            // Use Tailwind for background, border, shadow, rounded corners, flex layout, and full height
            className="flex flex-col h-full bg-white border-4 border-black rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            // Removed bg-indigo-50 unless desired, using standard card bg-white
          >
            {/* Top Section: Image and Badge */}
            <div className="relative"> {/* Relative container for absolute badge */}
              {/* Image Wrapper */}
              <div className="relative w-full h-48 flex items-center justify-center bg-white"> {/* Added bg for loading state */}
                 <Image
                  // placeholder="blur" // Next.js Image handles placeholders automatically with fill/sizes or priority
                  // blurDataURL="..." // Optional low-quality image placeholder
                  alt={item.name || 'Product image'} // Provide alt text
                  src={
                    item?.productImage?.asset?._ref
                      ? urlForImage(item.productImage.asset._ref)
                          .width(300) // Request appropriate size
                          .height(300)
                          .fit('max') // 'max' scales down if needed, preserves aspect ratio
                          .auto('format') // Auto-select format (webp, avif)
                          .url()
                      : '/placeholder-image.png' // Fallback placeholder in /public
                  }
                  fill // Fill the container
                  style={{ objectFit: 'contain' }} // 'contain' shows the whole image, 'cover' fills space
                  className="transition-transform duration-300 group-hover:scale-105 pt-4" // Optional zoom effect on hover
                />
              </div>

               {/* Recommendation Badge - Positioned absolutely */}
               <div className="absolute top-3 left-3 z-10">
                 {item.recommend ? (
                   <Badge
                     pl={0}
                     size="sm"
                     color="green"
                     variant="filled" // Using filled variant
                     radius="xl"
                     className="shadow-md" // Added shadow for visibility
                     leftSection={
                       <ThumbsUp className="ml-1 h-4 w-4" /> // Adjusted icon size
                     }
                   >
                     Loved it
                   </Badge>
                 ) : (
                   <Badge
                     pl={0}
                     size="sm"
                     color="red"
                     variant="filled" // Using filled variant
                     radius="xl"
                     className="shadow-md" // Added shadow for visibility
                     leftSection={
                       <ThumbsDown className="ml-1 h-4 w-4" /> // Adjusted icon size
                     }
                   >
                     Hated it {/* Or "Not Recommended" */}
                   </Badge>
                 )}
               </div>
            </div>


            {/* Content Section - Takes remaining space */}
            <div className="flex flex-col grow p-4 bg-gray-50"> {/* Added padding */}
              {/* Product Name */}
              <h1 className=" text-base md:text-lg font-semibold text-gray-800 mb-2 font-montserrat line-clamp-2">
                {item.name}
              </h1>

              {/* Date and Price Info */}
              <div className="flex items-center text-xs md:text-sm text-gray-500 mb-1">
                <Calendar className="mr-1.5 h-4 w-4 text-pink-500 shrink-0" />
                <span> {/* Wrap text for better alignment if it wraps */}
                   Reviewed on <PostDate dateString={item.date} />
                </span>
              </div>
              <div className="flex items-center  text-xs md:text-sm text-gray-500 mb-3">
                 <CircleDollarSign className='text-pink-500 mr-1.5 h-4 w-4 shrink-0' />
                 <span className='font-semibold'> {/* Wrap text */}
                   {item.price > 0 ? `${item.price.toFixed(2)}` : 'FREE'}
                 </span>
              </div>

               {/* Description - takes available space before button */}
               <div className=" text-xs md:text-sm text-gray-600 mb-4 grow min-h-[40px]"> {/* Added min-height */}
                {/* Limit description lines */}
                 <div className="line-clamp-3">
                   <PostBody content={item.description} />
                 </div>
               </div>

               {/* Action Button Area - Pushed to bottom */}
               <div className="mt-auto pt-4 border-t border-gray-100 text-center sm:mx-7 lg:mx-10"> {/* mt-auto pushes down, border adds separation */}
                 <Button size='xs' link={item.link}>
                   Get Item
                 </Button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default TravelEssentialLayout