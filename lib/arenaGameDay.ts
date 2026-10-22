import { locationToSlug } from 'utils/locationSlug'

import type { ListingItem } from './reviewListing'
import type { CityPageData } from './sanity.queries'

/** A hotel or restaurant in the arena's city, as a card */
export interface GameDayPlace {
  kind: 'hotel' | 'food'
  item: ListingItem
}

/** "Game day in Las Vegas": the side-panel box and the row of places */
export interface ArenaGameDay {
  city: string
  href: string
  hotelCount: number
  foodCount: number
  places: GameDayPlace[]
}

const PER_KIND = 4

const toItem = (
  place: CityPageData['hotels'][number] | CityPageData['food'][number],
): ListingItem => ({
  _id: place._id,
  title: place.title ?? '',
  slug: place.slug ?? '',
  location: place.location?.trim() || null,
  kind: null,
  date: null,
  coverImage: place.coverImage ?? null,
  rating: place.rating ?? null,
})

const bestFirst = (a: ListingItem, b: ListingItem) =>
  (b.rating?.value ?? 0) - (a.rating?.value ?? 0)

/** The best-rated hotels, then food, in the arena's city (null when there are none) */
export function buildArenaGameDay(
  data: CityPageData,
  cityLocation: string,
  arenaSlug: string,
): ArenaGameDay | null {
  const hotels = data.hotels.map(toItem).filter((item) => item.slug)
  const food = data.food.map(toItem).filter((item) => item.slug)
  if (hotels.length === 0 && food.length === 0) return null

  return {
    city: cityLocation.split(',')[0].trim(),
    href: `/city/${locationToSlug(cityLocation)}?from=${arenaSlug}`,
    hotelCount: hotels.length,
    foodCount: food.length,
    places: [
      ...hotels
        .sort(bestFirst)
        .slice(0, PER_KIND)
        .map((item) => ({ kind: 'hotel' as const, item })),
      ...food
        .sort(bestFirst)
        .slice(0, PER_KIND)
        .map((item) => ({ kind: 'food' as const, item })),
    ],
  }
}
