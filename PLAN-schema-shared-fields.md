# PLAN: Extract Shared Sanity Schema Field Factories (positives / negatives / verdict / gallery)

## 1. The Goal

`schemas/hotelReview.ts` (703 lines) and `schemas/foodReview.ts` (637 lines) contain near-identical inline definitions of `positives`, `negatives`, `verdict`, and `gallery` — differing only in the subject noun ("hotel" vs "restaurant"), the verdict character limit (1200 vs 600), and the gallery photo-category list. This plan extracts parameterized factory functions into a new `schemas/sharedReviewFields.ts` and replaces the inline definitions, so future editors change the shared behavior in ONE place. Done = both schemas use the factories, the Studio renders identically, and no stored content changes shape (this is a pure code refactor — field `name`s, `type`s, and validation stay byte-equivalent in behavior).

**Scope guard:** do NOT touch `schemas/nbaArenas.ts` (its positives/negatives/verdict are nested inside a different object structure) or `schemas/guide.ts` (its gallery has a different field shape). Those can adopt the factories later.

## 2. Exact Files to Touch

- CREATE `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/schemas/sharedReviewFields.ts` — the field factories.
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/schemas/hotelReview.ts` — replace 4 inline fields with factory calls.
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/schemas/foodReview.ts` — same.

## 3. Step-by-Step Implementation Order

1. Create `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/schemas/sharedReviewFields.ts` with exactly:
   ```ts
   import { defineField } from 'sanity'
   import { AltTextGeneratorInput } from '../plugins/AltTextGeneratorInput'
   import { CaptionGeneratorInput } from '../plugins/CaptionGeneratorInput'
   import { VerdictGeneratorInput } from '../plugins/VerdictGeneratorInput'
   import { getPortableTextLength } from './utils'

   /** e.g. 'hotel' | 'restaurant' — used only in editor-facing descriptions */
   type Subject = string

   export const positivesField = (subject: Subject) =>
     defineField({
       title: 'Positives',
       name: 'positives',
       description: `Add multiple positive points about this ${subject}. Aim for 1–2 short sentences per point (under 150 chars each).`,
       type: 'array',
       of: [{ type: 'text' }],
       validation: (Rule) =>
         Rule.min(1).error('Please add at least one positive point'),
     })

   export const negativesField = (subject: Subject) =>
     defineField({
       title: 'Negatives',
       name: 'negatives',
       description: `Add multiple negative points about this ${subject}. Aim for 1–2 short sentences per point (under 150 chars each).`,
       type: 'array',
       of: [{ type: 'text' }],
     })

   export const verdictField = (subject: Subject, limit: number) =>
     defineField({
       name: 'verdict',
       title: 'Verdict',
       description: `Your overall verdict on this ${subject} — max 600 characters. Basic formatting allowed.`,
       type: 'array',
       of: [{ type: 'block' }],
       validation: (Rule) =>
         Rule.custom((portableTextValue) => {
           if (!portableTextValue || (portableTextValue as any[]).length === 0) {
             return 'Verdict is required'
           }
           const textLength = getPortableTextLength(portableTextValue as any[])
           if (textLength > limit) {
             return `Verdict exceeds ${limit} characters (${textLength}/${limit})`
           }
           return true
         }).error(),
       components: { input: VerdictGeneratorInput },
     })

   export interface GalleryCategoryOption {
     title: string
     value: string
   }

   export const galleryField = (
     categoryDescription: string,
     categories: GalleryCategoryOption[],
   ) =>
     defineField({
       name: 'gallery',
       title: 'Photo Gallery',
       type: 'array',
       description:
         'Photo gallery — upload each photo at its natural crop, max 1600 px on the longest edge. WebP 80% or JPEG 85% quality. Any aspect ratio is fine.',
       of: [
         {
           type: 'image',
           options: {
             hotspot: true,
           },
           fields: [
             {
               name: 'alt',
               type: 'string',
               title: 'Alternative text',
               components: { input: AltTextGeneratorInput },
             },
             {
               name: 'caption',
               type: 'string',
               title: 'Caption',
               description:
                 'Optional: add a brief caption shown below the photo in the gallery.',
               components: { input: CaptionGeneratorInput },
             },
             {
               name: 'category',
               type: 'string',
               title: 'Photo Category',
               description: categoryDescription,
               options: {
                 list: categories,
               },
             },
           ],
           preview: {
             select: {
               media: 'asset',
               title: 'alt',
               category: 'category',
             },
           },
         },
       ],
     })
   ```
   IMPORTANT: before finalizing this file, open `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/schemas/hotelReview.ts` and compare the inline gallery `preview` block (starts right after the `category` field, around line 216) against the `preview` block above — if the existing one contains a `prepare()` function or extra `select` keys, copy the EXISTING version verbatim into the factory. The stored-content shape must not change.

2. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/schemas/hotelReview.ts`:
   a. Add to the imports:
   ```ts
   import {
     galleryField,
     negativesField,
     positivesField,
     verdictField,
   } from './sharedReviewFields'
   ```
   b. Replace the entire inline `gallery` defineField (starts at the line `name: 'gallery',` ~line 171, through its closing `}),`) with:
   ```ts
   galleryField(
     "Choose a category — Bedroom: bed, pillows, sleeping area. Bathroom: shower, tub, vanity. Living Area: sofa, desk, sitting space. Kitchen / Coffee Station: coffee maker, mini fridge, kitchenette. View from the Room: cityscape, scenery, or balcony shot as seen from inside the room. Pool & Fitness: gym equipment, pool area. Additional Photos: anything that doesn't fit above.",
     [
       { title: 'Bedroom', value: 'bedroom' },
       { title: 'Bathroom', value: 'bathroom' },
       { title: 'Living Area', value: 'living-area' },
       { title: 'Kitchen / Coffee Station', value: 'kitchen-coffee' },
       { title: 'View from the Room', value: 'view' },
       { title: 'Pool & Fitness', value: 'pool-fitness' },
       { title: 'Additional Photos', value: 'other' },
     ],
   ),
   ```
   c. Replace the inline `positives` defineField (~line 282) with `positivesField('hotel'),`, the inline `negatives` defineField (~line 293) with `negativesField('hotel'),`, and the inline `verdict` defineField (~line 301) with `verdictField('hotel', 1200),`.
   d. If `AltTextGeneratorInput`, `CaptionGeneratorInput`, `VerdictGeneratorInput`, or `getPortableTextLength` are now unused in this file, remove those imports (they may still be used by other fields like `tip` or `content` — check each with a text search before removing).

3. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/schemas/foodReview.ts`, same pattern:
   a. Add the same import block from `./sharedReviewFields`.
   b. Replace the inline `gallery` defineField (~line 183) with:
   ```ts
   galleryField(
     "Choose a category — Food & Drinks: dishes, cocktails, desserts. Interior & Atmosphere: dining room, tables, décor. Exterior: outside the building, signage, patio. Menu: printed or digital menu shots. Additional Photos: anything that doesn't fit above.",
     [
       { title: 'Food & Drinks', value: 'food-drinks' },
       { title: 'Interior & Atmosphere', value: 'interior' },
       { title: 'Exterior', value: 'exterior' },
       { title: 'Menu', value: 'menu' },
       { title: 'Additional Photos', value: 'other' },
     ],
   ),
   ```
   c. Replace inline `positives` (~line 296) with `positivesField('restaurant'),`, inline `negatives` (~line 307) with `negativesField('restaurant'),`, inline `verdict` (~line 315) with `verdictField('restaurant', 600),`.
   d. Clean up now-unused imports the same way as step 2d.

4. Run `npm run type-check` → must exit 0.

5. Run `npm run dev`, open `http://localhost:3000/studio`, open one existing Hotel Review document and one Food Review document, and confirm: the Photo Gallery field lists the correct per-type categories, Positives/Negatives show their descriptions, and the Verdict field shows the ✨ generator input and enforces its length on edit.

## 4. Edge Cases

- **The verdict length limits are intentionally different** — hotel = 1200, food = 600 (verified at `schemas/hotelReview.ts:313` vs `schemas/foodReview.ts:329`). The factory takes `limit` as a parameter; do NOT normalize them to one value, existing hotel verdicts longer than 600 chars would become invalid and block publishing.
- **The hotel verdict description says "max 600 characters" while its validation allows 1200** — that's a pre-existing copy inconsistency in the source. Preserve it as-is via the shared description string (this refactor must not change editor-facing behavior); flag it to Kenny separately rather than silently "fixing" it.
- **`defineField` return values are spread into `fields: [...]`** — the factory calls replace `defineField({...}),` entries one-for-one; keep the trailing commas and array position (field order = Studio form order, editors are used to it).
- **Both files' gallery image members also feed `lib/sanity.queries.ts` projections** (`gallery[] { ..., caption, category, asset-> }`). Field names `alt`, `caption`, `category` must stay exactly those strings or existing queries/components (e.g. gallery lightbox category filters) break.
- **Zero content migration:** this plan changes NO document data and NO field names/types, so no Sanity migration or backup is needed. If you find yourself renaming a field, stop — that's out of scope.
- **`schemas/index.ts` (or wherever the schema list lives, imported by `sanity.config.ts`) does not change** — `sharedReviewFields.ts` exports helpers, not a schema type, so it must NOT be added to the schema types array.

## 5. Acceptance Criteria

### Feature works
- [ ] Run `npm run type-check` → exits 0.
- [ ] Run `npm run lint` → passes.
- [ ] `grep -c "name: 'positives'" schemas/hotelReview.ts schemas/foodReview.ts` → `0` for both files (definitions now come from the factory).
- [ ] `npm run dev` → open `http://localhost:3000/studio`, edit an existing Hotel Review: gallery photo "Category" dropdown shows Bedroom/Bathroom/Living Area/Kitchen / Coffee Station/View from the Room/Pool & Fitness/Additional Photos.
- [ ] Same check on a Food Review: dropdown shows Food & Drinks/Interior & Atmosphere/Exterior/Menu/Additional Photos.
- [ ] In the Studio, clear a Hotel Review's Verdict field → validation error "Verdict is required" appears; restore the value afterwards without publishing.

### Nothing broke (regression check)
- [ ] `npm run build` → completes with zero errors.
- [ ] Open a hotel detail page (e.g. `http://localhost:3000/hotel/grand-hyatt-washington-review`) → gallery renders with category filters, positives/negatives lists render, verdict renders.
- [ ] Open a food detail page → same.
- [ ] In the Studio, an existing document opened and closed WITHOUT edits shows no "unsaved changes" indicator (proves the schema shape is unchanged).
