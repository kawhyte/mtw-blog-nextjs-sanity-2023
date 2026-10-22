import ListingHeader, {
  type ListingHeaderTab,
} from 'components/listing/ListingHeader'
import PaginationComponent from 'components/PaginationComponent'
import SanityImage from 'components/SanityImage'
import type { GuideListingItem } from 'lib/guideListing'
import {
  Building2,
  BusFront,
  Gem,
  Landmark,
  LayoutGrid,
  Lightbulb,
  Mountain,
  Users,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

import GuideCard, { guideCategory, guideMonth } from './GuideCard'

// Short tab names; the full names (e.g. "Budget Travel") show on cards
const CATEGORY_TABS: Record<string, Omit<ListingHeaderTab, 'key'>> = {
  tips: { label: 'Travel Tips', icon: Lightbulb },
  budget: { label: 'Budget', icon: Wallet },
  adventure: { label: 'Adventure', icon: Mountain },
  transport: { label: 'Transportation', icon: BusFront },
  luxury: { label: 'Luxury', icon: Gem },
  city: { label: 'City Guides', icon: Building2 },
  culture: { label: 'Culture', icon: Landmark },
  family: { label: 'Family', icon: Users },
}

const ALL = 'all'
const PAGE_SIZE = 12
// Keep the strip calm: "All" plus at most 5 categories (6 tabs fit across a
// phone with a little scrolling), and a category needs 2+ guides to earn a tab
const MAX_CATEGORY_TABS = 5
const MIN_GUIDES_FOR_TAB = 2

/**
 * /guides in the same style as /hotels and /food: icon tabs for the
 * categories that have guides, the newest guide as a big feature card, then
 * the grid. Everything filters on the client from one lean list.
 */
export default function GuidesBrowse({
  guides,
}: {
  /** Every published guide, newest first */
  guides: GuideListingItem[]
}) {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const gridTop = useRef<HTMLDivElement>(null)

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    guides.forEach((guide) => {
      if (guide.category && CATEGORY_TABS[guide.category])
        map.set(guide.category, (map.get(guide.category) ?? 0) + 1)
    })
    return map
  }, [guides])

  // A category link (e.g. the chip on a guide page) still filters even when
  // that category is too small for its own tab; it then shows as a tab
  const queryType = router.query.type
  const activeKey =
    typeof queryType === 'string' && counts.has(queryType) ? queryType : ALL

  // Busiest categories first, capped so the strip never gets crowded
  const tabs = useMemo<ListingHeaderTab[]>(() => {
    const keys = [...counts.entries()]
      .filter(([, count]) => count >= MIN_GUIDES_FOR_TAB)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_CATEGORY_TABS)
      .map(([key]) => key)
    if (activeKey !== ALL && !keys.includes(activeKey)) keys.push(activeKey)
    return [
      { key: ALL, label: 'All', icon: LayoutGrid },
      ...keys.map((key) => ({ key, ...CATEGORY_TABS[key] })),
    ]
  }, [counts, activeKey])

  const isAll = activeKey === ALL

  const filtered = useMemo(
    () => (isAll ? guides : guides.filter((g) => g.category === activeKey)),
    [guides, activeKey, isAll],
  )
  // On "All", the newest guide gets the feature card and leaves the grid
  const featured = isAll ? guides[0] : undefined
  const gridGuides = featured ? filtered.slice(1) : filtered

  useEffect(() => setPage(1), [activeKey])

  const pageGuides = gridGuides.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const selectTab = (key: string) => {
    router.replace(key === ALL ? '/guides' : `/guides?type=${key}`, undefined, {
      shallow: true,
      scroll: false,
    })
  }

  const changePage = (next: number) => {
    setPage(next)
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeLabel = tabs.find((t) => t.key === activeKey)?.label

  return (
    <>
      <ListingHeader
        title="Stories & Guides"
        intro={`${guides.length} guides from the road: travel tips, deals and trip stories.`}
        tabs={tabs}
        activeKey={activeKey}
        onSelect={selectTab}
      />

      <div className="container mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:py-10 md:gap-12 md:px-6">
        {featured && page === 1 && (
          <Link
            href={`/guide/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border-[3px] border-border-bold bg-border-bold md:grid-cols-[7fr_5fr]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-border-bold md:aspect-auto md:min-h-[400px]">
              {featured.coverImage?.asset && (
                <SanityImage
                  image={featured.coverImage}
                  width={1100}
                  height={700}
                  alt={featured.title}
                  sizes="(min-width: 1280px) 720px, (min-width: 768px) 58vw, 100vw"
                  priority
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02]"
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-3 bg-card p-5 sm:p-7 md:gap-4 md:p-9">
              <span className="text-xs font-bold tracking-[0.14em] text-primary">
                LATEST GUIDE
              </span>
              <span className="font-heading-family text-title font-extrabold leading-tight group-hover:text-primary md:text-section">
                {featured.title}
              </span>
              {featured.summary && (
                <p className="hidden leading-relaxed text-muted-foreground md:line-clamp-3">
                  {featured.summary}
                </p>
              )}
              <span className="text-sm text-muted-foreground">
                {[
                  guideCategory(featured),
                  `${featured.readMinutes} min read`,
                  guideMonth(featured),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
              <span className="hidden text-base font-bold text-primary md:block">
                Read the guide →
              </span>
            </div>
          </Link>
        )}

        <section
          id="all-guides"
          ref={gridTop}
          className="flex scroll-mt-28 flex-col gap-5"
          aria-live="polite"
        >
          <h2 className="text-title font-extrabold tracking-tight sm:text-title">
            {isAll ? 'All guides' : activeLabel}{' '}
            <span className="text-base font-semibold text-muted-foreground">
              ({filtered.length})
            </span>
          </h2>

          {pageGuides.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {pageGuides.map((guide) => (
                <GuideCard key={guide._id} guide={guide} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-muted-foreground">
              No guides here yet.
            </p>
          )}

          <PaginationComponent
            totalItems={gridGuides.length}
            itemsPerPage={PAGE_SIZE}
            currentPage={page}
            onPageChange={changePage}
          />
        </section>
      </div>
    </>
  )
}
