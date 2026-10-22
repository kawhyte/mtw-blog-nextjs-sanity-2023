import IndexPage, { type IndexPageProps } from 'components/IndexPage'
import PreviewIndexPage from 'components/PreviewIndexPage'
import {
  freshFromTheRoad,
  pickHeroArenas,
  toHomeArena,
  toHomeGear,
} from 'lib/homeData'
import { topFavourites } from 'lib/reviewListing'
import {
  getFoodListing,
  getGuideListing,
  getHotelListing,
  getSettings,
  getTravelEssentialPosts,
  getVisitedArenaCards,
} from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { fetchPlaylistVideos } from 'lib/youtube'
import { GetStaticProps } from 'next'

interface PageProps extends IndexPageProps {
  preview: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}

export default function Page({ preview, token, ...props }: PageProps) {
  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewIndexPage {...props} />
      </PreviewProvider>
    )
  }

  return <IndexPage {...props} />
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, arenaCards, hotels, food, guides, gear, youtubeVideos] =
    await Promise.all([
      getSettings(),
      getVisitedArenaCards(),
      getHotelListing(),
      getFoodListing(),
      getGuideListing(),
      getTravelEssentialPosts(),
      fetchPlaylistVideos(process.env.YOUTUBE_PLAYLIST_ID ?? ''),
    ])

  const arenas = arenaCards.map(toHomeArena)

  return {
    props: {
      settings,
      heroArenas: pickHeroArenas(arenas),
      latestArenas: arenas.slice(0, 8),
      counts: {
        arenas: arenas.length,
        hotels: hotels.length,
        food: food.length,
        guides: guides.length,
        gear: gear.length,
      },
      fresh: freshFromTheRoad(hotels, food, guides),
      favouriteHotels: topFavourites(hotels),
      favouriteFood: topFavourites(food),
      gear: toHomeGear(gear),
      youtubeVideos: youtubeVideos ?? [],
      preview,
      token: previewData.token ?? null,
    },
    // Also re-picks the random hero arenas about once a minute
    revalidate: 60,
  }
}
