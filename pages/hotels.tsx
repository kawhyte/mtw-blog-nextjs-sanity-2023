import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import CategoryPageHead from 'components/CategoryPageHead'
import Footer from 'components/Footer'
import ListingBrowse, {
  type ListingKindTab,
} from 'components/listing/ListingBrowse'
import PreviewIndexPage from 'components/PreviewIndexPage'
import type { ListingItem } from 'lib/reviewListing'
import { getHotelListing, getSettings } from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { Settings } from 'lib/sanity.queries'
import { Building2, Crown, House } from 'lucide-react'
import { GetStaticProps } from 'next'

// Hotel categories, matching the `category` options in schemas/hotelReview.ts
const KIND_TABS: ListingKindTab[] = [
  { key: 'luxury', label: 'Luxury', icon: Crown, gridTitle: 'Luxury stays' },
  {
    key: 'mid-scale',
    label: 'Mid-Scale',
    icon: Building2,
    gridTitle: 'Mid-scale stays',
  },
  { key: 'economy', label: 'Economy', icon: House, gridTitle: 'Economy stays' },
]

interface PageProps {
  hotels: ListingItem[]
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
  const { hotels, settings, preview, token } = props

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
        categoryType="hotels"
        totalCount={hotels.length}
        topItems={hotels
          .slice(0, 10)
          .map((h) => ({ name: h.title, url: `/hotel/${h.slug}` }))}
      />
      <Layout preview={false} loading={false}>
        <BlogHeader level={1} />
        <ListingBrowse
          items={hotels}
          basePath="/hotels"
          itemPath="/hotel"
          title="Hotel Reviews"
          intro={(count) =>
            `${count} stays, honestly rated — from beds to breakfast.`
          }
          kindTabs={KIND_TABS}
          allTitle="All hotel reviews"
          noun="stays"
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

  // Every hotel as a lean card (scores computed at build time), so the rows,
  // tabs and grid all filter on the client with no further requests.
  const [settings, hotels] = await Promise.all([
    getSettings(),
    getHotelListing(),
  ])

  return {
    props: {
      hotels,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60,
  }
}
