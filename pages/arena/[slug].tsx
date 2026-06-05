// pages/arena/[slug].tsx

import { PreviewSuspense } from '@sanity/preview-kit'
import ArenaPage from 'components/ArenaPage'
import {
  getAllArenaSlugs,
  getArenaBySlug,
  getArenaPosts,
  getFoodReviewsByArena,
  getSettings,
} from 'lib/sanity.client'
import { urlForImage } from 'lib/sanity.image'
import { Arena, ArenaFoodReviewCard, Settings } from 'lib/sanity.queries'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { lazy } from 'react'
import { calculateArenaRanks } from 'utils/arena/arenaUtils'

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
  const [arena, settings, arenaPosts] = await Promise.all([
    getArenaBySlug(slug),
    getSettings(),
    getArenaPosts(),
  ])

  if (!arena) {
    return {
      notFound: true,
    }
  }

  const foodReviews = await getFoodReviewsByArena(arena._id)

  const rankMap = calculateArenaRanks(arenaPosts ?? [])
  const rank = arena.visited ? (rankMap.get(arena._id) ?? null) : null
  const totalVisited = (arenaPosts ?? []).filter((a) => a.visited).length
  const isTied =
    rank !== null
      ? [...rankMap.values()].filter((r) => r === rank).length > 1
      : false

  return {
    props: {
      arena,
      settings,
      preview,
      token: previewData.token ?? null,
      rank,
      totalVisited,
      isTied,
      foodReviews: foodReviews ?? [],
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
  rank: number | null
  totalVisited: number
  isTied: boolean
  foodReviews: ArenaFoodReviewCard[]
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}

export default function ArenaSlugRoute(props: PageProps) {
  const { settings, arena, preview, token, rank, totalVisited, isTied, foodReviews } = props

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

  return (
    <>
      <Head>
        {arena.arenaImage && (
          <link
            rel="preload"
            as="image"
            href={urlForImage(arena.arenaImage)
              .width(1200)
              .height(630)
              .quality(85)
              .url()}
          />
        )}
      </Head>
      <ArenaPage
        arena={arena}
        settings={settings}
        rank={rank}
        totalVisited={totalVisited}
        isTied={isTied}
        foodReviews={foodReviews}
      />
    </>
  )
}
