// pages/search.js
import { Pagination } from '@mantine/core'; // Import Mantine Pagination
import Container from 'components/BlogContainer';
import BlogHeader from 'components/BlogHeader';
import Layout from 'components/BlogLayout';
import Footer from 'components/Footer';
import PostPreview from 'components/PostPreview'; // Import PostPreview
import * as demo from 'lib/demo.data';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'; // Keep useState and useEffect

import { CMS_NAME } from '../lib/constants';
import { globalSearchQuery, Post } from '../lib/sanity.queries';
import { Settings } from '../lib/sanity.queries';
import { sanityClient } from '../lib/sanity.server';

// Removed MoreStoriesIndex import as it's no longer used here

interface PageProps {
  preview?: boolean;
  loading?: boolean;
  // 'posts' prop removed - data is fetched client-side based on query
  settings: Settings;
}

// Dynamically import Lottie Player component with SSR disabled
const PlayerWithNoSSR = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false }
);

const SearchResults = (props: PageProps) => {
  const router = useRouter();
  const { q: searchQuery } = router.query;
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // --- Client-Side Pagination State ---
  const [activePage, setPage] = useState(1);
  const itemsPerPage = 9; // Adjust items per page as needed (e.g., 9 for 3 columns)

  const { settings } = props;
  const { title = demo.title, description = demo.description } = settings || {};

  useEffect(() => {
    const currentSearchQuery = router.query.q;
    setPage(1); // Reset to page 1 on new search
    if (typeof currentSearchQuery === 'string' && currentSearchQuery.trim()) {
      setLoading(true);
      setError(null);
      // Using wildcards for broader matching, adjust if exact match needed
      const searchTermWithWildcards = `*${currentSearchQuery.trim()}*`;
      sanityClient
        .fetch(globalSearchQuery, { searchTerm: searchTermWithWildcards })
        .then((data) => {
          setResults(data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
          setResults([]);
          console.error('Error fetching search results:', err);
        });
    } else {
      setResults([]);
      setLoading(false);
      setError(null);
    }
  }, [router.query.q]); // Re-run search when query 'q' changes

  // --- Calculate Pagination Values ---
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedResults = results.slice(startIndex, endIndex);

  // --- Loading State ---
  if (loading) {
    return (
      <Layout preview={false} loading={true}>
        <Container>
          <div className="flex justify-center items-center min-h-[50vh]">
            Searching the archives...
          </div>
        </Container>
        <Footer />
      </Layout>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Layout preview={false} loading={false}>
        <Container>
          <div className="flex justify-center items-center min-h-[50vh] text-red-600">
            Blast! Something went wrong: {error.message}
          </div>
        </Container>
        <Footer />
      </Layout>
    );
  }
 
  // --- Results Display ---
  return (
    <Layout preview={false} loading={loading}>
      <Head>
        {/* Updated title */}
        <title>{searchQuery ? `Search Results for "${searchQuery}"` : `Search - ${CMS_NAME}`}</title>
      </Head>
      <BlogHeader title={title} description={description} level={1} />

      <Container>
        {searchQuery && results.length > 0 ? ( // Check searchQuery to ensure search was performed
          // --- RESULTS FOUND ---
          <>

          <div className='bg-gray-50 flex flex-col items-center justify-center rounded-xl shadow-md px-4 mx-2 my-8'> 
            <h1 className="font-oswald text-3xl md:text-4xl mt-6 mb-6">
              Search results for{' '}
              <span className="text-pink-500">&quot;{searchQuery}&quot;</span>
            </h1>

            <p className="text-md md:text-lg text-gray-500 max-w-lg mx-auto mb-10">
              {results.length} {results.length === 1 ? 'item' : 'items'} found 😉
            </p></div>

            {/* --- Grid Display using PostPreview --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-4 px-4 sm:px-6 lg:px-8 container mx-auto max-w-8xl">
            {displayedResults.map((post) => (
                <PostPreview
                  key={post._id}
                  // Pass necessary props from the post object
                  title={post.title}
                  coverImage={post.coverImage}
                  date={post.date}
                  slug={post.slug}
                  location={post.location}
                  category={post.category}
                  linkType={post.linkType}
                  // Pass rating info if needed by PostPreview, casting or checking existence
                  hotelRating={(post as any).hotelRating}
                  foodRating={(post as any).foodRating}
                  takeoutRating={(post as any).takeoutRating}
                  diningType={(post as any).diningType}
                  // Don't show rating overlay on search results perhaps?
                  showRating={true}
                  // You might pass the whole post: {...post} if PostPreview accepts it
                />
              ))}
            </div>

            {/* --- Pagination Controls --- */}
            {totalPages > 1 && (
              <div className="pb-6 pt-14">
                <Pagination
                  total={totalPages}
                  value={activePage}
                  onChange={setPage} // Use the state setter directly
                  position="center"
                  size="lg"
                  pt={10}
                  styles={(theme) => ({
                    control: {
                      '&[data-active]': {
                        backgroundImage: theme.fn.gradient({
                          from: 'pink',
                          to: 'pink',
                        }),
                        border: 0,
                      },
                    },
                  })}
                />
              </div>
            )}
          </>
        ) : (
          // --- NO RESULTS FOUND (or no search term entered yet) ---
          <>
            {searchQuery ? ( // Only show "no results" if a search was actually performed
              // --- <<< FUNNY "NO RESULTS" BLOCK START >>> ---
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-10">
                {/* Lottie Animation */}
                <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] mx-auto mb-8">
                  <PlayerWithNoSSR
                    autoplay
                    keepLastFrame
                    loop
                    src={'/confused-search.json'} // Point to your Lottie JSON in /public
                  />
                </div>

                {/* Funny Headline */}
                <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl mb-4 text-gray-800">
                  Whoopsie!{' '}
                  <span className="text-pink-500">
                    &quot;{searchQuery}&quot;
                  </span>{' '}
                  was not found.
                </h1>

                {/* Humorous Explanation */}
                <p className="text-md md:text-lg text-gray-500 max-w-lg mx-auto">
                  Maybe check the spelling? Or perhaps it&#39;s playing
                  hide-and-seek in another dimension?
                </p>

                {/* Suggestion / Call to action */}
                <p className="mt-8 text-md text-gray-500">
                  Try searching for something else? <br />
                  (We hear &#39;Hyatt&#39; yields great results 😉)
                </p>
              </div>
            ) : (
              // --- NO SEARCH TERM ENTERED YET ---
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <h2 className="text-2xl text-gray-700 mb-4">
                  Ready when you are!
                </h2>
                <p className="text-lg text-gray-500">
                  Pop a search term into the bar above to begin your adventure.
                </p>
              </div>
            )}
          </>
        )}
      </Container>
      <Footer />
    </Layout>
  );
};

export default SearchResults;

// Optional: Fetch settings server-side if needed for initial render
// import { getClient } from '../lib/sanity.server';
// import { settingsQuery } from '../lib/sanity.queries';

// export async function getStaticProps({ preview = false }) {
//   // Fetch settings needed by the Layout/Header/Footer
//   const settings = (await getClient(preview).fetch(settingsQuery)) || {};
//   return {
//     props: { settings, preview },
//     // revalidate: 60, // Optional: Revalidate settings periodically if they change often
//   };
// }