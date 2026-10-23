import { getArenaDisplayRating } from 'utils/arena/arenaUtils'

import { foodRowRating } from './foodListing'
import { GUIDE_CATEGORY_LABELS } from './guideListing'
import { hotelRowRating } from './hotelListing'
import type { ListingItem } from './reviewListing'
import type { Arena, FoodReview, Guide, HotelReview } from './sanity.queries'

export type SearchKind = 'arena' | 'hotel' | 'food' | 'guide'

/** A raw result from globalSearchQuery, tagged with its type */
export type RawSearchResult = (HotelReview | FoodReview | Guide | Arena) & {
  _contentType: SearchKind
  _score?: number
}

/** One search result, shaped for a card (the same facts as the listing cards) */
export interface SearchItem {
  id: string
  kind: SearchKind
  title: string
  href: string
  image: ListingItem['coverImage']
  /** City for reviews and arenas, the category for guides */
  place: string | null
  date: string | null
  rating: { display: string; text: string } | null
}

/** Order of the groups on the "All" tab, and the labels for chips and headings */
export const SEARCH_GROUPS: { kind: SearchKind; label: string; noun: string }[] = [
  { kind: 'arena', label: 'Arenas', noun: 'arenas' },
  { kind: 'hotel', label: 'Hotels', noun: 'hotels' },
  { kind: 'food', label: 'Food', noun: 'restaurants' },
  { kind: 'guide', label: 'Guides', noun: 'guides' },
]

const ROUTES: Record<SearchKind, string> = {
  arena: '/arena',
  hotel: '/hotel',
  food: '/food',
  guide: '/guide',
}

export function toSearchItem(result: RawSearchResult): SearchItem {
  const kind = result._contentType
  const base = {
    id: result._id,
    kind,
    href: `${ROUTES[kind]}/${result.slug ?? ''}`,
    date: result.date ?? null,
  }

  if (kind === 'arena') {
    const arena = result as Arena
    const { average, textRating } = getArenaDisplayRating(arena)
    return {
      ...base,
      title: arena.name ?? '',
      image: (arena.arenaImage as ListingItem['coverImage']) ?? null,
      place: arena.location?.trim() || null,
      rating:
        arena.visited && Number(average) > 0
          ? { display: average, text: textRating }
          : null,
    }
  }

  if (kind === 'guide') {
    const guide = result as Guide
    return {
      ...base,
      title: guide.title ?? '',
      image: (guide.coverImage as ListingItem['coverImage']) ?? null,
      place: guide.category
        ? (GUIDE_CATEGORY_LABELS[guide.category] ?? null)
        : null,
      rating: null,
    }
  }

  const review = result as HotelReview | FoodReview
  const rating =
    kind === 'hotel'
      ? hotelRowRating(review as any)
      : foodRowRating(review as any)
  return {
    ...base,
    title: review.title ?? '',
    image: (review.coverImage as ListingItem['coverImage']) ?? null,
    place: review.location?.trim() || null,
    rating: rating ? { display: rating.display, text: rating.text } : null,
  }
}
