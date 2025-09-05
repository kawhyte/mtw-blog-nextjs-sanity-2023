// pages/arena/[slug].tsx

import { PreviewSuspense } from '@sanity/preview-kit'
import ArenaPage from 'components/ArenaPage'
import {
  getAllArenaSlugs,
  getArenaBySlug,
  getSettings,
} from 'lib/sanity.client'
import { Arena, Settings } from 'lib/sanity.queries'
import { GetStaticPaths, GetStaticProps } from 'next'
import { lazy } from 'react'

const PreviewArenaPage = lazy(() => import('components/PreviewArenaPage'))

// Props Interface & Query
export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = previewData.token

  const slug = params?.slug as string
  const arena = await getArenaBySlug(slug)
  const settings = await getSettings()

  if (!arena) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      arena,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60, // Revalidate every minute
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllArenaSlugs()

  return {
    paths: slugs?.map((slug) => `/arena/${slug}`) || [],
    fallback: 'blocking',
  }
}

interface PageProps {
  arena: Arena
  settings?: Settings
  preview: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}

export default function ArenaSlugRoute(props: PageProps) {
  const { settings, arena, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <ArenaPage loading preview arena={arena} settings={settings} />
        }
      >
        <PreviewArenaPage token={token} arena={arena} settings={settings} />
      </PreviewSuspense>
    )
  }

  return <ArenaPage arena={arena} settings={settings} />
}
