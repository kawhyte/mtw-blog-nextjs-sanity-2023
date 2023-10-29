import { PreviewSuspense } from '@sanity/preview-kit'
import IndexPage from 'components/IndexPage'
import { getAllPosts, getInstagramPosts, getSettings, getTravelEssentialPosts } from 'lib/sanity.client'
import { Esssential, Post, Settings } from 'lib/sanity.queries'
import { GetServerSideProps, GetStaticProps } from 'next'
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  posts: Post[]
  Essentialposts: Esssential[]

  settings: Settings
  instagram: any
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
  const { posts,Essentialposts, settings,instagram, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <IndexPage loading preview posts={posts} settings={settings} instagram={instagram} Essentialposts={Essentialposts}  />
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }


  return <IndexPage posts={posts} settings={settings} instagram={instagram} Essentialposts={Essentialposts} />
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, posts = [], instagram,Essentialposts = []] = await Promise.all([
    getSettings(),
    getAllPosts(),
    getInstagramPosts(),
    getTravelEssentialPosts(),
  ])

  return {
    props: {
      posts,
      settings,
      instagram,
      Essentialposts,
      preview,
      
      token: previewData.token ?? null,
    },
     //revalidate:10
  }
}


