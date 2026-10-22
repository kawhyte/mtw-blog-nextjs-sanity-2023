import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import CategoryPageHead from 'components/CategoryPageHead'
import Footer from 'components/Footer'
import GuidesBrowse from 'components/guides/GuidesBrowse'
import PreviewIndexPage from 'components/PreviewIndexPage'
import type { GuideListingItem } from 'lib/guideListing'
import { getGuideListing, getSettings } from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'

interface PageProps {
  guides: GuideListingItem[]
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
  const { guides, settings, preview, token } = props

  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewIndexPage />
      </PreviewProvider>
    )
  }

  return (
    <>
      <CategoryPageHead
        settings={settings}
        categoryType="guides"
        totalCount={guides.length}
        topItems={guides
          .slice(0, 10)
          .map((g) => ({ name: g.title, url: `/guide/${g.slug}` }))}
      />
      <Layout preview={false} loading={false}>
        <BlogHeader level={1} />
        <GuidesBrowse guides={guides} />
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

  // Every guide as a lean card (reading time worked out at build time), so
  // the tabs and grid filter on the client with no further requests.
  const [settings, guides] = await Promise.all([
    getSettings(),
    getGuideListing(),
  ])

  return {
    props: {
      guides,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60,
  }
}
