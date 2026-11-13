import calculateAverageRating from 'lib/calculateArenaRating'
import { getEffectiveRating } from 'lib/mergeRatings'
import { Arena } from 'lib/sanity.queries'
import {
  FilterCriteriaType,
  ArenaWithRating,
  NOT_VISITED_SORT_OPTIONS,
} from './arenaConstants'
import { getSorterFunction } from './arenaSorters'

/**
 * Single source of truth for arena rating display.
 * Always applies revisit updates before calculating, call this everywhere
 * a rating needs to be shown, never chain getEffectiveRating + calculateAverageRating manually.
 */
export const getArenaDisplayRating = (
  arena: Pick<Arena, 'arenaReview' | 'revisits'>,
) => {
  return calculateAverageRating(
    getEffectiveRating(arena.arenaReview || {}, arena.revisits),
  )
}

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
 * Calculate competition-style (Olympic) ranking for visited arenas.
 * Ranks use the exact (unrounded) score, so two arenas that both display
 * 4.5 can still rank #3 and #4. Only exactly equal scores share a rank.
 * The next unique score skips positions equal to the number of ties.
 */
export const calculateArenaRanks = (arenas: Arena[]): Map<string, number> => {
  const ranks = new Map<string, number>()

  const scored = arenas
    .filter((arena) => arena.visited)
    .map((arena) => ({
      id: arena._id,
      score: getArenaDisplayRating(arena).averageRaw || 0,
    }))
    .sort((a, b) => b.score - a.score)

  scored.forEach((entry, index) => {
    const prev = scored[index - 1]
    if (prev && Math.abs(entry.score - prev.score) < 1e-9) {
      ranks.set(entry.id, ranks.get(prev.id)!) // Exactly equal score: same rank
    } else {
      ranks.set(entry.id, index + 1) // Different score: skip tied positions
    }
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
    const { average, averageRaw, textRating, color } =
      getArenaDisplayRating(arena)

    return {
      ...arena,
      displayRating: {
        average,
        averageRaw,
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
    return (NOT_VISITED_SORT_OPTIONS as readonly string[]).includes(
      sortCriteria,
    )
  }
  return true
}

// Share cards are 1200px wide
const SHARE_MIN_WIDTH = 1200

/**
 * The photo to share the arena with (Facebook, iMessage, Google): the first
 * hero photo when it's big enough, otherwise the largest of the hero photos
 * and the card image, which is often tiny
 */
export const arenaSharePhoto = (
  arena: Pick<Arena, 'arenaImage' | 'heroPhotos'>,
) => {
  const width = (image: any) => image?.asset?.metadata?.dimensions?.width ?? 0
  const height = (image: any) => image?.asset?.metadata?.dimensions?.height ?? 0
  const first = arena.heroPhotos?.find((image) => image?.asset)
  if (first && width(first) >= SHARE_MIN_WIDTH) return first
  return (
    [...(arena.heroPhotos ?? []), arena.arenaImage]
      .filter((image) => image?.asset)
      .sort((a, b) => width(b) * height(b) - width(a) * height(a))[0] ?? null
  )
}

/** "Toronto, ON" → CA; everything else is in the US */
export const arenaCountry = (location?: string) =>
  /,\s*(AB|BC|MB|NB|NL|NS|ON|PE|QC|SK)$/i.test(location?.trim() ?? '')
    ? 'CA'
    : 'US'
