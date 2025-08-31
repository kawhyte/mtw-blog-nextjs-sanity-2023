// Assuming this file is components/StoryGuidePage.tsx (or similar, based on usage)
// Renamed from guides.tsx conceptually if desired

import Container from 'components/BlogContainer';
import BlogHeader from 'components/BlogHeader'; // Keep or remove as needed
import Layout from 'components/BlogLayout';
import IndexPageHead from 'components/IndexPageHead';
import MoreStories from 'components/MoreStories'; // Import the generic MoreStories
import * as demo from 'lib/demo.data';
import type { Guide, Settings } from 'lib/sanity.queries';
import Head from 'next/head';
import PostPreview from './PostPreview';

import { CMS_NAME } from '../lib/constants';
import Footer from './Footer';
import ReviewHeader from './ReviewHeader';
import PaginationComponent from './PaginationComponent';


export interface StoryGuidePageProps {
  preview?: boolean;
  loading?: boolean;
  initialPosts: Guide[];
  settings: Settings;
}

// --- Renamed Component ---
export default function StoryGuidePage(props: StoryGuidePageProps) {
  const {
    preview,
    loading,
    initialPosts,
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

        {/* Travel Guides Grid using PostPreview */}
        <Container>
          <div className="my-10">
            {initialPosts && initialPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialPosts.map((guide) => (
                  <PostPreview
                    key={guide._id}
                    title={guide.title}
                    coverImage={guide.coverImage}
                    linkType="story"
                    date={guide.date}
                    showRating={false}
                    slug={guide.slug}
                    location={guide.location}
                    category={guide.category}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center my-10">No stories or guides found. Loading: {loading ? 'Yes' : 'No'}</p>
            )}
          </div>
        </Container>
      </Layout>
      <Footer />
    </>
  );
}