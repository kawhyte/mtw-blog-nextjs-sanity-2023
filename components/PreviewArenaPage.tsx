// components/PreviewArenaPage.tsx
import ArenaPage from 'components/ArenaPage'
import { useLiveQuery } from 'lib/sanity.preview'
import { type Arena, arenaBySlugQuery, type Settings } from 'lib/sanity.queries'

interface PreviewArenaPageProps {
  arena: Arena
  settings: Settings
}

export default function PreviewArenaPage({
  arena: initialArena,
  settings,
}: PreviewArenaPageProps) {
  const [previewArena] = useLiveQuery<Arena>(initialArena, arenaBySlugQuery, {
    slug: initialArena.slug,
  })

  return (
    <ArenaPage preview arena={previewArena ?? initialArena} settings={settings} />
  )
}
