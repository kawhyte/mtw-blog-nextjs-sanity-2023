import { GEAR_TRIPS, type GearTrip } from 'lib/gearSections'
import {
  Backpack,
  ListChecks,
  type LucideIcon,
  type LucideProps,
  Luggage,
  Plane,
  Ship,
  Snowflake,
  Sun,
} from 'lucide-react'
import { useEffect, useRef } from 'react'

/** Lucide has no basketball, so this one is drawn in the same stroke style */
function Basketball(props: LucideProps) {
  const { size = 24, strokeWidth = 2, ...rest } = props
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M4.9 4.9a10 10 0 0 1 0 14.2M19.1 4.9a10 10 0 0 0 0 14.2M2 12h20M12 2v20" />
    </svg>
  )
}

const ICONS: Record<GearTrip, LucideIcon | typeof Basketball> = {
  every: ListChecks,
  weekend: Luggage,
  daytrip: Backpack,
  warm: Sun,
  cold: Snowflake,
  cruise: Ship,
  gameday: Basketball,
  flying: Plane,
}

/** The row of trip buttons; tapping the picked trip again shows everything */
export default function TripPicker({
  trip,
  counts,
  onPick,
}: {
  trip: GearTrip | null
  counts: Record<GearTrip, number>
  onPick: (trip: GearTrip | null) => void
}) {
  const row = useRef<HTMLDivElement>(null)

  // On a phone the row scrolls sideways: keep a shared link's trip in view
  useEffect(() => {
    const picked = row.current?.querySelector<HTMLElement>(
      '[aria-pressed="true"]',
    )
    if (!picked || !row.current) return
    row.current.scrollTo({
      left: picked.offsetLeft - row.current.offsetLeft - 16,
      behavior: 'smooth',
    })
  }, [trip])

  return (
    <div className="flex flex-col gap-2.5">
      <span
        id="trip-picker-label"
        className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground sm:text-sm"
      >
        What trip are you packing for?
      </span>
      <div
        ref={row}
        role="group"
        aria-labelledby="trip-picker-label"
        className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-8"
      >
        {GEAR_TRIPS.map(({ value, title }) => {
          const Icon = ICONS[value]
          const on = trip === value
          return (
            <button
              key={value}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(on ? null : value)}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors md:min-w-0 md:flex-col md:justify-center md:gap-1.5 md:rounded-2xl md:px-2 md:py-3.5 ${
                on
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-card text-foreground hover:border-foreground/40'
              }`}
            >
              <Icon size={20} className="shrink-0 md:size-6" />
              <span className="whitespace-nowrap">{title}</span>
              <span
                className={`hidden text-xs font-semibold md:block ${
                  on ? 'text-background/80' : 'text-muted-foreground'
                }`}
              >
                {counts[value]} things
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
