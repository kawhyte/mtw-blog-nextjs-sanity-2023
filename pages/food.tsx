import FoodReviewsPage from 'components/FoodReviewsPage' // Component to display food reviews
import PreviewIndexPage from 'components/PreviewIndexPage'
import {
  getFoodReviewsTotalCount, // Independent food review count function
  getPaginatedFoodReviews, // Independent food review pagination function
  getSettings,
} from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { FoodReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

// Define how many items to show per page
const ITEMS_PER_PAGE = 12

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
  const { initialPosts, totalPostsCount, settings, preview, token } = props

  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewIndexPage />
      </PreviewProvider>
    )
  }

  return (
    <FoodReviewsPage
      key="food-page"
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
    getFoodReviewsTotalCount(),
  ])

  // Fetch first page of posts and cast to FoodReview[]
  const initialPosts = await getPaginatedFoodReviews(0, ITEMS_PER_PAGE)

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
