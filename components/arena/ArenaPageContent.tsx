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
  const {
    sortCriteria,
    filterCriteria,
    handleSort,
    handleFilter,
    isSortDisabled,
  } = useArenaFiltering()

  // ✅ No more ranking calculations - data is pre-computed!
  const displayArenas = useArenaDisplay(arenas, filterCriteria, sortCriteria)

  return (
    <>
      <ArenaFilters
        sortCriteria={sortCriteria}
        filterCriteria={filterCriteria}
        onSortChange={handleSort}
        onFilterChange={handleFilter}
        isSortDisabled={isSortDisabled}
      />

      <ArenaGrid arenas={displayArenas} />
    </>
  )
}
