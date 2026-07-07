// components/PreviewGuidePage.tsx
import GuidePage from 'components/GuidePage'
import { usePreview } from 'lib/sanity.preview'
import {
  type Guide,
  guideBySlugQuery,
  type Settings,
} from 'lib/sanity.queries'

interface PreviewGuidePageProps {
  token: null | string
  guide: Guide
  settings: Settings
}

export default function PreviewGuidePage({
  token,
  guide: initialGuide,
  settings,
}: PreviewGuidePageProps) {
  const params = { slug: initialGuide.slug }
  const previewGuide: Guide =
    usePreview(token, guideBySlugQuery, params) || initialGuide

  return <GuidePage preview guide={previewGuide} settings={settings} />
}
