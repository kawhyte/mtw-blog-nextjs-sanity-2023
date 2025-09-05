import { PreviewSuspense } from '@sanity/preview-kit'
import TopListPage from 'components/TopListPage'
import {
  getSettings,
  getTopWeightedFoodPosts,
  getTopWeightedHotelPosts,
} from 'lib/sanity.client'
import { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  posts: Post[]
  settings: Settings
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
  const { posts, settings, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <TopListPage
            loading
            preview
            posts={posts}
            settings={settings}
            postHeader={''}
            img={''}
            summary={''}
          />
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }

  return (
    <TopListPage
      posts={posts}
      settings={settings}
      postHeader={'Our Top Hotel Picks'}
      img={'/top2.json'}
      summary={
        'Our top 10 hotels based on weighted average ratings, and our curated food guide. Discover the best experiences for your next adventure.'
      }
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, topWeightedHotels = [], topWeightedFoods = []] =
    await Promise.all([
      getSettings(),
      // getRecommendationPosts(),
      getTopWeightedHotelPosts(), // Use the function to fetch top weighted hotels
      // getTopWeightedFoodPosts(), // Use the new function to fetch top weighted food
    ])

  const posts = topWeightedHotels

  return {
    props: {
      posts,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 10,
  }
}
