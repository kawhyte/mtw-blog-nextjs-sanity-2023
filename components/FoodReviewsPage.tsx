import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import CategoryPageHead from 'components/CategoryPageHead'
import * as demo from 'lib/demo.data'
import { getPaginatedFoodReviews } from 'lib/sanity.client'
import type { FoodReview, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'

import { CardSkeletonGrid } from '@/components/ui/card-skeleton'

import { CMS_NAME } from '../lib/constants'
import DynamicPostCard from './DynamicPostCard'
import Footer from './Footer'
import PaginationComponent from './PaginationComponent'
import ReviewHeader from './ReviewHeader'

export interface FoodReviewsPageProps {
  preview?: boolean
  loading?: boolean
  initialPosts: FoodReview[]
  totalPostsCount: number
  itemsPerPage: number
  settings: Settings
}

export default function FoodReviewsPage(props: FoodReviewsPageProps) {
  const {
    preview,
    loading,
    initialPosts,
    totalPostsCount,
    itemsPerPage,
    settings,
  } = props

  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState(initialPosts)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const { title = demo.title, description = demo.description } = settings || {}

  const { data, error } = useSWR(
    [currentPage, itemsPerPage],
    ([page, limit]) =>
      getPaginatedFoodReviews((page - 1) * limit, page * limit),
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
      setPosts(data as FoodReview[])
      setIsTransitioning(false)
    }
  }, [data])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <CategoryPageHead
        settings={settings}
        categoryType="food"
        totalCount={totalPostsCount}
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={'Food Reviews'}
          summary={
            "Join us on a culinary adventure as we explore the best (and sometimes, the worst) eateries in town. From hidden gems to fancy hotspots, We’ll dish out honest reviews, mouthwatering photos, and insider tips. Let's eat!"
          }
          img={'/food.json'}
        />

        <Container>
          <div className="my-10">
            {loading || isTransitioning ? (
              <CardSkeletonGrid count={12} layout="page" />
            ) : posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((foodReview) => (
                  <DynamicPostCard
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
                  />
                ))}
              </div>
            ) : (
              <p className="text-center my-10 text-muted-foreground">
                No food reviews found.
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
