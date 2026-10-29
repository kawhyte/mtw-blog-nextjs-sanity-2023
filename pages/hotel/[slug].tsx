import HotelReviewPage from 'components/HotelReviewPage'
import PreviewHotelReviewPage from 'components/PreviewHotelReviewPage'
import {
  getAllHotelReviewSlugs,
  getArenasInLocation,
  getHotelReviewBySlug,
  getSettings,
} from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { HotelReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

interface PageProps {
  hotelReview: HotelReview
  arenasInCity: { name: string; slug: string; location: string }[]
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

export default function HotelSlugRoute(props: PageProps) {
  const { settings, hotelReview, arenasInCity, preview, token } = props

  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewHotelReviewPage hotelReview={hotelReview} settings={settings} />
      </PreviewProvider>
    )
  }

  return (
    <HotelReviewPage
      hotelReview={hotelReview}
      arenasInCity={arenasInCity}
      settings={settings}
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = preview ? (previewData.token ?? null) : null

  const [settings, hotelReview] = await Promise.all([
    getSettings(),
    getHotelReviewBySlug(params.slug as string, token ?? undefined),
  ])

  if (!hotelReview) {
    return {
      notFound: true,
      // Re-check so a scheduled post appears once its time passes
      revalidate: 60,
    }
  }

  const arenasInCity = await getArenasInLocation(hotelReview.location)

  return {
    props: {
      hotelReview,
      arenasInCity,
      settings,
      preview,
      token,
    },
    // Revalidate every 60 seconds when page is requested
    // Only rebuilds if content actually changed in Sanity
    revalidate: 60,
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllHotelReviewSlugs()

  return {
    paths: slugs?.map((slug) => `/hotel/${slug}`) || [],
    fallback: 'blocking',
  }
}
