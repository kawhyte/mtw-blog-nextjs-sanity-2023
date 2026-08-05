// components/PreviewHotelReviewPage.tsx
import HotelReviewPage from 'components/HotelReviewPage'
import { useLiveQuery } from 'lib/sanity.preview'
import {
  type HotelReview,
  hotelReviewBySlugQuery,
  type Settings,
} from 'lib/sanity.queries'

interface PreviewHotelReviewPageProps {
  hotelReview: HotelReview
  settings: Settings
}

export default function PreviewHotelReviewPage({
  hotelReview: initialHotelReview,
  settings,
}: PreviewHotelReviewPageProps) {
  const [previewHotelReview] = useLiveQuery<HotelReview>(
    initialHotelReview,
    hotelReviewBySlugQuery,
    { slug: initialHotelReview.slug },
  )

  return (
    <HotelReviewPage
      preview
      hotelReview={previewHotelReview ?? initialHotelReview}
      settings={settings}
    />
  )
}
