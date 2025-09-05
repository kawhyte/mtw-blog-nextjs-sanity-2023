// pages/guide/[slug].tsx

import { PreviewSuspense } from '@sanity/preview-kit'
import GuidePage from 'components/GuidePage'
import {
  getAllGuideSlugs,
  getGuideBySlug,
  getSettings,
} from 'lib/sanity.client'
import { Guide, Settings } from 'lib/sanity.queries'
import { GetStaticPaths, GetStaticProps } from 'next'
import { lazy } from 'react'

// TODO: Create PreviewGuidePage component
const PreviewGuidePage = lazy(() => import('components/PreviewPostPage'))

// Props Interface & Query
export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {}, params = {} } = ctx

  const token = previewData.token

  const slug = params?.slug as string
  const guide = await getGuideBySlug(slug)
  const settings = await getSettings()

  if (!guide) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      guide,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60, // Revalidate every minute
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

export default function GuideSlugRoute(props: PageProps) {
  const { settings, guide, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <GuidePage loading preview guide={guide} settings={settings} />
        }
      >
        <PreviewGuidePage
          token={token}
          post={guide}
          settings={settings}
          contentType="guide"
        />
      </PreviewSuspense>
    )
  }

  return <GuidePage guide={guide} settings={settings} />
}
