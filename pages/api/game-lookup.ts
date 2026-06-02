import type { NextApiRequest, NextApiResponse } from 'next'

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/basketball'

type EspnPlayer = {
  _key: string
  playerName: string
  teamName: string
  points: number
  rebounds: number
  assists: number
  nbaPlayerId: number | null
}

type EspnGameResult = {
  opponent: string
  ourScore: number | null
  opponentScore: number | null
  seasonType: string
  overtimePeriods: number
  players: EspnPlayer[]
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

async function getEspnGameData(
  gameDate: string,
  teamName: string,
  sport: 'nba' | 'wnba',
): Promise<EspnGameResult | null> {
  const dateParam = gameDate.replace(/-/g, '') // YYYYMMDD
  const lower = teamName.toLowerCase().trim()

  // 1. Scoreboard — find the event and extract game data
  const scoreboardRes = await fetch(
    `${ESPN_BASE}/${sport}/scoreboard?dates=${dateParam}`,
    { cache: 'no-store' },
  )
  if (!scoreboardRes.ok) return null
  const scoreboard = await scoreboardRes.json()

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

  const competition = event.competitions?.[0]
  const competitors: any[] = competition?.competitors ?? []

  const ourComp = competitors.find((c: any) => {
    const t = c.team ?? {}
    return (
      t.displayName?.toLowerCase() === lower ||
      `${t.location ?? ''} ${t.name ?? ''}`.toLowerCase().trim() === lower
    )
  })
  const oppComp = competitors.find((c: any) => c !== ourComp)

  const ourScore = ourComp?.score != null ? parseInt(ourComp.score) : null
  const opponentScore = oppComp?.score != null ? parseInt(oppComp.score) : null
  const opponent: string = oppComp?.team?.displayName ?? ''

  // ESPN season type: 1 = pre-season, 2 = regular, 3 = post-season
  const espnSeasonType: number = event.season?.type ?? 2
  const seasonType =
    espnSeasonType === 1
      ? 'Pre-Season'
      : espnSeasonType === 3
        ? 'Playoffs'
        : 'Regular Season'

  const period: number = competition?.status?.period ?? 4
  const overtimePeriods = Math.max(0, period - 4)

  // 2. Summary — full box score for top scorer per team
  const players: EspnPlayer[] = []
  try {
    const summaryRes = await fetch(
      `${ESPN_BASE}/${sport}/summary?event=${event.id}`,
      { cache: 'no-store' },
    )
    if (summaryRes.ok) {
      const summary = await summaryRes.json()

      for (const teamBlock of summary.boxscore?.players ?? []) {
        const teamDisplayName: string = teamBlock.team?.displayName ?? ''
        const teamPlayers: Array<{
          athlete: any
          pts: number
          reb: number
          ast: number
        }> = []

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
            teamPlayers.push({
              athlete: entry.athlete,
              pts: ptsIdx >= 0 ? parseInt(stats[ptsIdx]) || 0 : 0,
              reb: rebIdx >= 0 ? parseInt(stats[rebIdx]) || 0 : 0,
              ast: astIdx >= 0 ? parseInt(stats[astIdx]) || 0 : 0,
            })
          }
        }

        const top = teamPlayers.sort((a, b) => b.pts - a.pts)[0]
        if (top) {
          players.push({
            _key: randomKey(),
            playerName: top.athlete?.displayName ?? '',
            teamName: teamDisplayName,
            points: top.pts,
            rebounds: top.reb,
            assists: top.ast,
            nbaPlayerId: top.athlete?.id ? parseInt(top.athlete.id) : null,
          })
        }
      }
    }
  } catch {
    // Summary failed — return game data without player info
  }

  return { opponent, ourScore, opponentScore, seasonType, overtimePeriods, players }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
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
    const gameData = await getEspnGameData(gameDate, teamName, sport)

    if (!gameData) {
      return res.status(404).json({
        error: `No game found for "${teamName}" on ${gameDate}. Double-check the team name (e.g. "San Antonio Spurs") and date, or the result may not be available yet.`,
      })
    }

    return res.status(200).json({
      game: {
        gameDate,
        opponent: gameData.opponent,
        homeScore: gameData.ourScore,
        awayScore: gameData.opponentScore,
        seasonType: gameData.seasonType,
        overtimePeriods: gameData.overtimePeriods,
        playerOfGame: gameData.players.length > 0 ? gameData.players : null,
      },
    })
  } catch (err: any) {
    console.error('[game-lookup]', err)
    return res.status(500).json({
      error: err.message ?? 'Failed to fetch game data',
    })
  }
}
