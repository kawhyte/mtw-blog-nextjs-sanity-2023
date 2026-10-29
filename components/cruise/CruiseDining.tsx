import MenuViewer from 'components/MenuViewer'
import SanityImage from 'components/SanityImage'
import { money, VENUE_TYPE, WORTH_IT } from 'lib/cruiseFormat'
import type { CruiseDiningVenue, CruiseReview } from 'lib/sanity.queries'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import {
  Bullets,
  Card,
  CardTitle,
  CruiseSection,
  Eyebrow,
  OurTake,
  Pill,
  ScoreCircle,
} from './parts'

type Filter = 'all' | 'extra' | 'included' | 'cabin-perk'

// Filter chips only help once the list gets long
const FILTER_MIN = 6

// Sit-down venue types that earn a big card once we rated what we ate there
const SIT_DOWN = ['specialty', 'main-dining', 'exclusive', 'experience']

/**
 * Restaurants worth planning for get big cards with dish ratings and menus:
 * anything extra cost or a cabin perk, plus included sit-down restaurants
 * with a Best Dish or rated dishes (on lines like Virgin, everything is
 * included). Cafes, quick bites, buffets and bars stay small cards.
 */
function isPlanned(v: CruiseDiningVenue) {
  if (v.cost === 'extra' || v.cost === 'cabin-perk') return true
  const rated = !!v.bestDish || (v.dishes ?? []).some((d) => d.name)
  return rated && SIT_DOWN.includes(v.venueType ?? '')
}

