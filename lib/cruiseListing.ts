import { cruiseLineName, cruiseOverall } from './cruiseFormat'
import { type ListingItem } from './reviewListing'
import type { CruiseReview } from './sanity.queries'

export interface RawCruiseListingRow {
  _id: string
  title?: string
  slug?: string
  shipName?: string
  cruiseLine?: string
  lineTier?: string
  nights?: number
  sailingDate?: string
  coverImage?: ListingItem['coverImage']
  cruiseRating?: Record<string, number | undefined>
}

/** Cruises for /cruises, scored like the cruise review page */
export function buildCruiseListing(rows: RawCruiseListingRow[]): ListingItem[] {
  return rows
    .filter((row) => row.title && row.slug)
    .map((row) => {
      const score = cruiseOverall(row as CruiseReview)
      return {
        _id: row._id,
        // The card shows the ship; the full title carries cabin and month
        title: row.shipName || row.title!,
        slug: row.slug!,
        location:
          [
            cruiseLineName(row.cruiseLine),
            row.nights ? `${row.nights} nights` : null,
          ]
            .filter(Boolean)
            .join(' · ') || null,
        kind: row.lineTier ?? null,
        date: row.sailingDate ?? null,
        coverImage: row.coverImage ?? null,
        rating: score
          ? {
              value: score.numericalRating,
              display: score.displayRating,
              text: score.textRating,
            }
          : null,
      }
    })
}
