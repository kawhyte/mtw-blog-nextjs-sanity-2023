import CruiseReviewPage from 'components/CruiseReviewPage'
import { useLiveQuery } from 'lib/sanity.preview'
import {
  type CruiseReview,
  cruiseReviewBySlugQuery,
  type Settings,
} from 'lib/sanity.queries'

interface PreviewCruiseReviewPageProps {
  review: CruiseReview
  settings: Settings
}

export default function PreviewCruiseReviewPage({
  review: initialReview,
  settings,
}: PreviewCruiseReviewPageProps) {
  const [previewReview] = useLiveQuery<CruiseReview>(
    initialReview,
    cruiseReviewBySlugQuery,
    { slug: initialReview.slug, preview: true },
  )

  return (
    <CruiseReviewPage
      preview
      review={previewReview ?? initialReview}
      settings={settings}
    />
  )
}
