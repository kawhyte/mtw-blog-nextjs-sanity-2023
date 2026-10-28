import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'components/ui/accordion'
import VideoPlayer from 'components/Youtube'
import {
  BED,
  BED_OUTLETS,
  BOOKED_WHEN,
  CROWD,
  CROWD_AGE,
  DRESS_CODE,
  DRESS_UP_NIGHTS,
  EXCURSION,
  LINES,
  money,
  MOTION,
  NIGHTLIFE,
  POSITION,
  SHOWER,
  STOP_TYPE,
  WIFI_PLAN,
  WIFI_SHARING,
  WIFI_VERDICT,
} from 'lib/cruiseFormat'
import type { CruiseReview } from 'lib/sanity.queries'
import { Check, Plane, Tv, Wifi, X } from 'lucide-react'
import Link from 'next/link'

import {
  Bullets,
  Card,
  CardTitle,
  CruiseSection,
  Eyebrow,
  Fact,
  has,
  OurTake,
  Pill,
  ScoreCircle,
} from './parts'

type Props = { review: CruiseReview }

const num = (n?: number) =>
  typeof n === 'number' ? n.toLocaleString('en-US') : null

// ── Ship & vibe ──────────────────────────────────────────────

export function ShipSection({ review }: Props) {
  const f = review.shipFacts
  // Ship facts only show once someone has checked them against sources
  const facts = f?.factsChecked
    ? ([
        ['Class', f.shipClass],
        [
          'Built',
          f.yearBuilt &&
            `${f.yearBuilt}${f.lastRefurb ? `, refit ${f.lastRefurb}` : ''}`,
        ],
        ['Size', f.grossTonnage && `${num(f.grossTonnage)} GT`],
        ['Decks', num(f.decks)],
        [
          'Guests',
          num(f.guestsDouble),
          f.guestsMax ? `up to ${num(f.guestsMax)} when full` : undefined,
        ],
        ['Crew', num(f.crew)],
      ].filter(([, v]) => v) as [string, string, string?][])
    : []
  const v = review.vibe
  const crowd = v?.crowd?.map((c) => CROWD[c] ?? c) ?? []
  const dress = [
    v?.dressCodeStyle && DRESS_CODE[v.dressCodeStyle],
    v?.dressUpNights && DRESS_UP_NIGHTS[v.dressUpNights],
    v?.dressUpEnforced &&
      (v.dressUpEnforced === 'yes' ? 'enforced' : 'not enforced'),
  ].filter(Boolean)
  const hasVibe =
    crowd.length > 0 || v?.crowdAge || v?.nightlife || dress.length > 0
  if (facts.length === 0 && !hasVibe) return null

  return (
    <CruiseSection id="ship" title="Ship & vibe">
      <div
        className={`grid gap-5 ${facts.length && hasVibe ? 'lg:grid-cols-[3fr_2fr]' : ''}`}
      >
        {facts.length > 0 && (
          <Card>
            <CardTitle>Ship facts</CardTitle>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {facts.map(([label, value, sub]) => (
                <Fact key={label} label={label} value={value} sub={sub} />
              ))}
            </div>
            {(has(f?.sisterShips) || f?.sisterDifferences) && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {has(f?.sisterShips) && (
                  <>
                    <b className="text-foreground">Sister ships:</b>{' '}
                    {f!.sisterShips!.join(', ')}.{' '}
                  </>
                )}
                {f?.sisterDifferences}
              </p>
            )}
          </Card>
        )}
        {hasVibe && (
          <Card>
            <CardTitle>The vibe</CardTitle>
            <div className="flex flex-col gap-3">
              {crowd.length > 0 && (
                <div>
                  <Eyebrow>Who was on board</Eyebrow>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {crowd.map((c) => (
                      <Pill
                        key={c}
                        className="bg-primary-soft-background text-foreground"
                      >
                        {c}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}
              {(v?.crowdAge || v?.nightlife) && (
                <div className="grid grid-cols-2 gap-3">
                  {v?.crowdAge && (
                    <Fact
                      label="Age mix"
                      value={CROWD_AGE[v.crowdAge] ?? v.crowdAge}
                    />
                  )}
                  {v?.nightlife && (
                    <Fact
                      label="Nightlife"
                      value={NIGHTLIFE[v.nightlife] ?? v.nightlife}
                    />
                  )}
                </div>
              )}
              {(dress.length > 0 || v?.dressCodeNote) && (
                <div>
                  <Eyebrow>Dress code</Eyebrow>
                  <p className="mt-1 text-base leading-relaxed">
                    {dress.length > 0 && <b>{dress.join(', ')}.</b>}{' '}
                    {v?.dressCodeNote}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </CruiseSection>
  )
}

// ── Cabin ────────────────────────────────────────────────────

const quiet = (above?: string, below?: string) => {
  if (above === 'none' && below === 'none') return ['Quiet', 'above and below']
  if (above === 'loud' || below === 'loud')
    return ['Loud', above === 'loud' ? 'from above' : 'from below']
  if (above || below)
    return [
      'Some noise',
      [above === 'some' && 'above', below === 'some' && 'below']
        .filter(Boolean)
        .join(' and '),
    ]
  return null
}

export function CabinSection({ review }: Props) {
  const c = review.cabin ?? {}
  const noise = quiet(c.noiseAbove, c.noiseBelow)
  const facts = [
    c.sizeSqFt && [
      'Cabin size',
      `${num(c.sizeSqFt)} sq ft`,
      c.balconySqFt ? `+ ${num(c.balconySqFt)} sq ft balcony` : undefined,
    ],
    (c.deck || c.position) && [
      'Where',
      [c.deck && `Deck ${c.deck}`, c.position && POSITION[c.position]]
        .filter(Boolean)
        .join(', '),
    ],
    c.splitBathroom && [
      'Bathroom',
      c.splitBathroom === 'yes' ? 'Split' : 'One room',
      c.splitBathroom === 'yes' ? 'toilet room + shower room' : undefined,
    ],
    c.shower && ['Shower', SHOWER[c.shower] ?? c.shower],
    c.bedFeel && [
      'Bed',
      BED[c.bedFeel] ?? c.bedFeel,
      c.topper === 'yes' ? 'ask for a topper' : undefined,
    ],
    c.bedOutlets && [
      'Bed outlets',
      BED_OUTLETS[c.bedOutlets] ?? c.bedOutlets,
      c.bedUsb === 'yes' ? 'USB at the bed' : 'no USB at the bed',
    ],
    noise && ['Noise', noise[0], noise[1]],
    c.motion && ['Motion', MOTION[c.motion] ?? c.motion],
  ].filter(Boolean) as [string, string, string?][]
  const perks = review.perks
  const hasPerks = has(perks?.included) || has(perks?.notIncluded)
  const isShort =
    review.youtube && /youtube\.com\/shorts\//.test(review.youtube)
  const hasAnything =
    review.cabinTake ||
    facts.length ||
    has(c.liked) ||
    has(c.disliked) ||
    has(c.tips) ||
    hasPerks ||
    review.youtube
  if (!hasAnything) return null
  const cabinName = [review.cabinType, review.cabinNumber]
    .filter(Boolean)
    .join(' ')

  const likes = (
    <>
      {has(c.liked) && (
        <Card tone="plain">
          <CardTitle>
            <Check className="h-5 w-5 text-success" aria-hidden="true" />
            What we liked
          </CardTitle>
          <Bullets items={c.liked} />
        </Card>
      )}
      {has(c.disliked) && (
        <Card tone="plain">
          <CardTitle>
            <X className="h-5 w-5 text-destructive" aria-hidden="true" />
            What we didn’t
          </CardTitle>
          <Bullets items={c.disliked} />
        </Card>
      )}
    </>
  )

  const video = review.youtube && (
    <div id="cabin-tour" className="scroll-mt-32">
      {isShort ? (
        <ShortPlayer
          url={review.youtube}
          title={`${cabinName || 'Cabin'} tour`}
        />
      ) : (
        <VideoPlayer
          url={review.youtube}
          videoDescription={review.seoExcerpt}
        />
      )}
    </div>
  )

  return (
    <CruiseSection
      id="cabin"
      title={cabinName ? `Cabin: ${cabinName}` : 'Cabin'}
      score={review.cruiseRating?.Cabin}
      scoreLabel="Cabin score"
    >
      <OurTake text={review.cabinTake} />
      <div
        className={`grid items-start gap-5 ${isShort ? 'lg:grid-cols-[minmax(0,1fr)_270px]' : ''}`}
      >
        <div className="flex min-w-0 flex-col gap-5">
          {facts.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {facts.map(([label, value, sub]) => (
                <Fact key={label} label={label} value={value} sub={sub} />
              ))}
            </div>
          )}
          {(has(c.liked) || has(c.disliked)) && (
            <div className="grid gap-5 md:grid-cols-2">{likes}</div>
          )}
        </div>
        {isShort && video}
      </div>
      {(has(c.tips) || hasPerks) && (
        <div className="grid items-start gap-5 md:grid-cols-2">
          {has(c.tips) && (
            <Card tone="amber">
              <CardTitle>Cabin tips</CardTitle>
              <Bullets items={c.tips} />
            </Card>
          )}
          {hasPerks && (
            <Card>
              <CardTitle>
                {perks?.program
                  ? `${perks.program.split(':').pop()?.trim()} perks`
                  : 'Cabin perks'}
                {review.cabinType ? ` (${review.cabinType})` : ''}
              </CardTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                {has(perks?.included) && (
                  <div>
                    <Eyebrow className="text-success">Included</Eyebrow>
                    <div className="mt-1">
                      <Bullets items={perks!.included} />
                    </div>
                  </div>
                )}
                {has(perks?.notIncluded) && (
                  <div>
                    <Eyebrow className="text-destructive">Not included</Eyebrow>
                    <div className="mt-1">
                      <Bullets items={perks!.notIncluded} />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
      {!isShort && video}
    </CruiseSection>
  )
}

/** YouTube Shorts are tall, so they get a 9:16 player instead of 16:9 */
function ShortPlayer({ url, title }: { url: string; title: string }) {
  const id = url.match(/shorts\/([a-zA-Z0-9_-]{11})/)?.[1]
  if (!id) return null
  return (
    <div className="mx-auto aspect-[9/16] w-full max-w-[270px] overflow-hidden rounded-2xl border-[3px] border-border-bold bg-border-bold">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}

// ── Cost & value ─────────────────────────────────────────────

export function CostSection({ review }: Props) {
  const items = review.costItems ?? []
  const total = items.reduce((sum, i) => sum + (i.amount || 0), 0)
  const perNight =
    total && review.guests && review.nights
      ? Math.round(total / review.guests / review.nights)
      : null
  const audit = review.inclusionAudit
  const packages = review.packageComparisons ?? []
  if (
    !review.valueTake &&
    !items.length &&
    !packages.length &&
    !has(audit?.frictionFree) &&
    !has(audit?.traps) &&
    !has(review.moneyTips)
  ) {
    return null
  }

  return (
    <CruiseSection
      id="cost"
      title="Cost & value"
      score={review.cruiseRating?.Value}
      scoreLabel="Value score"
    >
      <OurTake text={review.valueTake} />
      <div className="grid items-start gap-5 lg:grid-cols-2">
        {items.length > 0 && (
          <Card>
            <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <Eyebrow>
                  All in{review.guests ? `, for ${review.guests}` : ''}
                </Eyebrow>
                <div className="font-heading-family text-[2.25rem] font-black leading-tight md:text-[2.75rem]">
                  {money(total)}
                </div>
              </div>
              {perNight && (
                <div>
                  <Eyebrow>Per person, per night</Eyebrow>
                  <div className="font-heading-family text-section font-black leading-tight md:text-[2rem]">
                    ${perNight}
                  </div>
                </div>
              )}
            </div>
            <details className="group mt-3">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-base font-extrabold">
                Where it went ({items.length} items)
                <span className="text-sm font-bold text-primary group-open:hidden">
                  Show
                </span>
                <span className="hidden text-sm font-bold text-primary group-open:inline">
                  Hide
                </span>
              </summary>
              <ul>
                {items.map((item) => (
                  <li
                    key={item._key}
                    className="flex items-baseline gap-3 border-t border-border py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-semibold">
                        {item.label}
                      </div>
                      {item.bookedWhen && (
                        <div className="text-sm text-muted-foreground">
                          {BOOKED_WHEN[item.bookedWhen]}
                        </div>
                      )}
                    </div>
                    <div className="font-heading-family whitespace-nowrap text-base font-extrabold">
                      {money(item.amount)}
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          </Card>
        )}
        {(packages.length > 0 || has(review.moneyTips)) && (
          <div className="flex min-w-0 flex-col gap-5">
            {packages.map((p) => (
              <PackageCard key={p._key} pkg={p} />
            ))}
            {has(review.moneyTips) && (
              <Card tone="amber">
                <CardTitle>Money-saving tips</CardTitle>
                <Bullets items={review.moneyTips} />
              </Card>
            )}
          </div>
        )}
      </div>
      {(has(audit?.frictionFree) || has(audit?.traps)) && (
        <div className="grid items-start gap-5 md:grid-cols-2">
          {has(audit?.frictionFree) && (
            <Card tone="green">
              <CardTitle>Free and worth it</CardTitle>
              <Bullets items={audit!.frictionFree} />
            </Card>
          )}
          {has(audit?.traps) && (
            <Card tone="red">
              <CardTitle>Money traps</CardTitle>
              <Bullets items={audit!.traps} />
            </Card>
          )}
        </div>
      )}
    </CruiseSection>
  )
}

type Pkg = NonNullable<CruiseReview['packageComparisons']>[number]

function PackageCard({ pkg }: { pkg: Pkg }) {
  const options = [
    ['a', pkg.optionA],
    ['b', pkg.optionB],
  ] as const
  return (
    <Card>
      <CardTitle>{pkg.title}</CardTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map(([key, option]) => {
          if (!option) return null
          const win = pkg.winner === key
          const sum = (option.items ?? []).reduce(
            (s, i) => s + (i.amount || 0),
            0,
          )
          return (
            <div
              key={key}
              className={`min-w-0 rounded-xl bg-card p-4 ${win ? 'border-[3px] border-success' : 'border-2 border-border'}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="text-base">{option.label}</b>
                {win && (
                  <Pill className="border border-green-200 bg-green-50 text-success">
                    Cheaper, our pick
                  </Pill>
                )}
              </div>
              <ul className="mt-2">
                {option.items?.map((i, n) => (
                  <li
                    key={n}
                    className="flex justify-between gap-3 py-1 text-sm"
                  >
                    <span>{i.label}</span>
                    <b className="whitespace-nowrap">
                      {typeof i.amount === 'number' ? money(i.amount) : ''}
                    </b>
                  </li>
                ))}
              </ul>
              <div className="font-heading-family mt-2 flex justify-between border-t-2 border-border-bold pt-2 text-lg font-extrabold">
                <span>Total</span>
                <span>{money(sum)}</span>
              </div>
            </div>
          )
        })}
      </div>
      {pkg.breakEven && (
        <p className="mt-3 text-sm text-muted-foreground">
          <b className="text-foreground">Break-even:</b> {pkg.breakEven}
        </p>
      )}
      {pkg.verdict && (
        <p className="mt-3 text-base font-bold text-success">{pkg.verdict}</p>
      )}
    </Card>
  )
}

// ── Activities, sports, crowds and Wi-Fi ─────────────────────

export function ActivitiesSection({ review }: Props) {
  const shows = review.shows ?? []
  const attractions = (review.attractions ?? []).filter(
    (a) => a.tried !== false,
  )
  const sf = review.sportsFitness
  const game = sf?.gamesWatched?.[0]
  const court = sf?.basketballCourt
  const gym = sf?.gym
  const sportsFacts = [
    game && [
      'Watching games',
      [game.league, game.venue && `at ${game.venue.split(' ')[0]}`]
        .filter(Boolean)
        .join(' '),
      undefined,
    ],
    court?.available !== undefined && [
      'Basketball court',
      court.available
        ? `Yes${court.setting ? `, ${court.setting.toLowerCase()}` : ''}`
        : 'No',
      court.location ? `in the ${court.location}` : undefined,
    ],
    gym?.peakHours && [
      'Gym rush',
      gym.peakHours,
      gym.bestTime
        ? `go ${gym.bestTime.charAt(0).toLowerCase()}${gym.bestTime.slice(1)}`
        : undefined,
    ],
  ].filter(Boolean) as [string, string, string?][]
  const sportsScore = review.cruiseRating?.Sports_Fan
  const wifi = review.wifi
  const showWifi = wifi?.usage && wifi.usage !== 'none'
  const hot = review.crowdHotSpots ?? []
  const flow = review.cruiseRating?.Ship_Flow
  if (
    !review.entertainmentTake &&
    !shows.length &&
    !attractions.length &&
    !sportsFacts.length &&
    !showWifi &&
    !hot.length &&
    !review.crowdsTake
  ) {
    return null
  }

  return (
    <CruiseSection
      id="activities"
      title="Activities, sports & Wi-Fi"
      score={review.cruiseRating?.Entertainment}
      scoreLabel="Entertainment score"
    >
      <OurTake text={review.entertainmentTake} />
      {(shows.length > 0 || attractions.length > 0) && (
        <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shows.map((s) => (
            <Card key={s._key} tone="plain">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="font-heading-family text-lg">{s.name}</b>
                {s.arriveEarly && (
                  <Pill className="border border-amber-200 bg-amber-50 text-amber-900">
                    Arrive {s.arriveEarly} early
                  </Pill>
                )}
              </div>
              {s.venue && (
                <div className="text-sm text-muted-foreground">{s.venue}</div>
              )}
              {s.note && (
                <p className="mt-2 text-base leading-relaxed">{s.note}</p>
              )}
            </Card>
          ))}
          {attractions.map((a) => (
            <Card key={a._key} tone="plain">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="font-heading-family text-lg">{a.name}</b>
                <Pill className="bg-primary-soft-background text-foreground">
                  {a.cost === 'extra'
                    ? a.price
                      ? `${money(a.price)} per person`
                      : 'Extra cost'
                    : 'Included'}
                </Pill>
              </div>
              {a.note && (
                <p className="mt-2 text-base leading-relaxed">{a.note}</p>
              )}
            </Card>
          ))}
        </div>
      )}
      {(sportsFacts.length > 0 || showWifi) && (
        <div
          className={`grid items-start gap-5 ${sportsFacts.length && showWifi ? 'lg:grid-cols-[3fr_2fr]' : ''}`}
        >
          {sportsFacts.length > 0 && (
            <Card>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-lg font-extrabold md:text-title">
                  <Tv className="h-5 w-5" aria-hidden="true" />
                  For sports fans
                </h3>
                {typeof sportsScore === 'number' && (
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <ScoreCircle score={sportsScore} size="sm" />
                    Sports fan score
                  </div>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {sportsFacts.map(([label, value, sub]) => (
                  <Fact key={label} label={label} value={value} sub={sub} />
                ))}
              </div>
              {game?.note && (
                <p className="mt-3 text-base leading-relaxed">{game.note}</p>
              )}
            </Card>
          )}
          {showWifi && <WifiCard wifi={wifi!} />}
        </div>
      )}
      {(hot.length > 0 || review.crowdsTake) && (
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold md:text-title">
              Crowds: where and when
            </h3>
            {typeof flow === 'number' && (
              <div className="flex items-center gap-2 text-sm font-bold">
                <ScoreCircle score={flow} size="sm" />
                Ship flow score
              </div>
            )}
          </div>
          {review.crowdsTake && (
            <p className="mb-3 text-base leading-relaxed">
              {review.crowdsTake}
            </p>
          )}
          {hot.length > 0 && (
            <div>
              <div className="hidden grid-cols-[160px_220px_1fr] gap-4 pb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-muted-foreground md:grid">
                <span>Where</span>
                <span>Busiest</span>
                <span>What to do</span>
              </div>
              {hot.map((h) => (
                <div
                  key={h._key}
                  className="grid gap-1 border-t border-border py-3 text-base md:grid-cols-[160px_220px_1fr] md:gap-4"
                >
                  <b>{h.place}</b>
                  <span className="text-sm font-bold text-destructive md:text-base">
                    {h.peakTimes}
                  </span>
                  <span className="text-sm text-muted-foreground md:text-base">
                    {h.tip}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      {has(review.reservationTips) && (
        <Card tone="amber">
          <CardTitle>Book ahead</CardTitle>
          <Bullets items={review.reservationTips} />
        </Card>
      )}
    </CruiseSection>
  )
}

function WifiCard({ wifi }: { wifi: NonNullable<CruiseReview['wifi']> }) {
  const verdict = wifi.verdict ? WIFI_VERDICT[wifi.verdict] : null
  const plan = wifi.planName
    ? wifi.planName.replace(/\s*\(.*\)$/, '')
    : wifi.plan && WIFI_PLAN[wifi.plan]
  const provider = wifi.planName?.match(/\((.*)\)/)?.[1]
  return (
    <Card tone="success">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-success">
          <Wifi className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <div className="font-heading-family text-lg font-extrabold">
            Wi-Fi{verdict ? `: ${verdict.label}` : ''}
          </div>
          <div className="text-sm text-muted-foreground">
            Not part of the score
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {plan && <Fact label="Plan" value={plan} sub={provider} />}
        {wifi.devices && (
          <Fact
            label="Devices"
            value={wifi.devices}
            sub={wifi.sharingRule ? WIFI_SHARING[wifi.sharingRule] : undefined}
          />
        )}
      </div>
      {wifi.verdictNote && (
        <p className="mt-3 text-base leading-relaxed">{wifi.verdictNote}</p>
      )}
    </Card>
  )
}

// ── Ports & logistics ────────────────────────────────────────

const STOP_TONE: Record<string, string> = {
  overnight: 'text-orange-900',
  docked: 'text-success',
  tendered: 'text-blue-800',
}

export function PortsSection({ review }: Props) {
  const days = review.itinerary ?? []
  const g = review.gettingThere
  const emb = review.embarkation
  const deb = review.debarkation
  const boardTips = [...(emb?.tips ?? []), ...(deb?.tips ?? [])]
  const hasLogistics =
    g?.airport ||
    g?.terminal ||
    emb?.lines ||
    deb?.minutesToExit ||
    boardTips.length
  if (!review.portsTake && !days.length && !hasLogistics) return null

  return (
    <CruiseSection
      id="ports"
      title="Ports & logistics"
      score={review.cruiseRating?.Itinerary}
      scoreLabel="Itinerary score"
    >
      <OurTake text={review.portsTake} />
      <div
        className={`grid items-start gap-5 ${days.length && hasLogistics ? 'lg:grid-cols-[3fr_2fr]' : ''}`}
      >
        {days.length > 0 && (
          <Card>
            {review.itineraryName && (
              <CardTitle>{review.itineraryName}</CardTitle>
            )}
            <ol>
              {days.map((d) => {
                const sea = d.stopType === 'sea'
                const times = [
                  d.arrive && `In ${d.arrive}`,
                  d.depart && `Out ${d.depart}`,
                ]
                  .filter(Boolean)
                  .join(' to ')
                return (
                  <li
                    key={d._key}
                    className={`grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-t border-border md:grid-cols-[56px_minmax(0,1fr)] ${sea ? 'py-2.5' : 'py-3.5'}`}
                  >
                    <div className="font-heading-family pt-0.5 text-sm font-extrabold text-muted-foreground">
                      DAY {d.day}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <b className={sea ? 'text-base' : 'text-lg'}>
                          {d.port}
                        </b>
                        {!sea && d.stopType && (
                          <Pill
                            className={`border border-border bg-card ${STOP_TONE[d.stopType] ?? 'text-foreground'}`}
                          >
                            {STOP_TYPE[d.stopType]}
                          </Pill>
                        )}
                        {times && (
                          <span className="text-sm text-muted-foreground">
                            {times}
                          </span>
                        )}
                      </div>
                      {d.whatWeDid && (
                        <p className="mt-1.5 text-base leading-relaxed">
                          <b>
                            What we did
                            {d.excursionType
                              ? ` (${EXCURSION[d.excursionType]?.toLowerCase()})`
                              : ''}
                            :
                          </b>{' '}
                          {d.whatWeDid}
                        </p>
                      )}
                      {d.tip && (
                        <p className="mt-1.5 rounded-lg bg-amber-50 px-3 py-2 text-sm leading-relaxed">
                          <b>Tip:</b> {d.tip}
                        </p>
                      )}
                      {d.tenderWait && (
                        <div className="mt-1.5">
                          <Pill className="border border-red-200 bg-red-50 text-destructive">
                            Tender wait {d.tenderWait}
                          </Pill>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </Card>
        )}
        {hasLogistics && (
          <div className="flex min-w-0 flex-col gap-5">
            {(g?.airport || g?.terminal) && (
              <Card tone="plain">
                <CardTitle>
                  <Plane className="h-5 w-5" aria-hidden="true" />
                  Getting to the ship
                </CardTitle>
                <div className="grid grid-cols-2 gap-3">
                  {g?.airport && <Fact label="Fly into" value={g.airport} />}
                  {g?.transfer && (
                    <Fact
                      label="To the port"
                      value={[
                        g.transfer.split(' or ')[0],
                        g.transferMinutes && `${g.transferMinutes} min`,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                      sub={
                        g.transferCost
                          ? `${money(g.transferCost)} one way`
                          : undefined
                      }
                    />
                  )}
                </div>
                {g?.terminal && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    {g.terminal}
                  </div>
                )}
                {g?.whyThisAirport && (
                  <p className="mt-2 text-base leading-relaxed">
                    {g.whyThisAirport}
                  </p>
                )}
              </Card>
            )}
            {(emb?.lines || deb?.minutesToExit || boardTips.length > 0) && (
              <Card tone="plain">
                <CardTitle>Boarding and getting off</CardTitle>
                <div className="grid grid-cols-2 gap-3">
                  {emb?.lines && (
                    <Fact
                      label="Boarding lines"
                      value={LINES[emb.lines] ?? emb.lines}
                      sub={
                        emb.minutesToBoard
                          ? `on board in ${emb.minutesToBoard} min`
                          : undefined
                      }
                    />
                  )}
                  {deb?.minutesToExit && (
                    <Fact
                      label="Getting off"
                      value={`${deb.minutesToExit} min`}
                      sub={
                        [
                          deb.method === 'self-assist'
                            ? 'self-assist'
                            : deb.method === 'assigned'
                              ? 'assigned group'
                              : null,
                          deb.facialRecognition === 'yes' ? 'face scan' : null,
                        ]
                          .filter(Boolean)
                          .join(', ') || undefined
                      }
                    />
                  )}
                </div>
                {boardTips.length > 0 && (
                  <div className="mt-3">
                    <Bullets items={boardTips} />
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </CruiseSection>
  )
}

// ── Verdict, comparison and FAQ ──────────────────────────────

export function VerdictSection({
  review,
  overall,
}: Props & { overall?: number }) {
  const cmp = review.comparisons ?? []
  if (
    !has(review.positives) &&
    !has(review.negatives) &&
    !has(review.bookItIf) &&
    !has(review.skipItIf) &&
    !cmp.length
  ) {
    return null
  }
  const ship = review.shipName || 'This ship'
  return (
    <CruiseSection
      id="verdict"
      title="Our verdict"
      score={overall}
      scoreLabel="Overall"
    >
      {(has(review.positives) || has(review.negatives)) && (
        <div className="grid items-start gap-5 md:grid-cols-2">
          {has(review.positives) && (
            <Card tone="plain">
              <CardTitle>
                <Check className="h-5 w-5 text-success" aria-hidden="true" />
                Pros
              </CardTitle>
              <Bullets items={review.positives} />
            </Card>
          )}
          {has(review.negatives) && (
            <Card tone="plain">
              <CardTitle>
                <X className="h-5 w-5 text-destructive" aria-hidden="true" />
                Cons
              </CardTitle>
              <Bullets items={review.negatives} />
            </Card>
          )}
        </div>
      )}
      {(has(review.bookItIf) || has(review.skipItIf)) && (
        <div className="grid items-start gap-5 md:grid-cols-2">
          {has(review.bookItIf) && (
            <Card tone="green">
              <CardTitle>Book it if</CardTitle>
              <Bullets items={review.bookItIf} />
            </Card>
          )}
          {has(review.skipItIf) && (
            <Card tone="red">
              <CardTitle>Skip it if</CardTitle>
              <Bullets items={review.skipItIf} />
            </Card>
          )}
        </div>
      )}
      {cmp.map((c) => {
        const other = c.otherShip.split(' (')[0]
        return (
          <Card key={c._key}>
            <CardTitle>
              <span>
                How it compares:{' '}
                {c.otherReviewSlug ? (
                  <Link
                    href={`/cruise/${c.otherReviewSlug}`}
                    className="text-primary hover:underline"
                  >
                    {c.otherShip}
                  </Link>
                ) : (
                  c.otherShip
                )}
              </span>
            </CardTitle>
            <div className="hidden grid-cols-[170px_1fr_1fr_240px] gap-4 pb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-muted-foreground lg:grid">
              <span />
              <span>{ship}</span>
              <span>{other}</span>
              <span>Who wins</span>
            </div>
            {c.rows?.map((r) => (
              <div
                key={r._key}
                className="grid gap-1 border-t border-border py-3 text-base lg:grid-cols-[170px_1fr_1fr_240px] lg:gap-4"
              >
                <b className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted-foreground lg:text-base lg:normal-case lg:tracking-normal lg:text-foreground">
                  {r.metric}
                </b>
                <span className="text-sm lg:text-base">
                  <b className="lg:hidden">{ship}: </b>
                  {r.thisShip}
                </span>
                <span className="text-sm lg:text-base">
                  <b className="lg:hidden">{other}: </b>
                  {r.otherShip}
                </span>
                <span className="text-sm font-extrabold text-primary lg:text-base">
                  {r.edge}
                </span>
              </div>
            ))}
          </Card>
        )
      })}
    </CruiseSection>
  )
}

export function FaqSection({ review }: Props) {
  const faqs = review.faqs ?? []
  if (!faqs.length && !review.disclosure) return null
  return (
    <CruiseSection id="faq" title="Questions people ask">
      {faqs.length > 0 && (
        <Accordion
          type="single"
          collapsible
          defaultValue={faqs[0]._key}
          className="w-full"
        >
          {faqs.map((f) => (
            <AccordionItem key={f._key} value={f._key}>
              <AccordionTrigger className="min-h-14 text-left text-base font-extrabold">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {review.disclosure && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {review.disclosure}
        </p>
      )}
    </CruiseSection>
  )
}
