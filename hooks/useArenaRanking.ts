import { useMemo, useRef } from 'react'
import { Arena } from 'lib/sanity.queries'
import { calculateArenaRanks } from 'utils/arena/arenaUtils'

/**
 * Custom hook for calculating stable arena rankings
 * Optimized to prevent unnecessary recalculations
 */
export const useArenaRanking = (arenas: Arena[]) => {
  const lastArenasRef = useRef<Arena[]>([])
  const cachedRankMapRef = useRef<Map<string, number>>(new Map())

  const rankMap = useMemo(() => {
    // Check if arenas have actually changed
    if (
      arenas.length === lastArenasRef.current.length &&
      arenas.every((arena, index) => arena._id === lastArenasRef.current[index]?._id)
    ) {
      return cachedRankMapRef.current
    }

    // Recalculate only if arenas have changed
    const newRankMap = calculateArenaRanks(arenas)
    lastArenasRef.current = arenas
    cachedRankMapRef.current = newRankMap
    return newRankMap
  }, [arenas])

  return rankMap
}
