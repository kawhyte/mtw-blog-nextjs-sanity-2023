import { useEffect, useState } from 'react'
import {
  SortCriteriaType,
  FilterCriteriaType,
  DEFAULT_FILTERS,
  NOT_VISITED_SORT_OPTIONS,
} from 'utils/arena/arenaConstants'
import { isSortValidForFilter } from 'utils/arena/arenaUtils'

/**
 * Custom hook for managing arena filtering and sorting state
 */
export const useArenaFiltering = () => {
  const [sortCriteria, setSortCriteria] = useState<SortCriteriaType>(
    DEFAULT_FILTERS.sortCriteria,
  )
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteriaType>(
    DEFAULT_FILTERS.filterCriteria,
  )

  // Effect to adjust sort criteria when filter changes to 'notVisited'
  useEffect(() => {
    if (!isSortValidForFilter(sortCriteria, filterCriteria)) {
      setSortCriteria('name_asc') // Default to A-Z for not visited
    }
  }, [filterCriteria, sortCriteria])

  const handleSort = (criteria: SortCriteriaType) => {
    setSortCriteria(criteria)
  }

  const handleFilter = (criteria: FilterCriteriaType) => {
    setFilterCriteria(criteria)
  }

  const isSortDisabled = filterCriteria === 'notVisited'

  return {
    sortCriteria,
    filterCriteria,
    handleSort,
    handleFilter,
    isSortDisabled,
  }
}
