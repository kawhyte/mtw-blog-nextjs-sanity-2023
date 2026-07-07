// components/PreviewHotelReviewPage.tsx
import HotelReviewPage from 'components/HotelReviewPage'
import { usePreview } from 'lib/sanity.preview'
import {
  type HotelReview,
  hotelReviewBySlugQuery,
  type Settings,
} from 'lib/sanity.queries'

interface PreviewHotelReviewPageProps {
  token: null | string
  hotelReview: HotelReview
  settings: Settings
}

export default function PreviewHotelReviewPage({
  token,
  hotelReview: initialHotelReview,
  settings,
}: PreviewHotelReviewPageProps) {
  const params = { slug: initialHotelReview.slug }
  const previewHotelReview: HotelReview =
    usePreview(token, hotelReviewBySlugQuery, params) || initialHotelReview

  return (
    <HotelReviewPage
      preview
      hotelReview={previewHotelReview}
      settings={settings}
    />
  )
}
