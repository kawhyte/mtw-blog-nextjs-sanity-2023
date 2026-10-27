import FoodReviewPage from 'components/FoodReviewPage'
import PreviewFoodReviewPage from 'components/PreviewFoodReviewPage'
import {
  getAllFoodReviewSlugs,
  getArenasInLocation,
  getFoodReviewBySlug,
  getSettings,
} from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { FoodReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

interface PageProps {
  foodReview: FoodReview
  /** Arenas in the same city, for the "Going to a game?" box */
  arenasInCity: { name: string; slug: string; location: string }[]
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

export default function FoodSlugRoute(props: PageProps) {
  const { settings, foodReview, arenasInCity, preview, token } = props

  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewFoodReviewPage foodReview={foodReview} settings={settings} />
      </PreviewProvider>
    )
  }

  return (
    <FoodReviewPage
      foodReview={foodReview}
      settings={settings}
      arenasInCity={arenasInCity}
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = preview ? (previewData.token ?? null) : null

  const [settings, foodReview] = await Promise.all([
    getSettings(),
    getFoodReviewBySlug(params.slug as string, token ?? undefined),
  ])

  if (!foodReview) {
    return {
      notFound: true,
      // Re-check so a scheduled post appears once its time passes
      revalidate: 60,
    }
  }

  const arenasInCity = await getArenasInLocation(foodReview.location)

  return {
    props: {
      foodReview,
      arenasInCity,
      settings,
      preview,
      token,
    },
    // Revalidate every 60 seconds when page is requested
    revalidate: 60,
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllFoodReviewSlugs()

  return {
    paths: slugs?.map((slug) => `/food/${slug}`) || [],
    fallback: 'blocking',
  }
}
