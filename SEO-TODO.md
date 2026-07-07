# SEO Priority Checklist
_Work through these in order. Check off as you complete them._

---

## 🚀 DEPLOY FIRST

- [ ] Push to Vercel and deploy (all 5 batches of SEO changes are committed and ready)

---

## 🔴 HIGH — Do Immediately After Deploy

### Google Search Console — Step by Step

**How to access GSC:**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Select your property: `https://www.meetthewhytes.com`

**How to re-request indexing for a single page:**
1. Click **URL Inspection** in the left sidebar
2. Paste the full URL in the search bar at the top (e.g. `https://www.meetthewhytes.com`)
3. Press Enter — wait for it to check the live URL
4. Click **"Request Indexing"** button
5. A dialog will confirm it's been added to the queue (usually indexed within 1–7 days)
6. Repeat for each URL below

**How to submit new pages Google hasn't seen before (city hub pages):**
1. Click **Sitemaps** in the left sidebar
2. If `sitemap.xml` is already submitted, click it → click **"Resubmit"**
   — OR — enter `sitemap.xml` in the "Add a new sitemap" field and click Submit
3. Google will crawl the sitemap and find all new `/city/` URLs automatically

**Pages to re-index (do these in order):**
- [ ] `https://www.meetthewhytes.com` — Homepage (arena section is new)
- [ ] `https://www.meetthewhytes.com/arenas` — Arenas listing (ItemList schema improved)
- [ ] `https://www.meetthewhytes.com/arena/fiserv-forum`
- [ ] `https://www.meetthewhytes.com/arena/state-farm-arena`
- [ ] `https://www.meetthewhytes.com/arena/gainbridge-fieldhouse`
- [ ] `https://www.meetthewhytes.com/arena/mohegan-sun-arena`
- [ ] `https://www.meetthewhytes.com/arena/t-mobile-arena`
- [ ] `https://www.meetthewhytes.com/arena/moda-center`
- [ ] `https://www.meetthewhytes.com/arena/target-center`
- [ ] `https://www.meetthewhytes.com/arena/amway-center`
- [ ] `https://www.meetthewhytes.com/arena/barclays-center`
- [ ] `https://www.meetthewhytes.com/arena/entertainment-and-sports-arena`
- [ ] `https://www.meetthewhytes.com/arena/paycom-center`
- [ ] `https://www.meetthewhytes.com/guides` — Guides listing
- [ ] Each published guide URL (paste from your browser)
- [ ] Resubmit sitemap to pick up all `/city/` pages automatically

---

### NBA Arena Road Trip Guide (Fix Before Publishing)

- [ ] **Replace all 19 photo/video placeholder callouts** with real photos from your trips
      — Or delete the empty callout blocks if you don't have the photo yet
      — Don't publish with any `📷 Add photo here` blocks showing
- [ ] **Fix the title** — change from the current 89-char wordy title to something like:
      *"NBA Arena Road Trip Guide: Visiting All 30 Teams (Costs, Tips & Best Arenas)"*
- [ ] **Add location field** — type `United States` in the new Location field
- [ ] **Add WNBA content** OR remove WNBA from the tags and update the title to NBA-only
- [ ] **Add 3–5 hotel review links** in the budget/hotels section — link to actual hotels you've stayed at near arenas
- [ ] **Add city hub page links** in the "arenas worth flying for" section (e.g. `/city/milwaukee-wi`)
- [ ] **Verify the "Every Arena We've Reviewed" section** links to all your reviewed arenas
- [ ] Set `publishedAt` date and **publish**

---

### Studio — Arena FAQs (High SEO Impact)
_Add 3–5 Q&As to each visited arena. These appear as expandable answers in Google search results._

