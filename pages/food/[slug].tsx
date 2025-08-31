import { PreviewSuspense } from '@sanity/preview-kit'
import FoodReviewPage from 'components/FoodReviewPage'
import {
  getAllFoodReviewSlugs,
  getFoodReviewBySlug,
  getSettings,
} from 'lib/sanity.client'
import { FoodReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { lazy } from 'react'

// TODO: Create PreviewFoodReviewPage component
const PreviewFoodReviewPage = lazy(() => import('components/PreviewPostPage'))

interface PageProps {
  foodReview: FoodReview
  settings?: Settings
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
  const { settings, foodReview, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <FoodReviewPage
            loading
            preview
            foodReview={foodReview}
            settings={settings}
          />
        }
      >
        <PreviewFoodReviewPage
          token={token}
          post={foodReview}
          settings={settings}
          contentType="foodReview"
        />
      </PreviewSuspense>
    )
  }

  return (
    <FoodReviewPage 
      foodReview={foodReview} 
      settings={settings} 
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = previewData.token

  const [settings, foodReview] = await Promise.all([
    getSettings(),
    getFoodReviewBySlug(params.slug as string),
  ])

  if (!foodReview) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      foodReview,
      settings,
      preview,
      token: previewData.token ?? null,
    },
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllFoodReviewSlugs()

  return {
    paths: slugs?.map((slug) => `/food/${slug}`) || [],
    fallback: 'blocking',
  }
}
