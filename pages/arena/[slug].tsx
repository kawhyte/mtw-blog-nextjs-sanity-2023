// pages/arena/[slug].tsx

import ArenaPage from 'components/ArenaPage'
import PreviewArenaPage from 'components/PreviewArenaPage'
import { type ArenaGameDay, buildArenaGameDay } from 'lib/arenaGameDay'
import { primaryCityLocation } from 'lib/cityMatch'
import {
  getAllArenaSlugs,
  getArenaBySlug,
  getArenaPosts,
  getCityPageData,
  getFoodReviewsByArena,
  getSettings,
} from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { Arena, ArenaFoodReviewCard, Settings } from 'lib/sanity.queries'
import { GetStaticPaths, GetStaticProps } from 'next'
import { calculateArenaRanks } from 'utils/arena/arenaUtils'

// Props Interface & Query
export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = preview ? (previewData.token ?? null) : null

  const slug = params?.slug as string
  const [arena, settings, arenaPosts] = await Promise.all([
    getArenaBySlug(slug, token ?? undefined),
    getSettings(),
    getArenaPosts(),
  ])

  if (!arena) {
    return {
      notFound: true,
    }
  }

  // The city page this arena links to: Paradise → the Las Vegas page, etc.
  const arenaLocations = [
    ...new Set((arenaPosts ?? []).map((a) => a.location).filter(Boolean)),
  ] as string[]
  const cityLocation = arena.location
    ? primaryCityLocation(arena.location, arenaLocations)
    : null

  const [foodReviews, cityData] = await Promise.all([
    getFoodReviewsByArena(arena._id),
    cityLocation ? getCityPageData(cityLocation, arenaLocations) : null,
  ])
  const gameDay =
    cityData && cityLocation && arena.slug
      ? buildArenaGameDay(cityData, cityLocation, arena.slug)
      : null

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
      token,
      rank,
      totalVisited,
      isTied,
      foodReviews: foodReviews ?? [],
      cityLocation,
      gameDay,
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
  settings: Settings
  preview: boolean
  token: string | null
  rank: number | null
  totalVisited: number
  cityLocation: string | null
  isTied: boolean
  foodReviews: ArenaFoodReviewCard[]
  gameDay: ArenaGameDay | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}

export default function ArenaSlugRoute(props: PageProps) {
  const {
    settings,
    arena,
    preview,
    token,
    rank,
    totalVisited,
    isTied,
    foodReviews,
    cityLocation,
    gameDay,
  } = props

  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewArenaPage arena={arena} settings={settings} />
      </PreviewProvider>
    )
  }

  return (
    <>
      {/* No manual image preload: the hero's next/image `priority` already preloads the real
          responsive LCP image. A hand-written 1200×630 arenaImage preload matched no rendered
          image and competed with the hero for bandwidth. */}
      <ArenaPage
        arena={arena}
        settings={settings}
        rank={rank}
        totalVisited={totalVisited}
        isTied={isTied}
        foodReviews={foodReviews}
        cityLocation={cityLocation}
        gameDay={gameDay}
      />
    </>
  )
}
