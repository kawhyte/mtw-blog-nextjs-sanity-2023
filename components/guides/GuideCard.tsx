import SanityImage from 'components/SanityImage'
import { GUIDE_CATEGORY_LABELS, type GuideListingItem } from 'lib/guideListing'
import Link from 'next/link'

// Same home timezone as PostDate, so server and browser agree on the month
const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Los_Angeles',
})

export const guideMonth = (guide: GuideListingItem) =>
  guide.date ? monthFormatter.format(new Date(guide.date)) : null

export const guideCategory = (guide: GuideListingItem) =>
  guide.category
    ? (GUIDE_CATEGORY_LABELS[guide.category] ?? guide.category)
    : null

interface GuideCardProps {
  guide: GuideListingItem
  /** In a swipe row the card has a fixed width; in the grid it fills its cell */
  inRow?: boolean
}

/** Square guide card — the same look as the hotel and food listing cards */
export default function GuideCard({ guide, inRow = false }: GuideCardProps) {
  const month = guideMonth(guide)
  const category = guideCategory(guide)

  return (
    <Link
      href={`/guide/${guide.slug}`}
      className={`group flex flex-col gap-2 ${
        inRow
          ? 'w-[68vw] max-w-64 shrink-0 snap-start sm:w-60 lg:w-62'
          : 'min-w-0'
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl border-[3px] border-border-bold bg-border-bold">
        {guide.coverImage?.asset && (
          <SanityImage
            image={guide.coverImage}
            width={500}
            height={500}
            alt={guide.title}
            sizes={
              inRow
                ? '(min-width: 1024px) 248px, (min-width: 640px) 240px, 68vw'
                : '(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw'
            }
            className="h-full w-full object-cover group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="line-clamp-2 text-base font-bold leading-snug group-hover:text-primary">
          {guide.title}
        </span>
        <span className="text-sm text-muted-foreground">
          {[category, `${guide.readMinutes} min read`]
            .filter(Boolean)
            .join(' · ')}
          {/* Two-up phone grid is too narrow for the month */}
          {month && (
            <span className={inRow ? undefined : 'hidden sm:inline'}>
              {' '}
              · {month}
            </span>
          )}
        </span>
      </div>
    </Link>
  )
}
