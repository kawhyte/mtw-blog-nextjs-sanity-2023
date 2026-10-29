// Labels and small formatters for the cruise review page. The values match
// the option lists in schemas/cruiseReview.ts.
import { addDays, format, parseISO } from 'date-fns'
import { calculateRating } from 'lib/calculateRating'
import { CRUISE_LINES } from 'lib/cruiseShips'
import { CRUISE_WEIGHTS } from 'lib/ratingWeights'
import type { CruiseReview } from 'lib/sanity.queries'

/** "Feb 4 to 10, 2026", "Jan 30 to Feb 6, 2026" or "Dec 28, 2025 to Jan 4, 2026" */
export function formatSailingRange(start?: string, nights?: number) {
  if (!start) return undefined
  const from = parseISO(start)
  if (!nights) return format(from, 'MMM d, yyyy')
  const to = addDays(from, nights)
  if (from.getFullYear() !== to.getFullYear()) {
    return `${format(from, 'MMM d, yyyy')} to ${format(to, 'MMM d, yyyy')}`
  }
  if (from.getMonth() !== to.getMonth()) {
    return `${format(from, 'MMM d')} to ${format(to, 'MMM d, yyyy')}`
  }
  return `${format(from, 'MMM d')} to ${format(to, 'd, yyyy')}`
}

export const cruiseLineName = (value?: string) =>
  CRUISE_LINES.find((line) => line.value === value)?.title

/** "Quantum of the Seas", or the review title when the ship is missing */
export const shipTitle = (review: CruiseReview) =>
  review.shipName || review.title

/** Overall score on the site's 5-point scale, from the weighted 0 to 10 scores */
export function cruiseOverall(review: CruiseReview) {
  const ratings = review.cruiseRating
  if (!ratings) return null
  const scored = Object.keys(CRUISE_WEIGHTS).filter(
    (key) => typeof ratings[key] === 'number',
  )
  if (scored.length === 0) return null
  return calculateRating(ratings as Record<string, number>, CRUISE_WEIGHTS)
}

export const money = (amount: number) =>
  `$${amount.toLocaleString('en-US', { minimumFractionDigits: amount % 1 ? 2 : 0, maximumFractionDigits: 2 })}`

export const LINE_TIER: Record<string, string> = {
  contemporary: 'Contemporary',
  premium: 'Premium',
  upscale: 'Upscale',
  luxury: 'Luxury',
}

export const REGION: Record<string, string> = {
  mexico: 'Mexican Riviera',
  caribbean: 'Caribbean',
  bahamas: 'Bahamas',
  alaska: 'Alaska',
  hawaii: 'Hawaii',
  mediterranean: 'Mediterranean',
  'northern-europe': 'Northern Europe',
  asia: 'Asia',
  australia: 'Australia & South Pacific',
  'pacific-coast': 'Pacific Coast',
  repositioning: 'Repositioning',
}

export const BEST_FOR: Record<string, string> = {
  families: 'Families',
  multigen: 'Multi-gen families',
  couples: 'Couples',
  'first-timers': 'First-timers',
  'sports-fans': 'Sports fans',
  foodies: 'Foodies',
  solo: 'Solo travelers',
  loyalty: 'Loyalty points runs',
}

export const SAIL_AGAIN: Record<
  string,
  { label: string; tone: 'success' | 'warning' | 'destructive' }
> = {
  yes: { label: 'Yes, absolutely', tone: 'success' },
  conditional: { label: 'Yes, with conditions', tone: 'warning' },
  maybe: { label: 'Maybe', tone: 'warning' },
  no: { label: 'No', tone: 'destructive' },
}

export const RATING_LABELS: [string, string][] = [
  ['Cabin', 'Cabin'],
  ['Dining', 'Dining'],
  ['Service', 'Service'],
  ['Ship_Flow', 'Ship flow & crowds'],
  ['Entertainment', 'Entertainment'],
  ['Itinerary', 'Itinerary & ports'],
  ['Value', 'Value'],
]

