import PaginationComponent from 'components/PaginationComponent'
import type { ListingItem } from 'lib/reviewListing'
import { topFavourites } from 'lib/reviewListing'
import { LayoutGrid, LucideIcon, Star } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

import ListingCard from './ListingCard'
import ListingHeader from './ListingHeader'
import SwipeRow from './SwipeRow'

export interface ListingKindTab {
  /** Matches `ListingItem.kind`, and is the `?type=` value in the URL */
  key: string
  label: string
  icon: LucideIcon
  /** Heading over the grid when this tab is picked, e.g. "Luxury stays" */
  gridTitle: string
}

export interface ListingBrowseProps {
  /** Every published review, newest first */
  items: ListingItem[]
  /** This page, e.g. "/hotels" */
  basePath: string
  /** Review pages live at `${itemPath}/${slug}`, e.g. "/hotel" */
  itemPath: string
  title: string
  /** Line under the title; gets the live review count */
  intro: (count: number) => string
  /** The kind filters, after All and Whytes' favourites */
  kindTabs: ListingKindTab[]
  /** e.g. "All hotel reviews" */
  allTitle: string
  /** e.g. "stays" → "See all 102 stays" */
  noun: string
  /** Hide kind tabs that have no reviews yet (a young section like /cruises) */
  hideEmptyKindTabs?: boolean
  /** Show the swipe rows only once there are this many reviews, so a short list doesn't repeat the same cards */
  rowsFrom?: number
}

const ALL = 'all'
const FAVOURITES = 'favourites'
const ROW_LIMIT = 12
const PAGE_SIZE = 12

/**
 * Airbnb-style listing shared by /hotels and /food: icon tabs, "Recently
 * reviewed" and "Whytes' favourites" swipe rows, then the full paginated
 * grid. Everything filters on the client from one lean list.
 */
export default function ListingBrowse({
  items,
  basePath,
  itemPath,
  title,
  intro,
  kindTabs,
  allTitle,
  noun,
  hideEmptyKindTabs = false,
  rowsFrom = 0,
}: ListingBrowseProps) {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const gridTop = useRef<HTMLDivElement>(null)

  const tabs = useMemo(
    () => [
      { key: ALL, label: 'All', icon: LayoutGrid, gridTitle: allTitle },
      // Second so it's on screen in the phone tab strip without scrolling
      {
        key: FAVOURITES,
        label: 'Whytes’ favourites',
        icon: Star,
        gridTitle: 'Whytes’ favourites',
      },
      ...(hideEmptyKindTabs
        ? kindTabs.filter((t) => items.some((item) => item.kind === t.key))
        : kindTabs),
    ],
    [allTitle, kindTabs, hideEmptyKindTabs, items],
  )
  const queryType = router.query.type
  const tab = tabs.find((t) => t.key === queryType) ?? tabs[0]

  // Whytes' favourites = the top 10 by score (this replaced the old "Our
  // Top Picks" pages). Ranked #1-#10 in their row/tab; the same 10 get the
  // white pill everywhere else.
  const favourites = useMemo(() => topFavourites(items), [items])
  const rankOf = useMemo(
    () => new Map(favourites.map((item, i) => [item._id, i + 1])),
    [favourites],
  )
  const kindLabelOf = (item: ListingItem) =>
    kindTabs.find((t) => t.key === item.kind)?.label ?? null

  const gridItems = useMemo(() => {
    if (tab.key === FAVOURITES) return favourites
    if (tab.key === ALL) return items
    return items.filter((item) => item.kind === tab.key)
  }, [tab.key, items, favourites])

  // New tab → back to page 1
  useEffect(() => setPage(1), [tab.key])

  const pageItems = gridItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const tabHref = (key: string) =>
    key === ALL ? basePath : `${basePath}?type=${key}`

  const selectTab = (key: string) => {
    router.replace(tabHref(key), undefined, { shallow: true, scroll: false })
  }

  const changePage = (next: number) => {
    setPage(next)
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const card = (
    item: ListingItem,
    opts: { inRow?: boolean; showRank?: boolean; priority?: boolean } = {},
  ) => (
    <ListingCard
      key={item._id}
      item={item}
      href={`${itemPath}/${item.slug}`}
      kindLabel={kindLabelOf(item)}
      rank={rankOf.get(item._id)}
      {...opts}
    />
  )

  return (
    <>
      <ListingHeader
        title={title}
        intro={intro(items.length)}
        tabs={tabs}
        activeKey={tab.key}
        onSelect={selectTab}
      />

      <div className="container mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:py-10 md:gap-12 md:px-6">
        {tab.key === ALL && items.length >= rowsFrom && (
          <>
            <SwipeRow
              title="Recently reviewed"
              seeAllHref="#all-reviews"
              seeAllLabel={`See all ${items.length} ${noun}`}
            >
              {items
                .slice(0, ROW_LIMIT)
                .map((item, i) => card(item, { inRow: true, priority: i < 2 }))}
            </SwipeRow>

            {favourites.length > 0 && (
              <SwipeRow
                title="Whytes’ favourites"
                seeAllHref={tabHref(FAVOURITES)}
              >
                {favourites.map((item) =>
                  card(item, { inRow: true, showRank: true }),
                )}
              </SwipeRow>
            )}
          </>
        )}

        <section
          id="all-reviews"
          ref={gridTop}
          className="flex scroll-mt-28 flex-col gap-5"
          aria-live="polite"
        >
          <h2 className="text-title font-extrabold tracking-tight sm:text-title">
            {tab.gridTitle}{' '}
            <span className="text-base font-semibold text-muted-foreground">
              ({gridItems.length}
              {tab.key === FAVOURITES ? ', ranked by our score' : ''})
            </span>
          </h2>

          {pageItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {pageItems.map((item) =>
                card(item, { showRank: tab.key === FAVOURITES }),
              )}
            </div>
          ) : (
            <p className="py-10 text-center text-muted-foreground">
              No reviews here yet.
            </p>
          )}

          <PaginationComponent
            totalItems={gridItems.length}
            itemsPerPage={PAGE_SIZE}
            currentPage={page}
            onPageChange={changePage}
          />
        </section>
      </div>
    </>
  )
}
