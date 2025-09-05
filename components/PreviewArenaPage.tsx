// components/PreviewArenaPage.tsx
import ArenaPage from 'components/ArenaPage'
import { usePreview } from 'lib/sanity.preview'
import { type Arena, arenaBySlugQuery, type Settings } from 'lib/sanity.queries'

interface PreviewArenaPageProps {
  token: null | string
  arena: Arena
  settings: Settings
}

export default function PreviewArenaPage({
  token,
  arena: initialArena,
  settings,
}: PreviewArenaPageProps) {
  const params = { slug: initialArena.slug }
  const previewArena: Arena = usePreview(token, arenaBySlugQuery, params)

  return <ArenaPage preview arena={previewArena} settings={settings} />
}
