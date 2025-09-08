import { PreviewSuspense } from '@sanity/preview-kit'
import TopListPage from 'components/TopListPage'
import { getSettings, getTopWeightedFoodReviews } from 'lib/sanity.client'
import { FoodReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  foodReviews: FoodReview[]
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
  const { foodReviews, settings, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <TopListPage
            loading
            preview
            posts={foodReviews}
            settings={settings}
            postHeader={''}
            img={''}
            summary={''}
            contentType="food"
          />
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }

  return (
    <TopListPage
      posts={foodReviews}
      settings={settings}
      postHeader={'Our Top Restaurant Picks'}
      img={'/ramen.json'}
      summary={
        'Our top 10 restaurants based on weighted average ratings using our new rating system. Discover the best culinary experiences for your next adventure.'
      }
      contentType="food"
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, foodReviews = []] = await Promise.all([
    getSettings(),
    getTopWeightedFoodReviews(10), // Get top 10 weighted food reviews
  ])

  return {
    props: {
      foodReviews,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60, // Cache for 1 minute since we're doing calculations
  }
}
