import Container from 'components/BlogContainer';
import BlogHeader from 'components/BlogHeader';
import Layout from 'components/BlogLayout';
import IndexPageHead from 'components/IndexPageHead';
import MoreStories from 'components/MoreStories';
import * as demo from 'lib/demo.data';
import { urlForImage } from 'lib/sanity.image';
import type { Post, Recommendation, Settings } from 'lib/sanity.queries';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import post from 'schemas/post';
import { getSettings, getTopWeightedHotelPosts } from 'lib/sanity.client'; // Import the new function

import { CMS_NAME } from '../lib/constants';
import Footer from './Footer';
import ReviewHeader from './ReviewHeader';
import SectionSeparator from './SectionSeparator';
import TopListItems from './TopListItems';
import { GetStaticProps } from 'next';

export interface IndexPageProps {
  preview?: boolean;
  loading?: boolean;
  posts: Post[]; // Changed type to Post[] to reflect the output of getTopWeightedHotelPosts
  settings: Settings;
}
let count = 2;

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, posts, settings } = props;
  // const [heroPost, ...morePosts] = posts || []; // Removed as we are focusing on top hotels
  const { title = demo.title, description = demo.description } = settings || {};

  // const hotels = posts.filter((word) => word.listType === 'hotel'); // No longer filtering here
  const topHotels = posts.filter((post) => post?.linkType === 'hotel'); // Filter for hotels based on linkType
  const topRestaurants = posts.filter((post) => post?.linkType === 'food'); // Filter for hotels based on linkType
  // const restaurants = posts.filter((word) => word.listType === 'food');
//  console.log("topRestaurants", topRestaurants)
  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{CMS_NAME}</title>
          {/* <title>{CMS_NAME}</title> */}
        </Head>
        {/* <Container> */}
        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={'Our Top Picks'}
          arenas={[]}
          summary={
            'Our top 10 hotels based on weighted average ratings, and our curated food guide. Discover the best experiences for your next adventure.'
          }
          animation={'/relaxing.svg'}
        />

        {topHotels.length > 0 && (
          <>
            <TopListItems posts={topHotels} />

            <SectionSeparator />
            {topRestaurants.length > 0 && (
              <>
                <TopListItems posts={topRestaurants} />
                <section></section>
              </>
            )}
          </>
        )}
        {/* </Container> */}
      </Layout>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<IndexPageProps> = async (
  context
) => {
  const { preview = false } = context;
  const settings = await getSettings();
  const topWeightedHotelPosts = await getTopWeightedHotelPosts(); // Fetch the top weighted hotels

  return {
    props: {
      preview,
      loading: preview,
      posts: topWeightedHotelPosts, // Pass the top weighted hotels as 'posts'
      settings,
    },
    revalidate: 10,
  };
};