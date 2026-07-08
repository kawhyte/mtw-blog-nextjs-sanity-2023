# PLAN: Stop Over-Fetching — Card-Only GROQ Fragments for List/Top/Search/Home Queries

## 1. The Goal

Listing, top-picks, homepage, and search queries currently embed the FULL detail fragments (`independentHotelReviewFields` / `independentFoodReviewFields` / `independentGuideFields`), which include `content` (entire Portable Text body), `gallery[]` (every photo with metadata), `verdict`, `positives`, `negatives`, `revisits[]`, `roomAmenities`, and `techRating`. Card components only render title/image/rating/date/location. This plan adds lightweight `hotelCardFields` and `foodCardFields` fragments (mirroring the existing `guideCardFields` pattern) and uses them in every list-context query. Done = all listing/top/home/search pages render identically while their Sanity payloads shrink dramatically (roughly 5–20× smaller per item).

## 2. Exact Files to Touch

- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/lib/sanity.queries.ts` — add `hotelCardFields`, `foodCardFields`, and `guideCardFieldsWithType`; switch 7 list-context queries to them.
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/lib/sanity.client.ts` — switch the 2 inline paginated queries to the new card fragments.

No other files change. Detail pages (`hotelReviewBySlugQuery`, `foodReviewBySlugQuery`, `guideBySlugQuery`) keep the full fragments — do NOT touch them.

## 3. Step-by-Step Implementation Order

1. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/lib/sanity.queries.ts`, find the existing block (currently at line 343):
   ```ts
   // Lightweight fields for listing/card pages (no content body, no gallery)
   export const guideCardFields = groq`
   ```
   Immediately AFTER the closing backtick of `guideCardFields` (the line containing only `` ` `` after `coverImage { ... }`), add these two exports:
   ```ts
   // Lightweight hotel fields for listing/card pages.
   // Excludes heavy detail-only fields: content, gallery, verdict, positives,
   // negatives, revisits[], roomAmenities, techRating, tip, youtube,
   // blurbSource, blurbUrl, nearestArena, resortFee, parking, breakfast.
   export const hotelCardFields = groq`
     _id,
     title,
     date,
     location,
     category,
     room,
     lounge,
     coverImage {
       ...,
       asset->{ _id, metadata { lqip, dimensions { width, height } } }
     },
     excerpt2,
     seoExcerpt,
     hotelRating,
     "internetSpeed": coalesce(hotelRating.internetSpeed, internetSpeed),
     tags,
     wouldReturn,
     priceTier,
     bestFor,
     "slug": slug.current,
     "updatedAt": _updatedAt,
     "revisitCount": count(revisits)
   `

   // Lightweight food fields for listing/card pages.
   // Excludes heavy detail-only fields: content, gallery, verdict, positives,
   // negatives, revisits[], tip, youtube, nearestArena.
   export const foodCardFields = groq`
     _id,
     title,
     date,
     location,
     diningType,
     coverImage {
       ...,
       asset->{ _id, metadata { lqip, dimensions { width, height } } }
     },
     excerpt2,
     seoExcerpt,
     individualFoodRating,
     foodRating,
     takeoutRating,
     tags,
     priceTier,
     "slug": slug.current,
     "updatedAt": _updatedAt,
     "revisitCount": count(revisits)
   `
   ```
   IMPORTANT: `hotelRating`, `foodRating`, and `takeoutRating` MUST stay in the card fragments — `getTopWeightedHotelReviews` / `getTopWeightedFoodReviews` in `lib/sanity.client.ts` compute weighted scores from them, and `DynamicPostCard` renders the rating overlay from them.

2. Same file: in `allHotelReviewsQuery` (currently line 472) replace `${independentHotelReviewFields}` with `${hotelCardFields}`.

3. Same file: in `topHotelReviewsQuery` (currently line 479) replace `${independentHotelReviewFields}` with `${hotelCardFields}`.

4. Same file: in `hotelReviewsByCategoryQuery` (currently line 486) replace `${independentHotelReviewFields}` with `${hotelCardFields}`.

5. Same file: in `topFoodReviewsQuery` (currently line 544) replace `${independentFoodReviewFields}` with `${foodCardFields}`.

6. Same file: in `allFoodReviewsQuery` (currently line 561) replace `${independentFoodReviewFields}` with `${foodCardFields}`.

7. Same file: in `foodReviewsByDiningTypeQuery` (currently line 568) replace `${independentFoodReviewFields}` with `${foodCardFields}`.

8. Same file: in `latestIndependentContentQuery` (currently line 746), replace all three fragment interpolations:
   - `${independentGuideFields},` → `${guideCardFields},`
   - `${independentHotelReviewFields},` → `${hotelCardFields},`
   - `${independentFoodReviewFields},` → `${foodCardFields},`
   Keep the trailing `_type` projections exactly as they are.

9. Same file: in `globalSearchQuery` (currently line 787), replace:
   - `${independentHotelReviewFields},` → `${hotelCardFields},`
   - `${independentFoodReviewFields},` → `${foodCardFields},`
   - `${independentGuideFields},` → `${guideCardFields},`
   Do NOT change the `arenas` section (`${arenaFields}`) — `NBAArenaCard` in `pages/search.tsx` uses `firstGalleryImage`, `buildDate`, `capacity`, `visited`, which are projected by `arenaFields`.
   NOTE: `globalSearchQuery`'s guide filter uses `summary match $searchTerm`, and `guideCardFields` already projects `summary` — no change needed there.

10. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/lib/sanity.client.ts`:
    - In `getPaginatedFoodReviews` (currently line ~157), the inline template query interpolates `${independentFoodReviewFields}` — replace with `${foodCardFields}`.
    - In `getPaginatedHotelReviews` (currently line ~725), replace `${independentHotelReviewFields}` with `${hotelCardFields}`.
    - Update the import block at the top of the file (`from 'lib/sanity.queries'`) to import `foodCardFields` and `hotelCardFields` (add them alphabetically; `guideCardFields` is already imported for `getPaginatedGuides`).
    - Do NOT change `getGuideBySlug` / `getHotelReviewBySlug` / `getFoodReviewBySlug` / `getArenaBySlug` — detail pages need full fragments. Note these functions have an optional `token` parameter for draft preview; leave that intact.

11. Run `npm run type-check` then `npm run build`. Both must pass with zero errors.

## 4. Edge Cases

- **Top-list score computation:** `getTopWeightedHotelReviews` (lib/sanity.client.ts ~line 594) and `getTopWeightedFoodReviews` (~line 641) fetch `topHotelReviewsQuery`/`topFoodReviewsQuery` then compute `calculatedRating` in JS from `hotelRating` / `foodRating` / `takeoutRating` / `diningType`. If any of those four fields is dropped from the card fragments, the `/top-hotel-picks` and `/top-restaurant-picks` pages silently show `0.0` scores. They are included in the fragments above — do not remove them.
- **`revisitCount` vs `revisits[]`:** `DynamicPostCard` renders a "Revisited" badge from `revisitCount` (a computed `count(revisits)`), NOT from the `revisits[]` array. The card fragments keep `"revisitCount": count(revisits)` while dropping the array — this is intentional, keep both halves of that decision.
- **`_type` discriminator on the homepage:** `latestIndependentContentQuery` appends `_type` after each fragment interpolation and the homepage uses it to route hrefs. The card fragments do not project `_type` themselves, so the existing trailing `, _type` in that query is load-bearing — do not delete it.
- **Search page casts:** `pages/search.tsx` (lines ~217-290) accesses `excerpt2`, `category`, `location`, `hotelRating`, `foodRating`, `takeoutRating`, `diningType` on results via `'field' in result` guards. All are present in the card fragments. `_contentType` is projected separately in `globalSearchQuery` — unchanged.
- **Preview mode listing components:** `components/HotelReviewsPage.tsx` and `components/FoodReviewsPage.tsx` fetch via SWR + `getPaginatedHotelReviews`/`getPaginatedFoodReviews` API routes. They render `DynamicPostCard` only — no detail fields. Safe.
- **TypeScript interfaces are all-optional:** `HotelReview`/`FoodReview`/`Guide` interfaces in `lib/sanity.queries.ts` declare every field optional (`title?`, `content?`, …), so removing fields from list payloads produces NO type errors. This means the compiler will NOT catch an accidentally-dropped field — the acceptance criteria's visual checks below are the real safety net.

## 5. Acceptance Criteria

### Feature works
- [ ] Run `npm run type-check` → exits 0, no output errors.
- [ ] Run `npm run build` → completes with zero errors; `/hotels`, `/food`, `/guides`, `/top-hotel-picks`, `/top-restaurant-picks`, `/` all appear in the build output.
- [ ] Run `npm run dev`, open `http://localhost:3000/hotels` → hotel cards render with cover image, title, rating badge (e.g. "8.4/10"), location, date, and "Revisited" badge where applicable. Open DevTools Network tab, find the Sanity API request — the response no longer contains `"content"` or `"gallery"` keys for list items.
- [ ] Open `http://localhost:3000/top-hotel-picks` → 10 hotels listed with NON-ZERO score badges (proves `hotelRating` still fetched).
- [ ] Open `http://localhost:3000/top-restaurant-picks` → 10 restaurants with non-zero scores (proves `foodRating`/`takeoutRating`/`diningType` still fetched).
- [ ] Open `http://localhost:3000/search`, search "hotel" → mixed results render as cards with images and ratings.
- [ ] Open `http://localhost:3000/` → "latest content" section renders 6 cards with correct links (hotel links go to `/hotel/...`, food to `/food/...`, guides to `/guide/...`).

### Nothing broke (regression check)
- [ ] `npm run lint` passes.
- [ ] Open any hotel DETAIL page, e.g. `http://localhost:3000/hotel/grand-hyatt-washington-review` → full body content, photo gallery, positives/negatives, and verdict all still render (detail queries untouched).
- [ ] Open any food detail and guide detail page → same: full content + gallery render.
