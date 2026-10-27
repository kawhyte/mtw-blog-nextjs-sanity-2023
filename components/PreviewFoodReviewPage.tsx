// components/PreviewFoodReviewPage.tsx
import FoodReviewPage from 'components/FoodReviewPage'
import { useLiveQuery } from 'lib/sanity.preview'
import {
  type FoodReview,
  foodReviewBySlugQuery,
  type Settings,
} from 'lib/sanity.queries'

interface PreviewFoodReviewPageProps {
  foodReview: FoodReview
  settings: Settings
}

export default function PreviewFoodReviewPage({
  foodReview: initialFoodReview,
  settings,
}: PreviewFoodReviewPageProps) {
  const [previewFoodReview] = useLiveQuery<FoodReview>(
    initialFoodReview,
    foodReviewBySlugQuery,
    { slug: initialFoodReview.slug, preview: true },
  )

  return (
    <FoodReviewPage
      preview
      foodReview={previewFoodReview ?? initialFoodReview}
      settings={settings}
    />
  )
}
