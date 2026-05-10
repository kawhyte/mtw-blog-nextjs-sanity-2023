import NBAArenaCard from 'components/NBAArenaCard'
import { MapPin } from 'lucide-react'
import { ArenaWithRating } from 'utils/arena/arenaConstants'

import { Separator } from '@/components/ui/separator'

interface ArenaGridProps {
  arenas: ArenaWithRating[]
}

function ArenaCardGrid({
  arenas,
  priorityOffset = 0,
}: {
  arenas: ArenaWithRating[]
  priorityOffset?: number
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 px-4 md:gap-x-6 md:gap-y-10 md:px-6 lg:gap-x-8 mx-auto container">
      {arenas.map((arena, index) => {
        const displayRating = arena.displayRating!
        const isPriority = index + priorityOffset < 6

        return (
          <NBAArenaCard
            key={arena._id}
            arenaImageSrc={arena.arenaImage}
            location={arena.location}
            constructionDate={arena.buildDate}
            capacity={arena.capacity}
            alt={`${arena.name ?? 'Arena'} exterior`}
            arenaReview={arena.arenaReview || {}}
            arenaName={arena.name}
            slug={arena.slug}
            gallery={
              arena.firstGalleryImage ? [arena.firstGalleryImage] : arena.gallery
            }
            visited={arena.visited}
            dateVisited={arena.date}
            id={arena._id}
            averageRating={displayRating.average}
            textRating={displayRating.textRating}
            ratingColor={displayRating.color}
            rank={arena.rank}
            priority={isPriority}
            revisitCount={arena.revisitCount}
          />
        )
      })}
    </div>
  )
}

export default function ArenaGrid({ arenas }: ArenaGridProps) {
  const visitedArenas = arenas.filter((a) => a.visited)
  const bucketListArenas = arenas.filter((a) => !a.visited)

  if (arenas.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center text-muted-foreground">
        No arenas match the current filter and sort criteria.
      </div>
    )
  }

  // If all arenas are unvisited (early-stage), show flat grid without section split
  if (visitedArenas.length === 0) {
    return <ArenaCardGrid arenas={bucketListArenas} />
  }

  return (
    <div className="space-y-12">
      <ArenaCardGrid arenas={visitedArenas} />

      {bucketListArenas.length > 0 && (
        <div>
          <div className="container mx-auto px-4 md:px-6 mb-8">
            <Separator className="mb-8" />
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Still on Our Bucket List
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {bucketListArenas.length} arena
                  {bucketListArenas.length !== 1 ? 's' : ''} left to visit
                </p>
              </div>
            </div>
          </div>
          <ArenaCardGrid
            arenas={bucketListArenas}
            priorityOffset={visitedArenas.length}
          />
        </div>
      )}
    </div>
  )
}
