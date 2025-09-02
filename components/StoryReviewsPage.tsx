import Container from 'components/BlogContainer';
import BlogHeader from 'components/BlogHeader';
import Layout from 'components/BlogLayout';
import IndexPageHead from 'components/IndexPageHead';
import * as demo from 'lib/demo.data';
import type { Guide, Settings } from 'lib/sanity.queries';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { getPaginatedGuidePosts } from 'lib/sanity.client';
import PaginationComponent from './PaginationComponent';
import DynamicPostCard from './DynamicPostCard';

import { CMS_NAME } from '../lib/constants';
import Footer from './Footer';
import ReviewHeader from './ReviewHeader';

export interface StoryReviewsPageProps {
  preview?: boolean;
  loading?: boolean;
  initialPosts: Guide[];
  totalPostsCount: number;
  itemsPerPage: number;
  settings: Settings;
}

export default function StoryReviewsPage(props: StoryReviewsPageProps) {
  const {
    preview,
    loading,
    initialPosts,
    totalPostsCount,
    itemsPerPage,
    settings,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);

  const { title = demo.title, description = demo.description } = settings || {};

  const { data, error } = useSWR(
    [currentPage, itemsPerPage],
    ([page, limit]) => getPaginatedGuidePosts((page - 1) * limit, page * limit),
    {
      fallbackData: currentPage === 1 ? initialPosts : undefined,
    }
  );

  useEffect(() => {
    if (data) {
      setPosts(data as Guide[]);
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
          <title>{`Stories & Guides - ${CMS_NAME}`}</title>
        </Head>

        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={"Stories & Guides"}
          summary={"Uncover insider tips, hidden gems, and unforgettable adventures. From budget backpacking to luxury escapes, We’ve got you covered. Let's explore together!"}
          img={'/plane.json'}
        />

        <Container>
          <div className="my-10">
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((guide) => (
                  <DynamicPostCard
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
              <p className="text-center my-10 text-muted-foreground">No stories or guides found. Loading: {loading ? 'Yes' : 'No'}</p>
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