export default function CruiseDining({ review }: { review: CruiseReview }) {
  const venues = (review.diningVenues ?? []).filter((v) => v.tried !== false)
  const [filter, setFilter] = useState<Filter>('all')
  if (
    !review.diningTake &&
    venues.length === 0 &&
    !review.diningWatchOuts?.length
  )
    return null

  const count = (f: Filter) =>
    venues.filter((v) => (v.cost ?? 'included') === f).length
  const shown = venues.filter(
    (v) => filter === 'all' || (v.cost ?? 'included') === filter,
  )
  const planned = shown.filter(isPlanned)
  const everyday = shown.filter((v) => !isPlanned(v))
  const chips: [Filter, string, number][] = (
    [
      ['all', 'All', venues.length],
      ['extra', 'Extra cost', count('extra')],
      ['included', 'Included', count('included')],
      ['cabin-perk', 'Suite perk', count('cabin-perk')],
    ] as [Filter, string, number][]
  ).filter(([, , n]) => n > 0)

  return (
    <CruiseSection
      id="dining"
      title="Dining"
      score={review.cruiseRating?.Dining}
      scoreLabel="Dining score"
    >
      <OurTake text={review.diningTake} />

      {venues.length >= FILTER_MIN && (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter restaurants"
        >
          {chips.map(([key, label, n]) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={`min-h-10 rounded-full border-2 px-4 text-sm font-bold transition-colors ${
                filter === key
                  ? 'border-border-bold bg-foreground text-background'
                  : 'border-border bg-card text-foreground hover:border-border-bold'
              }`}
            >
              {label} {n}
            </button>
          ))}
        </div>
      )}

      {planned.length > 0 && (
        <div>
          <h3 className="text-lg font-extrabold md:text-title">
            Restaurants worth planning for
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Sit-down restaurants we rated, plus anything that costs extra. Book
            these on day one.
          </p>
          {/* Two stacked columns, so a tall open card leaves no gap beside it */}
          <div className="mt-4 gap-6 md:columns-2">
            {planned.map((v) => (
              <div key={v._key} className="mb-4 break-inside-avoid md:mb-6">
                <VenueCard venue={v} cabin={review.cabinType} />
              </div>
            ))}
          </div>
        </div>
      )}

      {everyday.length > 0 && (
        <div>
          <h3 className="text-lg font-extrabold md:text-title">
            Everyday spots
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Included in the fare.
          </p>
          <div className="mt-4 grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
            {everyday.map((v) => (
              <div
                key={v._key}
                className="min-w-0 rounded-2xl border-2 border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading-family text-lg font-extrabold">
                      {v.name}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {[
                        v.venueType && VENUE_TYPE[v.venueType],
                        v.meals?.join(', '),
                        'Included',
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </div>
                  {typeof v.rating === 'number' && (
                    <ScoreCircle score={v.rating} size="sm" />
                  )}
                </div>
                {v.review && (
                  <p className="mt-2 text-base leading-relaxed text-stone-700">
                    {v.review}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!!review.diningWatchOuts?.length && (
        <Card tone="red">
          <CardTitle>Dining watch-outs</CardTitle>
          <Bullets items={review.diningWatchOuts} />
        </Card>
      )}
    </CruiseSection>
  )
}

function costLabel(v: CruiseDiningVenue, cabin?: string) {
  if (v.cost === 'cabin-perk') return cabin ? `${cabin} perk` : 'Cabin perk'
  if (v.cost === 'extra')
    return v.price ? `${money(v.price)} per person` : 'Extra cost'
  return 'Included'
}

function VenueCard({
  venue: v,
  cabin,
}: {
  venue: CruiseDiningVenue
  cabin?: string
}) {
  const [open, setOpen] = useState(false)
  const worth = v.worthIt && WORTH_IT[v.worthIt]
  const dishes = (v.dishes ?? []).filter((d) => d.name)
  const menu = (v.menu ?? []).filter((m) => m.url)
  const listId = `dishes-${v._key}`
  // Photo-first: the Best Dish photo leads the card when there is one
  const hero = v.bestDish && v.bestDishPhoto?.asset ? v.bestDishPhoto : null
  const bestScore = dishes.find((d) => d.name === v.bestDish)?.rating
  const photoDishes = dishes.filter((d) => d.photo?.asset)
  const plainDishes = dishes.filter((d) => !d.photo?.asset)

  return (
    <article className="min-w-0 overflow-hidden rounded-[20px] border-[3px] border-border-bold bg-card">
      {hero && (
        // Whole photo, never cropped: phone shots are mostly portrait, so a
        // blurred copy fills the sides instead of zooming into the plate
        <div className="relative h-[300px] overflow-hidden bg-muted md:h-[380px]">
          {/* Blur lives on the wrapper so SanityImage's load fade can't undo it */}
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-110 blur-2xl brightness-90"
          >
            <SanityImage
              image={hero as any}
              width={400}
              alt=""
              sizes="400px"
              className="h-full w-full object-cover"
            />
          </div>
          <SanityImage
            image={hero as any}
            width={1200}
            alt={hero.alt || v.bestDish || 'Best dish'}
            sizes="(min-width: 768px) 600px, 100vw"
            className="relative h-full w-full object-contain"
          />
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white/95 py-2 pl-4 pr-2.5 text-stone-900 shadow-lg md:inset-x-4 md:bottom-4">
            <div className="min-w-0 flex-1">
              <Eyebrow className="text-success">Best dish</Eyebrow>
              <div className="text-base font-extrabold md:text-lg">
                {v.bestDish}
              </div>
            </div>
            {typeof bestScore === 'number' && (
              <ScoreCircle score={bestScore} size="sm" />
            )}
          </div>
        </div>
      )}

      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="font-heading-family text-xl font-extrabold">
              {v.name}
            </h4>
            {v.meals?.length ? (
              <div className="text-sm text-muted-foreground">
                {v.meals.join(', ')}
              </div>
            ) : null}
          </div>
          {typeof v.rating === 'number' && <ScoreCircle score={v.rating} />}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Pill>{costLabel(v, cabin)}</Pill>
          {v.venueType && (
            <Pill className="bg-primary-soft-background text-stone-700">
              {VENUE_TYPE[v.venueType]}
            </Pill>
          )}
          {worth && <Pill className={worth.className}>{worth.label}</Pill>}
        </div>

        {v.bestDish && !hero && (
          <div className="mt-4 rounded-xl bg-primary-soft-background px-3.5 py-2.5">
            <Eyebrow className="text-success">Best dish</Eyebrow>
            <div className="text-base font-bold">{v.bestDish}</div>
          </div>
        )}
        {v.worstDish && (
          <p className="mt-2 text-sm">
            <b className="text-destructive">Worst:</b> {v.worstDish}
          </p>
        )}

        {v.review && (
          <p className="mt-3 text-base leading-relaxed text-stone-700">
            {v.review}
          </p>
        )}

        {(dishes.length > 0 || menu.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {dishes.length > 0 && (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((o) => !o)}
                className={`flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl border-2 border-border-bold px-4 text-sm font-bold transition-colors sm:min-h-11 sm:w-auto ${
                  open
                    ? 'bg-foreground text-background'
                    : 'bg-card hover:bg-muted'
                }`}
              >
                {dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'} we
                rated
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            )}
            {menu.length > 0 && (
              <MenuViewer
                files={menu}
                restaurant={v.name}
                triggerClassName="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-border-bold bg-card px-4 text-sm font-bold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            )}
          </div>
        )}

        {open && dishes.length > 0 && (
          <div id={listId} className="mt-4">
            {photoDishes.length > 0 && (
              <ul className="grid grid-cols-2 gap-x-2.5 gap-y-4 lg:grid-cols-3">
                {photoDishes.map((d) => (
                  <li key={d._key} className="min-w-0">
                    <div className="relative overflow-hidden rounded-xl bg-muted">
                      <SanityImage
                        image={d.photo as any}
                        width={480}
                        height={360}
                        alt={d.photo?.alt || d.name || 'Dish'}
                        sizes="(min-width: 1024px) 190px, (min-width: 768px) 170px, 50vw"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      {typeof d.rating === 'number' && (
                        <span className="absolute right-1.5 top-1.5 rounded-full ring-2 ring-white">
                          <ScoreCircle score={d.rating} size="sm" />
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 text-base font-extrabold leading-snug">
                      {d.name}
                    </div>
                    {d.note && (
                      <div className="mt-0.5 text-sm leading-snug text-muted-foreground">
                        {d.note}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {plainDishes.length > 0 && (
              <ul className={photoDishes.length > 0 ? 'mt-4' : ''}>
                {plainDishes.map((d) => (
                  <li
                    key={d._key}
                    className="flex items-center gap-3 border-t border-border py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-extrabold">{d.name}</div>
                      {d.note && (
                        <div className="mt-0.5 text-sm leading-snug text-muted-foreground">
                          {d.note}
                        </div>
                      )}
                    </div>
                    {typeof d.rating === 'number' && (
                      <ScoreCircle score={d.rating} size="sm" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
