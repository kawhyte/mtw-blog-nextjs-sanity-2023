import SanityImage from 'components/SanityImage'
import type { HotelListingItem } from 'lib/hotelListing'
import Link from 'next/link'
import { getRankBadgeStyle } from 'utils/arena/rankBadgeStyles'

const CATEGORY_LABELS: Record<string, string> = {
  luxury: 'Luxury',
  'mid-scale': 'Mid-Scale',
  economy: 'Economy',
}

// Same home timezone as PostDate, so server and browser agree on the month
const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Los_Angeles',
})

// "Park Hyatt Jakarta Hotel Review" → "Park Hyatt Jakarta" (cards say it's a review)
const cardName = (title: string) =>
  title.replace(/\s+(hotel\s+)?review\s*$/i, '').trim()

interface HotelStayCardProps {
  hotel: HotelListingItem
  /** Set when the hotel is one of the Whytes' favourites (top 10 by score) */
  rank?: number
  /** Show the #1–#10 badge (favourites row/tab) instead of the white pill */
  showRank?: boolean
  /** In a swipe row the card has a fixed width; in the grid it fills its cell */
  inRow?: boolean
  priority?: boolean
}

export default function HotelStayCard({
  hotel,
  rank,
  showRank = false,
  inRow = false,
  priority = false,
}: HotelStayCardProps) {
  const name = cardName(hotel.title)
  const category = hotel.category ? CATEGORY_LABELS[hotel.category] : null
  const meta = [hotel.location, category].filter(Boolean).join(' · ')
  const month = hotel.date ? monthFormatter.format(new Date(hotel.date)) : null

  return (
    <Link
      href={`/hotel/${hotel.slug}`}
      className={`group flex flex-col gap-2 ${
        inRow
          ? 'w-[68vw] max-w-64 shrink-0 snap-start sm:w-60 lg:w-62'
          : 'min-w-0'
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-[22px] border-[3px] border-border-bold bg-muted">
        {hotel.coverImage?.asset && (
          <SanityImage
            image={hotel.coverImage}
            width={500}
            height={500}
            alt={hotel.title}
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
        {hotel.rating && (
          <span className="text-sm font-semibold">
            <span aria-hidden="true">★</span> {hotel.rating.display}
            <span className="font-normal text-muted-foreground">
              {' '}
              · {hotel.rating.text}
              {/* Two-up phone grid is too narrow for the month */}
              {month && (
                <span className={inRow ? undefined : 'hidden sm:inline'}>
                  {' '}
                  · {month}
                </span>
              )}
            </span>
          </span>
        )}
      </div>
    </Link>
  )
}
