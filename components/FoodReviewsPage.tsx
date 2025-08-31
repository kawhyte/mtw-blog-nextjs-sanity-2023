

import Container from 'components/BlogContainer';
import BlogHeader from 'components/BlogHeader'; // Maybe remove if ReviewHeader is enough
import Layout from 'components/BlogLayout';
import IndexPageHead from 'components/IndexPageHead';
import MoreStories from 'components/MoreStories'; // Import the updated MoreStories
import * as demo from 'lib/demo.data';
import type { FoodReview, Settings } from 'lib/sanity.queries';
import Head from 'next/head';
import PostPreview from './PostPreview';

import { CMS_NAME } from '../lib/constants';
import Footer from './Footer';
import ReviewHeader from './ReviewHeader';


export interface FoodReviewsPageProps {
  preview?: boolean;
  loading?: boolean;
  initialPosts: FoodReview[];
  totalPostsCount: number;
  itemsPerPage: number;
  settings: Settings;
}

// --- Renamed Component ---
export default function FoodReviewsPage(props: FoodReviewsPageProps) {
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
          img={'/food.json'} 
        />

        {/* Food Reviews Grid using PostPreview */}
        <Container>
          <div className="my-10">
            {initialPosts && initialPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialPosts.map((foodReview) => (
                  <PostPreview
                    key={foodReview._id}
                    title={foodReview.title}
                    coverImage={foodReview.coverImage}
                    foodRating={foodReview.foodRating}
                    takeoutRating={foodReview.takeoutRating}
                    linkType="food"
                    diningType={foodReview.diningType}
                    date={foodReview.date}
                    showRating={true}
                    slug={foodReview.slug}
                    location={foodReview.location}
                    category={foodReview.category}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center my-10">No food reviews found. Loading: {loading ? 'Yes' : 'No'}</p>
            )}
          </div>
        </Container>
      </Layout>
      <Footer />
    </>
  );
}