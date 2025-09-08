import { PreviewSuspense } from '@sanity/preview-kit'
import TopListPage from 'components/TopListPage'
import { getSettings, getTopWeightedHotelReviews } from 'lib/sanity.client'
import { HotelReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  hotelReviews: HotelReview[]
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
  const { hotelReviews, settings, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <TopListPage
            loading
            preview
            posts={hotelReviews}
            settings={settings}
            postHeader={''}
            img={''}
            summary={''}
            contentType="hotel"
          />
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }

  return (
    <TopListPage
      posts={hotelReviews}
      settings={settings}
      postHeader={'Our Top Hotel Picks'}
      img={'/top2.json'}
      summary={
        'Our top 10 hotels based on weighted average ratings using our new rating system. Discover the best hotel experiences for your next NBA arena adventure.'
      }
      contentType="hotel"
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, hotelReviews = []] = await Promise.all([
    getSettings(),
    getTopWeightedHotelReviews(10), // Get top 10 weighted hotel reviews
  ])

  return {
    props: {
      hotelReviews,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60, // Cache for 1 minute since we're doing calculations
  }
}
