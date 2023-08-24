import IndexPage from 'components/IndexPage'
import { usePreview } from 'lib/sanity.preview'
import {
  indexQuery,
  type Instagram,
  type Post,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'

export default function PreviewIndexPage({ token }: { token: null | string }) {
  const posts: Post[] = usePreview(token, indexQuery) || []
  const settings: Settings = usePreview(token, settingsQuery) || {}
  const instagram: Instagram = usePreview(token, settingsQuery) || {}

  return <IndexPage preview posts={posts} settings={settings} instagram={instagram} />
}
