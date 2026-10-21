import PaginationComponent from 'components/PaginationComponent'
import type { HotelListingItem } from 'lib/hotelListing'
import { isFavourite } from 'lib/hotelListing'
import {
  Building2,
  Crown,
  House,
  LayoutGrid,
  LucideIcon,
  Star,
} from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

import HotelStayCard from './HotelStayCard'
import SwipeRow from './SwipeRow'

type TabKey = 'all' | 'luxury' | 'mid-scale' | 'economy' | 'favourites'

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'all', label: 'All', icon: LayoutGrid },
  // Second so it's on screen in the phone tab strip without scrolling
  { key: 'favourites', label: 'Whytes’ favourites', icon: Star },
  { key: 'luxury', label: 'Luxury', icon: Crown },
  { key: 'mid-scale', label: 'Mid-Scale', icon: Building2 },
  { key: 'economy', label: 'Economy', icon: House },
]

const GRID_TITLES: Record<TabKey, string> = {
  all: 'All hotel reviews',
  luxury: 'Luxury stays',
  'mid-scale': 'Mid-scale stays',
  economy: 'Economy stays',
  favourites: 'Whytes’ favourites',
}

const ROW_LIMIT = 12
const PAGE_SIZE = 12

const isTabKey = (value: unknown): value is TabKey =>
  TABS.some((tab) => tab.key === value)

const tabHref = (key: TabKey) =>
  key === 'all' ? '/hotels' : `/hotels?type=${key}`

interface HotelsBrowseProps {
  /** Every published hotel, newest first */
  hotels: HotelListingItem[]
}

export default function HotelsBrowse({ hotels }: HotelsBrowseProps) {
  const router = useRouter()
  const queryType = router.query.type
  const tab: TabKey = isTabKey(queryType) ? queryType : 'all'
  const [page, setPage] = useState(1)
  const gridTop = useRef<HTMLDivElement>(null)

  // Favourites = rated Excellent, ranked by score (this replaced the old
  // "Our Top Hotel Picks" top-10 page, so #1–#10 match what it showed).
  const favourites = useMemo(
    () =>
      hotels
        .filter(isFavourite)
        .sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0)),
    [hotels],
  )
  const rankOf = useMemo(
    () => new Map(favourites.map((hotel, i) => [hotel._id, i + 1])),
    [favourites],
  )

  const gridHotels = useMemo(() => {
    switch (tab) {
      case 'favourites':
        return favourites
      case 'all':
        return hotels
      default:
        return hotels.filter((h) => h.category === tab)
    }
  }, [tab, hotels, favourites])

  const tabStrip = useRef<HTMLDivElement>(null)

  // New tab → back to page 1, and keep the chosen tab visible in the phone strip
  useEffect(() => {
    setPage(1)
    tabStrip.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [tab])

  const pageHotels = gridHotels.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const selectTab = (key: TabKey) => {
    router.replace(tabHref(key), undefined, { shallow: true, scroll: false })
  }

  const changePage = (next: number) => {
    setPage(next)
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section className="border-b border-primary/20 bg-primary-soft-background">
        <div className="container mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-8 sm:pt-10 md:px-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              Hotel Reviews
            </h1>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              {hotels.length} stays, honestly rated — from beds to breakfast.
            </p>
          </div>

          <div
            ref={tabStrip}
            role="tablist"
            aria-label="Filter hotels"
            className="scrollbar-hide -mx-4 flex gap-7 overflow-x-auto px-4 md:mx-0 md:gap-9 md:px-0"
          >
            {TABS.map(({ key, label, icon: Icon }) => {
              const active = key === tab
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectTab(key)}
                  className={`flex min-w-11 shrink-0 flex-col items-center gap-1.5 border-b-[3px] pb-3 text-sm transition-colors ${
                    active
                      ? 'border-foreground font-bold text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                >
                  <Icon
                    className="h-6 w-6"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:py-10 md:gap-12 md:px-6">
        {tab === 'all' && (
          <>
            <SwipeRow
              title="Recently reviewed"
              seeAllHref="#all-hotels"
              seeAllLabel={`See all ${hotels.length} stays`}
            >
              {hotels.slice(0, ROW_LIMIT).map((hotel, i) => (
                <HotelStayCard
                  key={hotel._id}
                  hotel={hotel}
                  inRow
                  priority={i < 2}
                />
              ))}
            </SwipeRow>

            {favourites.length > 0 && (
              <SwipeRow
                title="Whytes’ favourites"
                seeAllHref={tabHref('favourites')}
                seeAllLabel="See all our favourites"
              >
                {favourites.slice(0, ROW_LIMIT).map((hotel) => (
                  <HotelStayCard
                    key={hotel._id}
                    hotel={hotel}
                    rank={rankOf.get(hotel._id)}
                    inRow
                  />
                ))}
              </SwipeRow>
            )}
          </>
        )}

        <section
          id="all-hotels"
          ref={gridTop}
          className="flex scroll-mt-28 flex-col gap-5"
          aria-live="polite"
        >
          <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {GRID_TITLES[tab]}{' '}
            <span className="text-base font-semibold text-muted-foreground">
              ({gridHotels.length}
              {tab === 'favourites' ? ', ranked by our score' : ''})
            </span>
          </h2>

          {pageHotels.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {pageHotels.map((hotel) => (
                <HotelStayCard
                  key={hotel._id}
                  hotel={hotel}
                  rank={
                    tab === 'favourites' ? rankOf.get(hotel._id) : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-muted-foreground">
              No hotel reviews here yet.
            </p>
          )}

          <PaginationComponent
            totalItems={gridHotels.length}
            itemsPerPage={PAGE_SIZE}
            currentPage={page}
            onPageChange={changePage}
          />
        </section>
      </div>
    </>
  )
}
