import DynamicPostCard from 'components/DynamicPostCard'
import { client } from 'lib/sanity.client'
import {
  type FoodReview,
  type Guide,
  type HotelReview,
  type Post,
} from 'lib/sanity.queries'
import { useCallback, useEffect, useState } from 'react'

import { Loader } from '@/components/ui/loader'
import { PaginationWrapper as Pagination } from '@/components/ui/pagination-wrapper'

// Union type for all possible content types
type ContentItem = Post | Guide | HotelReview | FoodReview

// Define the props for the generic MoreStories component
interface MoreStoriesProps {
  initialPosts?: ContentItem[]
  totalPostsCount: number
  itemsPerPage: number
  showPagination: boolean
  showRating: boolean
  paginatedQuery: string // Query string for fetching specific paginated post types
  emptyStateMessage?: string // Optional custom message for no posts
}

export default function MoreStories({
  initialPosts = [],
  totalPostsCount,
  itemsPerPage,
  showPagination,
  showRating,
  paginatedQuery, // The specific GROQ query for the post type being displayed
  emptyStateMessage = 'No items found.', // Default empty state message
}: MoreStoriesProps) {
  // State for the posts currently displayed on the page
  const [currentPagePosts, setCurrentPagePosts] =
    useState<ContentItem[]>(initialPosts)
  // State for the current active page number
  const [activePage, setPage] = useState(1)
  // State to track loading status during fetches
  const [isLoading, setIsLoading] = useState(false)
  // State to store potential errors during fetch
  const [error, setError] = useState<string | null>(null)

  // Calculate total number of pages needed for pagination controls
  const totalPages = Math.ceil(totalPostsCount / itemsPerPage)

  // Generic function to fetch data for a specific page from Sanity
  const fetchPageData = useCallback(
    async (page: number) => {
      // Avoid fetching page 1 again if we already have initialPosts
      if (page === 1 && initialPosts?.length > 0) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage


      try {
        // Fetch data using the Sanity client and the provided paginated query
        const posts = await client.fetch<ContentItem[]>(
          paginatedQuery, // Use the query passed via props
          { start, end },
        )
        setCurrentPagePosts(posts || [])
      } catch (err) {
        console.error('Failed to fetch posts:', err)
        setError('Failed to load posts. Please try again later.')
        setCurrentPagePosts([])
      } finally {
        setIsLoading(false)
      }
      // Dependencies include props needed for the fetch logic that might change
    },
    [itemsPerPage, initialPosts, paginatedQuery],
  ) // Correct dependencies

  // Effect Hook: Fetch data when the activePage state changes
  useEffect(() => {
    if (activePage !== 1 || initialPosts?.length === 0) {
      fetchPageData(activePage)
    } else if (activePage === 1 && initialPosts?.length > 0) {
      // Restore initial posts for page 1
      setCurrentPagePosts(initialPosts)
      setIsLoading(false)
      setError(null)
    }
  }, [activePage, fetchPageData, initialPosts]) // Correct dependencies

  // Handler for when a pagination button is clicked
  function handlePageChange(newPage: number) {
    if (newPage !== activePage) {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // --- Render Logic with Conditional States ---

  if (isLoading && currentPagePosts.length === 0) {
    return (
      <section className="container mx-auto mt-2">
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container mx-auto mt-2">
        <div className="text-center text-red-500 my-10">{error}</div>
      </section>
    )
  }

  // Use the emptyStateMessage prop
  if (!isLoading && currentPagePosts.length === 0 && activePage === 1) {
    return (
      <section className="container mx-auto mt-2">
        <div className="text-center text-gray-500 my-10">
          {emptyStateMessage}
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto mt-2">
      {/* Optional subtle loading indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <Loader size="sm" />
        </div>
      )}

      {/* Display Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 px-4 sm:px-6 lg:px-8 container mx-auto max-w-8xl">
        {currentPagePosts.map((item) => {
          // Helper function to determine linkType for new schema types
          const getLinkType = (
            item: ContentItem,
          ): 'hotel' | 'food' | 'story' | 'favorite' => {
            if ('_type' in item) {
              switch (item._type) {
                case 'hotelReview':
                  return 'hotel'
                case 'foodReview':
                  return 'food'
                case 'guide':
                  return 'story'
                default:
                  const linkType = (item as Post).linkType
                  return linkType === 'hotel' ||
                    linkType === 'food' ||
                    linkType === 'story' ||
                    linkType === 'favorite'
                    ? linkType
                    : 'favorite'
              }
            }
            const linkType = (item as Post).linkType
            return linkType === 'hotel' ||
              linkType === 'food' ||
              linkType === 'story' ||
              linkType === 'favorite'
              ? linkType
              : 'favorite'
          }

          return (
            <DynamicPostCard
              key={item._id}
              title={item.title}
              coverImage={item.coverImage}
              date={item.date}
              author={'author' in item ? item.author : undefined}
              slug={item.slug}
              excerpt2={'excerpt2' in item ? item.excerpt2 : undefined}
              location={'location' in item ? item.location : undefined}
              category={'category' in item ? item.category : undefined}
              linkType={getLinkType(item)}
              // Pass specific rating fields based on content type
              hotelRating={'hotelRating' in item ? item.hotelRating : undefined}
              foodRating={'foodRating' in item ? item.foodRating : undefined}
              takeoutRating={
                'takeoutRating' in item ? item.takeoutRating : undefined
              }
              diningType={'diningType' in item ? item.diningType : undefined}
              showRating={showRating}
            />
          )
        })}
      </div>

      {/* Display Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="pb-6 pt-14">
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={handlePageChange}
            position="center"
            size="lg"
            className="pt-10"
          />
        </div>
      )}
    </section>
  )
}
