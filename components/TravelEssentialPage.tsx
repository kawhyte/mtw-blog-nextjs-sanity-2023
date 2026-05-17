import cn from 'classnames'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import type { Essential, Settings } from 'lib/sanity.queries'
import { PackageCheck } from 'lucide-react'
import Head from 'next/head'
import { useMemo, useState } from 'react'

import { CMS_NAME } from '../lib/constants'
import BlogHeader from './BlogHeader'
import Footer from './Footer'
import TravelEssentialLayout from './TravelEssentialsLayout'

interface TravelEssentialPageProps {
  preview?: boolean
  loading?: boolean
  posts: Essential[]
  settings: Settings
}

const TRIP_FILTERS = [
  { value: 'all', label: 'All Gear' },
  { value: 'nba', label: 'NBA Games' },
  { value: 'cruise', label: 'Cruises' },
  { value: 'daytrip', label: 'Day Trips' },
  { value: 'international', label: 'International' },
]

export default function TravelEssentialPage({
  preview,
  loading,
  posts,
  settings,
}: TravelEssentialPageProps) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredPosts =
    activeFilter === 'all'
      ? posts
      : posts.filter(
          (post) =>
            post.tripType?.includes(activeFilter) ||
            post.tripType?.includes('all'),
        )

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length }
    for (const f of TRIP_FILTERS.filter((f) => f.value !== 'all')) {
      counts[f.value] = posts.filter(
        (p) => p.tripType?.includes(f.value) || p.tripType?.includes('all'),
      ).length
    }
    return counts
  }, [posts])

  const now = new Date()
  const updatedLabel = now.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{`What We Pack — Travel Gear | ${CMS_NAME}`}</title>
          <meta
            name="description"
            content="Our tried-and-tested gear for NBA games, cruises, day trips, and beyond. ~20 curated picks, no fluff."
          />
        </Head>

        <BlogHeader title="" description={[]} level={1} />

        {/* Hero */}
        <section className="bg-primary-soft-background py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
              Travel Gear
            </p>
            <h1 className="font-epilogue mb-4 text-4xl font-bold text-primary md:text-5xl lg:text-6xl">
              What We Pack
            </h1>
            <p className="mb-6 max-w-xl text-base text-muted-foreground md:text-lg">
              From courtside NBA games to Caribbean cruises — tried, tested, and
              always in our bags.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <PackageCheck className="h-3.5 w-3.5 text-primary" />
              <span>
                ~{posts?.length ?? 0} curated picks · Updated {updatedLabel}
              </span>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <div className="border-b border-border bg-background py-4">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              {TRIP_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    'rounded-full border-2 border-foreground px-4 py-2 text-sm font-medium transition-all duration-200',
                    activeFilter === filter.value
                      ? 'scale-95 bg-foreground text-background shadow-none'
                      : 'bg-card text-foreground hover:-translate-y-0.5 hover:bg-accent hover:shadow-brutalist-sm',
                  )}
                >
                  {filter.label}
                  {(filterCounts[filter.value] ?? 0) > 0 && (
                    <span className="ml-1 text-xs opacity-60">
                      ({filterCounts[filter.value]})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <section className="py-12">
          {filteredPosts.length > 0 ? (
            <TravelEssentialLayout posts={filteredPosts} />
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-base">No items for this trip type yet.</p>
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="mt-4 text-sm font-medium text-primary underline underline-offset-4"
              >
                View all gear
              </button>
            </div>
          )}
        </section>
      </Layout>
      <Footer />
    </>
  )
}
