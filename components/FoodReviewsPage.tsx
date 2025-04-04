

import Container from 'components/BlogContainer';
import BlogHeader from 'components/BlogHeader'; // Maybe remove if ReviewHeader is enough
import Layout from 'components/BlogLayout';
import IndexPageHead from 'components/IndexPageHead';
import MoreStories from 'components/MoreStories'; // Import the updated MoreStories
import * as demo from 'lib/demo.data';
// Import Post and Settings, and the specific food pagination query
import type { Post, Settings } from 'lib/sanity.queries';
import { paginatedFoodPostsQuery } from 'lib/sanity.queries'; // <-- IMPORT specific query
import Head from 'next/head';

import { CMS_NAME } from '../lib/constants';
import Footer from './Footer';
import ReviewHeader from './ReviewHeader';


export interface FoodReviewsPageProps {
  preview?: boolean;
  loading?: boolean;
  initialPosts: Post[]; // Use Post type if returned by client func
  totalPostsCount: number;
  itemsPerPage: number;
  settings: Settings;
}

// --- Renamed Component ---
export default function FoodReviewsPage(props: FoodReviewsPageProps) {
  // --- Updated Props Destructuring ---
  const {
    preview,
    loading,
    initialPosts,
    totalPostsCount,
    itemsPerPage,
    settings,
   } = props;



  const { title = demo.title, description = demo.description } = settings || {};

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
           {/* Update title */}
          <title>{`Food Reviews - ${CMS_NAME}`}</title>
        </Head>

      
        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={'Food Reviews'}
       
          summary={
            "Join us on a culinary adventure as we explore the best (and sometimes, the worst) eateries in town. From hidden gems to fancy hotspots, We’ll dish out honest reviews, mouthwatering photos, and insider tips. Let's eat!"
          }
          img={'/watermelon.json'} 
        />

        {/* --- Update MoreStories Props --- */}
        {totalPostsCount > 0 ? (
          <MoreStories
            initialPosts={initialPosts}
            totalPostsCount={totalPostsCount}
            itemsPerPage={itemsPerPage}
            showPagination={true}
            showRating={true} 
            paginatedQuery={paginatedFoodPostsQuery} 
          />
        ) : (
           !loading && <Container><p className="text-center my-10">No food reviews found.</p></Container>
        )}
      </Layout>
      <Footer />
    </>
  );
}