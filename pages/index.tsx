import { PreviewSuspense } from '@sanity/preview-kit'
import IndexPage from 'components/IndexPage'
import { getArenaPosts, getIndexPosts, getInstagramPosts, getSettings, getTravelEssentialPosts } from 'lib/sanity.client'
import { Arena, Essential, Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  posts: Post[]
  // Essentialposts: Essential[]
  // arenaPosts:  Arena[]
  settings: Settings
  // instagram: any
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
  const { posts, settings, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <IndexPage loading preview posts={posts} settings={settings}    />
          // <IndexPage loading preview posts={posts} settings={settings} instagram={instagram} Essentialposts={Essentialposts} arenaPosts={arenaPosts}  />
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }


  return <IndexPage posts={posts} settings={settings} />
  // return <IndexPage posts={posts} settings={settings} instagram={instagram} Essentialposts={Essentialposts} arenaPosts={arenaPosts}/>
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, posts = []] = await Promise.all([
  // const [settings, posts = [], instagram,Essentialposts = [], arenaPosts=[]] = await Promise.all([
    getSettings(),
    getIndexPosts(),
    // getInstagramPosts(),
    // getTravelEssentialPosts(),
    // getArenaPosts(),
  ])
  // console.log('Fetched Posts:', posts)
  return {
    props: {
      posts,
      settings,
      // instagram,
      // Essentialposts,
      // arenaPosts,
      preview,
      
      token: previewData.token ?? null,
    },
     revalidate:10
  }
}


