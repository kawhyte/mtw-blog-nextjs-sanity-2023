# PLAN: Blog Image Fixes — Retina Sharpness, Arena Food Cards, Hotspot, Body-Image Cap

> Companion plan to the ImageRocket converter plans in
> `/Users/Kenny/Documents/Development/Image-converter/image-converter-pwa/` (PLAN-1…PLAN-5, PLANS-README.md).
> A copy of this file lives there as `PLAN-6-blog-image-fixes.md`. If you execute THIS plan,
> use the **"Converter preset coordination"** table below INSTEAD of PLAN-1's dimension table.

## Goal

Fix the four blog-side image problems that the converter cannot fix from its side:

1. **Retina softness**: `next.config.mjs` sets `images.unoptimized: true`, so the browser downloads exactly the `.width(N)` hard-coded in each component — no 2x srcset exists. Every hero/cover/card is fetched at 1x and renders soft on Retina/HDPI screens. Fix: raise the `.width()/.height()` calls to 2x and drop those images' quality param from 85 → 75 ("compressive images" technique — 2x pixels at q75 costs roughly the same bytes as 1x at q85 but looks sharp on retina).
2. **Arena food cards "look wrong"**: `ArenaFoodItems.tsx` uses a fixed-height container (`h-64` = 256px) with fluid width, so the same 3:2 photo is cropped ~3:2 on desktop, ~4:3 on tablet, and up to ~2.3:1 letterbox on mobile — the dish gets chopped differently per screen. Fix: fixed `aspect-[3/2]` box.
3. **Hotspot ignored on food-review dish cards**: `IndividualFoodRating.tsx` passes `item.asset._ref` (a string) to `urlForImage`, so the editor's hotspot never applies. Fix: pass the full image object.
4. **Body images are the heaviest fetch on the site**: `PostBody.tsx` requests images at their NATIVE upload dimensions. Fix: cap the request width at 1600 — this decouples page weight from whatever size gets uploaded.

Sanity does all resizing on the fly — no re-uploads are required for these changes to take effect (except where old sources are smaller than the new 2x request; see Edge cases).

## Files to touch

- `components/HeroPhotoGallery.tsx`
- `components/GuidePage.tsx`
- `components/ArenaViewFromSeat.tsx`
- `components/ArenaFoodItems.tsx`
- `components/IndividualFoodRating.tsx`
- `components/Gallery.tsx`
- `components/ImageGallery.tsx`
- `components/CoverImage.tsx`
- `components/PostBody.tsx`
- `components/ArenaPage.tsx` (team logo sizes only)
- `components/TravelEssentialsLayout.tsx` (mobile product size only)

Do NOT touch `next.config.mjs` (`unoptimized: true` stays — switching to Vercel image optimization is a separate cost/architecture decision), `lib/sanity.image.ts`, or any schema.

## Step-by-step implementation

Pattern for every step below: change ONLY the `.width()`, `.height()`, and `.quality()` numbers (or the SanityImage `width`/`height`/`quality` props) in the exact chain cited. Keep `.fit('crop')`, `.auto('format')`, ordering, and all other props identical. Where a chain has no explicit `.quality()`, it inherits q85 from `lib/sanity.image.ts` — add `.quality(75)` explicitly when the step says so.

1. **`components/HeroPhotoGallery.tsx`** (hotel/food/arena heroes):
   - Line ~60 (mobile main, container `h-96`): `.width(800).height(600).quality(85)` → `.width(1600).height(1200).quality(75)`
   - Line ~79-81 (desktop main, container `h-[550px]`): `.width(1200).height(800)` + `.quality(85)` → `.width(2400).height(1600)` + `.quality(75)`
   - Line ~101-103 (desktop side thumbs): `.width(600).height(400)` + `.quality(85)` → `.width(1200).height(800)` + `.quality(75)`

