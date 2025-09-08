import { useArenaDisplay } from 'hooks/useArenaDisplay'
import { useArenaFiltering } from 'hooks/useArenaFiltering'
import { useArenaRanking } from 'hooks/useArenaRanking'
import { Arena } from 'lib/sanity.queries'

import ArenaFilters from './ArenaFilters'
import ArenaGrid from './ArenaGrid'

interface ArenaPageContentProps {
  arenas: Arena[]
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

  const rankMap = useArenaRanking(arenas)

  const displayArenas = useArenaDisplay(
    arenas,
    filterCriteria,
    sortCriteria,
    rankMap,
  )

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