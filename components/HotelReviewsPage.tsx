import Container from 'components/BlogContainer';
import BlogHeader from 'components/BlogHeader';
import Layout from 'components/BlogLayout';
import IndexPageHead from 'components/IndexPageHead';
import * as demo from 'lib/demo.data';
import type { HotelReview, Settings } from 'lib/sanity.queries';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { getPaginatedHotelReviews } from 'lib/sanity.client';
import PaginationComponent from './PaginationComponent';

import { CMS_NAME } from '../lib/constants';
import Footer from './Footer';
import DynamicPostCard from './DynamicPostCard';
import ReviewHeader from './ReviewHeader';

export interface HotelReviewsPageProps {
  preview?: boolean;
  loading?: boolean;
  initialPosts: HotelReview[];
  settings: Settings;
  totalPostsCount: number;
  itemsPerPage: number;
}

export default function HotelReviewsPage(props: HotelReviewsPageProps) {
  const {
    preview,
    loading,
    initialPosts,
    settings,
    totalPostsCount,
    itemsPerPage,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);

  const { title = demo.title, description = demo.description } = settings || {};

  const { data, error } = useSWR(
    [currentPage, itemsPerPage],
    ([page, limit]) => getPaginatedHotelReviews((page - 1) * limit, page * limit),
    {
      fallbackData: currentPage === 1 ? initialPosts : undefined,
    }
  );

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{`Hotel Reviews - ${CMS_NAME}`}</title>
        </Head>

        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={'Hotel Reviews'}
          summary={
            'Discover honest reviews from real travelers. We’ve stayed in the hotels, experienced the good, the bad, and the ugly. No fluff, just real talk on everything from beds to breakfast. Let’s explore the world together, one hotel at a time!'
          }
          img={'/bath2.json'}
        />

        <Container>
          <div className="my-10">
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((hotelReview) => (
                  <DynamicPostCard
                    key={hotelReview._id}
                    title={hotelReview.title}
                    coverImage={hotelReview.coverImage}
                    hotelRating={hotelReview.hotelRating}
                    linkType="hotel"
                    date={hotelReview.date}
                    showRating={true}
                    slug={hotelReview.slug}
                    location={hotelReview.location}
                    category={hotelReview.category}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center my-10 text-muted-foreground">No hotel reviews found. Loading: {loading ? 'Yes' : 'No'}</p>
            )}
          </div>
          <PaginationComponent
            totalItems={totalPostsCount}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Container>
      </Layout>
      <Footer />
    </>
  );
}