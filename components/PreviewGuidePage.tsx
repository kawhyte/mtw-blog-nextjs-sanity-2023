// components/PreviewGuidePage.tsx
import GuidePage from 'components/GuidePage'
import { useLiveQuery } from 'lib/sanity.preview'
import { type Guide, guideBySlugQuery, type Settings } from 'lib/sanity.queries'

interface PreviewGuidePageProps {
  guide: Guide
  settings: Settings
}

export default function PreviewGuidePage({
  guide: initialGuide,
  settings,
}: PreviewGuidePageProps) {
  const [previewGuide] = useLiveQuery<Guide>(initialGuide, guideBySlugQuery, {
    slug: initialGuide.slug,
    preview: true,
  })

  return (
    <GuidePage
      preview
      guide={previewGuide ?? initialGuide}
      settings={settings}
    />
  )
}
