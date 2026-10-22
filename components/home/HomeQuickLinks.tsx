import { Building2, MapPin, Trophy, Utensils } from 'lucide-react'
import Link from 'next/link'

export interface HomeCounts {
  arenas: number
  hotels: number
  food: number
  guides: number
  gear: number
}

/** Real counts that open each section: tiles on laptops, swipeable pills on phones */
export default function HomeQuickLinks({ counts }: { counts: HomeCounts }) {
  const links = [
    {
      href: '/arenas',
      icon: Trophy,
      count: counts.arenas,
      label: 'arenas ranked',
    },
    {
      href: '/hotels',
      icon: Building2,
      count: counts.hotels,
      label: 'hotel reviews',
    },
    {
      href: '/food',
      icon: Utensils,
      count: counts.food,
      label: 'restaurant reviews',
    },
    { href: '/guides', icon: MapPin, count: counts.guides, label: 'guides' },
  ]

  return (
    <nav
      aria-label="Browse the site"
      className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4 md:overflow-visible md:px-0"
    >
      {links.map(({ href, icon: Icon, count, label }) => (
        <Link
          key={href}
          href={href}
          className="flex shrink-0 items-center gap-2 rounded-full border-2 border-border bg-card px-3.5 py-2.5 text-sm text-foreground transition-colors hover:border-foreground/40 md:gap-3.5 md:rounded-[20px] md:px-5 md:py-4"
        >
          <span className="flex items-center justify-center md:h-11 md:w-11 md:shrink-0 md:rounded-[14px] md:bg-primary-soft-background">
            <Icon
              className="h-[18px] w-[18px] text-primary md:h-[22px] md:w-[22px]"
              aria-hidden="true"
            />
          </span>
          <span className="flex items-baseline gap-1.5 md:flex-col md:items-start md:gap-0.5">
            <b className="font-extrabold md:font-heading-family md:text-2xl md:leading-none">
              {count}
            </b>
            <span className="whitespace-nowrap text-muted-foreground">
              {label}
            </span>
          </span>
        </Link>
      ))}
    </nav>
  )
}
