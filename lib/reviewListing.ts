import { calculateRating } from './calculateRating'

/**
 * One review on a listing page (/hotels, /food) — only what a card needs,
 * with the overall score already worked out using the same maths as the
 * review page, so the page ships no rating objects.
 */
export interface ListingItem {
  _id: string
  title: string
  slug: string
  location: string | null
  /** Hotel category (luxury, mid-scale, …) or food dining type (dinein, takeout) */
  kind: string | null
  date: string | null
  coverImage: { asset?: { _ref?: string }; hotspot?: any; crop?: any } | null
  rating: { value: number; display: string; text: string } | null
}

export type ListingRating = ListingItem['rating']

/** Score a (merged) rating object for a card */
export function listingRating(
  ratings: Record<string, number | undefined> | null | undefined,
  weights: Parameters<typeof calculateRating>[1],
): ListingRating {
  if (!ratings) return null
  const result = calculateRating(ratings as Record<string, number>, weights)
  return {
    value: result.numericalRating,
    display: result.displayRating,
    text: result.textRating,
  }
}

/** How many reviews count as "Whytes' favourites" (replaced the Top 10 pages) */
export const FAVOURITES_COUNT = 10

/** The top 10 by score (newer visit wins a tie) — Whytes' favourites, in rank order */
export const topFavourites = (items: ListingItem[]) =>
  items
    .filter((item) => item.rating)
    .sort(
      (a, b) =>
        b.rating!.value - a.rating!.value ||
        (b.date ?? '').localeCompare(a.date ?? ''),
    )
    .slice(0, FAVOURITES_COUNT)
