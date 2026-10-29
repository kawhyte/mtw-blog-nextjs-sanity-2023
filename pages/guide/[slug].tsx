// pages/guide/[slug].tsx

import GuidePage from 'components/GuidePage'
import PreviewGuidePage from 'components/PreviewGuidePage'
import {
  type GuideListingItem,
  relatedGuides as pickRelated,
} from 'lib/guideListing'
import {
  getAllGuideSlugs,
  getGuideBySlug,
  getGuideListing,
  getSettings,
} from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { Guide, Settings } from 'lib/sanity.queries'
import { GetStaticPaths, GetStaticProps } from 'next'

// Props Interface & Query
export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = preview ? (previewData.token ?? null) : null

  const slug = params?.slug as string
  const [guide, settings, allGuides] = await Promise.all([
    getGuideBySlug(slug, token ?? undefined),
    getSettings(),
    getGuideListing(),
  ])

  if (!guide) {
    return {
      notFound: true,
      // Re-check so a scheduled post appears once its time passes
      revalidate: 60,
    }
  }

  // "More guides": same category first, then the newest (never empty)
  const relatedGuides = pickRelated(allGuides, {
    slug,
    category: guide.category,
  })

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
  relatedGuides: GuideListingItem[]
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
