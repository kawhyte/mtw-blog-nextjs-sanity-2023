import { useArenaDisplay } from 'hooks/useArenaDisplay'
import { useArenaFiltering } from 'hooks/useArenaFiltering'
import { ArenaWithRating } from 'utils/arena/arenaConstants'

import ArenaFilters from './ArenaFilters'
import ArenaGrid from './ArenaGrid'

interface ArenaPageContentProps {
  arenas: ArenaWithRating[] // ✅ Now expects pre-enriched data
}

export default function ArenaPageContent({ arenas }: ArenaPageContentProps) {
  // Custom hooks for managing state and data processing
  const { sortCriteria, filterCriteria, handleSort, handleFilter } =
    useArenaFiltering()

  const displayArenas = useArenaDisplay(arenas, filterCriteria, sortCriteria)
  const visitedCount = arenas.filter((a) => a.visited).length

  return (
    // Anchor for the podium's "See the full rankings" link (scroll-mt
    // clears the sticky nav)
    <div id="arena-rankings" className="scroll-mt-20">
      {/* This heading peeks in under the hero on every screen, so it's clear
          the page keeps going */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-heading-family text-2xl font-extrabold tracking-tight text-foreground md:text-[28px]">
          The rankings
        </h2>
        <p className="mt-1 text-[15px] text-muted-foreground">
          All {arenas.length} arenas, best to worst. {visitedCount} visited
          {arenas.length > visitedCount
            ? `, ${arenas.length - visitedCount} to go`
            : ''}
          .
        </p>
      </div>
      <ArenaFilters
        sortCriteria={sortCriteria}
        filterCriteria={filterCriteria}
        onSortChange={handleSort}
        onFilterChange={handleFilter}
      />

      <ArenaGrid arenas={displayArenas} />
    </div>
  )
}