2. **`components/GuidePage.tsx`** (~line 83-84, guide cover):
   `.width(1200).height(630).quality(85)` → `.width(2400).height(1260).quality(75)`. Leave the `<Image width={1200} height={630}>` layout props alone — they only set the render box, not the fetch.

3. **`components/ArenaViewFromSeat.tsx`** (~line 176-181, seat tiles):
   `.width(600).height(450).quality(85)` → `.width(1200).height(900).quality(75)`

4. **`components/ArenaFoodItems.tsx`**:
   - Line 150: `<div className="relative h-64 w-full">` → `<div className="relative aspect-[3/2] w-full">`
   - Lines 153-156: `.width(900).height(600)` → `.width(1800).height(1200)`, and set `.quality(75)` (currently 85).
   - Keep `urlForImage(item)` (full object — hotspot already works here) and the `fill` + `object-cover` Image props.

5. **`components/IndividualFoodRating.tsx`** (food-review dish cards):
   - Line 159: `urlForImage(item.asset._ref)` → `urlForImage(item)` — this makes the editor's hotspot apply. Verify the surrounding code passes the full portable image object as `item` (it does — `item.asset._ref` exists, so `item` is the image object).
   - Lines 160-161: `.width(900).height(600)` → `.width(1800).height(1200)`, add `.quality(75)`.
   - Line 157: `h-64` → `aspect-[3/2]` (same fix as step 4 — this component has the identical fixed-height problem).

6. **`components/Gallery.tsx`** (~line 72-76) and **`components/ImageGallery.tsx`** (~line 138-142), inline masonry tiles:
   `.width(800).quality(85)` → `.width(1600).quality(75)`. There is no `.height()` in these chains — keep it that way (aspect preserved for masonry).

7. **`components/ImageGallery.tsx`** lightbox (~line 276-282): `<SanityImage image={item} width={1200} ...>` → `width={2400}` and add `quality={75}`.

8. **`components/CoverImage.tsx`** (~line 88-103, listing cards): `<SanityImage ... width={900} height={560}>` → `width={1800} height={1120}` and add `quality={75}`. Note `SanityImage` uses `fit('max')` (no crop) — unchanged; the numbers are a bounding box.

9. **`components/PostBody.tsx`** (body/portable-text images — the page-weight cap):
   Replace the native-size request:
   ```ts
   const { width, height } = getImageDimensions(value)
   ```
   …used as `.height(height).width(width)`, with a capped version:
   ```ts
   const { width, height } = getImageDimensions(value)
   const targetWidth = Math.min(width, 1600)
   const targetHeight = Math.round(targetWidth * (height / width))
   ```
   and request `.width(targetWidth).height(targetHeight).quality(75)`. Keep the `<Image>` layout props derived the same way they are today (they may keep using the native dims for aspect — fine).

10. **`components/ArenaPage.tsx`** team logos (2x the tiny circles): line ~153-158 `.width(22).height(22)` → `.width(44).height(44)`; line ~538-543 `48` → `96`; line ~646-651 `32` → `64`. Keep everything else; logos are small enough that quality stays default.

11. **`components/TravelEssentialsLayout.tsx`** mobile product image (~line 80-85): `.width(160).height(160)` → `.width(320).height(320)`. Desktop (~line 178-183, 800×800) unchanged.

## Converter preset coordination (supersedes PLAN-1's dimension table if this plan runs)

With the blog now fetching 2x, the converter presets must supply at least the largest fetch. In `image-converter-pwa/lib/utils.ts` use these values (everything else in PLAN-1 — q82, descriptions, rationale comment, guide updates — still applies):

