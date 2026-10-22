import { calculateReadingTime } from './readingTime'
import type { ListingItem } from './reviewListing'

/** One guide on /guides and in "More guides" — only what a card needs */
export interface GuideListingItem {
  _id: string
  title: string
  slug: string
  category: string | null
  location: string | null
  date: string | null
  summary: string | null
  coverImage: ListingItem['coverImage']
  readMinutes: number
}

export interface RawGuideListingRow {
  _id: string
  title?: string
  slug?: string
  category?: string
  location?: string
  date?: string
  summary?: string
  coverImage?: ListingItem['coverImage']
  content?: any[]
}

export const GUIDE_CATEGORY_LABELS: Record<string, string> = {
  city: 'City Guide',
  tips: 'Travel Tips',
  transport: 'Transportation',
  culture: 'Culture & History',
  adventure: 'Adventure',
  family: 'Family Travel',
  budget: 'Budget Travel',
  luxury: 'Luxury Travel',
}

/** Reading time is worked out here, so the page ships no article text */
export const buildGuideListing = (
  rows: RawGuideListingRow[],
): GuideListingItem[] =>
  rows
    .filter((row) => row.title && row.slug)
    .map((row) => ({
      _id: row._id,
      title: row.title!.trim(),
      slug: row.slug!,
      category: row.category ?? null,
      location: row.location?.trim() || null,
      date: row.date ?? null,
      summary: row.summary ?? null,
      coverImage: row.coverImage ?? null,
      readMinutes: calculateReadingTime(row.content),
    }))

/** Up to `limit` other guides: same category first, then the newest */
export const relatedGuides = (
  guides: GuideListingItem[],
  current: { slug: string; category?: string | null },
  limit = 8,
) => {
  const others = guides.filter((guide) => guide.slug !== current.slug)
  const sameCategory = others.filter(
    (guide) => current.category && guide.category === current.category,
  )
  return [
    ...sameCategory,
    ...others.filter((guide) => !sameCategory.includes(guide)),
  ].slice(0, limit)
}
