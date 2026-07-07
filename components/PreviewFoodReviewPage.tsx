// components/PreviewFoodReviewPage.tsx
import FoodReviewPage from 'components/FoodReviewPage'
import { usePreview } from 'lib/sanity.preview'
import {
  type FoodReview,
  foodReviewBySlugQuery,
  type Settings,
} from 'lib/sanity.queries'

interface PreviewFoodReviewPageProps {
  token: null | string
  foodReview: FoodReview
  settings: Settings
}

export default function PreviewFoodReviewPage({
  token,
  foodReview: initialFoodReview,
  settings,
}: PreviewFoodReviewPageProps) {
  const params = { slug: initialFoodReview.slug }
  const previewFoodReview: FoodReview =
    usePreview(token, foodReviewBySlugQuery, params) || initialFoodReview

  return (
    <FoodReviewPage preview foodReview={previewFoodReview} settings={settings} />
  )
}
