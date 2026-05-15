import { PreviewSuspense } from '@sanity/preview-kit'
import IndexPage from 'components/IndexPage'
import { getLatestIndependentContent, getSettings } from 'lib/sanity.client'
import { FoodReview, Guide, HotelReview, Settings } from 'lib/sanity.queries'
import {
  fetchChannelShorts,
  fetchPlaylistVideos,
  YoutubeVideo,
} from 'lib/youtube'
import { GetStaticProps } from 'next'
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  posts: (Guide | HotelReview | FoodReview)[]
  settings: Settings
  youtubeVideos: YoutubeVideo[]
  youtubeShorts: YoutubeVideo[]
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
  const { posts, settings, youtubeVideos, youtubeShorts, preview, token } =
    props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <IndexPage
            loading
            preview
            posts={posts}
            settings={settings}
            youtubeVideos={youtubeVideos}
            youtubeShorts={youtubeShorts}
          />
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }

  return (
    <IndexPage
      posts={posts}
      settings={settings}
      youtubeVideos={youtubeVideos}
      youtubeShorts={youtubeShorts}
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, posts = [], youtubeVideos = [], youtubeShorts = []] =
    await Promise.all([
      getSettings(),
      getLatestIndependentContent(),
      fetchPlaylistVideos(process.env.YOUTUBE_PLAYLIST_ID ?? ''),
      fetchChannelShorts(process.env.YOUTUBE_CHANNEL_ID ?? ''),
    ])

  return {
    props: {
      posts,
      settings,
      youtubeVideos,
      youtubeShorts,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 10,
  }
}
