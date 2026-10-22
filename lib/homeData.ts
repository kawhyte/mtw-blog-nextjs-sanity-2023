import type { GuideListingItem } from './guideListing'
import type { ListingItem } from './reviewListing'
import type { ArenaHighlightCard, Essential } from './sanity.queries'

/*
 * Homepage data, shaped on the server so the page ships only what the cards
 * need. Everything here runs in getStaticProps, so the random hero pick is
 * made once per page refresh (no photo swap in the browser).
 */

/** An arena as a homepage card, plus the colour of its score */
export interface HomeArena extends ListingItem {
  ratingColor: string | null
  /** The photo is wider than it is tall (only these get the big hero spot) */
  landscape: boolean
}

export type FreshKind = 'hotel' | 'food' | 'guide'

/** One of the newest posts for "Fresh from the road" */
export interface FreshItem {
  kind: FreshKind
  item: ListingItem
  readMinutes: number | null
}

export interface HomeGear {
  _id: string
  name: string
  image: Essential['productImage'] | null
}

export const toHomeArena = (arena: ArenaHighlightCard): HomeArena => {
  const average = Number(arena.displayRating?.average)
  const { width = 0, height = 0 } =
    arena.arenaImage?.asset?.metadata?.dimensions ?? {}
  return {
    _id: arena._id,
    title: arena.name ?? '',
    slug: arena.slug ?? '',
    location: arena.location?.trim() || null,
    kind: null,
    date: arena.date ?? null,
    coverImage: arena.arenaImage?.asset ? arena.arenaImage : null,
    rating:
      average > 0
        ? {
            value: average,
            display: average.toFixed(1),
            text: arena.displayRating!.textRating,
          }
        : null,
    ratingColor: arena.displayRating?.color ?? null,
    landscape: width > height,
  }
}

const shuffle = <T>(items: T[]) => {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** 3 random visited arenas with photos; the first (big) one is landscape */
export function pickHeroArenas(arenas: HomeArena[]): HomeArena[] {
  const withPhotos = shuffle(arenas.filter((a) => a.coverImage && a.slug))
  const leadIndex = withPhotos.findIndex((a) => a.landscape)
  if (leadIndex > 0) withPhotos.unshift(...withPhotos.splice(leadIndex, 1))
  return withPhotos.slice(0, 3)
}

/** The newest hotel, food and guide posts, newest first */
export function freshFromTheRoad(
  hotels: ListingItem[],
  food: ListingItem[],
  guides: GuideListingItem[],
  limit = 8,
): FreshItem[] {
  const all: FreshItem[] = [
    ...hotels.map((item) => ({
      kind: 'hotel' as const,
      item,
      readMinutes: null,
    })),
    ...food.map((item) => ({ kind: 'food' as const, item, readMinutes: null })),
    ...guides.map((guide) => ({
      kind: 'guide' as const,
      item: {
        _id: guide._id,
        title: guide.title,
        slug: guide.slug,
        location: guide.location,
        kind: guide.category,
        date: guide.date,
        coverImage: guide.coverImage,
        rating: null,
      },
      readMinutes: guide.readMinutes,
    })),
  ]
  return all
    .sort((a, b) => (b.item.date ?? '').localeCompare(a.item.date ?? ''))
    .slice(0, limit)
}

export const toHomeGear = (gear: Essential[], limit = 4): HomeGear[] =>
  gear
    .filter((item) => item.productImage?.asset)
    .slice(0, limit)
    .map((item) => ({
      _id: item._id,
      name: item.name ?? '',
      image: item.productImage ?? null,
    }))
