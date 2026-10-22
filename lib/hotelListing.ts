import { withInternetRating } from './mbpsToRating'
import { getEffectiveRating } from './mergeRatings'
import { HOTEL_WEIGHTS } from './ratingWeights'
import { type ListingItem, listingRating } from './reviewListing'

export interface RawHotelListingRow {
  _id: string
  title?: string
  slug?: string
  location?: string
  category?: string
  date?: string
  coverImage?: ListingItem['coverImage']
  hotelRating?: Record<string, number | undefined>
  internetSpeed?: number
  revisits?: {
    visitDate: string
    ratingUpdates?: Record<string, number | undefined>
  }[]
}

/** A hotel's overall score, the same maths as the hotel review page (Wi-Fi score from Mbps, plus revisit updates) */
export const hotelRowRating = (
  row: Pick<RawHotelListingRow, 'hotelRating' | 'internetSpeed' | 'revisits'>,
) =>
  row.hotelRating
    ? listingRating(
        getEffectiveRating(
          withInternetRating(row.hotelRating, row.internetSpeed),
          row.revisits ?? [],
        ),
        HOTEL_WEIGHTS,
      )
    : null

/** Hotels for /hotels, scored like the hotel review page */
export function buildHotelListing(rows: RawHotelListingRow[]): ListingItem[] {
  return rows
    .filter((row) => row.title && row.slug)
    .map((row) => ({
      _id: row._id,
      title: row.title!,
      slug: row.slug!,
      location: row.location?.trim() ?? null,
      kind: row.category ?? null,
      date: row.date ?? null,
      coverImage: row.coverImage ?? null,
      rating: hotelRowRating(row),
    }))
}
