import Layout from 'components/BlogLayout'
import GearCard, { GearNote } from 'components/gear/GearCard'
import TripPicker from 'components/gear/TripPicker'
import StaticPageHead from 'components/StaticPageHead'
import { GEAR_SECTIONS, GEAR_TRIPS, type GearTrip } from 'lib/gearSections'
import type { Essential, Settings } from 'lib/sanity.queries'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'

import BlogHeader from './BlogHeader'
import Footer from './Footer'

interface TravelEssentialPageProps {
  preview?: boolean
  loading?: boolean
  posts: Essential[]
  settings: Settings
}

interface GearGroup {
  id: string
  title: string
  blurb?: string
  items: Essential[]
}

// Inside a group: must-packs first, then the newest
const byPick = (a: Essential, b: Essential) =>
  Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
  (b.date ?? '').localeCompare(a.date ?? '')

/** The Studio "Section" groups in page order; items without one go last */
function groupGear(items: Essential[]): GearGroup[] {
  const known = new Set<string>(GEAR_SECTIONS.map((s) => s.value))
  const groups: GearGroup[] = GEAR_SECTIONS.map((section) => ({
    id: section.value,
    title: section.title,
    blurb: section.blurb,
    items: items.filter((item) => item.section === section.value),
  })).filter((group) => group.items.length > 0)
  const rest = items.filter((item) => !item.section || !known.has(item.section))
  if (rest.length > 0) {
    groups.push({
      id: 'more',
      title: groups.length > 0 ? 'More gear' : 'Everything we pack',
      items: rest,
    })
  }
  return groups.map((group) => ({
    ...group,
    items: [...group.items].sort(byPick),
  }))
}

/** "Packing for ___" in the summary line */
const TRIP_PHRASE: Record<GearTrip, string> = {
  every: 'every trip',
  weekend: 'a weekend',
  daytrip: 'a day trip',
  warm: 'warm weather',
  cold: 'cold weather',
  cruise: 'a cruise',
  gameday: 'game day',
  flying: 'a long flight',
}

const isTrip = (value: unknown): value is GearTrip =>
  GEAR_TRIPS.some((t) => t.value === value)

