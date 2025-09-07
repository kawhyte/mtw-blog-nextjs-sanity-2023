import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import CategoryPageHead from 'components/CategoryPageHead'
import * as demo from 'lib/demo.data'
import { getPaginatedHotelReviews } from 'lib/sanity.client'
import type { HotelReview, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'

import { CardSkeletonGrid } from '@/components/ui/card-skeleton'

import { CMS_NAME } from '../lib/constants'
import DynamicPostCard from './DynamicPostCard'
import Footer from './Footer'
import PaginationComponent from './PaginationComponent'
import ReviewHeader from './ReviewHeader'

export interface HotelReviewsPageProps {
  preview?: boolean
  loading?: boolean
  initialPosts: HotelReview[]
  settings: Settings
  totalPostsCount: number
  itemsPerPage: number
}

export default function HotelReviewsPage(props: HotelReviewsPageProps) {
  const {
    preview,
    loading,
    initialPosts,
    settings,
    totalPostsCount,
    itemsPerPage,
  } = props

  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState(initialPosts)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const { title = demo.title, description = demo.description } = settings || {}

  const { data, error } = useSWR(
    [currentPage, itemsPerPage],
    ([page, limit]) =>
      getPaginatedHotelReviews((page - 1) * limit, page * limit),
    {
      fallbackData: currentPage === 1 ? initialPosts : undefined,
    },
  )

  // Reset state when initialPosts change (page navigation)
  useEffect(() => {
    setIsTransitioning(true)
    setPosts(initialPosts)
    setCurrentPage(1)
    // Clear SWR cache to prevent stale data
    mutate(() => true, undefined, { revalidate: false })
    const timer = setTimeout(() => setIsTransitioning(false), 100)
    return () => clearTimeout(timer)
  }, [initialPosts])

  useEffect(() => {
    if (data) {
      setPosts(data)
      setIsTransitioning(false)
      console.log(
        `Page ${currentPage} loaded with ${data.length} posts:`,
        data.map((p) => p.title),
      )
    }
  }, [data, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <CategoryPageHead
        settings={settings}
        categoryType="hotels"
        totalCount={totalPostsCount}
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={'Hotel Reviews'}
          summary={
            'Discover honest reviews from real travelers. We’ve stayed in the hotels, experienced the good, the bad, and the ugly. No fluff, just real talk on everything from beds to breakfast. Let’s explore the world together, one hotel at a time!'
          }
          img={'/bath2.json'}
        />

        <Container>
          <div className="my-10 w-full max-w-7xl mx-auto">
            {loading || isTransitioning ? (
              <CardSkeletonGrid count={12} layout="page" />
            ) : posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
              <p className="text-center my-10 text-muted-foreground">
                No hotel reviews found.
              </p>
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
  )
}
