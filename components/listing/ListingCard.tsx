import SanityImage from 'components/SanityImage'
import type { ListingItem } from 'lib/reviewListing'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { getRankBadgeStyle } from 'utils/arena/rankBadgeStyles'

// Same home timezone as PostDate, so server and browser agree on the month
export const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Los_Angeles',
})

// "Park Hyatt Jakarta Hotel Review" → "Park Hyatt Jakarta",
// "Jackie DC Restaurant Review" → "Jackie DC" (cards say it's a review)
const cardName = (title: string) =>
  title.replace(/\s+((hotel|restaurant|food)\s+)?review\s*$/i, '').trim()

interface ListingCardProps {
  item: ListingItem
  /** Review page path, e.g. "/hotel/park-hyatt-jakarta" */
  href: string
  /** Readable label for `item.kind` ("Luxury", "Dine-in", …) */
  kindLabel?: string | null
  /** Set when the item is one of the Whytes' favourites (top 10 by score) */
  rank?: number
  /** Show the #1–#10 badge (favourites row/tab) instead of the white pill */
  showRank?: boolean
  /** In a swipe row the card has a fixed width; in the grid it fills its cell */
  inRow?: boolean
  priority?: boolean
  /** Replaces the "location · kind" line (homepage rows) */
  meta?: string
  /** Replaces the rating line, e.g. "5 min read · May 2026" for a guide */
  detail?: ReactNode
  /** Leave the month off the rating line when `meta` already shows it */
  showMonth?: boolean
}

export default function ListingCard({
  item,
  href,
  kindLabel,
  rank,
  showRank = false,
  inRow = false,
  priority = false,
  meta: metaOverride,
  detail,
  showMonth = true,
}: ListingCardProps) {
  const name = cardName(item.title)
  const meta =
    metaOverride ?? [item.location, kindLabel].filter(Boolean).join(' · ')
  const month =
    showMonth && item.date ? monthFormatter.format(new Date(item.date)) : null

  return (
    <Link
      href={href}
      className={`group flex flex-col gap-2 ${
        inRow
          ? 'w-[68vw] max-w-64 shrink-0 snap-start sm:w-60 lg:w-62'
          : 'min-w-0'
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl border-[3px] border-border-bold bg-border-bold">
        {item.coverImage?.asset && (
          <SanityImage
            image={item.coverImage}
            width={500}
            height={500}
            alt={item.title}
            sizes={
              inRow
                ? '(min-width: 1024px) 248px, (min-width: 640px) 240px, 68vw'
                : '(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw'
            }
            priority={priority}
            className="h-full w-full object-cover group-hover:scale-[1.03]"
          />
        )}
        {rank &&
          (showRank ? (
            <span
              className={`absolute left-2.5 top-2.5 flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-black shadow ${getRankBadgeStyle(rank)}`}
            >
              #{rank}
            </span>
          ) : (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-gray-900 shadow">
              Whytes’ favourite
            </span>
          ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <span
          className={`text-[15px] font-bold group-hover:text-primary ${
            // Two-up phone grid: let long names wrap to a 2nd line
            inRow ? 'line-clamp-1' : 'line-clamp-2 sm:line-clamp-1'
          }`}
        >
          {name}
        </span>
        {meta && (
          <span className="line-clamp-1 text-sm text-muted-foreground">
            {meta}
          </span>
        )}
        {detail ? (
          <span className="text-sm text-muted-foreground">{detail}</span>
        ) : (
          item.rating && (
            <span className="text-sm font-semibold">
              <span aria-hidden="true">★</span> {item.rating.display}
              <span className="font-normal text-muted-foreground">
                {' '}
                · {item.rating.text}
                {/* Two-up phone grid is too narrow for the month */}
                {month && (
                  <span className={inRow ? undefined : 'hidden sm:inline'}>
                    {' '}
                    · {month}
                  </span>
                )}
              </span>
            </span>
          )
        )}
      </div>
    </Link>
  )
}
