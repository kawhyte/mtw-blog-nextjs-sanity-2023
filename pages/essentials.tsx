import PreviewIndexPage from 'components/PreviewIndexPage'
import TopListPage from 'components/TopListPage'
import TravelEssentialPage from 'components/TravelEssentialPage'
import { getSettings, getTravelEssentialPosts } from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { Essential, Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from 'next/head'

interface PageProps {
  TravelEssentialposts: any
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
      <PreviewProvider token={token}>
        <PreviewIndexPage />
      </PreviewProvider>
    )
  }

  return (
    <TravelEssentialPage posts={TravelEssentialposts} settings={settings} />
  )
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
    revalidate: 10,
  }
}
