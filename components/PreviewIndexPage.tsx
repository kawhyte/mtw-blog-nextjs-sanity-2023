import IndexPage from 'components/IndexPage'
import { usePreview } from 'lib/sanity.preview'
import {
  type FoodReview,
  type Guide,
  type HotelReview,
  latestIndependentContentQuery,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'

export default function PreviewIndexPage({ token }: { token: null | string }) {
  const response: { allContent: (Guide | HotelReview | FoodReview)[] } =
    usePreview(token, latestIndependentContentQuery) || { allContent: [] }
  const posts = response.allContent
  const settings: Settings = usePreview(token, settingsQuery) || {}
  // const instagram: Instagram = usePreview(token, settingsQuery) || {}
  // const Essentialposts: Essential[] = usePreview(token, travelEssentialQuery) || {}
  // const arena: Arena[] = usePreview(token, arenaQuery) || {}

  return <IndexPage preview posts={posts} settings={settings} />
  // return <IndexPage preview posts={posts} settings={settings} instagram={instagram} Essentialposts={Essentialposts} arenaPosts={arena} />
}
