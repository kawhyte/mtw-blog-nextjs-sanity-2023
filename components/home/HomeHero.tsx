import { monthFormatter } from 'components/listing/ListingCard'
import SanityImage from 'components/SanityImage'
import { PhotoScore } from 'components/ui/score-circle'
import type { HomeArena } from 'lib/homeData'
import Link from 'next/link'

/** The small score circle, in the top-left corner of each photo */
function ScoreChip({ arena }: { arena: HomeArena }) {
  if (!arena.rating) return null
  return (
    <PhotoScore
      score={arena.rating.value}
      textRating={arena.rating.text}
      className="left-2.5 top-2.5"
    />
  )
}

const city = (location: string | null) => location?.split(',')[0].trim()

const photoFrame =
  'relative block overflow-hidden border-[3px] border-border-bold bg-border-bold'

/**
 * Homepage hero: headline, intro, two buttons and 3 arena photos picked at
 * random on the server (one big, two small). Phones get the big photo only,
 * between the intro and the buttons.
 */
export default function HomeHero({ arenas }: { arenas: HomeArena[] }) {
  const [lead, ...others] = arenas
  const leadMonth = lead?.date
    ? monthFormatter.format(new Date(lead.date)).toUpperCase()
    : null

  return (
    <section className="border-b border-border bg-primary-soft-background">
      <div className="container mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:px-6 md:py-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-14">
        {/* Phones: its children flow around the photo; laptops: one column */}
        <div className="contents lg:flex lg:flex-col lg:gap-7">
          <div className="order-1 flex flex-col gap-4 lg:gap-6">
            <h1 className="text-page font-black uppercase leading-[1.02] tracking-tight text-foreground sm:text-page xl:text-display">
              Our quest to visit every{' '}
              <span className="text-primary">NBA &amp; WNBA</span> arena
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">
              We travel for basketball. Every arena gets a real review, plus the
              hotels we stay in and the food we find along the way.
            </p>
          </div>
          <div className="order-3 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/arenas"
              className="inline-flex h-12 items-center justify-center rounded-full border-[3px] border-border-bold bg-primary px-[22px] text-base font-extrabold text-white transition-colors hover:bg-pink-700"
            >
              See the arena rankings
            </Link>
            <Link
              href="#fresh"
              className="inline-flex h-12 items-center justify-center rounded-full border-[3px] border-border-bold bg-card px-[22px] text-base font-extrabold text-foreground transition-colors hover:bg-muted"
            >
              Our latest trips
            </Link>
          </div>
        </div>

        {lead && (
          <div className="order-2 lg:order-none lg:grid lg:h-[480px] lg:grid-cols-[1.35fr_1fr] lg:grid-rows-2 lg:gap-3.5 xl:h-[520px]">
            <Link
              href={`/arena/${lead.slug}`}
              className={`${photoFrame} h-56 rounded-2xl sm:h-80 lg:row-span-2 lg:h-auto lg:rounded-3xl`}
            >
              <SanityImage
                image={lead.coverImage!}
                width={900}
                height={1000}
                alt={lead.title}
                sizes="(min-width: 1024px) 400px, 100vw"
                priority
                className="h-full w-full object-cover"
              />
              <ScoreChip arena={lead} />
              <span className="absolute inset-x-0 bottom-0 flex flex-col bg-linear-to-t from-black/75 to-transparent px-3.5 pb-3 pt-10 text-white lg:px-4.5 lg:pb-4">
                {leadMonth && (
                  <span className="text-xs font-extrabold tracking-[0.12em] opacity-85 lg:text-xs">
                    VISITED {leadMonth}
                  </span>
                )}
                <span className="font-heading-family text-lg font-extrabold leading-tight lg:text-title">
                  {lead.title}
                  {city(lead.location) ? `, ${city(lead.location)}` : ''}
                </span>
              </span>
            </Link>
            {others.map((arena) => (
              <Link
                key={arena._id}
                href={`/arena/${arena.slug}`}
                className={`${photoFrame} hidden rounded-2xl lg:block`}
              >
                <SanityImage
                  image={arena.coverImage!}
                  width={500}
                  height={500}
                  alt=""
                  sizes="220px"
                  className="h-full w-full object-cover"
                />
                <ScoreChip arena={arena} />
                <span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/75 to-transparent px-3.5 pb-2.5 pt-8 text-sm font-bold text-white">
                  {arena.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
