# SEO Handoff — Meet the Whytes (meetthewhytes.com)

## What This Project Is
Next.js 13 (Pages Router) + Sanity CMS travel blog. Primary SEO goal: rank for **NBA/WNBA arena tips and experiences** — we are visiting every NBA & WNBA arena in the US and Canada. Secondary: hotel, food, and travel reviews tied to those arena trips.

---

## What Was Completed This Session

### Critical Bug Fixes
- **Arena page titles were broken** — every arena page was showing just the site name as its `<title>` because `PostPageHead` checked `post.title` but the Arena schema uses `name` not `title`. Fixed in `components/ArenaPage.tsx:195` by mapping `{ ...arena, title: arena.name }`.
- **Arena canonical URLs were wrong** — were pointing to `/posts/` prefix. Fixed by adding `contentType="arena"` to PostPageHead, which now routes to `/arena/`.
- **Arena pages had no Review structured data** — hotels and food pages had `ReviewStructuredData` but arenas had nothing. Fixed by creating `components/ArenaStructuredData.tsx` which emits `SportsActivityLocation` + `Review` JSON-LD schema (powers star ratings in Google SERPs).
- **Arena listing page (`/arenas`) was missing OG/Twitter tags** — replaced basic `<Head>` with `CategoryPageHead categoryType="arenas"` which has full OG, Twitter, canonical, and ItemList schema.
- **Organization `sameAs` was empty** — added YouTube + Instagram to `components/IndexPageHead.tsx`.

### Analytics
- **GA4 added** — `pages/_app.tsx` now loads GA4 (gated on `NEXT_PUBLIC_GA4_ID` env var). Measurement ID: `G-7D2PT1D9M6` — already added to `.env.local` and Vercel env vars.
- **Web Vitals reporting** — exported `reportWebVitals` from `_app.tsx` to send LCP, CLS, FID to GA4.
- **GA4 linked to Google Search Console** — done manually. Sitemap (`/sitemap.xml`) already submitted and healthy (181 pages, crawled daily).

### Arena Schema — Excerpt Field
- Added `excerpt` (string, max 155 chars) to `schemas/nbaArenas.ts` — shows in Sanity Studio below the Location field.
- Added `excerpt` to GROQ query `arenaFieldsDetailed` in `lib/sanity.queries.ts`.
- Added `excerpt?: string` to `Arena` TypeScript interface.
- Updated `components/PostPageHead.tsx` description logic for arenas: editor-written excerpt → auto-generated from location/capacity → site fallback.
- **Ran migration script** (`scripts/add-arena-excerpts.mjs`) — all 38 arenas now have unique, human-written, SEO-rich excerpts written directly into Sanity. Barclays Center was the test arena (already had excerpt, was skipped).

### Files Modified
| File | Change |
|------|--------|
| `components/PostPageHead.tsx` | Added `arena` contentType, title template, description fallback, `/arena` URL prefix, `LocalBusiness` JSON-LD type |
| `components/ArenaPage.tsx` | Fixed PostPageHead props (name→title mapping, contentType="arena"); added ArenaStructuredData |
| `components/ArenaStructuredData.tsx` | NEW — SportsActivityLocation + Review JSON-LD schema |
| `pages/arenas.tsx` | Replaced basic Head with CategoryPageHead |
| `components/IndexPageHead.tsx` | Added YouTube + Instagram to sameAs |
| `pages/_app.tsx` | Added GA4 scripts + reportWebVitals export |
| `schemas/nbaArenas.ts` | Added `excerpt` field |
| `lib/sanity.queries.ts` | Added `excerpt` to query + Arena interface |
| `scripts/add-arena-excerpts.mjs` | NEW — one-time migration script (already run) |
| `package.json` | Added `add-arena-excerpts` + `add-arena-excerpts:live` npm scripts |
| `.env.local` | Added `NEXT_PUBLIC_GA4_ID=G-7D2PT1D9M6` |

---

## What Still Needs to Be Done
> Ranked from Critical → Low. Each item lists who does it (you vs. code change) and exactly how to get it done.

---

### 🔴 CRITICAL

