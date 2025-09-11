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
 * Optimized to reduce re-calculations
 */
export const useArenaDisplay = (
  arenas: Arena[],
  filterCriteria: FilterCriteriaType,
  sortCriteria: SortCriteriaType,
  rankMap: Map<string, number>,
): ArenaWithRating[] => {
  // Memoize base processing to avoid recalculation when only sort changes
  const baseProcessed = useMemo(() => {
    return processArenas(arenas, filterCriteria, sortCriteria)
  }, [arenas, filterCriteria, sortCriteria])

  // Memoize enrichment separately
  const displayArenas = useMemo(() => {
    const enriched = enrichArenasWithDisplayData(baseProcessed, rankMap)
    return enriched.filter(isArenaValid)
  }, [baseProcessed, rankMap])

  return displayArenas
}
