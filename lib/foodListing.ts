import { getEffectiveRating } from './mergeRatings'
import { FOOD_WEIGHTS, TAKEOUT_WEIGHTS } from './ratingWeights'
import { type ListingItem, listingRating } from './reviewListing'

type Ratings = Record<string, number | undefined>

export interface RawFoodListingRow {
  _id: string
  title?: string
  slug?: string
  location?: string
  diningType?: string
  date?: string
  coverImage?: ListingItem['coverImage']
  foodRating?: Ratings
  takeoutRating?: Ratings
  revisits?: {
    visitDate: string
    foodRatingUpdates?: Ratings
    takeoutRatingUpdates?: Ratings
  }[]
}

/** A restaurant's overall score, the same maths as the food review page (dine-in or takeout weights, plus revisit updates) */
export function foodRowRating(
  row: Pick<
    RawFoodListingRow,
    'diningType' | 'foodRating' | 'takeoutRating' | 'revisits'
  >,
) {
  const isTakeout = row.diningType === 'takeout'
  const base = isTakeout ? row.takeoutRating : row.foodRating
  if (!base) return null
  const revisits = (row.revisits ?? []).map((r) => ({
    visitDate: r.visitDate,
    ratingUpdates: isTakeout ? r.takeoutRatingUpdates : r.foodRatingUpdates,
  }))
  return listingRating(
    getEffectiveRating(base, revisits),
    isTakeout ? TAKEOUT_WEIGHTS : FOOD_WEIGHTS,
  )
}

/** Restaurants for /food, scored like the food review page */
export function buildFoodListing(rows: RawFoodListingRow[]): ListingItem[] {
  return rows
    .filter((row) => row.title && row.slug)
    .map((row) => ({
      _id: row._id,
      title: row.title!,
      slug: row.slug!,
      location: row.location?.trim() ?? null,
      kind: row.diningType ?? null,
      date: row.date ?? null,
      coverImage: row.coverImage ?? null,
      rating: foodRowRating(row),
    }))
}
