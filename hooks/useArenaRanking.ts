import { useMemo } from 'react'
import { Arena } from 'lib/sanity.queries'
import { calculateArenaRanks } from 'utils/arena/arenaUtils'

/**
 * Custom hook for calculating stable arena rankings
 */
export const useArenaRanking = (arenas: Arena[]) => {
  const rankMap = useMemo(() => {
    return calculateArenaRanks(arenas)
  }, [arenas])

  return rankMap
}