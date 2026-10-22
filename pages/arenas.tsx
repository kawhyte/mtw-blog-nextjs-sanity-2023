import ArenaPageContent from 'components/arena/ArenaPageContent'
import ArenaQuestHero from 'components/arena/ArenaQuestHero'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import CategoryPageHead from 'components/CategoryPageHead'
import Footer from 'components/Footer'
import PreviewIndexPage from 'components/PreviewIndexPage'
import { getArenaPosts, getSettings } from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { Arena, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import {
  calculateArenaRanks,
  enrichArenasWithDisplayData,
} from 'utils/arena/arenaUtils'

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

export default function ArenasPage(props: PageProps) {
  const { arenaPosts, settings, preview, token } = props

  // Preview Mode Rendering
  if (preview) {
    return (
      <PreviewProvider token={token}>
        <PreviewIndexPage />
      </PreviewProvider>
    )
  }

  // Standard Page Rendering
  return (
    <>
      <CategoryPageHead
        settings={settings}
        categoryType="arenas"
        totalCount={arenaPosts.length}
        topItems={arenaPosts
          .filter((a) => a.name && a.slug)
          .slice(0, 10)
          .map((a) => ({ name: a.name!, url: `/arena/${a.slug}` }))}
      />
      <Layout preview={preview} loading={false}>
        {/* Header components */}
        <BlogHeader
          title={'Visiting and Ranking Every NBA/WNBA Arena'}
          description={[]}
          level={1}
        />
        <ArenaQuestHero arenas={arenaPosts} />

        <ArenaPageContent arenas={arenaPosts} />

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
    getArenaPosts(),
  ])

  // Basic validation
  if (!Array.isArray(arenaPosts)) {
    console.error('getArenaPosts did not return an array.')
  }

  // ✅ PRE-COMPUTE: Calculate arena rankings at build time (not runtime)
  // This eliminates expensive calculations on the client
  const rankMap = calculateArenaRanks(arenaPosts)

  // ✅ PRE-COMPUTE: Enrich arenas with display data (ratings, rankings)
  // All display properties are now pre-calculated during build
  const enrichedArenas = enrichArenasWithDisplayData(arenaPosts, rankMap)

  return {
    props: {
      arenaPosts: enrichedArenas, // ✅ Send pre-computed data to client
      settings: settings || {},
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60, // Revalidate every minute to keep data fresh
  }
}
