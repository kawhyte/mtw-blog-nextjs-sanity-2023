// Assuming this file is components/StoryGuidePage.tsx (or similar, based on usage)
// Renamed from guides.tsx conceptually if desired

import Container from 'components/BlogContainer';
import BlogHeader from 'components/BlogHeader'; // Keep or remove as needed
import Layout from 'components/BlogLayout';
import IndexPageHead from 'components/IndexPageHead';
import MoreStories from 'components/MoreStories'; // Import the generic MoreStories
import * as demo from 'lib/demo.data';
// Import the generic Post type and the specific guide pagination query
import type { Post, Settings } from 'lib/sanity.queries';
import { paginatedGuidePostsQuery } from 'lib/sanity.queries'; // Import the specific query
import Head from 'next/head';

import { CMS_NAME } from '../lib/constants';
import Footer from './Footer';
import ReviewHeader from './ReviewHeader';


// --- Renamed and Updated Props Interface ---
export interface StoryGuidePageProps {
  preview?: boolean;
  loading?: boolean;
  initialPosts: Post[];     // Use generic Post type
  totalPostsCount: number;   // Added total count
  itemsPerPage: number;      // Added items per page
  settings: Settings;
}

// --- Renamed Component ---
export default function StoryGuidePage(props: StoryGuidePageProps) {
  // --- Updated Props Destructuring ---
  const {
    preview,
    loading,
    initialPosts, // Use initialPosts
    totalPostsCount, // Use totalPostsCount
    itemsPerPage, // Use itemsPerPage
    settings,
   } = props;

  

  const { title = demo.title, description = demo.description } = settings || {};



  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          {/* Update title */}
          <title>{`Stories & Guides - ${CMS_NAME}`}</title>
        </Head>

        {/* Optional: Remove BlogHeader if ReviewHeader is sufficient */}
        <BlogHeader title={title} description={description} level={1}  />

        <ReviewHeader
          title={"Stories & Guides"}
     
          summary={"Uncover insider tips, hidden gems, and unforgettable adventures. From budget backpacking to luxury escapes, We’ve got you covered. Let's explore together!"}
          img={'/plane.json'} // Ensure path is correct
        />

        {/* --- Update MoreStories Props --- */}
        {totalPostsCount > 0 ? (
          <MoreStories
            initialPosts={initialPosts} // Pass initial posts (as Post[])
            totalPostsCount={totalPostsCount} // Pass total count
            itemsPerPage={itemsPerPage} // Pass items per page setting
            showPagination={true} // Enable pagination
            showRating={false} // Disable rating display for guides/stories
            // Pass the specific query for fetching guide posts
            paginatedQuery={paginatedGuidePostsQuery}
            // Optional: Provide a custom message
            emptyStateMessage="No stories or guides found."
          />
        ) : (
          // Optional: Display a message if no posts are found at all
          !loading && <Container><p className="text-center my-10">No stories or guides found.</p></Container>
        )}
      </Layout>
      <Footer />
    </>
  );
}