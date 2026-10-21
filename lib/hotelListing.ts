import { calculateRating } from './calculateRating'
import { withInternetRating } from './mbpsToRating'
import { getEffectiveRating } from './mergeRatings'
import { HOTEL_WEIGHTS } from './ratingWeights'

/**
 * One hotel on the /hotels listing — only what a card needs, with the overall
 * score already worked out (same maths as the hotel review page: Wi-Fi score
 * from Mbps, plus any revisit updates), so the page ships no rating objects.
 */
export interface HotelListingItem {
  _id: string
  title: string
  slug: string
  location: string | null
  category: string | null
  date: string | null
  coverImage: { asset?: { _ref?: string }; hotspot?: any; crop?: any } | null
  rating: { value: number; display: string; text: string } | null
}

export interface RawHotelListingRow {
  _id: string
  title?: string
  slug?: string
  location?: string
  category?: string
  date?: string
  coverImage?: HotelListingItem['coverImage']
  hotelRating?: Record<string, number | undefined>
  internetSpeed?: number
  revisits?: {
    visitDate: string
    ratingUpdates?: Record<string, number | undefined>
  }[]
}

export function buildHotelListing(
  rows: RawHotelListingRow[],
): HotelListingItem[] {
  return rows
    .filter((row) => row.title && row.slug)
    .map((row) => {
      let rating: HotelListingItem['rating'] = null
      if (row.hotelRating) {
        const effective = getEffectiveRating(
          withInternetRating(row.hotelRating, row.internetSpeed),
          row.revisits ?? [],
        )
        const result = calculateRating(
          effective as Record<string, number>,
          HOTEL_WEIGHTS,
        )
        rating = {
          value: result.numericalRating,
          display: result.displayRating,
          text: result.textRating,
        }
      }
      return {
        _id: row._id,
        title: row.title!,
        slug: row.slug!,
        location: row.location?.trim() ?? null,
        category: row.category ?? null,
        date: row.date ?? null,
        coverImage: row.coverImage ?? null,
        rating,
      }
    })
}

/** "Whytes' favourite" = rated Excellent */
export const isFavourite = (hotel: HotelListingItem) =>
  hotel.rating?.text === 'Excellent'
