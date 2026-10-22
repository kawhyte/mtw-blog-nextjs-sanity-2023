import SwipeRow from 'components/listing/SwipeRow'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'

const gameDate = (date?: string) =>
  date
    ? new Date(`${date}T12:00:00`)
        .toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        .toUpperCase()
    : null

const headshot = (team: any, playerId: number) =>
  `https://a.espncdn.com/i/headshots/${team.teamType === 'wnba' ? 'wnba' : 'nba'}/players/full/${playerId}.png`

const initials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function TeamLogo({ team, size }: { team: any; size: number }) {
  if (!team.asset) return null
  return (
    <Image
      src={urlForImage(team)
        .width(size * 2)
        .height(size * 2)
        .fit('max')
        .auto('format')
        .url()}
      alt={`${team.name} logo`}
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0 rounded-xl border-2 border-border bg-white object-contain p-0.5"
    />
  )
}

/** One game: final score, the result and the top scorer from each team */
function GameCard({ game, team }: { game: any; team: any }) {
  const hasScore = game.homeScore != null && game.awayScore != null
  const won = hasScore && game.homeScore > game.awayScore
  const lost = hasScore && game.homeScore < game.awayScore
  const extra =
    game.eventName ||
    (game.seasonType && game.seasonType !== 'Regular Season'
      ? game.seasonType
      : null)
  const overtime =
    game.overtimePeriods > 0
      ? game.overtimePeriods === 1
        ? 'OT'
        : `${game.overtimePeriods}OT`
      : null

  return (
    <div className="flex w-[78vw] max-w-[268px] shrink-0 snap-start flex-col gap-3 rounded-2xl border-[3px] border-border-bold bg-card p-4">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold tracking-[0.1em] text-muted-foreground">
        <span>
          FINAL{gameDate(game.gameDate) ? ` · ${gameDate(game.gameDate)}` : ''}
        </span>
        {overtime && <span className="text-amber-600">· {overtime}</span>}
        {extra && (
          <span className="rounded-full bg-primary-soft-background px-2 py-0.5 tracking-normal text-primary">
            {extra}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[15px] font-bold">{team.name}</span>
          {hasScore && (
            <span className="font-heading-family flex items-baseline gap-1.5 text-xl font-extrabold tabular-nums">
              {game.homeScore}
              <span
                className={`text-xs ${won ? 'text-green-600' : 'text-red-600'}`}
              >
                {won ? 'W' : lost ? 'L' : ''}
              </span>
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-between gap-2 text-muted-foreground">
          <span className="truncate text-[15px]">{game.opponent ?? 'TBA'}</span>
          {hasScore && (
            <span className="font-heading-family pr-[1.1rem] text-xl font-bold tabular-nums">
              {game.awayScore}
            </span>
          )}
        </div>
      </div>

      {game.playerOfGame?.length > 0 && (
        <div className="flex flex-col gap-2.5 border-t-2 border-muted pt-3">
          <span className="text-[11px] font-extrabold tracking-[0.1em] text-muted-foreground">
            TOP SCORERS
          </span>
          {game.playerOfGame.map((player: any, i: number) => (
            <div
              key={player._key ?? i}
              className="flex min-w-0 items-center gap-2.5"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-extrabold text-muted-foreground">
                {initials(player.playerName)}
                {player.nbaPlayerId && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={headshot(team, player.nbaPlayerId)}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full bg-muted object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[13px] font-bold">
                  {player.playerName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {[
                    player.points != null && `${player.points} pts`,
                    player.rebounds != null && `${player.rebounds} reb`,
                    player.assists != null && `${player.assists} ast`,
                  ]
                    .filter(Boolean)
                    .join(' · ') || player.teamName}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const teamSummary = (team: any) => {
  const games: any[] = team.attendedGames ?? []
  const count = games.length || team.timesAttended || 1
  const scored = games.filter((g) => g.homeScore != null && g.awayScore != null)
  const wins = scored.filter((g) => g.homeScore > g.awayScore).length
  const league = team.teamType
    ? `${String(team.teamType).toUpperCase()} · `
    : ''
  const record =
    scored.length === 0
      ? ''
      : wins === scored.length
        ? scored.length === 1
          ? ', a win'
          : ', all wins'
        : `, ${wins} win${wins === 1 ? '' : 's'}`
  const special = team.specialGame ? ' · special game here' : ''
  return `${league}${count} game${count === 1 ? '' : 's'}${record}${special}`
}

/** Every game we saw here, one swipe row per team, plus the other teams */
export default function ArenaGames({ teams }: { teams: any[] }) {
  const attended = teams.filter((t) => t.played && t.name)
  const others = teams.filter((t) => !t.played && t.name)
  if (attended.length === 0 && others.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
      {attended.map((team, i) => {
        const header = (
          <div className="flex items-center gap-3">
            <TeamLogo team={team} size={44} />
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-bold">{team.name}</span>
              <span className="text-sm text-muted-foreground">
                {teamSummary(team)}
              </span>
            </div>
          </div>
        )
        const games: any[] = team.attendedGames ?? []
        if (games.length === 0) {
          return (
            <section key={team.name} className="flex flex-col gap-4">
              {i === 0 && (
                <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  Games we attended
                </h2>
              )}
              {header}
            </section>
          )
        }
        return (
          <SwipeRow
            key={team.name}
            title={i === 0 ? 'Games we attended' : `${team.name} games`}
            subtitle={
              i === 0
                ? 'Final scores and top scorers from every game we saw here.'
                : undefined
            }
            toolbar={header}
          >
            {games.map((game, gi) => (
              <GameCard key={game._key ?? gi} game={game} team={team} />
            ))}
          </SwipeRow>
        )
      })}

      {others.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-xs font-extrabold tracking-[0.12em] text-muted-foreground">
            ALSO PLAYS HERE
          </span>
          <ul className="flex flex-wrap gap-2">
            {others.map((team) => (
              <li
                key={team.name}
                className="flex items-center gap-2 rounded-full border-2 border-border bg-card py-1 pl-1 pr-3 text-sm"
              >
                <TeamLogo team={team} size={28} />
                <span className="font-semibold">{team.name}</span>
                {team.teamType && (
                  <span className="text-xs uppercase text-muted-foreground">
                    {team.teamType}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
