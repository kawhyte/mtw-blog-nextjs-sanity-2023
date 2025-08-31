import { PreviewSuspense } from '@sanity/preview-kit'
import FoodReviewsPage from 'components/FoodReviewsPage' // Component to display food reviews
import {
  getSettings,
  getPaginatedFoodPosts,
  getFoodPostsTotalCount
} from 'lib/sanity.client'
import { FoodReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from "next/head"; // Keep if used
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

// Define how many items to show per page
const ITEMS_PER_PAGE = 12;

interface PageProps {
  initialPosts: FoodReview[]
  totalPostsCount: number
  settings: Settings
  preview: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}


export default function Page(props: PageProps) {
    const {
      initialPosts,
      totalPostsCount,
      settings,
      preview,
      token
     } = props

    if (preview) {
      return (
        <PreviewSuspense
          fallback={
            <FoodReviewsPage
              loading
              preview
              initialPosts={initialPosts}
              totalPostsCount={totalPostsCount}
              itemsPerPage={ITEMS_PER_PAGE}
              settings={settings}
            />
          }
        >
          <PreviewIndexPage token={token} />
        </PreviewSuspense>
      )
    }

    return (
      <FoodReviewsPage
          initialPosts={initialPosts}
          totalPostsCount={totalPostsCount}
          itemsPerPage={ITEMS_PER_PAGE}
          settings={settings}
       />
    )
  }

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  // Fetch settings and total count concurrently
  const [settings, totalPostsCount] = await Promise.all([
    getSettings(),
    getFoodPostsTotalCount(),
  ]);

  // Fetch first page of posts and cast to FoodReview[]
  const initialPosts = await getPaginatedFoodPosts(0, ITEMS_PER_PAGE);

  console.log('Food Reviews Found:', initialPosts?.length || 0);
  console.log('Total Food Reviews:', totalPostsCount);
  console.log('Sample Food Review:', initialPosts?.[0] || 'None');

  return {
    props: {
      initialPosts: initialPosts as FoodReview[], // Cast to FoodReview[] for compatibility
      totalPostsCount,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60,
  }
}