import { useMemo } from 'react'
import { Arena } from 'lib/sanity.queries'
import {
  SortCriteriaType,
  FilterCriteriaType,
  ArenaWithRating,
} from 'utils/arena/arenaConstants'
import {
  processArenas,
  enrichArenasWithDisplayData,
  isArenaValid,
} from 'utils/arena/arenaUtils'

/**
 * Custom hook that combines filtering, sorting, and ranking logic
 */
export const useArenaDisplay = (
  arenas: Arena[],
  filterCriteria: FilterCriteriaType,
  sortCriteria: SortCriteriaType,
  rankMap: Map<string, number>,
): ArenaWithRating[] => {
  const displayArenas = useMemo(() => {
    // Process arenas (filter and sort)
    const processed = processArenas(arenas, filterCriteria, sortCriteria)

    // Enrich with display data (ratings and ranks)
    const enriched = enrichArenasWithDisplayData(processed, rankMap)

    // Filter out invalid arenas
    return enriched.filter(isArenaValid)
  }, [arenas, filterCriteria, sortCriteria, rankMap])

  return displayArenas
}
