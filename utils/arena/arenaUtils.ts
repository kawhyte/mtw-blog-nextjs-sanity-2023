import calculateAverageRating from 'lib/calculateArenaRating'
import { Arena } from 'lib/sanity.queries'
import { FilterCriteriaType, ArenaWithRating } from './arenaConstants'
import { getSorterFunction } from './arenaSorters'

/**
 * Filter arenas based on criteria
 */
export const filterArenas = (
  arenas: Arena[],
  filterCriteria: FilterCriteriaType,
): Arena[] => {
  switch (filterCriteria) {
    case 'visited':
      return arenas.filter((arena) => arena.visited)
    case 'notVisited':
      return arenas.filter((arena) => !arena.visited)
    case 'all':
    default:
      return arenas
  }
}

/**
 * Calculate stable ranking for visited arenas based on ratings
 */
export const calculateArenaRanks = (arenas: Arena[]): Map<string, number> => {
  const ranks = new Map<string, number>()

  // Filter for visited arenas only
  const visitedArenas = arenas.filter((arena) => arena.visited)

  // Sort by rating (highest first) with stable tie-breaking
  const sortedForRanking = [...visitedArenas].sort((a, b) => {
    const nameA = a.name ?? ''
    const nameB = b.name ?? ''
    const { average: scoreA } = calculateAverageRating(a.arenaReview || {})
    const { average: scoreB } = calculateAverageRating(b.arenaReview || {})

    const numScoreA = parseFloat(scoreA) || 0
    const numScoreB = parseFloat(scoreB) || 0

    // Primary sort: Higher score first
    if (numScoreB !== numScoreA) {
      return numScoreB - numScoreA
    }
    // Tie-breaker: Alphabetical name (A-Z)
    return nameA.localeCompare(nameB)
  })

  // Assign ranks based on sorted order
  sortedForRanking.forEach((arena, index) => {
    ranks.set(arena._id, index + 1)
  })

  return ranks
}

/**
 * Add display properties to arenas (rating info and rank)
 */
export const enrichArenasWithDisplayData = (
  arenas: Arena[],
  rankMap: Map<string, number>,
): ArenaWithRating[] => {
  return arenas.map((arena) => {
    const { average, textRating, color } = calculateAverageRating(
      arena.arenaReview || {},
    )

    return {
      ...arena,
      displayRating: {
        average,
        textRating,
        color,
      },
      rank: arena.visited ? (rankMap.get(arena._id) ?? null) : null,
    }
  })
}

/**
 * Sort and filter arenas based on criteria
 */
export const processArenas = (
  arenas: Arena[],
  filterCriteria: FilterCriteriaType,
  sortCriteria: string,
) => {
  // Filter first
  const filtered = filterArenas(arenas, filterCriteria)

  // Then sort
  const sorterFunction = getSorterFunction(sortCriteria as any, filterCriteria)
  const sorted = [...filtered].sort(sorterFunction)

  return sorted
}

/**
 * Validate arena for display (has required fields)
 */
export const isArenaValid = (arena: Arena): boolean => {
  if (!arena.slug) {
    console.warn(
      `Arena "${arena.name || arena._id}" is missing a slug. Skipping.`,
    )
    return false
  }
  return true
}

/**
 * Check if sort criteria is valid for the current filter
 */
export const isSortValidForFilter = (
  sortCriteria: string,
  filterCriteria: FilterCriteriaType,
): boolean => {
  if (filterCriteria === 'notVisited') {
    return sortCriteria === 'name_asc' || sortCriteria === 'name_desc'
  }
  return true
}