| preset key | value if this blog plan is EXECUTED | (PLAN-1 value if blog stays 1x) |
|---|---|---|
| `hotel_food_cover` | **2400×1600 q82** | 1600×1067 q82 |
| `travel_guide_cover` | **2400×1260 q82** | 1600×840 q82 |
| `arena_hero` | **2400×1600 q82** | 1600×1067 q82 |
| `seat_view` | **1200×900 q82** (unchanged either way) | 1200×900 q82 |
| `gallery` | **maxEdge 2400 q82** (covers 2400 lightbox; PostBody is now capped at 1600 so this is safe) | maxEdge 1600 q82 |
| `card_items` | **1800×1200 q82** | 900×600 q82 |
| `team_logos` / `product_images` | unchanged | unchanged |

Recommended order: execute this blog plan FIRST, then PLAN-1 with the left-hand column, then PLAN-2…5 as ranked.

## Edge cases a weaker model would miss

- **Sanity never upscales.** Existing images uploaded at the old smaller sizes (e.g. a 1200×800 hero) will simply be served at their maximum available size when 2400×1600 is requested — no error, no distortion, just no sharpness gain until that image is re-uploaded larger. Do not "fix" this; it degrades gracefully.
- **`fit('crop')` + hotspot only works with the full image object.** Never "simplify" a `urlForImage(item)` call to `urlForImage(item.asset._ref)` or `.asset` — that silently drops hotspot data (that's exactly the bug in step 5).
- **The `sizes` prop and `<Image width/height>` layout props do NOT control what's downloaded** under `unoptimized: true` — only the Sanity URL params do. Don't waste time editing `sizes` attributes.
- **`SanityImage.tsx` uses `fit('max')`** inherited from the global builder — passing width/height to it is a bounding box, not a crop. Steps 7–8 intentionally keep that behavior.
- **Mobile data cost**: with no srcset, phones also download the 2x widths. The q75 drop offsets this — total bytes land near the old 1x@q85. Do not raise quality back to 85 on the doubled images.
- **`aspect-[3/2]` vs `h-64`**: after step 4/5 the food cards grow taller on wide single-column mobile layouts (width/1.5 instead of fixed 256px). This is intended — verify the grid still looks right at 375px, 768px, and 1280px widths.
- **PostBody aspect math**: `getImageDimensions` comes from `@sanity/asset-utils` and returns the ORIGINAL dims (post-crop). Compute `targetHeight` from the original ratio as shown; do not hardcode a ratio.
- **Division by zero**: `getImageDimensions` always returns positive dims for a valid image asset; no guard needed, but keep `Math.min` so small images aren't upscaled requests.
- **Do not touch the OG/structured-data `width(1200).height(630)` calls** (`HotelReviewPage.tsx`, `FoodReviewPage.tsx`, `ArenaStructuredData.tsx`, `*PageHead.tsx`, the `<link rel="preload">` in `pages/arena/[slug].tsx`) — social-card crawlers want ~1200px, and doubling them buys nothing.

## Acceptance criteria

1. `npm run build` (or this repo's build command) passes; `npm run lint` passes if configured.
2. `npm run dev`, then in Chrome DevTools → Network → Img, filtered to `cdn.sanity.io`:
   - A hotel page hero URL contains `w=2400&h=1600` and `q=75`.
   - An arena food card URL contains `w=1800&h=1200&q=75` and (for an image with a hotspot set) `fp-x`/`rect` params reflecting the hotspot.
   - A body image inside an article contains `w=1600` (not the native upload width) — check on a post whose upload was >1600 wide.
   - A guide cover contains `w=2400&h=1260&q=75`.
3. Arena page food grid: at 375px, 768px, and 1280px viewport widths every card image box is 3:2 (measure in DevTools — width ÷ height ≈ 1.5 at all three), and the visible crop of one test image is the same framing at all three widths.
4. Food-review page dish cards: an image whose Sanity hotspot is set off-center visibly re-frames toward the hotspot (compare before/after or against the arena food card of the same image).
5. On a Retina display, a hero image is noticeably sharper than the production site; total transferred bytes for the hero (DevTools "Size" column) is within ~±30% of production's current hero.
6. OG tags unchanged: view-source on a hotel page still shows `w=1200&h=630` in the `og:image` URL.
