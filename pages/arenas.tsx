import { PreviewSuspense } from '@sanity/preview-kit'
import AllReviewsPage from 'components/AllReviewsPage'
import Arenas from 'components/Arenas'
import TopListPage from 'components/TopListPage'
import TravelEssentialPage from 'components/TravelEssentialPage'
import { getAllPosts,getArenaPosts,getSettings,getTravelEssentialPosts } from 'lib/sanity.client'
import { Arena, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from "next/head";
import { lazy } from 'react'


const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  arenaPosts:  Arena[]
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
    const {  settings,arenaPosts, preview, token } = props
  
    //console.log("KENNY3 ", props )
    // if (preview) {
    //   return (
    //     <PreviewSuspense
    //       fallback={
    //         <TopListPage loading preview  settings={settings} />
    //       }
    //     >
    //       <PreviewIndexPage token={token} />
    //     </PreviewSuspense>
    //   )
    // }
 
    return <Arenas arenas={arenaPosts}  />
  }
  
  export const getStaticProps: GetStaticProps<
    PageProps,
    Query,
    PreviewData
  > = async (ctx) => {
    const { preview = false, previewData = {} } = ctx
  
    const [settings, arenaPosts=[]] = await Promise.all([
      getSettings(),
    //   getTravelEssentialPosts(),
      getArenaPosts(),
    ])
  
    return {
      props: {
        arenaPosts,
        settings,
        preview,
        token: previewData.token ?? null,
      },
       revalidate:10
    }
  }