import { Pagination } from '@mantine/core';
import { Loader } from '@mantine/core';
import PostPreview from 'components/PostPreview';
// Import the base Post type which should cover common fields for Hotel, Food, Guide
import { type Post } from 'lib/sanity.queries'; // Use the generic Post type
import { client } from 'lib/sanity.client';
import { useState, useEffect, useCallback } from 'react';

// Define the props for the generic MoreStories component
interface MoreStoriesProps {
  initialPosts?: Post[]; // Use the generic Post type
  totalPostsCount: number;
  itemsPerPage: number;
  showPagination: boolean;
  showRating: boolean; // Keep this if PostPreview handles conditional rating display
  paginatedQuery: string; // Query string for fetching specific paginated post types
  emptyStateMessage?: string; // Optional custom message for no posts
}

export default function MoreStories({
  initialPosts = [],
  totalPostsCount,
  itemsPerPage,
  showPagination,
  showRating,
  paginatedQuery, // The specific GROQ query for the post type being displayed
  emptyStateMessage = "No items found.", // Default empty state message
}: MoreStoriesProps) {
  // State for the posts currently displayed on the page
  const [currentPagePosts, setCurrentPagePosts] = useState<Post[]>(initialPosts); // Use Post type
  // State for the current active page number
  const [activePage, setPage] = useState(1);
  // State to track loading status during fetches
  const [isLoading, setIsLoading] = useState(false);
  // State to store potential errors during fetch
  const [error, setError] = useState<string | null>(null);

  // Calculate total number of pages needed for pagination controls
  const totalPages = Math.ceil(totalPostsCount / itemsPerPage);

  // Generic function to fetch data for a specific page from Sanity
  const fetchPageData = useCallback(async (page: number) => {
    // Avoid fetching page 1 again if we already have initialPosts
    if (page === 1 && initialPosts?.length > 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // console.log(`Workspaceing posts for page ${page}, range [${start}...${end}] using query: ${paginatedQuery}`); // Generic log

    try {
      // Fetch data using the Sanity client and the provided paginated query
      const posts = await client.fetch<Post[]>( // Expecting an array of generic Post type
        paginatedQuery, // Use the query passed via props
        { start, end }
      );
      setCurrentPagePosts(posts || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again later.');
      setCurrentPagePosts([]);
    } finally {
      setIsLoading(false);
    }
    // Dependencies include props needed for the fetch logic that might change
  }, [itemsPerPage, initialPosts, paginatedQuery]); // Correct dependencies

  // Effect Hook: Fetch data when the activePage state changes
  useEffect(() => {
    if (activePage !== 1 || initialPosts?.length === 0) {
      fetchPageData(activePage);
    } else if (activePage === 1 && initialPosts?.length > 0) {
      // Restore initial posts for page 1
      setCurrentPagePosts(initialPosts);
      setIsLoading(false);
      setError(null);
    }
  }, [activePage, fetchPageData, initialPosts]); // Correct dependencies

  // Handler for when a pagination button is clicked
  function handlePageChange(newPage: number) {
    if (newPage !== activePage) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --- Render Logic with Conditional States ---

  if (isLoading && currentPagePosts.length === 0) {
      return (
          <section className="container mx-auto mt-2">
              <div className="flex justify-center items-center py-20">
                  <Loader size="xl" />
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
              <div className="text-center text-gray-500 my-10">{emptyStateMessage}</div>
          </section>
      )
  }

  return (
    <section className="container mx-auto mt-2">
      {/* Optional subtle loading indicator */}
      {isLoading && (
         <div className="text-center py-4"><Loader size="sm" /></div>
      )}

      {/* Display Posts Grid */}
      <div className="container mx-auto mt-10 grid grid-cols-1 place-content-center place-items-center gap-x-16 gap-y-10 px-3 sm:grid-cols-2 md:grid-cols-2 md:gap-10 md:px-6 lg:gap-x-[2rem] lg:grid-cols-3 2xl:grid-cols-3">
        {/* Map over the generic Post array */}
        {currentPagePosts.map((post) => (
          <PostPreview
            // Pass common props expected by PostPreview from the base Post type
            // PostPreview should handle displaying specific details (like ratings)
            // based on post.linkType or other fields within the post object.
            key={post._id}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt2={post.excerpt2}
            location={post.location}
            category={post.category}
            linkType={post.linkType} // Pass linkType so PostPreview can adapt
            // Pass potentially optional fields - PostPreview must handle if they are undefined
            hotelRating={(post as any).hotelRating} // Use type casting or check existence if needed
            foodRating={(post as any).foodRating}
            takeoutRating={(post as any).takeoutRating}
            diningType={(post as any).diningType}
            // Consider passing the whole post object if PostPreview is designed for it:
            // {...post}
            // showRating prop might signal PostPreview to attempt showing ratings
            showRating={showRating}
          />
        ))}
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
            pt={10}
            styles={(theme) => ({
              control: {
                '&[data-active]': {
                  backgroundImage: theme.fn.gradient({
                    from: 'pink', // Consider theme variables
                    to: 'pink',
                  }),
                  border: 0,
                },
              },
            })}
          />
        </div>
      )}
    </section>
  );
}