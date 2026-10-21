import { formatDate } from 'components/PostDate'
import SanityImage from 'components/SanityImage'
import {
  ARENA_COORDINATES,
  clusterMapPoints,
  projectToMap,
} from 'lib/arenaMap'
import type { Arena } from 'lib/sanity.queries'
import {
  US_MAP_HEIGHT,
  US_MAP_WIDTH,
  US_OUTLINE_PATH,
  US_STATE_BORDERS_PATH,
} from 'lib/usMapPaths'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

interface MapArena {
  id: string
  name: string
  slug?: string
  visited: boolean
  city: string
  date?: string
  teams: NonNullable<Arena['teams']>
  x: number
  y: number
}

// Pins closer than this (viewBox units) merge into one numbered pin. Phones
// use a larger radius so tap targets don't overlap in the Northeast.
const CLUSTER_DISTANCE_DESKTOP = 18
const CLUSTER_DISTANCE_PHONE = 60

const cityOf = (location?: string) => location?.split(',')[0]?.trim() ?? ''

function ArenaDetails({ arena }: { arena: MapArena }) {
  const logos = arena.teams.filter((team) => team.asset?._id)
  const teamNames = arena.teams
    .map((team) => team.name)
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex items-center gap-3">
      {logos.length > 0 && (
        <div className="flex shrink-0 -space-x-2">
          {logos.map((team, i) => (
            <SanityImage
              key={team.asset!._id + i}
              image={team}
              width={96}
              height={96}
              alt={`${team.name ?? 'Team'} logo`}
              className="h-11 w-11 rounded-full bg-card object-contain"
              sizes="44px"
            />
          ))}
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-bold leading-tight text-foreground">
          {arena.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {[arena.city, teamNames].filter(Boolean).join(' · ')}
        </span>
        {arena.visited ? (
          <span className="text-xs font-bold text-green-700 dark:text-green-400">
            Visited{arena.date ? ` ${formatDate(arena.date)}` : ''}
          </span>
        ) : (
          <span className="text-xs font-bold text-muted-foreground">
            Still to go
          </span>
        )}
        {arena.visited && arena.slug && (
          <Link
            href={`/arena/${arena.slug}`}
            className="text-xs font-bold text-primary hover:underline"
          >
            Read review →
          </Link>
        )}
      </div>
    </div>
  )
}

function ClusterDetails({ arenas }: { arenas: MapArena[] }) {
  if (arenas.length === 1) return <ArenaDetails arena={arenas[0]} />
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {arenas.length} arenas here
      </span>
      {arenas.map((arena) => (
        <div
          key={arena.id}
          className="flex items-center justify-between gap-3 border-t border-border pt-2 first-of-type:border-t-0 first-of-type:pt-0"
        >
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">{arena.name}</div>
            <div className="text-xs text-muted-foreground">
              {arena.city} ·{' '}
              {arena.visited ? 'Visited' : 'Still to go'}
            </div>
          </div>
          {arena.visited && arena.slug && (
            <Link
              href={`/arena/${arena.slug}`}
              className="flex min-h-11 shrink-0 items-center text-xs font-bold text-primary hover:underline"
            >
              Review →
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ArenaQuestMap({ arenas }: { arenas: Arena[] }) {
  const [clusterDistance, setClusterDistance] = useState(
    CLUSTER_DISTANCE_DESKTOP,
  )
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Wider clustering on phone-sized screens (runs after hydration, so the
  // server HTML and first client render match)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => {
      setClusterDistance(
        query.matches ? CLUSTER_DISTANCE_PHONE : CLUSTER_DISTANCE_DESKTOP,
      )
      setActiveIndex(null)
    }
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const pins = useMemo<MapArena[]>(
    () =>
      arenas.flatMap((arena) => {
        const coords = arena.slug ? ARENA_COORDINATES[arena.slug] : undefined
        if (!coords || !arena.name) return []
        return [
          {
            id: arena._id,
            name: arena.name,
            slug: arena.slug,
            visited: Boolean(arena.visited),
            city: cityOf(arena.location),
            date: arena.date,
            teams: arena.teams ?? [],
            ...projectToMap(coords[0], coords[1]),
          },
        ]
      }),
    [arenas],
  )

  const clusters = useMemo(
    () => clusterMapPoints(pins, clusterDistance),
    [pins, clusterDistance],
  )
  const active = activeIndex !== null ? clusters[activeIndex] : null

  // Escape, or a tap outside the map, closes the open card
  const mapRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && !mapRef.current?.contains(e.target as Node)) {
        setActiveIndex(null)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [activeIndex])

  const toPercent = (x: number, y: number) => ({
    left: `${(x / US_MAP_WIDTH) * 100}%`,
    top: `${(y / US_MAP_HEIGHT) * 100}%`,
  })

  // Floating card sits beside the pin, flipped so it stays inside the map
  const cardStyle = active
    ? {
        ...toPercent(active.x, active.y),
        transform: `translate(${active.x > US_MAP_WIDTH * 0.55 ? 'calc(-100% - 18px)' : '18px'}, ${active.y > US_MAP_HEIGHT * 0.55 ? 'calc(-100% + 10px)' : '-10px'})`,
      }
    : undefined

  return (
    <div ref={mapRef} className="flex flex-col gap-2 sm:gap-3">
      <div
        className="relative"
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') setActiveIndex(null)
        }}
      >
        <svg
          viewBox={`0 0 ${US_MAP_WIDTH} ${US_MAP_HEIGHT}`}
          className="block h-auto w-full"
          aria-hidden="true"
        >
          <path
            d={US_OUTLINE_PATH}
            className="fill-primary-soft-background stroke-border-bold"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <path
            d={US_STATE_BORDERS_PATH}
            fill="none"
            className="stroke-primary/30"
            strokeWidth={1}
          />
        </svg>

        {clusters.map((cluster, index) => {
          const visitedCount = cluster.items.filter((a) => a.visited).length
          const allVisited = visitedCount === cluster.items.length
          const label =
            cluster.items.length === 1
              ? `${cluster.items[0].name}, ${cluster.items[0].visited ? 'visited' : 'still to go'}`
              : `${cluster.items.length} arenas: ${cluster.items.map((a) => a.name).join(', ')}`
          const isActive = index === activeIndex
          return (
            <button
              key={cluster.items.map((a) => a.id).join('|')}
              type="button"
              aria-label={label}
              aria-expanded={isActive}
              // Hover only for a real mouse: on touch a tap fires both
              // pointerenter and click, which would open then close the card
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setActiveIndex(index)
              }}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              style={toPercent(cluster.x, cluster.y)}
              className="absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:h-7 md:w-7"
            >
              <span
                className={`flex items-center justify-center rounded-full border-2 border-border-bold text-[10px] font-black leading-none transition-transform ${
                  cluster.items.length > 1 ? 'h-5 w-5' : 'h-3.5 w-3.5'
                } ${
                  allVisited
                    ? 'bg-primary text-primary-foreground'
                    : visitedCount === 0
                      ? 'border-dashed bg-card text-foreground'
                      : 'bg-card text-foreground ring-2 ring-primary'
                } ${isActive ? 'scale-125 ring-2 ring-border-bold ring-offset-1' : ''}`}
              >
                {cluster.items.length > 1 ? cluster.items.length : null}
              </span>
            </button>
          )
        })}

        {/* Hover card — tablets and up */}
        {active && (
          <div
            style={cardStyle}
            className="pointer-events-auto absolute z-20 hidden w-64 rounded-2xl border-[3px] border-border-bold bg-card p-3 shadow-brutalist md:block"
          >
            <ClusterDetails arenas={active.items} />
          </div>
        )}
      </div>

      {/* Tap card — phones (no hover on touch screens); only takes up
          space once a pin is tapped */}
      {active && (
        <div className="rounded-2xl border-2 border-border bg-card p-3 md:hidden">
          <ClusterDetails arenas={active.items} />
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-border-bold bg-primary" />
          Visited
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-dashed border-border-bold bg-card" />
          Still to go
        </span>
        <span className="md:hidden">Tap a pin for details</span>
        <span className="hidden md:inline">Hover a pin for details</span>
      </div>
    </div>
  )
}
