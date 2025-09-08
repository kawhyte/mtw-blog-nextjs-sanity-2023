import { Arena } from 'lib/sanity.queries'

export type SortCriteriaType =
  | 'latest'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'highest'
  | 'lowest'

export type FilterCriteriaType = 'all' | 'visited' | 'notVisited'

export interface ArenaWithRating extends Arena {
  displayRating?: {
    average: string
    textRating: string
    color: string
  }
  rank?: number | null
}

export interface ArenaFilters {
  sortCriteria: SortCriteriaType
  filterCriteria: FilterCriteriaType
}

export const DEFAULT_FILTERS: ArenaFilters = {
  sortCriteria: 'highest',
  filterCriteria: 'all',
}

export const SORT_OPTIONS = [
  { value: 'highest' as const, label: 'Ranked: High to Low' },
  { value: 'lowest' as const, label: 'Ranked: Low to High' },
  { value: 'latest' as const, label: 'Date Visited: Most Recent' },
  { value: 'name_asc' as const, label: 'Arena Name (A-Z)' },
  { value: 'name_desc' as const, label: 'Arena Name (Z-A)' },
] as const

export const FILTER_OPTIONS = [
  { value: 'all' as const, label: 'All' },
  { value: 'visited' as const, label: 'Visited' },
  { value: 'notVisited' as const, label: 'Not Visited' },
] as const

// Sort options available for unvisited arenas
export const NOT_VISITED_SORT_OPTIONS = ['name_asc', 'name_desc'] as const
