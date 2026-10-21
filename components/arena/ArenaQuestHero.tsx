import { formatDate } from 'components/PostDate'
import SanityImage from 'components/SanityImage'
import { Trophy } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import type { ArenaWithRating } from 'utils/arena/arenaConstants'
import { getRankBadgeStyle } from 'utils/arena/rankBadgeStyles'

import ArenaQuestMap from './ArenaQuestMap'

interface ArenaQuestHeroProps {
  arenas: ArenaWithRating[]
  hotelReviewCount: number
  foodReviewCount: number
}

const cityOf = (location?: string) => location?.split(',')[0]?.trim() ?? ''

// Fixed confetti layout (no Math.random, so server and client HTML match)
const CONFETTI_COLORS = ['bg-primary', 'bg-secondary', 'bg-yellow-400', 'bg-green-500']
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37 + 7) % 100}%`,
  delay: `${(i % 6) * 0.12}s`,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  rotate: `${(i * 47) % 360}deg`,
}))

/** One-time confetti burst over the hero when the quest is complete. */
function Confetti() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {CONFETTI.map((piece, i) => (
        <span
          key={i}
          className={`quest-confetti absolute top-0 h-3 w-1.5 rounded-sm ${piece.color}`}
          style={
            {
              left: piece.left,
              animationDelay: piece.delay,
              '--confetti-rotate': piece.rotate,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Shown in place of the "to go" chips once every arena is visited. */
function FinalPodium({
  arenas,
  finishedOn,
}: {
  arenas: ArenaWithRating[]
  finishedOn?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border-2 border-border-bold bg-yellow-300 px-3 py-1.5 text-sm font-extrabold text-gray-900 shadow-brutalist-sm">
        <Trophy className="h-4 w-4" aria-hidden="true" />
        Quest complete{finishedOn ? ` · finished ${formatDate(finishedOn)}` : ''}
      </span>
      <span className="text-sm font-bold">Our final top 3</span>
      <ol className="flex flex-col gap-2">
        {arenas.map((arena) => (
          <li key={arena._id}>
            <Link
              href={`/arena/${arena.slug}`}
              className="flex min-h-11 items-center gap-3 rounded-2xl border-2 border-border-bold bg-card p-2 pr-3 shadow-brutalist-sm transition-transform hover:-translate-y-0.5"
            >
              <span
                className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full px-2 text-xs font-black ${getRankBadgeStyle(arena.rank ?? 99)}`}
              >
                #{arena.rank}
              </span>
              {arena.arenaImage?.asset && (
                <SanityImage
                  image={arena.arenaImage}
                  width={96}
                  height={96}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-xl object-cover"
                  sizes="44px"
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{arena.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {cityOf(arena.location)}
                </span>
              </span>
              {arena.displayRating?.average && (
                <span className="shrink-0 rounded-lg bg-green-600 px-2 py-1 text-sm font-extrabold text-white">
                  {arena.displayRating.average}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
      <a
        href="#arena-rankings"
        className="inline-flex min-h-11 w-fit items-center text-sm font-bold text-primary hover:underline"
      >
        See the full rankings ↓
      </a>
    </div>
  )
}

function StatTile({
  value,
  label,
  accent,
}: {
  value: number
  label: string
  accent: string
}) {
  return (
    <div className="rounded-2xl border-[3px] border-border-bold bg-card px-4 py-3 shadow-brutalist sm:px-5 sm:py-4">
      <div className={`font-epilogue text-3xl font-extrabold sm:text-4xl ${accent}`}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

/**
 * /arenas hero: the quest progress (animated count + bar), a US map of every
 * arena, the arenas still to go, and quick stats.
 */
export default function ArenaQuestHero({
  arenas,
  hotelReviewCount,
  foodReviewCount,
}: ArenaQuestHeroProps) {
  const visited = useMemo(() => arenas.filter((a) => a.visited), [arenas])
  const stillToGo = useMemo(
    () =>
      arenas
        .filter((a) => !a.visited)
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')),
    [arenas],
  )
  const lastVisited = useMemo(
    () =>
      [...visited].sort(
        (a, b) => new Date(b.date ?? 0).valueOf() - new Date(a.date ?? 0).valueOf(),
      )[0],
    [visited],
  )
  const arenaCities = useMemo(
    () =>
      new Set(visited.map((a) => (a.location ?? '').trim().toLowerCase()))
        .size,
    [visited],
  )

  const total = arenas.length
  const progress = total > 0 ? visited.length / total : 0
  // Complete only while every arena is visited — adding a new arena in
  // Studio reopens the quest automatically.
  const complete = total > 0 && visited.length === total
  const podium = useMemo(
    () =>
      visited
        .filter((a) => a.rank != null && a.slug)
        .sort(
          (a, b) =>
            (a.rank ?? 0) - (b.rank ?? 0) ||
            Number(b.displayRating?.average ?? 0) -
              Number(a.displayRating?.average ?? 0),
        )
        .slice(0, 3),
    [visited],
  )

  return (
    <section className="relative bg-secondary-soft-background">
      {complete && <Confetti />}
      <div className="container mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 py-8 sm:gap-8 sm:py-10 md:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:py-14">
        <div className="flex flex-col gap-5">
          <span className="text-xs font-bold tracking-[0.14em] text-primary">
            THE ARENA QUEST
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-primary md:text-5xl">
            Visiting and Ranking Every NBA/WNBA Arena
          </h1>
          <p className="max-w-xl leading-relaxed text-muted-foreground">
            {complete
              ? `We did it — all ${total} NBA and WNBA arenas across the US and Canada, visited and ranked. Here's how they stack up.`
              : `We're traveling near and far to visit and rank all ${total} NBA and WNBA arenas across the US and Canada. Follow along as the map fills in.`}
          </p>

          <div>
            <div className="flex items-baseline gap-2">
              {/* Animated digits are decorative; the sr-only text is what
                  screen readers and search engines read */}
              <span
                aria-hidden="true"
                className="quest-count font-epilogue text-7xl font-extrabold leading-none tabular-nums text-foreground md:text-8xl"
                style={{ '--quest-target': visited.length } as React.CSSProperties}
              />
              <span className="sr-only">{visited.length}</span>
              <span className="font-epilogue text-2xl font-bold text-muted-foreground md:text-3xl">
                / {total}
              </span>
              <span className="text-sm text-muted-foreground md:text-base">
                arenas visited
              </span>
            </div>
            <div
              className="mt-4 h-4 overflow-hidden rounded-full border-[3px] border-border-bold bg-card"
              role="progressbar"
              aria-label="Arenas visited"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={visited.length}
            >
              <div
                className="quest-bar h-full w-full bg-primary"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
            {/* Phones: skip past the map straight to the arena list (the
                podium has its own link once the quest is complete) */}
            {!complete && (
              <a
                href="#arena-rankings"
                className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-primary hover:underline md:hidden"
              >
                Jump to the rankings ↓
              </a>
            )}
          </div>

          {complete ? (
            <FinalPodium arenas={podium} finishedOn={lastVisited?.date} />
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold">
                {stillToGo.length} to go
              </span>
              <ul className="flex flex-wrap gap-2">
                {stillToGo.map((arena) => (
                  <li
                    key={arena._id}
                    className="rounded-full border-2 border-dashed border-border-bold bg-card px-3 py-1.5 text-xs sm:text-sm"
                  >
                    {arena.name}
                    {arena.location ? ` · ${cityOf(arena.location)}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-3xl border-4 border-border-bold bg-card p-3 shadow-brutalist sm:gap-3 sm:p-6">
          <h2 className="font-epilogue text-lg font-extrabold sm:text-2xl">
            Our arena map
          </h2>
          <ArenaQuestMap arenas={arenas} />
          {lastVisited && (
            <div className="flex items-center justify-between gap-3 border-t-2 border-border pt-2 text-sm sm:pt-3">
              <span className="min-w-0 truncate">
                <span className="text-muted-foreground">Last visited </span>
                <strong>{lastVisited.name}</strong>
                <span className="hidden sm:inline">
                  {lastVisited.location
                    ? ` · ${cityOf(lastVisited.location)}`
                    : ''}
                  {lastVisited.date ? ` · ${formatDate(lastVisited.date)}` : ''}
                </span>
              </span>
              {lastVisited.slug && (
                <Link
                  href={`/arena/${lastVisited.slug}`}
                  className="flex min-h-11 shrink-0 items-center font-bold text-primary hover:underline sm:min-h-0"
                >
                  <span className="sm:hidden">Review →</span>
                  <span className="hidden sm:inline">Read the review →</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 pb-10 sm:gap-5 md:px-6 lg:grid-cols-4 lg:pb-14">
        <StatTile value={visited.length} label="arenas visited" accent="text-primary" />
        <StatTile value={arenaCities} label="arena cities explored" accent="text-secondary" />
        <StatTile value={hotelReviewCount} label="hotel reviews" accent="text-foreground" />
        <StatTile value={foodReviewCount} label="food reviews" accent="text-foreground" />
      </div>
    </section>
  )
}
