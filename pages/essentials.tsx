import { PreviewSuspense } from '@sanity/preview-kit'
import AllReviewsPage from 'components/AllReviewsPage'
import TopListPage from 'components/TopListPage'
import TravelEssentialPage from 'components/TravelEssentialPage'
import { getAllPosts,getSettings,getTravelEssentialPosts } from 'lib/sanity.client'
import { Esssential, Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from "next/head";
import { lazy } from 'react'


const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  TravelEssentialposts: Esssential[]
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
    const { TravelEssentialposts, settings, preview, token } = props
  
 
    if (preview) {
      return (
        <PreviewSuspense
          fallback={
            <TopListPage loading preview posts={TravelEssentialposts} settings={settings} />
          }
        >
          <PreviewIndexPage token={token} />
        </PreviewSuspense>
      )
    }
 
    return <TravelEssentialPage posts={TravelEssentialposts} settings={settings} />
  }
  
  export const getStaticProps: GetStaticProps<
    PageProps,
    Query,
    PreviewData
  > = async (ctx) => {
    const { preview = false, previewData = {} } = ctx
  
    const [settings, TravelEssentialposts = []] = await Promise.all([
      getSettings(),
      getTravelEssentialPosts(),
    ])
  
    return {
      props: {
        TravelEssentialposts,
        settings,
        preview,
        token: previewData.token ?? null,
      },
       revalidate:10
    }
  }