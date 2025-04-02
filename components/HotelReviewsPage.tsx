import Container from 'components/BlogContainer';
import BlogHeader from 'components/BlogHeader';
import Layout from 'components/BlogLayout';
import IndexPageHead from 'components/IndexPageHead';
import MoreStories from 'components/MoreStories'; // Import the updated MoreStories
import * as demo from 'lib/demo.data';
// Import the generic Post type and the specific hotel pagination query
import type { Post, Settings } from 'lib/sanity.queries'; // Use Post type
import { paginatedHotelPostsQuery } from 'lib/sanity.queries'; // Import the specific query
import Head from 'next/head';

import { CMS_NAME } from '../lib/constants';
import Footer from './Footer';
import ReviewHeader from './ReviewHeader';

// --- Updated Props Interface ---
export interface HotelReviewsPageProps {
  preview?: boolean;
  loading?: boolean;
  initialPosts: Post[];     // Use generic Post type now expected by MoreStories
  totalPostsCount: number;
  itemsPerPage: number;
  settings: Settings;
}

// --- Component Name (assuming file is HotelReviewsPage.tsx) ---
export default function HotelReviewsPage(props: HotelReviewsPageProps) {
  // --- Props Destructuring ---
  const {
    preview,
    loading,
    initialPosts, // Received as Post[]
    totalPostsCount,
    itemsPerPage,
    settings,
   } = props;

  const { title = demo.title, description = demo.description } = settings || {};
  // console.log("Hotel Review Page Initial Posts:", initialPosts)
// console.log("Hotel Review Page Initial Posts:11", initialPosts.length)
  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{`Hotel Reviews - ${CMS_NAME}`}</title>
        </Head>

        {/* Optional: Remove BlogHeader if ReviewHeader is sufficient */}
        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={'Hotel Reviews'}
          arenas={[]} // Pass empty array or remove if not applicable
          summary={
            'Discover honest reviews from real travelers. We’ve stayed in the hotels, experienced the good, the bad, and the ugly. No fluff, just real talk on everything from beds to breakfast. Let’s explore the world together, one hotel at a time!'
          }
          animation={'/sand.svg'} // Ensure path is correct
        />

        {/* --- Update MoreStories Props --- */}
        {totalPostsCount > 0 ? (
          <MoreStories
            initialPosts={initialPosts} // Pass initial posts (now as Post[])
            totalPostsCount={totalPostsCount}
            itemsPerPage={itemsPerPage}
            showPagination={true}
            showRating={true} // MoreStories passes this to PostPreview
            // Pass the specific query for fetching hotel posts
            paginatedQuery={paginatedHotelPostsQuery}
            // Optional: Provide a custom message for this specific page type
            emptyStateMessage="No hotel reviews found."
          />
        ) : (
          // Optional: Display a message if no posts are found at all
          !loading && <Container><p className="text-center my-10">No hotel reviews found.</p></Container>
        )}
      </Layout>
      <Footer />
    </>
  );
}