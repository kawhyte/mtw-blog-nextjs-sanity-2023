import ListingCard from 'components/listing/ListingCard'
import SwipeRow from 'components/listing/SwipeRow'
import type { ListingItem } from 'lib/reviewListing'
import { useState } from 'react'

type Tab = 'hotels' | 'food'

const TABS: { id: Tab; label: string; listing: string; review: string }[] = [
  { id: 'hotels', label: 'Hotels', listing: '/hotels', review: '/hotel' },
  { id: 'food', label: 'Restaurants', listing: '/food', review: '/food' },
]

/** Whytes' favourites (top 10 by score) with a Hotels / Restaurants switch */
export default function HomeFavourites({
  hotels,
  food,
}: {
  hotels: ListingItem[]
  food: ListingItem[]
}) {
  const [tab, setTab] = useState<Tab>('hotels')
  const active = TABS.find((t) => t.id === tab)!
  const items = tab === 'hotels' ? hotels : food

  if (hotels.length === 0 && food.length === 0) return null

  return (
    <SwipeRow
      key={tab}
      title="Whytes’ favourites"
      subtitle="Our 10 highest-rated stays and meals."
      linkLabel="All favourites"
      shortLinkLabel="See all"
      linkHref={`${active.listing}?type=favourites`}
      toolbar={
        <div className="flex gap-2" role="group" aria-label="Show favourites">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={t.id === tab}
              onClick={() => setTab(t.id)}
              className={`min-h-10 rounded-full px-4 text-sm font-bold transition-colors ${
                t.id === tab
                  ? 'bg-foreground text-background'
                  : 'border-2 border-border bg-card text-foreground hover:border-foreground/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      }
    >
      {items.map((item, index) => (
        <ListingCard
          key={item._id}
          item={item}
          href={`${active.review}/${item.slug}`}
          meta={item.location ?? ''}
          rank={index + 1}
          showRank
          showMonth={false}
          inRow
        />
      ))}
    </SwipeRow>
  )
}
