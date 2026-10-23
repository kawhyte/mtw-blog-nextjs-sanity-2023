import {
  Building2,
  type LucideIcon,
  MapPin,
  Search,
  Trophy,
  Utensils,
} from 'lucide-react'
import Link from 'next/link'

// Searches that find plenty (8 to 45 results each, Oct 2026); shown before
// typing and after a miss
export const POPULAR_SEARCHES = [
  'Las Vegas',
  'Miami',
  'New York',
  'Hyatt',
  'Marriott',
  'Chicago',
]

export interface SectionCounts {
  arenas: number
  hotels: number
  food: number
  guides: number
}

const label = 'text-xs font-extrabold tracking-[0.12em] text-muted-foreground'

/** Popular searches, then the 4 sections, so the page is never a dead end */
export default function SearchSuggestions({ counts }: { counts: SectionCounts }) {
  const sections: {
    href: string
    title: string
    detail: string
    short: string
    icon: LucideIcon
  }[] = [
    { href: '/arenas', title: 'Arenas', detail: `${counts.arenas} arenas ranked`, short: `${counts.arenas} ranked`, icon: Trophy },
    { href: '/hotels', title: 'Hotels', detail: `${counts.hotels} hotel reviews`, short: `${counts.hotels} reviews`, icon: Building2 },
    { href: '/food', title: 'Food', detail: `${counts.food} restaurant reviews`, short: `${counts.food} reviews`, icon: Utensils },
    { href: '/guides', title: 'Guides', detail: `${counts.guides} travel guides`, short: `${counts.guides} guides`, icon: MapPin },
  ]

  return (
    <div className="flex flex-col gap-7 md:gap-8">
      <div className="flex flex-col gap-2.5">
        <h2 className={label}>POPULAR SEARCHES</h2>
        <ul className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <li key={term}>
              <Link
                href={`/search?q=${encodeURIComponent(term)}`}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-border bg-card px-3.5 text-sm font-semibold text-foreground transition-colors hover:border-stone-300 hover:bg-muted"
              >
                <Search
                  className="h-3.5 w-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                {term}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2.5">
        <h2 className={label}>OR BROWSE</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {sections.map(({ href, title, detail, short, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-w-0 items-center gap-3 rounded-2xl border-2 border-border bg-card p-3 transition-colors hover:border-stone-300 md:p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft-background md:h-11 md:w-11">
                  <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-base font-bold text-foreground">
                    {title}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    <span className="md:hidden">{short}</span>
                    <span className="hidden md:inline">{detail}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
