import ListingCard from 'components/listing/ListingCard'
import SwipeRow from 'components/listing/SwipeRow'
import type { ArenaGameDay } from 'lib/arenaGameDay'
import Link from 'next/link'

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`

/** Side-panel box: how many places we've reviewed in town, and the city guide */
export function GameDayBox({ gameDay }: { gameDay: ArenaGameDay }) {
  const counts = [
    gameDay.hotelCount > 0 && plural(gameDay.hotelCount, 'hotel', 'hotels'),
    gameDay.foodCount > 0 &&
      plural(gameDay.foodCount, 'restaurant', 'restaurants'),
  ]
    .filter(Boolean)
    .join(' and ')

  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border-2 border-secondary/30 bg-secondary-soft-background px-4 py-3">
      <span className="text-xs font-bold tracking-[0.1em] text-secondary">
        GAME DAY IN {gameDay.city.toUpperCase()}
      </span>
      <span className="text-sm leading-relaxed text-foreground">
        {counts} we&apos;ve reviewed nearby.
      </span>
      <Link
        href={gameDay.href}
        className="flex min-h-11 items-center text-sm font-bold text-primary hover:underline xl:min-h-0"
      >
        {gameDay.city} game-day guide →
      </Link>
    </div>
  )
}

/** Swipe row of the best hotels and food in town, ending with the city guide */
export function GameDayRow({ gameDay }: { gameDay: ArenaGameDay }) {
  return (
    <SwipeRow
      title={`Game day in ${gameDay.city}`}
      subtitle="Hotels and food we’ve reviewed near the arena."
      linkLabel={`${gameDay.city} game-day guide`}
      shortLinkLabel="See the guide"
      linkHref={gameDay.href}
      seeAllHref={gameDay.href}
      seeAllLabel={`Full ${gameDay.city} game-day guide`}
    >
      {gameDay.places.map(({ kind, item }) => (
        <ListingCard
          key={item._id}
          item={item}
          href={`/${kind}/${item.slug}`}
          meta={[kind === 'hotel' ? 'Hotel' : 'Food', item.location]
            .filter(Boolean)
            .join(' · ')}
          showMonth={false}
          inRow
        />
      ))}
    </SwipeRow>
  )
}