- [ ] Fiserv Forum — add FAQs
- [ ] State Farm Arena — add FAQs
- [ ] Gainbridge Fieldhouse — add FAQs
- [ ] T-Mobile Arena — add FAQs
- [ ] Mohegan Sun Arena — add FAQs
- [ ] Moda Center — add FAQs
- [ ] Target Center — add FAQs
- [ ] Amway Center — add FAQs
- [ ] Barclays Center — add FAQs
- [ ] Capital One Arena (ESA) — add FAQs
- [ ] Paycom Center — add FAQs
- [ ] _(add remaining visited arenas)_

Good FAQ starters per arena:
- "Is [Arena] loud / good atmosphere?"
- "Where do I park near [Arena]?"
- "What's the best food at [Arena]?"
- "Can you bring a bag into [Arena]?"
- "What section has the best view at [Arena]?"

---

## 🟡 MEDIUM — Do Within the Next Few Days

### Studio — Guide Locations
_Fills in the TravelGuide JSON-LD destination field. Takes ~1 min per guide._

- [ ] Add location to each published guide (format: `"Dallas, TX"` — match arena format exactly)
- [ ] For the Road Trip Guide, add `United States`

### Studio — Hotel/Food Location Consistency
_City hub pages match on exact location string. Hotels/food must match the arena's location._

- [ ] Go through hotel reviews — ensure location is `"City, ST"` format matching the arena
- [ ] Go through food reviews — same check
- [ ] After fixing, visit the city hub pages (`/city/dallas-tx` etc.) to verify hotels and food appear

### Studio — Cleanup
- [ ] Delete duplicate arena: **American Airlines Center** (keep the one with more data)
- [ ] Delete duplicate arena: **Frost Bank Center** (keep the one with more data)
- [ ] Delete duplicate arena: **Toyota Center** (keep the one with more data)
- [ ] Delete test document **"yesy"** (Food Reviews → location "ssxasxsx")

---

## 🟢 ONGOING — Content Strategy (Biggest Long-Term SEO Lever)

### Write arena-specific guides for each visited arena
_These are the pages fans actually search for. One guide per visited arena._

Format: `"[Arena Name] Guide — Visiting [Team] as a Fan"`
Examples:
- "Chase Center Guide — Visiting Golden State Warriors Arena"
- "What It's Like at State Farm Arena — Atlanta Hawks Game Day Tips"
- "Crypto.com Arena Review — Lakers Game Experience, Seats, Food & Parking"

Each guide should have:
- Location field filled in (matching arena location string)
- Tags with arena name + team name
- Links to your hotel and food reviews from that trip
- Links to the arena review page and city hub page

- [ ] Write guide for each visited arena (do one per week)

### YouTube optimization
- [ ] Retitle existing shorts to include arena name + keywords
      Example: "Chase Center Tour — Golden State Warriors Arena Experience | Meet the Whytes"
- [ ] For each new arena visit, publish a short with a keyword-rich title before writing the review
- [ ] Add a line inside arena review body content linking to your YouTube short for that arena

### Arena images
- [ ] Add alt text to arena images using the AI button in Studio
      Studio → each visited arena → each image → click "Generate with AI"

---

## 🔵 LOW — Nice to Have

- [ ] Test social sharing previews
      - Twitter: cards-dev.twitter.com/validator → paste any arena URL
      - Facebook: developers.facebook.com/tools/debug → paste any arena URL → "Scrape Again"
- [ ] Create a Google Business Profile for "Meet the Whytes" (business.google.com → Travel Blog / Media)
- [ ] Update arena excerpt in Studio after each new arena visit (~5 min post-visit)

---

## 📋 Reference — New Studio Fields Added This Session

| Field | Where | Purpose |
|-------|--------|---------|
| FAQs | Arena → scroll to bottom | 3–5 Q&As for Google rich results |
| Location | Guide → below Category | e.g. "Dallas, TX" — local SEO |

## 📋 Reference — New Pages Added This Session

| URL Pattern | Example | What It Shows |
|------------|---------|---------------|
| `/city/[slug]` | `/city/dallas-tx` | All content for that city: arena + hotels + food + guides |

City pages auto-generate from arena locations. Location strings in hotels/food/guides **must exactly match** the arena's location string to appear on the city page.
