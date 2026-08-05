import IndexPage from 'components/IndexPage'
import { useLiveQuery } from 'lib/sanity.preview'
import {
  type FoodReview,
  type Guide,
  type HotelReview,
  latestIndependentContentQuery,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'

type LatestContent = { allContent: (Guide | HotelReview | FoodReview)[] }

export default function PreviewIndexPage() {
  const [response] = useLiveQuery<LatestContent>(
    { allContent: [] },
    latestIndependentContentQuery,
  )
  const [settings] = useLiveQuery<Settings>({}, settingsQuery)

  return (
    <IndexPage
      preview
      posts={response?.allContent ?? []}
      settings={settings ?? {}}
    />
  )
}
