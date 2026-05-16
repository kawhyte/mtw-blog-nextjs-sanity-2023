# SEO Handoff — Meet the Whytes (meetthewhytes.com)

## What This Project Is
Next.js 13 (Pages Router) + Sanity CMS travel blog. Primary SEO goal: rank for **NBA/WNBA arena tips and experiences** — visiting every NBA & WNBA arena in the US and Canada. Secondary: hotel, food, and travel reviews tied to those arena trips.

---

## ✅ FULLY COMPLETED (Both Sessions)

### Session 1 — Arena SEO Fixes
- **Arena page titles fixed** — were showing just site name. Fixed by mapping `title: arena.name` in `ArenaPage.tsx`.
- **Arena canonical URLs fixed** — were using `/posts/` prefix. Fixed with `contentType="arena"` in PostPageHead.
- **ArenaStructuredData added** — `components/ArenaStructuredData.tsx` emits `SportsActivityLocation` + `Review` JSON-LD (powers star ratings in SERPs).
- **Arena listing page (`/arenas`)** — replaced basic Head with `CategoryPageHead` (full OG, Twitter, canonical, ItemList schema).
- **Organization sameAs** — YouTube + Instagram added to `IndexPageHead.tsx`.
- **GA4 added** — in `pages/_app.tsx`. Measurement ID: `G-7D2PT1D9M6`. GA4 linked to Search Console.
- **Web Vitals reporting** — `reportWebVitals` exports LCP, CLS, FID to GA4.
- **Arena excerpt field** — `excerpt` (string, max 155 chars) added to `schemas/nbaArenas.ts`. All 38 arenas have human-written SEO excerpts (run via `scripts/add-arena-excerpts.mjs`).

### Session 2 — Internal Links, Alt Text AI, SEO Excerpts, Cleanup
- **Internal links (hotel/food → arena)** — `nearestArena` reference field added to `hotelReview.ts` and `foodReview.ts`. `NearestArenaLink` component displays a card linking to the nearest arena on every hotel and food review page. GROQ queries updated.
- **Gemini AI "Generate with AI" button** — `plugins/AltTextGeneratorInput.tsx` + `pages/api/generate-alt-text.ts` (uses `gemini-3.1-flash-lite`). Button appears below every `alt` text field in Sanity Studio. Click → Gemini analyzes the image → fills in SEO-rich alt text. Working and tested.
- **alt text fields added to coverImage** — `hotelReview` and `foodReview` `coverImage` fields previously had no `alt` field. Now added with AI button.
- **NBA Arena Road Trip Guide** — 2,500-word hub article created as **unpublished Sanity draft** (ID: `VnnbDxNmge33QNjwt44eoF`). Includes photo/video placeholders throughout. Open in Studio → Guides → publish after adding real photos and personal touches.
- **seoExcerpt field** — plain string (max 155 chars) added to `hotelReview` and `foodReview` schemas. Wired into GROQ queries, TypeScript interfaces, and `PostPageHead` priority chain (takes priority over `excerpt2` fallback for meta descriptions).
- **Global search bug fixed** — `globalSearchQuery` was searching `excerpt2` on guides but guides use `summary`. Fixed.
- **Guide schema already correct** — `summary` field (max 160 chars, labeled "Summary / Meta Description") already serves as the SEO meta description for guide pages. No changes needed.

---

## ⚠️ SCRIPTS READY — NOT YET RUN LIVE

These scripts are written, dry-run verified, and ready to execute. Run them in order.

### 1. Fix null fields + orphaned Robes data (run first, fast)
```
npm run fix-null-fields:live
```
**What it does:** Cleans 163 hotel/food review documents that have optional array fields stored as `null` (causes Studio warnings). Also removes the orphaned `roomAmenities.Robes` field from 2 hotel documents (Grand Hyatt Washington, Hyatt Regency Dulles). **Zero content is deleted** — only null placeholders are removed.

### 2. Bulk SEO excerpt generator (run second, ~26 min total)
```
npm run generate-seo-excerpts:live
```
**What it does:** Uses Gemini to write a 120–155 char, human-sounding `seoExcerpt` for every published hotel and food review. Dry run showed 150 generated, 13 Gemini rate-limit errors. **Run it twice** — second pass auto-catches the 13 that errored (script skips docs that already have seoExcerpt).

### 3. Bulk alt text generator (optional, ~17 min)
```
npm run generate-alt-text:live
```
**What it does:** Uses Gemini vision to generate alt text for every published arena/hotel/food image that has no alt text. Covers `arenaImage`, `imageGallery[]`, `coverImage`, `gallery[]`. Does NOT cover `content[]` embedded images (do those manually in Studio).

---

## 🔴 STILL NEEDS CODE WORK

### Vercel Speed Insights
**Priority: MEDIUM**
One component added to `pages/_app.tsx`. Gives real-user Core Web Vitals (LCP, CLS, FID) on the Vercel dashboard. Tells you exactly which pages load slowly on mobile.

Tell Claude: *"Add Vercel Speed Insights to `pages/_app.tsx` — no new npm packages, use the `@vercel/speed-insights/next` package which is already available on Vercel."*

---

## 🟡 YOU DO THESE (No Code Needed)

### HIGH
**1. Request GSC re-indexing for arena pages**
- Go to search.google.com/search-console → URL Inspection
- Paste each arena URL → "Request Indexing"
- Priority: arenas you've already visited first
- ~2 min per arena

**2. Add alt text to arena images in Studio**
- Now has an AI button — just click "Generate with AI" on each arena image's alt field
- Start with visited arenas
- ~1 min per arena

