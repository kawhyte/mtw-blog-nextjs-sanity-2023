import CruiseReviewPage from 'components/CruiseReviewPage'
import PreviewCruiseReviewPage from 'components/PreviewCruiseReviewPage'
import {
  getAllCruiseReviewSlugs,
  getCruiseReviewBySlug,
  getSettings,
} from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { CruiseReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

interface PageProps {
  review: CruiseReview
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

export default function CruiseSlugRoute(props: PageProps) {
  const { settings, review, preview, token } = props

  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewCruiseReviewPage review={review} settings={settings} />
      </PreviewProvider>
    )
  }

  return <CruiseReviewPage review={review} settings={settings} />
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = preview ? (previewData.token ?? null) : null

  const [settings, review] = await Promise.all([
    getSettings(),
    getCruiseReviewBySlug(params.slug as string, token ?? undefined),
  ])

  if (!review) {
    return {
      notFound: true,
      // Re-check so a scheduled review appears once its time passes
      revalidate: 60,
    }
  }

  return {
    props: { review, settings, preview, token },
    revalidate: 60,
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllCruiseReviewSlugs()

  return {
    paths: slugs?.map((slug) => `/cruise/${slug}`) || [],
    fallback: 'blocking',
  }
}
