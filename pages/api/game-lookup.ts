import type { NextApiRequest, NextApiResponse } from 'next'

const BALLDONTLIE_BASE = 'https://api.balldontlie.io'

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

    // 3. Get player stats for this game — requires a paid BallDontLie subscription.
    // If the plan doesn't include stats, skip gracefully and return game data without playerOfGame.
    let topPlayer: any = null
    try {
      const statsData = await bdlFetch(
        `${BALLDONTLIE_BASE}/${sport}/v1/stats?game_ids[]=${game.id}&per_page=100`,
      )
      const allStats: any[] = statsData.data ?? []

      // Find highest scorer (exclude 0:00 DNPs)
      const activePlayers = allStats.filter((s) => {
        const min = s.min ?? ''
        return (
          min !== '0:00' &&
          min !== '00:00' &&
          min !== '0' &&
          min !== '' &&
          s.pts != null
        )
      })
      topPlayer = activePlayers.sort(
        (a, b) => (b.pts ?? 0) - (a.pts ?? 0),
      )[0] ?? null
    } catch {
      // Stats endpoint requires a paid plan — game data is still returned without playerOfGame
    }

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
              playerName: `${topPlayer.player?.first_name ?? ''} ${topPlayer.player?.last_name ?? ''}`.trim(),
              teamName: topPlayer.team?.full_name ?? '',
              points: topPlayer.pts ?? 0,
              rebounds: topPlayer.reb ?? 0,
              assists: topPlayer.ast ?? 0,
              nbaPlayerId: topPlayer.player?.id ?? null,
            }
          : null,
      },
    })
  } catch (err: any) {
    console.error('[game-lookup]', err)
    return res.status(500).json({ error: err.message ?? 'Failed to fetch game data' })
  }
}
