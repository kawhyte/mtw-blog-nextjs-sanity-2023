import Link from 'next/link'
import NBAArenaCard from 'components/NBAArenaCard'
import { ArenaWithRating } from 'utils/arena/arenaConstants'

interface ArenaGridProps {
  arenas: ArenaWithRating[]
}

export default function ArenaGrid({ arenas }: ArenaGridProps) {
  if (arenas.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 px-4 md:gap-x-6 md:gap-y-10 md:px-6 lg:gap-x-8 mx-auto container">
        <p className="col-span-full text-center text-gray-500">
          No arenas match the current filter and sort criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 px-4 md:gap-x-6 md:gap-y-10 md:px-6 lg:gap-x-8 mx-auto container">
      {arenas.map((arena) => {
        const isVisited = arena.visited
        const displayRating = arena.displayRating!
        const rank = arena.rank

        return (
          <Link
            key={arena._id}
            href={`/arena/${arena.slug}`}
            passHref
            className={`group w-full flex justify-center ${
              isVisited
                ? 'cursor-pointer'
                : 'pointer-events-none cursor-default opacity-70'
            }`}
            aria-disabled={!isVisited}
            tabIndex={!isVisited ? -1 : undefined}
            prefetch={isVisited ? undefined : false}
          >
            <NBAArenaCard
              arenaImageSrc={arena.arenaImage}
              location={arena.location}
              constructionDate={arena.buildDate}
              capacity={arena.capacity}
              alt={`${arena.name ?? 'Arena'} exterior`}
              arenaReview={arena.arenaReview || {}}
              arenaName={arena.name}
              gallery={arena.gallery}
              visited={arena.visited}
              dateVisited={arena.date}
              id={arena._id}
              averageRating={displayRating.average}
              textRating={displayRating.textRating}
              ratingColor={displayRating.color}
              rank={rank}
            />
          </Link>
        )
      })}
    </div>
  )
}