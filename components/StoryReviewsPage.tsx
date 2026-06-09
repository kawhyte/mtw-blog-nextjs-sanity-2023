import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import CategoryPageHead from 'components/CategoryPageHead'
import * as demo from 'lib/demo.data'
import { getGuidesByCategory, getPaginatedGuides } from 'lib/sanity.client'
import type { Guide, Settings } from 'lib/sanity.queries'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'

import { CardSkeletonGrid } from '@/components/ui/card-skeleton'

import DynamicPostCard from './DynamicPostCard'
import Footer from './Footer'
import PaginationComponent from './PaginationComponent'
import ReviewHeader from './ReviewHeader'

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'City Guide', value: 'city' },
  { label: 'Travel Tips', value: 'tips' },
  { label: 'Transportation', value: 'transport' },
  { label: 'Culture', value: 'culture' },
  { label: 'Adventure', value: 'adventure' },
  { label: 'Family', value: 'family' },
  { label: 'Budget', value: 'budget' },
  { label: 'Luxury', value: 'luxury' },
]

export interface StoryReviewsPageProps {
  preview?: boolean
  loading?: boolean
  initialPosts: Guide[]
  totalPostsCount: number
  itemsPerPage: number
  settings: Settings
}

export default function StoryReviewsPage(props: StoryReviewsPageProps) {
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
  const [activeCategory, setActiveCategory] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<Guide[] | null>(null)
  const [isFiltering, setIsFiltering] = useState(false)

  const { title = demo.title, description = demo.description } = settings || {}

  const { data, error } = useSWR(
    activeCategory ? null : [currentPage, itemsPerPage],
    ([page, limit]) => getPaginatedGuides((page - 1) * limit, page * limit),
    {
      fallbackData: currentPage === 1 ? initialPosts : undefined,
    },
  )

  // Reset state when initialPosts change (page navigation)
  useEffect(() => {
    setIsTransitioning(true)
    setPosts(initialPosts)
    setCurrentPage(1)
    setActiveCategory('')
    setFilteredPosts(null)
    mutate(() => true, undefined, { revalidate: false })
    const timer = setTimeout(() => setIsTransitioning(false), 100)
    return () => clearTimeout(timer)
  }, [initialPosts])

  useEffect(() => {
    if (data && !activeCategory) {
      setPosts(data as Guide[])
      setIsTransitioning(false)
    }
  }, [data, activeCategory])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCategoryFilter = async (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1)

    if (!category) {
      setFilteredPosts(null)
      setIsFiltering(false)
      return
    }

    setIsFiltering(true)
    try {
      const results = await getGuidesByCategory(category)
      setFilteredPosts(results)
    } catch {
      setFilteredPosts([])
    } finally {
      setIsFiltering(false)
    }
  }

  const displayedPosts = activeCategory ? (filteredPosts ?? []) : posts
  const isLoading = loading || isTransitioning || isFiltering

  return (
    <>
      <CategoryPageHead
        settings={settings}
        categoryType="guides"
        totalCount={totalPostsCount}
        topItems={initialPosts
          .filter((p) => p.title && p.slug)
          .slice(0, 10)
          .map((p) => ({ name: p.title!, url: `/guide/${p.slug}` }))}
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={'Stories & Guides'}
          summary={
            "Uncover insider tips, hidden gems, and unforgettable adventures. From budget backpacking to luxury escapes, We've got you covered. Let's explore together!"
          }
          img={'/plane.json'}
          contentType="post"
        />

        <Container>
          <div className="my-10 w-full max-w-7xl mx-auto">
            {/* ── Category Filter Tabs ── */}
            <div
              className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide"
              role="tablist"
              aria-label="Filter guides by category"
            >
              {CATEGORIES.map(({ label, value }) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={activeCategory === value}
                  onClick={() => handleCategoryFilter(value)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border-2 ${
                    activeCategory === value
                      ? 'bg-primary text-primary-foreground border-primary shadow-brutalist-sm'
                      : 'bg-card text-foreground border-border hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <CardSkeletonGrid count={12} layout="page" />
            ) : displayedPosts && displayedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {displayedPosts.map((guide) => (
                  <DynamicPostCard
                    key={guide._id}
                    title={guide.title}
                    summary={guide.summary}
                    coverImage={guide.coverImage}
                    linkType="story"
                    date={guide.date}
                    showRating={false}
                    slug={guide.slug}
                    category={guide.category}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center my-10 text-muted-foreground">
                {activeCategory
                  ? 'No guides found in this category.'
                  : 'No stories or guides found.'}
              </p>
            )}
          </div>

          {/* Only show pagination when not filtering by category */}
          {!activeCategory && (
            <PaginationComponent
              totalItems={totalPostsCount}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </Container>
      </Layout>
      <Footer />
    </>
  )
}
