import PreviewProvider from 'lib/sanity.preview'
import IndexPage from 'components/IndexPage'
import {
  getLatestIndependentContent,
  getSettings,
  getTopArenas,
} from 'lib/sanity.client'
import {
  ArenaHighlightCard,
  FoodReview,
  Guide,
  HotelReview,
  Settings,
} from 'lib/sanity.queries'
import {
  fetchChannelShorts,
  fetchPlaylistVideos,
  YoutubeVideo,
} from 'lib/youtube'
import { GetStaticProps } from 'next'

import PreviewIndexPage from 'components/PreviewIndexPage'

interface PageProps {
  posts: (Guide | HotelReview | FoodReview)[]
  settings: Settings
  youtubeVideos: YoutubeVideo[]
  youtubeShorts: YoutubeVideo[]
  arenas: ArenaHighlightCard[]
  preview: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}

export default function Page(props: PageProps) {
  const {
    posts,
    settings,
    youtubeVideos,
    youtubeShorts,
    arenas,
    preview,
    token,
  } = props

  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewIndexPage />
      </PreviewProvider>
    )
  }

  return (
    <IndexPage
      posts={posts}
      settings={settings}
      youtubeVideos={youtubeVideos}
      youtubeShorts={youtubeShorts}
      arenas={arenas}
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [
    settings,
    posts = [],
    youtubeVideos = [],
    youtubeShorts = [],
    arenas = [],
  ] = await Promise.all([
    getSettings(),
    getLatestIndependentContent(),
    fetchPlaylistVideos(process.env.YOUTUBE_PLAYLIST_ID ?? ''),
    fetchChannelShorts(process.env.YOUTUBE_CHANNEL_ID ?? ''),
    getTopArenas(),
  ])

  return {
    props: {
      posts,
      settings,
      youtubeVideos,
      youtubeShorts,
      arenas,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 10,
  }
}