/** A trip's list: what's tagged for it plus everything we pack on every trip */
const packedFor = (item: Essential, trip: GearTrip) => {
  const trips = item.tripType ?? []
  return trips.includes(trip) || trips.includes('every')
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

export default function TravelEssentialPage({
  preview,
  loading,
  posts,
  settings,
}: TravelEssentialPageProps) {
  const router = useRouter()
  // ?trip=cruise makes a list shareable; the static page shows everything
  const trip = isTrip(router.query.trip) ? router.query.trip : null
  const [openNotes, setOpenNotes] = useState<Set<string>>(new Set())

  const pickTrip = (next: GearTrip | null) => {
    const { trip: _old, ...query } = router.query
    setOpenNotes(new Set())
    router.replace(
      {
        pathname: router.pathname,
        query: next ? { ...query, trip: next } : query,
      },
      undefined,
      { shallow: true, scroll: false },
    )
  }

  const toggleNotes = (ids: string[], open: boolean) =>
    setOpenNotes((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => (open ? next.add(id) : next.delete(id)))
      return next
    })

  const counts = Object.fromEntries(
    GEAR_TRIPS.map(({ value }) => [
      value,
      posts.filter((item) => packedFor(item, value)).length,
    ]),
  ) as Record<GearTrip, number>

  const shown = trip ? posts.filter((item) => packedFor(item, trip)) : posts
  const mustPacks = shown.filter((item) => item.featured).length
  const groups = groupGear(shown)
  const hasAffiliate = posts.some((item) => item.affiliate)

  return (
    <>
      <StaticPageHead
        settings={settings}
        title="What We Pack: Travel Gear | Meet the Whytes"
        description="Pick a trip and see what we actually pack for it: cruises, NBA and WNBA game days, day trips, warm and cold weather and long flights."
        path="/essentials"
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title="" description={[]} level={1} />

        <section className="border-b border-border bg-primary-soft-background">
          <div className="container mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-6 pt-7 md:px-6 md:pb-7 md:pt-11">
            <div className="flex flex-col gap-2">
              <h1 className="text-page font-extrabold tracking-tight text-primary md:text-page">
                What We Pack
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
                The gear that actually makes it into our bags. Pick your trip
                and we&apos;ll show what we pack for it, from game days to
                cruises.
              </p>
              {hasAffiliate && (
                <p className="text-sm text-muted-foreground">
                  Some links earn us a small commission at no cost to you. We
                  only list things we actually pack.
                </p>
              )}
            </div>
            <TripPicker trip={trip} counts={counts} onPick={pickTrip} />
          </div>
        </section>

        {posts.length > 0 && (
          <div className="border-b border-border bg-background">
            <p
              aria-live="polite"
              className="container mx-auto max-w-7xl px-4 py-4 text-sm md:px-6 md:text-base"
            >
              <b>
                {trip
                  ? `Packing for ${TRIP_PHRASE[trip]}:`
                  : 'Everything we pack:'}
              </b>{' '}
              {plural(shown.length, 'thing')}
              {mustPacks > 0 && (
                <>
                  ,{' '}
                  <b className="text-primary">
                    {plural(mustPacks, 'must-pack')}
                  </b>
                </>
              )}
              . Must-packs come first in every group.
            </p>
          </div>
        )}

        <div className="container mx-auto flex max-w-7xl flex-col gap-10 px-4 py-7 md:gap-13 md:px-6 md:py-10">
          {groups.map((group, groupIndex) => {
            const withNotes = group.items
              .filter((item) => item.howWeUseIt)
              .map((item) => item._id)
            const allOpen =
              withNotes.length > 0 && withNotes.every((id) => openNotes.has(id))
            return (
              <section
                key={group.id}
                id={group.id}
                className="flex scroll-mt-24 flex-col gap-4 md:gap-5"
              >
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h2 className="text-title font-extrabold tracking-tight sm:text-title">
                      {group.title}{' '}
                      <span className="text-sm font-semibold text-muted-foreground sm:text-base">
                        ({group.items.length})
                      </span>
                    </h2>
                    {group.blurb && (
                      <p className="text-sm text-muted-foreground sm:text-base">
                        {group.blurb}
                      </p>
                    )}
                  </div>
                  {withNotes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => toggleNotes(withNotes, !allOpen)}
                      className="hidden min-h-10 items-center rounded-full border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:border-foreground/40 md:inline-flex"
                    >
                      {allOpen
                        ? 'Close every "How we use it"'
                        : 'Open every "How we use it"'}
                    </button>
                  )}
                </div>
                {/* Dense flow lets the cards after an open note fill its row, so the note sits under the row */}
                <div className="grid grid-flow-row-dense grid-cols-2 gap-x-3.5 gap-y-6 md:grid-cols-3 md:gap-x-5 md:gap-y-8 lg:grid-cols-4">
                  {group.items.map((item, index) => {
                    const open = openNotes.has(item._id)
                    return (
                      <Fragment key={item._id}>
                        <GearCard
                          item={item}
                          priority={groupIndex === 0 && index < 4}
                          noteOpen={open}
                          onToggleNote={() => toggleNotes([item._id], !open)}
                        />
                        {open && (
                          <GearNote
                            item={item}
                            onClose={() => toggleNotes([item._id], false)}
                          />
                        )}
                      </Fragment>
                    )
                  })}
                </div>
              </section>
            )
          })}

          {posts.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">
              Our gear list is being packed. Check back soon.
            </p>
          )}
          {posts.length > 0 && shown.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">
              Nothing tagged for this trip yet.
            </p>
          )}
        </div>
      </Layout>
      <Footer />
    </>
  )
}
