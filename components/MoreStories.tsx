import { Pagination } from '@mantine/core';
import { Loader } from '@mantine/core'; // Import Loader for loading state
import PostPreview from 'components/PostPreview';
// Import Hotel type and the necessary query/client
import { type Hotel, paginatedHotelPostsQuery } from 'lib/sanity.queries';
import { client } from 'lib/sanity.client'; // Import your configured Sanity client
import { useState, useEffect, useCallback } from 'react'; // Import hooks

// Define the props for the MoreStories component
interface MoreStoriesProps {
  initialPosts?: Hotel[]; // Posts for the first page (optional, but recommended)
  totalPostsCount: number; // Total number of posts available matching the criteria
  itemsPerPage: number; // How many items to show per page
  showPagination: boolean;
  showRating: boolean;
}

export default function MoreStories({
  initialPosts = [], // Default to empty array if not provided
  totalPostsCount,
  itemsPerPage,
  showPagination,
  showRating,
}: MoreStoriesProps) {
  // State for the posts currently displayed on the page
  const [currentPagePosts, setCurrentPagePosts] = useState<Hotel[]>(initialPosts);
  // State for the current active page number
  const [activePage, setPage] = useState(1);
  // State to track loading status during fetches
  const [isLoading, setIsLoading] = useState(false);
  // State to store potential errors during fetch
  const [error, setError] = useState<string | null>(null);

  // Calculate total number of pages needed for pagination controls
  const totalPages = Math.ceil(totalPostsCount / itemsPerPage);

  // Function to fetch data for a specific page from Sanity
  // Wrapped in useCallback to prevent unnecessary re-creation
  const fetchPageData = useCallback(async (page: number) => {
    // Avoid fetching page 1 again if we already have initialPosts
    if (page === 1 && initialPosts?.length > 0) {
      // Handled by useEffect when activePage goes back to 1
      setIsLoading(false); // Ensure loading is off
      return;
    }

    setIsLoading(true); // Set loading true before fetch
    setError(null); // Reset error state

    // Calculate start and end indices for Sanity slice
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    console.log(`Workspaceing hotel posts for page ${page}, range [${start}...${end}]`); // Optional debug log

    try {
      // Fetch data using the Sanity client and the paginated query
      const posts = await client.fetch<Hotel[]>(
        paginatedHotelPostsQuery, // Use the query specific to paginated hotels
        { start, end } // Pass parameters to the query
      );
      setCurrentPagePosts(posts || []); // Update state with fetched posts, default to empty array
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again later.'); // Set error message
      setCurrentPagePosts([]); // Clear posts on error
    } finally {
      setIsLoading(false); // Set loading false after fetch completes or fails
    }
    // --- CORRECTED DEPENDENCIES ---
    // Dependencies should only include props/values from outside that the fetch logic *actually* depends on
    // and that don't change on every render cycle triggered by this function's state updates.
  }, [itemsPerPage, initialPosts, paginatedHotelPostsQuery]); // Removed currentPagePosts
  // Note: If `client` or `paginatedHotelPostsQuery` were potentially unstable refs, you might include them,
  // but typically they are stable top-level imports/constants.


  // Effect Hook: Fetch data when the activePage state changes
  useEffect(() => {
    // Fetch data for the active page, unless it's page 1 and we have initial posts
    if (activePage !== 1 || initialPosts?.length === 0) {
      fetchPageData(activePage);
    } else if (activePage === 1 && initialPosts?.length > 0) {
      // If navigating back to page 1, restore initialPosts and reset state
      setCurrentPagePosts(initialPosts);
      setIsLoading(false);
      setError(null);
    }
    // Dependency array: This effect runs when activePage or fetchPageData changes
    // fetchPageData is now stable unless its own dependencies (itemsPerPage, initialPosts) change.
  }, [activePage, fetchPageData, initialPosts]);

  // Handler for when a pagination button is clicked
  function handlePageChange(newPage: number) {
    if (newPage !== activePage) {
      setPage(newPage); // Update the active page state, which triggers the useEffect
      // Optional: Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Conditional rendering for loading state
  if (isLoading && currentPagePosts.length === 0) { // Show loader prominently if loading first page data
      return (
          <section className="container mx-auto mt-2">
              <div className="flex justify-center items-center py-20">
                  <Loader size="xl" />
              </div>
          </section>
      )
  }

  // Conditional rendering for error state
  if (error) {
      return (
          <section className="container mx-auto mt-2">
              <div className="text-center text-red-500 my-10">{error}</div>
          </section>
      )
  }

  // Conditional rendering for no posts found (after potential loading/error states)
  if (!isLoading && currentPagePosts.length === 0 && activePage === 1) {
      return (
          <section className="container mx-auto mt-2">
              <div className="text-center text-gray-500 my-10">No hotel reviews found.</div>
          </section>
      )
  }


  return (
    <section className="container mx-auto mt-2">
      {/* Optional: Show subtle loading indicator even when displaying previous page's data */}
      {isLoading && (
         <div className="text-center py-4"><Loader size="sm" /></div>
      )}

      {/* Display Posts Grid */}
      <div className="container mx-auto mt-10 grid grid-cols-1 place-content-center place-items-center gap-x-16 gap-y-10 px-3 sm:grid-cols-2 md:grid-cols-2 md:gap-10 md:px-6 lg:gap-x-[2rem] lg:grid-cols-3 2xl:grid-cols-3">
        {/* Map over the posts for the CURRENT page */}
        {currentPagePosts.map((post) => (
          <PostPreview
            // Ensure PostPreview accepts/handles Hotel type fields correctly
            key={post._id}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author} // Make sure Hotel type includes author or adjust
            slug={post.slug}
            excerpt2={post.excerpt2} // Make sure Hotel type includes excerpt2 or adjust
            location={post.location}
            category={post.category} // Make sure Hotel type includes category or adjust
            linkType={post.linkType} // Should be 'hotel'
            // Pass rating fields specific to Hotel if PostPreview handles them
            hotelRating={post.hotelRating}
            // Pass undefined/null for non-applicable ratings or adjust PostPreview
            foodRating={undefined}
            takeoutRating={undefined}
            diningType={undefined}
            showRating={showRating} // Propagate showRating prop
          />
        ))}
      </div>

      {/* Display Pagination (only if enabled and more than one page exists) */}
      {showPagination && totalPages > 1 && (
        <div className="pb-6 pt-14">
          <Pagination
            total={totalPages} // Use totalPages calculated from totalPostsCount
            value={activePage} // Current active page
            onChange={handlePageChange} // Function to call on page change
            position="center"
            size="lg"
            pt={10}
            styles={(theme) => ({
              control: {
                '&[data-active]': {
                  backgroundImage: theme.fn.gradient({
                    from: 'pink', // Or your desired theme color
                    to: 'pink',   // Or your desired theme color
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