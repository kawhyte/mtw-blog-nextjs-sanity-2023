import { useMemo } from 'react'
import {
  SortCriteriaType,
  FilterCriteriaType,
  ArenaWithRating,
} from 'utils/arena/arenaConstants'
import { processArenas, isArenaValid } from 'utils/arena/arenaUtils'

/**
 * Custom hook that handles filtering and sorting of pre-computed arena data
 * Optimized: Now expects arenas to already have display data and rankings
 * All expensive calculations are done at build time in getStaticProps
 */
export const useArenaDisplay = (
  arenas: ArenaWithRating[], // ✅ Now expects pre-enriched data
  filterCriteria: FilterCriteriaType,
  sortCriteria: SortCriteriaType,
): ArenaWithRating[] => {
  // Memoize processing - no enrichment needed, data is pre-computed!
  const displayArenas = useMemo(() => {
    const processed = processArenas(arenas, filterCriteria, sortCriteria)
    return processed.filter(isArenaValid)
  }, [arenas, filterCriteria, sortCriteria])

  return displayArenas
}
