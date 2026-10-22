import { monthFormatter } from 'components/listing/ListingCard'
import { formatDate } from 'components/PostDate'
import SanityImage from 'components/SanityImage'
import { CircleDashed, Clock, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import type { ArenaWithRating } from 'utils/arena/arenaConstants'
import { getRankBadgeStyle } from 'utils/arena/rankBadgeStyles'

import ArenaQuestMap, { MapLegend } from './ArenaQuestMap'

interface ArenaQuestHeroProps {
  arenas: ArenaWithRating[]
}

const cityOf = (location?: string) => location?.split(',')[0]?.trim() ?? ''

// Fixed confetti layout (no Math.random, so server and client HTML match)
const CONFETTI_COLORS = ['bg-primary', 'bg-brand', 'bg-warning', 'bg-success']
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
      <span className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border-2 border-border-bold bg-amber-50 px-3 py-1.5 text-sm font-extrabold text-amber-900">
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
                <span className="shrink-0 rounded-lg bg-success px-2 py-1 text-sm font-extrabold text-white">
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

/** "36 of 39 arenas visited", the thin progress line and the last visit */
function QuestProgress({
  visitedCount,
  total,
  lastVisited,
}: {
  visitedCount: number
  total: number
  lastVisited?: ArenaWithRating
}) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-2.5 lg:w-[300px]">
      <div className="flex items-baseline gap-2">
        {/* Animated digits are decorative; the sr-only text is what
            screen readers and search engines read */}
        <span
          aria-hidden="true"
          className="quest-count font-heading-family text-section font-extrabold leading-none tabular-nums text-foreground"
          style={{ '--quest-target': visitedCount } as React.CSSProperties}
        />
        <span className="sr-only">{visitedCount}</span>
        <span className="font-heading-family text-lg font-extrabold text-muted-foreground">
          of {total}
        </span>
        <span className="text-sm text-muted-foreground">arenas visited</span>
      </div>
      <ProgressLine visitedCount={visitedCount} total={total} />
      {lastVisited && (
        <span className="text-sm text-muted-foreground">
          Last visited{' '}
          <strong className="text-foreground">{lastVisited.name}</strong>
          {lastVisited.date && (
            <span className="hidden lg:inline">
              {' '}
              · {monthFormatter.format(new Date(lastVisited.date))}
            </span>
          )}
          {lastVisited.slug && (
            <>
              {' '}
              ·{' '}
              <Link
                href={`/arena/${lastVisited.slug}`}
                className="font-bold text-pink-700 hover:underline"
              >
                Review →
              </Link>
            </>
          )}
        </span>
      )}
    </div>
  )
}

/** The thin progress line from the wall-art look (animates in on load) */
function ProgressLine({
  visitedCount,
  total,
  className = 'w-full',
}: {
  visitedCount: number
  total: number
  className?: string
}) {
  return (
    <div
      className={`h-1.5 overflow-hidden rounded-full bg-stone-200 ${className}`}
      role="progressbar"
      aria-label="Arenas visited"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={visitedCount}
    >
      <div
        className="quest-bar h-full w-full bg-primary"
        style={{ transform: `scaleX(${total > 0 ? visitedCount / total : 0})` }}
      />
    </div>
  )
}

/** One phone row under the map: small pink label, then the value */
function Milestone({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 border-t border-border py-3">
      <span className="flex items-center gap-1.5 text-xs font-extrabold tracking-[0.12em] text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </span>
      <span className="text-base font-semibold text-foreground">
        {children}
      </span>
    </div>
  )
}

/**
 * /arenas hero: the title with the quest progress beside it, then a US map
 * of every arena (the ones still to go are labelled). On laptops the map
 * sizes itself to the screen height, so "The rankings" below always peeks
 * in and it's clear the page keeps going. Phones get the progress and the
 * last visit as short rows under the map.
 */
export default function ArenaQuestHero({ arenas }: ArenaQuestHeroProps) {
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

  const total = arenas.length
  // Complete only while every arena is visited, adding a new arena in
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
    <>
      <section className="relative bg-primary-soft-background">
        {complete && <Confetti />}
        <div className="container mx-auto max-w-7xl px-4 pb-1.5 pt-6 md:px-6 md:pt-8 lg:pb-5">
          <div className="flex items-end justify-between gap-9 lg:gap-10">
            <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
              <h1 className="font-heading-family text-section font-extrabold leading-[1.06] tracking-tight text-foreground md:text-page">
                Every <span className="text-primary">NBA &amp; WNBA</span>{' '}
                arena, visited and ranked
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground lg:text-base">
                All {total} arenas
                <span className="hidden md:inline"> in the US and Canada</span>,{' '}
                {complete ? 'visited' : 'reviewed'} and ranked.
              </p>
            </div>
            <div className="hidden md:block">
              <QuestProgress
                visitedCount={visited.length}
                total={total}
                lastVisited={lastVisited}
              />
            </div>
          </div>

          {/* Laptops: the map's height follows the screen's (nav, title row
              and the peek of "The rankings" take ~380px), within 560-960px wide */}
          <div className="mx-auto mt-5 w-full lg:max-w-[clamp(560px,calc((100svh_-_380px)*1.6),960px)]">
            <ArenaQuestMap arenas={arenas} showLegend={false} />
          </div>
          <MapLegend className="mt-2 md:justify-end lg:-mt-1" />

          {/* Phones: progress and the last visit as rows under the map */}
          {!complete && (
            <div className="mt-4 md:hidden">
              <div className="flex items-center gap-3 pb-3">
                <ProgressLine
                  visitedCount={visited.length}
                  total={total}
                  className="flex-1"
                />
                <span className="shrink-0 text-sm font-extrabold">
                  {visited.length} of {total} visited
                </span>
              </div>
              {lastVisited && (
                <Milestone icon={Clock} label="LAST VISITED">
                  {lastVisited.slug ? (
                    <Link
                      href={`/arena/${lastVisited.slug}`}
                      className="hover:underline"
                    >
                      {lastVisited.name}
                      {lastVisited.date &&
                        ` · ${monthFormatter.format(new Date(lastVisited.date))}`}{' '}
                      <span className="text-pink-700">→</span>
                    </Link>
                  ) : (
                    lastVisited.name
                  )}
                </Milestone>
              )}
              {stillToGo.length > 0 && (
                <Milestone icon={CircleDashed} label="STILL TO GO">
                  {[...new Set(stillToGo.map((a) => cityOf(a.location)))]
                    .filter(Boolean)
                    .join(', ')}
                </Milestone>
              )}
            </div>
          )}

          {complete && (
            <div className="mt-6 max-w-xl">
              <FinalPodium arenas={podium} finishedOn={lastVisited?.date} />
            </div>
          )}
        </div>
      </section>
      {/* The linen fades into the page instead of ending on a hard line,
          so it never looks like the bottom of the page */}
      <div
        aria-hidden="true"
        className="h-10 bg-linear-to-b from-primary-soft-background to-background"
      />
    </>
  )
}
