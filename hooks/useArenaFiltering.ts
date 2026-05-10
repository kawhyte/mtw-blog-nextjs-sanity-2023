import { useEffect, useState } from 'react'
import {
  SortCriteriaType,
  FilterCriteriaType,
  DEFAULT_FILTERS,
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

  // When filter changes, reset sort to a valid option if current one is incompatible
  useEffect(() => {
    if (!isSortValidForFilter(sortCriteria, filterCriteria)) {
      setSortCriteria('name_asc')
    }
  }, [filterCriteria]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = (criteria: SortCriteriaType) => {
    setSortCriteria(criteria)
  }

  const handleFilter = (criteria: FilterCriteriaType) => {
    setFilterCriteria(criteria)
  }

  return {
    sortCriteria,
    filterCriteria,
    handleSort,
    handleFilter,
  }
}
