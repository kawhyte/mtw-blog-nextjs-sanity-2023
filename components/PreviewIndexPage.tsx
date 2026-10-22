import IndexPage, { type IndexPageProps } from 'components/IndexPage'
import { useLiveQuery } from 'lib/sanity.preview'
import { type Settings, settingsQuery } from 'lib/sanity.queries'

/** Draft mode: the homepage rows come from the last build, settings are live */
export default function PreviewIndexPage(props: Partial<IndexPageProps>) {
  const [settings] = useLiveQuery<Settings>(props.settings ?? {}, settingsQuery)

  return (
    <IndexPage {...props} preview settings={settings ?? props.settings ?? {}} />
  )
}
