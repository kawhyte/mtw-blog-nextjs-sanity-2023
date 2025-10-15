import { PreviewSuspense } from '@sanity/preview-kit'
import IndexPage from 'components/IndexPage'
import { getLatestIndependentContent, getSettings } from 'lib/sanity.client'
import { FoodReview, Guide, HotelReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  posts: (Guide | HotelReview | FoodReview)[]
  // legacyPosts: Post[] // Keep legacy posts as backup if needed
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
          <IndexPage loading preview posts={posts} settings={settings} />
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
    getLatestIndependentContent(), // Using new independent content instead of legacy posts
    // getInstagramPosts(),
    // getTravelEssentialPosts(),
    // getArenaPosts(),
  ])

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
    revalidate: 10,
  }
}
