import { PreviewSuspense } from '@sanity/preview-kit'
import IndexPage from 'components/IndexPage'
import { getAllPosts, getInstagramPosts, getSettings } from 'lib/sanity.client'
import { Post, Settings } from 'lib/sanity.queries'
import { GetServerSideProps, GetStaticProps } from 'next'
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

interface PageProps {
  posts: Post[]
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
  const { posts, settings,instagram, preview, token } = props

  if (preview) {
    return (
      <PreviewSuspense
        fallback={
          <IndexPage loading preview posts={posts} settings={settings} instagram={instagram} />
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    )
  }


  return <IndexPage posts={posts} settings={settings} instagram={instagram} />
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, posts = [], instagram] = await Promise.all([
    getSettings(),
    getAllPosts(),
    getInstagramPosts()
  ])

  return {
    props: {
      posts,
      settings,
      instagram,
      preview,
      token: previewData.token ?? null,
    },
     revalidate:10
  }
}