**1. Request indexing for every arena page in Google Search Console (YOU DO THIS)**
- **Why critical:** Google has old/broken titles cached for all arena pages. Until you request indexing, search results still show the wrong title. This is the fastest way to get the SEO fixes live on Google.
- **How to do it:**
  1. Go to search.google.com/search-console
  2. Click "URL Inspection" in the left sidebar
  3. Paste `https://www.meetthewhytes.com/arena/barclays-center` → hit Enter
  4. Click "Request Indexing"
  5. Repeat for every arena URL (priority: arenas you've already visited first)
- **Time:** ~2 minutes per arena. Do your top 10 visited arenas first.

**2. Add alt text to every arena image in Sanity Studio (YOU DO THIS)**
- **Why critical:** Google Images is a real traffic source for travel content. Every image without alt text is invisible to Google. Also required for accessibility compliance.
- **How to do it:**
  1. Open Sanity Studio → go to an arena document
  2. Click the main Arena Image
  3. Fill in the "Alternative Text" field
  4. Format: `"Interior view of Barclays Center arena in Brooklyn, NY"`
  5. Repeat for every arena's main image and gallery images
- **What NOT to write:** `"arena"`, `"image"`, or leaving it blank.
- **Time:** ~3 minutes per arena. Start with visited arenas.

---

### 🟠 HIGH

**3. Build internal links — hotel/food reviews linking to nearest arena (CODE CHANGE NEEDED)**
- **Why high:** Internal links pass PageRank (Google ranking power) from your hotel/food pages to your arena pages. Right now those pages are isolated. Linking them tells Google your arenas are the most important content on the site.
- **How Claude does it:** Add a "Nearest Arena" reference field to the hotel and food Sanity schemas, then display a link in `HotelReviewPage.tsx` and `FoodReviewPage.tsx`. Tell Claude: *"Implement #3 from SEO-HANDOFF.md — build internal links between hotel/food reviews and their nearest arena."*
- **Time:** 1 coding session.

**4. Clean up duplicate arena documents in Sanity (YOU DO THIS)**
- **Why high:** Duplicate documents confuse Google (two URLs with identical content = duplicate content penalty risk) and make your CMS messy.
- **How to do it:**
  1. Open Sanity Studio → Arenas
  2. Find and delete the duplicate drafts for: **American Airlines Center**, **Frost Bank Center**, **Toyota Center** (each appears twice)
  3. Keep the one that has the most complete data, delete the other
- **Time:** 5 minutes total.

**5. Write a long-form "NBA Arena Road Trip Guide" article (YOU DO THIS)**
- **Why high:** A 2,000–3,000 word guide is the single biggest organic traffic opportunity on the site. It targets head keywords like "visiting every NBA arena" and "NBA arena road trip" that your individual arena pages can't rank for alone. Sports blogs will link to it.
- **How to do it:** Write a guide in Sanity Studio (as a travel guide post) covering:
  - How to plan a multi-city NBA arena road trip
  - Estimated costs per city (flights, hotel, tickets)
  - Which arenas are best for food / atmosphere / first-timers
  - Tips: best seats, when to arrive, what to bring
  - Link to your individual arena review pages throughout
- **Target keywords:** "visiting every NBA arena", "NBA arena road trip", "best NBA arenas to visit", "NBA arena bucket list"
- **Time:** 2–4 hours of writing.

---

### 🟡 MEDIUM

**6. Add Vercel Speed Insights (CODE CHANGE NEEDED)**
- **Why medium:** Gives you real-user Core Web Vitals (LCP, CLS, FID) broken down by page on your Vercel dashboard. Slow pages hurt rankings — this tells you exactly which pages to fix.
- **How Claude does it:** One package install + one component added to `pages/_app.tsx`. Tell Claude: *"Implement #6 from SEO-HANDOFF.md — add Vercel Speed Insights."*
- **Time:** 15 minutes.

**7. Update arena excerpts when you visit a new arena (YOU DO THIS)**
- **Why medium:** The excerpts for unvisited arenas are written timelessly (no "bucket list" language) but once you visit, a first-person experience-based excerpt is stronger for SEO and click-through rates.
- **How to do it:** After visiting an arena, go to Sanity Studio → that arena → update the "SEO Excerpt" field with something experience-based like the visited arena examples.
- **Time:** 5 minutes per arena after visiting.

---

### 🟢 LOW

**8. Test social sharing previews (YOU DO THIS)**
- **Why low:** Ensures your OG/Twitter images and titles look correct when someone shares an arena page on social media.
- **How to do it:**
  - Twitter/X: Go to cards-dev.twitter.com/validator → paste any arena URL
  - Facebook: Go to developers.facebook.com/tools/debug → paste any arena URL → click "Scrape Again"
- **Time:** 10 minutes.

**9. Add hreflang for Canadian arenas (CODE CHANGE NEEDED — future)**
- **Why low:** Only relevant if you ever publish bilingual content for Toronto (Scotiabank Arena / Raptors). Skip for now.

**10. Create a Google Business Profile for Meet the Whytes (YOU DO THIS)**
- **Why low:** Adds your site to Google's knowledge graph. Helps with branded searches ("Meet the Whytes") showing a sidebar panel.
- **How to do it:** Go to business.google.com → create a profile for "Meet the Whytes" as a Travel Blog / Media company → add your site URL, YouTube, and Instagram.

---

## Key Architecture Notes for New Context

- **Arena slug pages**: `pages/arena/[slug].tsx` → renders `components/ArenaPage.tsx`
- **Arena uses `name` not `title`** — critical: always map `title: arena.name` when passing arena to PostPageHead
- **SEO components**: `IndexPageHead` (homepage), `PostPageHead` (all individual pages), `CategoryPageHead` (listing pages), `ArenaStructuredData` (arena-specific JSON-LD), `ReviewStructuredData` (hotel/food JSON-LD), `BreadcrumbStructuredData` (all pages)
- **Analytics**: Umami (privacy) + GA4 (`G-7D2PT1D9M6`) both active in `pages/_app.tsx`
- **Sanity schema**: arenas use `schemas/nbaArenas.ts`, queries in `lib/sanity.queries.ts` (`arenaFieldsDetailed` for individual pages, `arenaFields` for listing)
- **Migration scripts**: follow pattern of `scripts/fix-arena-team-names.mjs` — dry run by default, `--no-dry-run` for live
- **Excerpt field**: `excerpt` (string, max 155 chars) — appears below Location in Sanity Studio for each arena

---

## Sanity Project Info
- Project ID: `k5e2zsor`
- Dataset: `production`
- Studio: `http://localhost:3000/studio` (local) or `https://www.meetthewhytes.com/studio` (prod)
