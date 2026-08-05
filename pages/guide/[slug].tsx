// pages/guide/[slug].tsx

import PreviewProvider from 'lib/sanity.preview'
import GuidePage from 'components/GuidePage'
import {
  getAllGuideSlugs,
  getGuideBySlug,
  getRelatedGuides,
  getSettings,
} from 'lib/sanity.client'
import { Guide, Settings } from 'lib/sanity.queries'
import { GetStaticPaths, GetStaticProps } from 'next'

import PreviewGuidePage from 'components/PreviewGuidePage'

// Props Interface & Query
export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = preview ? (previewData.token ?? null) : null

  const slug = params?.slug as string
  const [guide, settings] = await Promise.all([
    getGuideBySlug(slug, token ?? undefined),
    getSettings(),
  ])

  if (!guide) {
    return {
      notFound: true,
    }
  }

  const relatedGuides = guide.category
    ? await getRelatedGuides(guide.category, slug)
    : []

  return {
    props: {
      guide,
      settings,
      relatedGuides,
      preview,
      token,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllGuideSlugs()

  return {
    paths: slugs?.map((slug) => `/guide/${slug}`) || [],
    fallback: 'blocking',
  }
}

interface PageProps {
  guide: Guide
  settings: Settings
  relatedGuides: Guide[]
  preview: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}

export default function GuideSlugRoute(props: PageProps) {
  const { settings, guide, relatedGuides, preview, token } = props

  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewGuidePage guide={guide} settings={settings} />
      </PreviewProvider>
    )
  }

  return (
    <GuidePage
      guide={guide}
      settings={settings}
      relatedGuides={relatedGuides}
    />
  )
}
