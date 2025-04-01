import { PreviewSuspense } from '@sanity/preview-kit'
import StoryReviewsPage from 'components/StoryReviewsPage'
import { getSettings,getStoryPosts } from 'lib/sanity.client'
import { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from "next/head";
import { lazy } from 'react'


const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  posts: Post[]
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
    const { posts, settings, preview, token } = props
  
    if (preview) {
      return (
        <PreviewSuspense
          fallback={
            <StoryReviewsPage loading preview posts={posts} settings={settings} />
          }
        >
          <PreviewIndexPage token={token} />
        </PreviewSuspense>
      )
    }
  
    return <StoryReviewsPage posts={posts} settings={settings} />
  }
  
  export const getStaticProps: GetStaticProps<
    PageProps,
    Query,
    PreviewData
  > = async (ctx) => {
    const { preview = false, previewData = {} } = ctx
  
    const [settings, posts = []] = await Promise.all([
      getSettings(),
     // getAllPosts(),
      getStoryPosts()
    ])
  console.log("posts",posts)
    return {
      props: {
        posts,
        settings,
        preview,
        token: previewData.token ?? null,
      },
      // revalidate:10
    }
  }