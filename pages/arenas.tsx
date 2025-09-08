import { PreviewSuspense } from '@sanity/preview-kit'
import ArenaPageContent from 'components/arena/ArenaPageContent'
import ArenaPageHeader from 'components/ArenaPageHeader'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import { getArenaPosts, getSettings } from 'lib/sanity.client'
import { Arena, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { lazy } from 'react'

import { CMS_NAME } from '../lib/constants'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  arenaPosts: Arena[]
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

export default function ArenasPage(props: PageProps) {
  const { arenaPosts, settings, preview, token } = props

  // Preview Mode Rendering
  if (preview) {
    return (
      <PreviewSuspense fallback={<div>Loading preview...</div>}>
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }

  // Standard Page Rendering
  return (
    <>
      <Layout preview={preview} loading={false}>
        <Head>
          <title>{`NBA/WNBA Arena Reviews - ${settings.title ?? CMS_NAME}`}</title>
          <meta
            name="description"
            content="We're on a journey to visit and rank every NBA and WNBA arena! Explore our reviews, photos, and experiences from arenas across the US and Canada."
          />
        </Head>

        {/* Header components */}
        <BlogHeader
          title={'Visiting and Ranking Every NBA/WNBA Arena'}
          description={[]}
          level={1}
        />
        <ArenaPageHeader
          title={'Visiting and Ranking Every NBA/WNBA Arena'}
          arenas={arenaPosts}
          summary={`We are traveling near and far to every state/country to visit and rank all the NBA and WNBA arenas (${arenaPosts.length}) across the US and Canada. Follow us on this journey.`}
          animation={'/basketball.svg'}
        />

   
        <ArenaPageContent arenas={arenaPosts} />

        <Footer />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, arenaPosts = []] = await Promise.all([
    getSettings(),
    getArenaPosts(),
  ])

  // Basic validation
  if (!Array.isArray(arenaPosts)) {
    console.error('getArenaPosts did not return an array.')
  }

  return {
    props: {
      arenaPosts: arenaPosts || [],
      settings: settings || {},
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60,
  }
}