export const CROWD: Record<string, string> = {
  'young-families': 'Young families',
  teens: 'Teens',
  couples: 'Couples',
  retirees: 'Retirees',
  groups: 'Groups',
}

export const CROWD_AGE: Record<string, string> = {
  'under-40': 'Mostly under 40',
  mixed: 'Mixed',
  'over-55': 'Mostly over 55',
}

export const NIGHTLIFE: Record<string, string> = {
  quiet: 'Quiet',
  some: 'Some',
  lively: 'Lively',
  party: 'Party all night',
}

export const DRESS_CODE: Record<string, string> = {
  none: 'No dress code',
  relaxed: 'Relaxed',
  formal: 'Formal nights',
}

export const DRESS_UP_NIGHTS: Record<string, string> = {
  '1': '1 dress-up night',
  '2': '2 dress-up nights',
  '3+': '3 or more dress-up nights',
  all: 'Dress up every night',
}

export const POSITION: Record<string, string> = {
  forward: 'forward',
  midship: 'midship',
  aft: 'aft',
}

export const BED: Record<string, string> = {
  'too-soft': 'Too soft',
  'just-right': 'Just right',
  firm: 'Firm',
  'too-firm': 'Too firm',
}

export const SHOWER: Record<string, string> = {
  curtain: 'Curtain',
  'glass-door': 'Glass door',
  'tub-shower': 'Tub + shower',
}

export const BED_OUTLETS: Record<string, string> = {
  none: 'None at the bed',
  'one-side': 'One side only',
  'both-sides': 'Both sides',
}

export const MOTION: Record<string, string> = {
  barely: 'Barely felt',
  some: 'Some',
  'a-lot': 'A lot',
}

export const STORAGE: Record<string, string> = {
  tight: 'Not enough',
  enough: 'Just enough',
  plenty: 'Plenty',
}

export const VENUE_TYPE: Record<string, string> = {
  'main-dining': 'Main dining room',
  buffet: 'Buffet',
  specialty: 'Specialty',
  exclusive: 'Suite restaurant',
  casual: 'Quick bite',
  cafe: 'Cafe',
  bar: 'Bar',
  'room-service': 'Room service',
  experience: 'Tasting',
}

export const WORTH_IT: Record<string, { label: string; className: string }> = {
  yes: {
    label: 'Worth it',
    className: 'bg-green-50 text-success border border-green-200',
  },
  once: {
    label: 'Worth it once',
    className: 'bg-amber-50 text-amber-900 border border-amber-200',
  },
  skip: {
    label: 'Skip it',
    className: 'bg-red-50 text-destructive border border-red-200',
  },
}

export const STOP_TYPE: Record<string, string> = {
  embarkation: 'Boarding',
  sea: 'Sea day',
  docked: 'Docked',
  tendered: 'Tendered',
  overnight: 'Overnight',
  debarkation: 'Home',
}

export const EXCURSION: Record<string, string> = {
  ship: 'Ship excursion',
  independent: 'Booked on our own',
  diy: 'Explored on our own',
  onboard: 'Stayed onboard',
}

export const WIFI_VERDICT: Record<
  string,
  { label: string; className: string }
> = {
  great: {
    label: 'Great',
    className: 'bg-green-50 text-success border-green-200',
  },
  good: {
    label: 'Good',
    className: 'bg-green-50 text-success border-green-200',
  },
  slow: {
    label: 'Slow',
    className: 'bg-amber-50 text-amber-900 border-amber-200',
  },
  unusable: {
    label: 'Unusable',
    className: 'bg-red-50 text-destructive border-red-200',
  },
}

export const WIFI_SHARING: Record<string, string> = {
  'one-at-a-time': 'one online at a time',
  'per-device': 'each device needs a plan',
  shared: 'shared freely',
}

export const WIFI_PLAN: Record<string, string> = {
  basic: 'Basic',
  premium: 'Premium',
}

export const BOOKED_WHEN: Record<string, string> = {
  'pre-cruise': 'Before sailing',
  onboard: 'Onboard',
}

export const LINES: Record<string, string> = {
  short: 'Short',
  moderate: 'Moderate',
  long: 'Long',
}
