import { formatDate } from 'components/PostDate'
import type { Arena } from 'lib/sanity.queries'
import Link from 'next/link'
import { useMemo } from 'react'

import ArenaQuestMap from './ArenaQuestMap'

interface ArenaQuestHeroProps {
  arenas: Arena[]
  hotelReviewCount: number
  foodReviewCount: number
}

const cityOf = (location?: string) => location?.split(',')[0]?.trim() ?? ''

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

  return (
    <section className="bg-secondary-soft-background">
      <div className="container mx-auto grid max-w-7xl items-start gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-5">
          <span className="text-xs font-bold tracking-[0.14em] text-primary">
            THE ARENA QUEST
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-primary md:text-5xl">
            Visiting and Ranking Every NBA/WNBA Arena
          </h1>
          <p className="max-w-xl leading-relaxed text-muted-foreground">
            We&apos;re traveling near and far to visit and rank all {total} NBA
            and WNBA arenas across the US and Canada. Follow along as the map
            fills in.
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
            {/* Phones: skip past the map straight to the arena list */}
            <a
              href="#arena-rankings"
              className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-primary hover:underline md:hidden"
            >
              Jump to the rankings ↓
            </a>
          </div>

          {stillToGo.length > 0 ? (
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
          ) : (
            <span className="text-sm font-bold text-primary">
              Quest complete — every arena visited!
            </span>
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

      <div className="container mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 pb-10 sm:gap-5 sm:px-6 lg:grid-cols-4 lg:px-8 lg:pb-14">
        <StatTile value={visited.length} label="arenas visited" accent="text-primary" />
        <StatTile value={arenaCities} label="arena cities explored" accent="text-secondary" />
        <StatTile value={hotelReviewCount} label="hotel reviews" accent="text-foreground" />
        <StatTile value={foodReviewCount} label="food reviews" accent="text-foreground" />
      </div>
    </section>
  )
}
