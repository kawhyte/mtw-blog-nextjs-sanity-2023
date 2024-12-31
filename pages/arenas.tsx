import { PreviewSuspense } from '@sanity/preview-kit'
import AllReviewsPage from 'components/AllReviewsPage'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import NBAArenaCard from 'components/NBAArenaCard'
import ReviewHeader from 'components/ReviewHeader'
import TopListPage from 'components/TopListPage'
import TravelEssentialPage from 'components/TravelEssentialPage'
import {
  getAllPosts,
  getArenaPosts,
  getSettings,
  getTravelEssentialPosts,
} from 'lib/sanity.client'
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

export default function Page(props: PageProps) {
  const { arenaPosts, settings, preview, token } = props

  //console.log("KENNY3 ", props )
  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <AllReviewsPage
            loading
            preview
            posts={arenaPosts}
            settings={settings}
          />
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }

 console.log("ArenaPosts for Ratings", arenaPosts)

  return (
    <>
      <Layout preview={false} loading={false}>
        <Head>
          <title>{CMS_NAME}</title>
          {/* <title> { `${CMS_NAME} - Travel and Food Reviews`}</title> */}
        </Head>

        <BlogHeader title={'title'} description={[]} level={1} />
        <ReviewHeader
          title={'Visiting Every NBA & WNBA Arena'}
          arenas={arenaPosts}
          summary={`We are traveling near and far to every state/country to visit all the NBA and WNBA arenas (${arenaPosts.length}) across the US and Canada. Follow us on this journey.`}
          animation={'/basketball.svg'}
        />

<div className="container mx-auto   mt-14 grid grid-cols-1  place-content-center place-items-center gap-x-6 gap-y-10  px-3 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:gap-x-5 md:px-6  lg:grid-cols-2 xl:grid-cols-3">

{ arenaPosts.map( item => 
        <NBAArenaCard 
        
    // arenaImageSrc= {arenaPosts.arenaImage}
    arenaImageSrc={item.arenaImage}        
    location={item.location}
    constructionDate={item.buildDate}
    capacity={item.capacity}
    // visitedCount={item.visitedCount}
    // galleryCount={item.}
    arenaReview ={item?.arenaReview}
    arenaName={item.name}
    gallery={item.gallery}
    visited={item.visited}
    dateVisited={item.date}
    key={item._id}
   
        
        
        />
)}
        {/* <NBAArenaCard arenas={arenaPosts} /> */}

</div>
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
    revalidate: 10,
  }
}
