import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import CategoryPageHead from 'components/CategoryPageHead'
import Footer from 'components/Footer'
import ListingBrowse, {
  type ListingKindTab,
} from 'components/listing/ListingBrowse'
import PreviewIndexPage from 'components/PreviewIndexPage'
import type { ListingItem } from 'lib/reviewListing'
import { getCruiseListing, getSettings } from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { Settings } from 'lib/sanity.queries'
import { Crown, Gem, Sailboat, Ship } from 'lucide-react'
import { GetStaticProps } from 'next'

// Line tiers, matching the `lineTier` options in schemas/cruiseReview.ts.
// A tier tab only shows once it has a review.
const KIND_TABS: ListingKindTab[] = [
  {
    key: 'contemporary',
    label: 'Contemporary',
    icon: Ship,
    gridTitle: 'Contemporary lines',
  },
  {
    key: 'premium',
    label: 'Premium',
    icon: Sailboat,
    gridTitle: 'Premium lines',
  },
  { key: 'upscale', label: 'Upscale', icon: Gem, gridTitle: 'Upscale lines' },
  { key: 'luxury', label: 'Luxury', icon: Crown, gridTitle: 'Luxury lines' },
]

// Below this many reviews the swipe rows would only repeat the grid
const ROWS_FROM = 4

interface PageProps {
  cruises: ListingItem[]
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
  const { cruises, settings, preview, token } = props

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
        categoryType="cruises"
        totalCount={cruises.length}
        topItems={cruises
          .slice(0, 10)
          .map((c) => ({ name: c.title, url: `/cruise/${c.slug}` }))}
      />
      <Layout preview={false} loading={false}>
        <BlogHeader level={1} />
        <ListingBrowse
          items={cruises}
          basePath="/cruises"
          itemPath="/cruise"
          title="Cruise Reviews"
          intro={(count) =>
            `${count} ${count === 1 ? 'sailing' : 'sailings'}, honestly rated, from the cabin to the real cost.`
          }
          kindTabs={KIND_TABS}
          allTitle="All cruise reviews"
          noun="sailings"
          hideEmptyKindTabs
          rowsFrom={ROWS_FROM}
        />
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

  const [settings, cruises] = await Promise.all([
    getSettings(),
    getCruiseListing(),
  ])

  return {
    props: {
      cruises,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60,
  }
}
