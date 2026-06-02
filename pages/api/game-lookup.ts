import type { NextApiRequest, NextApiResponse } from 'next'

const BALLDONTLIE_BASE = 'https://api.balldontlie.io'
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/basketball'

async function getEspnPlayerOfGame(
  gameDate: string,
  teamName: string,
  sport: 'nba' | 'wnba',
): Promise<{
  playerName: string
  teamName: string
  points: number
  rebounds: number
  assists: number
  nbaPlayerId: number | null
} | null> {
  try {
    const dateParam = gameDate.replace(/-/g, '') // YYYYMMDD

    // 1. Find the ESPN event ID for this date + team
    const scoreboardRes = await fetch(
      `${ESPN_BASE}/${sport}/scoreboard?dates=${dateParam}`,
      { cache: 'no-store' },
    )
    if (!scoreboardRes.ok) return null
    const scoreboard = await scoreboardRes.json()

    const lower = teamName.toLowerCase().trim()
    const event = (scoreboard.events ?? []).find((e: any) =>
      (e.competitions?.[0]?.competitors ?? []).some((c: any) => {
        const t = c.team ?? {}
        return (
          t.displayName?.toLowerCase() === lower ||
          `${t.location ?? ''} ${t.name ?? ''}`.toLowerCase().trim() === lower
        )
      }),
    )
    if (!event) return null

    // 2. Fetch full box score for this event
    const summaryRes = await fetch(
      `${ESPN_BASE}/${sport}/summary?event=${event.id}`,
      { cache: 'no-store' },
    )
    if (!summaryRes.ok) return null
    const summary = await summaryRes.json()

    // 3. Find the top scorer across all players in the box score
    type PlayerEntry = {
      athlete: any
      pts: number
      reb: number
      ast: number
      teamDisplayName: string
    }
    const allPlayers: PlayerEntry[] = []

    for (const teamBlock of summary.boxscore?.players ?? []) {
      const teamDisplayName: string = teamBlock.team?.displayName ?? ''
      for (const statGroup of teamBlock.statistics ?? []) {
        const names: string[] = statGroup.names ?? statGroup.keys ?? []
        const idx = (label: string) =>
          names.findIndex((n: string) => n.toLowerCase().includes(label))
        const ptsIdx = idx('pts') !== -1 ? idx('pts') : idx('point')
        const rebIdx = idx('reb') !== -1 ? idx('reb') : idx('rebound')
        const astIdx = idx('ast') !== -1 ? idx('ast') : idx('assist')

        for (const entry of statGroup.athletes ?? []) {
          if (entry.didNotPlay) continue
          const stats: string[] = entry.stats ?? []
          allPlayers.push({
            athlete: entry.athlete,
            pts: ptsIdx >= 0 ? parseInt(stats[ptsIdx]) || 0 : 0,
            reb: rebIdx >= 0 ? parseInt(stats[rebIdx]) || 0 : 0,
            ast: astIdx >= 0 ? parseInt(stats[astIdx]) || 0 : 0,
            teamDisplayName,
          })
        }
      }
    }

    const top = allPlayers.sort((a, b) => b.pts - a.pts)[0]
    if (!top) return null

    return {
      playerName: top.athlete?.displayName ?? '',
      teamName: top.teamDisplayName,
      points: top.pts,
      rebounds: top.reb,
      assists: top.ast,
      nbaPlayerId: top.athlete?.id ? parseInt(top.athlete.id) : null,
    }
  } catch {
    return null
  }
}

async function bdlFetch(url: string) {
  const apiKey = process.env.BALLDONTLIE_API_KEY?.trim()
  const res = await fetch(url, {
    headers: apiKey ? { Authorization: apiKey } : {},
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`BallDontLie API ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

async function findTeamId(
  teamName: string,
  sport: 'nba' | 'wnba',
): Promise<number | null> {
  const data = await bdlFetch(
    `${BALLDONTLIE_BASE}/${sport}/v1/teams?per_page=100`,
  )
  const lower = teamName.toLowerCase().trim()
  const team = (data.data ?? []).find(
    (t: any) =>
      t.full_name?.toLowerCase() === lower ||
      t.name?.toLowerCase() === lower ||
      `${t.city} ${t.name}`.toLowerCase() === lower,
  )
  return team ? team.id : null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.BALLDONTLIE_API_KEY?.trim()) {
    return res
      .status(500)
      .json({ error: 'BALLDONTLIE_API_KEY is not configured in .env.local' })
  }

  const { gameDate, teamName, teamType } = req.body as {
    gameDate?: string
    teamName?: string
    teamType?: string
  }

  if (!gameDate || !teamName) {
    return res.status(400).json({ error: 'gameDate and teamName are required' })
  }

  if (teamType !== 'nba' && teamType !== 'wnba') {
    return res.status(400).json({
      error: `Auto-fetch is only supported for NBA and WNBA teams. Fill in this game's data manually.`,
    })
  }

  const sport: 'nba' | 'wnba' = teamType

  try {
    // 1. Resolve team ID by name
    const teamId = await findTeamId(teamName, sport)
    if (!teamId) {
      return res.status(404).json({
        error: `Team "${teamName}" not found in BallDontLie. Check that the team name matches exactly (e.g. "Detroit Pistons", "New York Liberty").`,
      })
    }

    // 2. Find game by date + team
    const gamesData = await bdlFetch(
      `${BALLDONTLIE_BASE}/${sport}/v1/games?dates[]=${gameDate}&team_ids[]=${teamId}&per_page=10`,
    )
    const game = (gamesData.data ?? [])[0]
    if (!game) {
      return res.status(404).json({
        error: `No game found for ${teamName} on ${gameDate}. Double-check the date, or the game result may not be available yet if it hasn't been played.`,
      })
    }

    // 3. Get player of game from ESPN (free, no API key needed)
    const topPlayer = await getEspnPlayerOfGame(gameDate, teamName, sport)

    // 4. Determine opponent and scores
    const trackedTeamIsHome = game.home_team.id === teamId
    const opponent = trackedTeamIsHome
      ? game.visitor_team.full_name
      : game.home_team.full_name

    // homeScore/awayScore always relative to the tracked team:
    // homeScore = tracked team's score, awayScore = opponent's score
    const trackedScore = trackedTeamIsHome
      ? game.home_team_score
      : game.visitor_team_score
    const opponentScore = trackedTeamIsHome
      ? game.visitor_team_score
      : game.home_team_score

    // 5. Derive season type and OT info
    const seasonType = game.postseason ? 'Playoffs' : 'Regular Season'
    const overtimePeriods = Math.max(0, (game.period ?? 4) - 4)

    return res.status(200).json({
      game: {
        gameDate,
        opponent,
        homeScore: trackedScore ?? null,
        awayScore: opponentScore ?? null,
        seasonType,
        overtimePeriods,
        playerOfGame: topPlayer
          ? {
              playerName: topPlayer.playerName,
              teamName: topPlayer.teamName,
              points: topPlayer.points,
              rebounds: topPlayer.rebounds,
              assists: topPlayer.assists,
              nbaPlayerId: topPlayer.nbaPlayerId,
            }
          : null,
      },
    })
  } catch (err: any) {
    console.error('[game-lookup]', err)
    return res.status(500).json({ error: err.message ?? 'Failed to fetch game data' })
  }
}
