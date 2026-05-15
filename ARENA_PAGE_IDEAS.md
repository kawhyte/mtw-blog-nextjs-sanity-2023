# Arena Detail Page — Future Feature Ideas

These are brainstormed ideas for making the arena detail page more unique and valuable to users.
Discuss each item with Claude before implementing — some may need schema changes, new components, or interactive client-side logic.

---

## 1. "The Game Day Experience" Timeline

**What it is:** A visual step-by-step flow of the full arena visit — from arrival through departure — with notes and mini-ratings at each stage.

**Stages (example):** Arrival → Parking/Transit → Arena Entry → Concessions → Finding Your Seat → Halftime → Exiting

**Why it's unique:** No major arena review site maps the _experience flow_. Most only rate the seat or the food — not the full journey.

**To implement:**

- Add a `gameDayTimeline` array field to `schemas/nbaArenas.ts`
- Each entry: `stage` (string/select), `notes` (text), `rating` (1–5), optional `tip`
- New `ArenaGameDayTimeline.tsx` component — vertical or horizontal step display
- Optional per-stage icons (Car, DoorOpen, Utensils, Armchair, Music, LogOut)

---

## 2. "Best Seats in the House" Seating Insight

**What it is:** Written recommendations for which sections to target and which to avoid, with optional color-coded zone callouts.

**Why it's unique:** Personalised seat advice based on actual experience — not just generic "lower level is better."

**To implement:**

- Add `seatingTips` array to schema: `{ zone: string, recommendation: 'great' | 'good' | 'avoid', notes: string }`
- New `ArenaSeatingTips.tsx` component — card list with color-coded badges (green/yellow/red)
- Future enhancement: SVG seating map overlay (advanced)

---

## 3. "Parking & Transit Strategy"

**What it is:** Specific, actionable guidance beyond the current Transportation rating — named lots, rideshare zones, transit stops, arrival/departure timing.

**Why it's unique:** The current rating is a number. Users planning a trip want _where to go_ and _what time_.

**To implement:**

- Add `transitStrategy` object field to schema with sub-fields: `bestLot` (string), `rideshareNote` (text), `transitStop` (string), `arriveBy` (string e.g. "90 min before tip-off"), `exitTip` (text)
- New `ArenaTransitCard.tsx` — structured card layout with icons (Car, Bus, MapPin, Clock)
- Connects naturally to the existing Transportation rating

---

## 4. "Crowd & Atmosphere Meter"

**What it is:** Goes beyond the single Vibes rating — describes _when_ the arena is at its loudest/best, what types of matchups create the best atmosphere, notable sections or traditions.

**Why it's unique:** Helps users decide _which game_ to attend, not just whether the arena is good.

**To implement:**

- Add `atmosphereNotes` object to schema: `bestMatchupType` (select: playoff/rivalry/opening night/regular season), `loudestSections` (string), `crowdNotes` (text), `standingSection` (boolean), `studentSection` (boolean)
- New `ArenaAtmosphereCard.tsx` — descriptive callout card
- Could include a simple "Hype Level" bar based on bestMatchupType

---

## 5. "Your Arena Checklist"

**What it is:** A list of things to do, try, or see at this arena — specific food stalls, photo spots, hidden gems, unique features. User can check items off (client-side, no auth needed).

**Why it's unique:** Turns a passive review into an interactive planning tool. Works for both first-timers and returning visitors.

**To implement:**

- Add `arenaChecklist` array to schema: each item `{ label: string, category: 'food' | 'photo' | 'experience' | 'tip' }`
- New `ArenaChecklist.tsx` component — checkbox list with `useState` for local tick state
- No backend needed — state lives in `localStorage` keyed by arena slug (optional persistence)

---

## 6. "Similar Arenas You Might Like"

**What it is:** 2–3 arena cards at the bottom linking to arenas with similar overall ratings or vibe profiles. "If you liked this, check out…"

**Why it's unique:** Keeps users on the site and builds cross-arena discovery.

**To implement:**

- No schema changes needed — computed at query time
- GROQ: fetch arenas where `visited == true && slug != currentSlug`, sorted by closest overall rating
- New `SimilarArenas.tsx` component — horizontal card row reusing `NBAArenaCard`
- Add to `arenaBySlugQuery` in `lib/sanity.queries.ts` as a parallel fetch

---

## 7. "Cost Breakdown Estimator"

**What it is:** A structured breakdown of the real cost of attending a game — parking, tickets, food — to help users budget a visit.

**Why it's unique:** Very practical and frequently Googled. Most review sites skip cost transparency entirely.

**To implement:**

- Add `costEstimate` object to schema: `{ ticketRangeLow: number, ticketRangeHigh: number, parkingCost: number, avgFoodSpend: number, notes: text }`
- New `ArenaCostCard.tsx` — displays ranges with Banknote icon, calculates a "per person" total estimate
- Optional: simple interactive selector (budget / mid / premium) that adjusts the estimate

---

## 8. "Accessibility & Family Comfort"

**What it is:** A dedicated section rating/describing accessibility features, family amenities, and premium comfort options — things parents, wheelchair users, and first-timers actually search for.

**Why it's unique:** Largely ignored by mainstream sports coverage. High value for a specific audience who struggles to find this info.

**To implement:**

- Add `accessibilityInfo` object to schema: `{ wheelchairAccess: boolean, familyRestrooms: boolean, kidsActivities: boolean, clubAccess: boolean, accessibilityNotes: text }`
- New `ArenaAccessibilityCard.tsx` — icon checklist (CheckCircle / XCircle) with optional notes
- Hidden in Studio unless `visited == true`

---

## Notes for Implementation

- All sections should be **optional** — no section should render if the data is empty (maintain backwards compatibility with existing arenas)
- Each new section should use `SectionTitle` and follow the existing container/padding pattern (`container mx-auto px-4 md:px-6`)
- Discuss ordering on the page before implementing — some sections (e.g. Cost Estimator) may work better near the top; others (Checklist, Similar Arenas) near the bottom
- Schema fields should all be hidden unless `visited === true` where applicable
