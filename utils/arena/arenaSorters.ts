import calculateAverageRating from 'lib/calculateArenaRating'
import { Arena } from 'lib/sanity.queries'
import { SortCriteriaType, FilterCriteriaType } from './arenaConstants'

/**
 * Sort arenas by date (latest first)
 */
export const sortByLatest = (a: Arena, b: Arena): number => {
  const nameA = a.name ?? ''
  const nameB = b.name ?? ''
  const dateA = a.date ? new Date(a.date).getTime() : 0
  const dateB = b.date ? new Date(b.date).getTime() : 0

  // Prioritize visited arenas
  if (!a.visited && b.visited) return 1
  if (a.visited && !b.visited) return -1
  if (!a.visited && !b.visited) return nameA.localeCompare(nameB)

  // For visited arenas, sort by date (latest first)
  if (dateB && !dateA) return 1
  if (!dateB && dateA) return -1
  return dateB - dateA
}

/**
 * Sort arenas by date (oldest first)
 */
export const sortByOldest = (a: Arena, b: Arena): number => {
  const nameA = a.name ?? ''
  const nameB = b.name ?? ''
  const dateA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER
  const dateB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER

  // Prioritize visited arenas
  if (a.visited && !b.visited) return -1
  if (!a.visited && b.visited) return 1
  if (!a.visited && !b.visited) return nameA.localeCompare(nameB)

  // For visited arenas, sort by date (oldest first)
  if (dateA && !dateB) return -1
  if (!dateA && dateB) return 1
  return dateA - dateB
}

/**
 * Sort arenas by name (A-Z)
 */
export const sortByNameAsc = (a: Arena, b: Arena): number => {
  const nameA = a.name ?? ''
  const nameB = b.name ?? ''
  return nameA.localeCompare(nameB)
}

/**
 * Sort arenas by name (Z-A)
 */
export const sortByNameDesc = (a: Arena, b: Arena): number => {
  const nameA = a.name ?? ''
  const nameB = b.name ?? ''
  return nameB.localeCompare(nameA)
}

/**
 * Sort arenas by rating (highest first)
 */
export const sortByHighestRating = (a: Arena, b: Arena): number => {
  const nameA = a.name ?? ''
  const nameB = b.name ?? ''

  // Non-visited arenas always go last
  if (!a.visited && b.visited) return 1
  if (a.visited && !b.visited) return -1
  if (!a.visited && !b.visited) return nameA.localeCompare(nameB)

  // Both are visited, compare ratings
  const { average: scoreA } = calculateAverageRating(a.arenaReview || {})
  const { average: scoreB } = calculateAverageRating(b.arenaReview || {})
  const numScoreA = parseFloat(scoreA) || 0
  const numScoreB = parseFloat(scoreB) || 0

  if (numScoreB !== numScoreA) {
    return numScoreB - numScoreA // Higher score first
  }
  return nameA.localeCompare(nameB) // Tie-breaker: alphabetical
}

/**
 * Sort arenas by rating (lowest first)
 */
export const sortByLowestRating = (a: Arena, b: Arena): number => {
  const nameA = a.name ?? ''
  const nameB = b.name ?? ''

  // Non-visited arenas always go last
  if (!a.visited && b.visited) return 1
  if (a.visited && !b.visited) return -1
  if (!a.visited && !b.visited) return nameA.localeCompare(nameB)

  // Both are visited, compare ratings
  const { average: scoreA } = calculateAverageRating(a.arenaReview || {})
  const { average: scoreB } = calculateAverageRating(b.arenaReview || {})
  const numScoreA = parseFloat(scoreA) || 0
  const numScoreB = parseFloat(scoreB) || 0

  if (numScoreA !== numScoreB) {
    return numScoreA - numScoreB // Lower score first
  }
  return nameA.localeCompare(nameB) // Tie-breaker: alphabetical
}

/**
 * Get the appropriate sorter function based on criteria
 */
export const getSorterFunction = (
  sortCriteria: SortCriteriaType,
  filterCriteria: FilterCriteriaType,
) => {
  // For 'notVisited', only allow name sorting
  if (filterCriteria === 'notVisited') {
    return sortCriteria === 'name_desc' ? sortByNameDesc : sortByNameAsc
  }

  // For all other filters, use the requested sort
  switch (sortCriteria) {
    case 'latest':
      return sortByLatest
    case 'oldest':
      return sortByOldest
    case 'name_asc':
      return sortByNameAsc
    case 'name_desc':
      return sortByNameDesc
    case 'highest':
      return sortByHighestRating
    case 'lowest':
      return sortByLowestRating
    default:
      return sortByHighestRating
  }
}