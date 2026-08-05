import PreviewProvider from 'lib/sanity.preview'
import TopListPage from 'components/TopListPage'
import { getSettings, getTopWeightedHotelReviews } from 'lib/sanity.client'
import { HotelReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

import PreviewIndexPage from 'components/PreviewIndexPage'

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
      <PreviewProvider token={token}>
        <PreviewIndexPage />
      </PreviewProvider>
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
      pageTitle="Our Top Hotel Picks | Meet The Whytes"
      pagePath="/top-hotel-picks"
      pageDescription="Our top 10 hotels ranked by weighted ratings from our NBA & WNBA arena travels — the best places we've actually stayed."
      siblingLink="/top-restaurant-picks"
      siblingLabel="Planning where to eat? Check out our Top Restaurant Picks"
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