**3. Delete duplicate arena documents**
- Studio → Arenas → delete duplicates for: **American Airlines Center**, **Frost Bank Center**, **Toyota Center**
- Keep the one with more complete data
- ~5 min

**4. Delete test document "yesy"**
- Studio → Food Reviews → delete the document titled "yesy" with location "ssxasxsx" (test/placeholder data)

### MEDIUM
**5. Publish the NBA Arena Road Trip Guide**
- Studio → Guides → find "The NBA Arena Road Trip Guide" (unpublished draft)
- Replace the `📷 [add photo here]` and `🎥 [add video here]` callout boxes with real images/videos
- Add your personal voice / edits
- Set `publishedAt` → Publish
- The guide links internally to 11 arena review pages (SEO benefit kicks in on publish)

**6. Update arena excerpts when you visit a new arena**
- After each new visit, go to Studio → that arena → update the "SEO Excerpt" field with a first-person experience-based sentence
- ~5 min per arena post-visit

**7. Fill in seoExcerpt for hotel/food reviews (or let the bulk script do it)**
- If you've already run `npm run generate-seo-excerpts:live`, the field is auto-filled for all published docs
- Review a few in Studio to confirm quality
- Update any you don't like (the script never overwrites a field that's already filled)

### LOW
**8. Test social sharing previews**
- Twitter/X: cards-dev.twitter.com/validator → paste any arena URL
- Facebook: developers.facebook.com/tools/debug → paste any arena URL → "Scrape Again"

**9. Create a Google Business Profile**
- business.google.com → create profile for "Meet the Whytes" as Travel Blog / Media
- Add site URL, YouTube, Instagram

---

## Key Architecture Notes (for new context window)

### Content Types & Schemas
| Type | Schema | Key Fields |
|---|---|---|
| Arena | `schemas/nbaArenas.ts` | `name` (NOT `title`), `slug`, `excerpt` (SEO, 155 chars), `arenaImage`, `imageGallery[]` |
| Hotel Review | `schemas/hotelReview.ts` | `title`, `excerpt2` (rich summary), `seoExcerpt` (SEO meta, 155 chars), `coverImage`, `nearestArena` |
| Food Review | `schemas/foodReview.ts` | `title`, `excerpt2`, `seoExcerpt` (SEO meta, 155 chars), `coverImage`, `nearestArena` |
| Guide | `schemas/guide.ts` | `title`, `summary` (SEO meta, 160 chars — already the meta description) |
| Travel Essentials | `schemas/travelEssentials.ts` | `name`, `whyWePack`, `tripType` — no individual pages, no SEO excerpt needed |

### PostPageHead Meta Description Priority
1. `summary` → guides
2. `excerpt` → arenas
3. `seoExcerpt` → hotels/food (when filled)
4. `excerpt2` stripped to plain text → hotels/food fallback
5. Site description fallback

### SEO Components
| Component | Used On |
|---|---|
| `IndexPageHead` | Homepage |
| `PostPageHead` | All individual review/arena pages |
| `CategoryPageHead` | Listing pages (/arenas, /hotels, /food, /guides) |
| `ArenaStructuredData` | Arena individual pages (SportsActivityLocation + Review JSON-LD) |
| `ReviewStructuredData` | Hotel + food individual pages |
| `BreadcrumbStructuredData` | All pages |
| `NearestArenaLink` | Hotel + food review pages (internal link card to nearest arena) |

### Gemini AI Integration
- **API key**: `GEMINI_API_KEY` in `.env.local` (server-side only, never `NEXT_PUBLIC_`)
- **Model**: `gemini-3.1-flash-lite` (GA May 7 2026, free tier, 15 req/min)
- **Studio button**: `plugins/AltTextGeneratorInput.tsx` — appears on every `alt` text field in Studio
- **API proxy**: `pages/api/generate-alt-text.ts` — converts Sanity asset `_ref` to CDN URL, fetches image, calls Gemini
- **Bulk scripts**: `scripts/generate-alt-text.mjs` (images), `scripts/generate-seo-excerpts.mjs` (text excerpts)

### Critical Arena Detail
- Arena schema uses `name` field, not `title`. Always map `title: arena.name` when passing to PostPageHead.
- Queries: `arenaFieldsDetailed` (individual pages), `arenaFields` (listing), `arenaFieldsSitemap` (sitemap)

### Migration Script Pattern
All scripts follow: dry run by default, `--no-dry-run` for live, rate-limited to 12 req/min.

### Sanity Project
- Project ID: `k5e2zsor`
- Dataset: `production`
- Studio: `http://localhost:3000/studio` (local) or `https://www.meetthewhytes.com/studio` (prod)

### Analytics
- Umami (privacy analytics) + GA4 (`G-7D2PT1D9M6`) both active in `pages/_app.tsx`
- GA4 linked to Google Search Console
- Sitemap at `/sitemap.xml` — 181 pages, submitted to GSC

---

## All Scripts Reference
```
npm run generate-alt-text          # Dry run — bulk alt text for all images
npm run generate-alt-text:live     # Live — write alt text to Sanity

npm run generate-seo-excerpts      # Dry run — bulk SEO excerpts for hotel/food
npm run generate-seo-excerpts:live # Live — write SEO excerpts to Sanity

npm run fix-null-fields            # Dry run — show null fields + Robes orphan
npm run fix-null-fields:live       # Live — clean up null fields from all documents

npm run add-arena-excerpts         # Dry run — (already run, skip)
npm run fix-arena-teams            # Dry run — (already run, skip)
```
