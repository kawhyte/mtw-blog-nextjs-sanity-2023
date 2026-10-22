import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import CategoryPageHead from 'components/CategoryPageHead'
import Footer from 'components/Footer'
import ListingBrowse, {
  type ListingKindTab,
} from 'components/listing/ListingBrowse'
import PreviewIndexPage from 'components/PreviewIndexPage'
import type { ListingItem } from 'lib/reviewListing'
import { getFoodListing, getSettings } from 'lib/sanity.client'
import PreviewProvider from 'lib/sanity.preview'
import { Settings } from 'lib/sanity.queries'
import { ShoppingBag, Utensils } from 'lucide-react'
import { GetStaticProps } from 'next'

// Dining types, matching the `diningType` options in schemas/foodReview.ts
const KIND_TABS: ListingKindTab[] = [
  { key: 'dinein', label: 'Dine-in', icon: Utensils, gridTitle: 'Dine-in' },
  { key: 'takeout', label: 'Takeout', icon: ShoppingBag, gridTitle: 'Takeout' },
]

interface PageProps {
  restaurants: ListingItem[]
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
  const { restaurants, settings, preview, token } = props

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
        categoryType="food"
        totalCount={restaurants.length}
        topItems={restaurants
          .slice(0, 10)
          .map((r) => ({ name: r.title, url: `/food/${r.slug}` }))}
      />
      <Layout preview={false} loading={false}>
        <BlogHeader level={1} />
        <ListingBrowse
          items={restaurants}
          basePath="/food"
          itemPath="/food"
          title="Food Reviews"
          intro={(count) =>
            `${count} places we’ve eaten, honestly rated. Hidden gems to fancy hotspots.`
          }
          kindTabs={KIND_TABS}
          allTitle="All food reviews"
          noun="places"
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

  // Every restaurant as a lean card (scores computed at build time), so the
  // rows, tabs and grid all filter on the client with no further requests.
  const [settings, restaurants] = await Promise.all([
    getSettings(),
    getFoodListing(),
  ])

  return {
    props: {
      restaurants,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60,
  }
}
