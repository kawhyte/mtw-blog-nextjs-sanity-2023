import { PreviewSuspense } from '@sanity/preview-kit'
import HotelReviewPage from 'components/HotelReviewPage'
import {
  getAllHotelReviewSlugs,
  getHotelReviewBySlug,
  getSettings,
} from 'lib/sanity.client'
import { HotelReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { lazy } from 'react'

// TODO: Create PreviewHotelReviewPage component
const PreviewHotelReviewPage = lazy(() => import('components/PreviewPostPage'))

interface PageProps {
  hotelReview: HotelReview
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

export default function HotelSlugRoute(props: PageProps) {
  const { settings, hotelReview, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <HotelReviewPage
            loading
            preview
            hotelReview={hotelReview}
            settings={settings}
          />
        }
      >
        <PreviewHotelReviewPage
          token={token}
          post={hotelReview}
          settings={settings}
          contentType="hotelReview"
        />
      </PreviewSuspense>
    )
  }

  return <HotelReviewPage hotelReview={hotelReview} settings={settings} />
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = previewData.token

  const [settings, hotelReview] = await Promise.all([
    getSettings(),
    getHotelReviewBySlug(params.slug as string),
  ])

  if (!hotelReview) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      hotelReview,
      settings,
      preview,
      token: previewData.token ?? null,
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
