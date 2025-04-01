import IndexPage from 'components/IndexPage'
import { usePreview } from 'lib/sanity.preview'
import {
  type Arena,
  arenaQuery,
  type Essential,
  indexQuery,
  type Instagram,
  type Post,
  type Settings,
  settingsQuery,
  travelEssentialQuery,
} from 'lib/sanity.queries'

export default function PreviewIndexPage({ token }: { token: null | string }) {
  const posts: Post[] = usePreview(token, indexQuery) || []
  const settings: Settings = usePreview(token, settingsQuery) || {}
  // const instagram: Instagram = usePreview(token, settingsQuery) || {}
  // const Essentialposts: Essential[] = usePreview(token, travelEssentialQuery) || {}
  // const arena: Arena[] = usePreview(token, arenaQuery) || {}

  return <IndexPage preview posts={posts} settings={settings}  />
  // return <IndexPage preview posts={posts} settings={settings} instagram={instagram} Essentialposts={Essentialposts} arenaPosts={arena} />
}
