import type { ArenaHighlightCard } from 'lib/sanity.queries'
import { MapPin, Trophy } from 'lucide-react'
import Link from 'next/link'
import Button from 'ui/Button'

import SanityImage from './SanityImage'
import SectionTitle from './SectionTitle'

interface ArenaHighlightsProps {
  arenas: ArenaHighlightCard[]
}

export default function ArenaHighlights({ arenas }: ArenaHighlightsProps) {
  if (!arenas || arenas.length === 0) return null

  return (
    <section className="py-10 md:py-14">
      <SectionTitle
        header="The Arena Quest"
        description="We're visiting every NBA & WNBA arena in North America — here are our latest reviews."
      />

      <div className="mt-8 grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 md:px-6">
        {arenas.map((arena, index) => {
          const hasImage = arena.arenaImage?.asset?._ref || arena.arenaImage?.asset?._id

          return (
            <Link
              key={arena._id}
              href={`/arena/${arena.slug}`}
              className="group relative block overflow-hidden rounded-3xl border-4 border-black bg-card text-foreground shadow-offsetIndigo transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {hasImage ? (
                  <SanityImage
                    image={arena.arenaImage}
                    width={400}
                    height={192}
                    alt={arena.name || 'NBA Arena'}
                    className="h-48 w-full object-cover object-center brightness-[0.85]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    priority={index < 3}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    Coming soon
                  </div>
                )}
              </div>

              <div className="p-4">
                <span className="mb-2 inline-flex w-fit rounded-full border border-secondary/20 bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
                  NBA Arena
                </span>
                <h3 className="mb-2 line-clamp-1 text-lg font-bold text-foreground decoration-primary decoration-dashed decoration-2 group-hover:underline">
                  {arena.name}
                </h3>
                {arena.location && (
                  <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{arena.location}</span>
                  </div>
                )}
                <span className="text-sm font-semibold text-primary">
                  View Review &rarr;
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <Button icon={<Trophy className="text-pink-500" />} link="/arenas">
          See All Arenas
        </Button>
      </div>
    </section>
  )
}
