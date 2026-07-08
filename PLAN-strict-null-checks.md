# PLAN: Enable `strictNullChecks` in TypeScript

## 1. The Goal

`tsconfig.json` currently sets `"strict": false` and `"strictNullChecks": false`, so the compiler catches none of the null/undefined bugs this codebase hand-guards against (Sanity fields are all optional — every `title?`, `slug?`, `coverImage?` can be missing). Enabling `strictNullChecks` was measured to surface exactly **101 errors across ~20 files** (measured 2026-07-08 with `npx tsc --noEmit --strictNullChecks`). This plan turns the flag on and fixes all 101 errors with behavior-preserving guards. Done = `npm run type-check` passes with `strictNullChecks: true` and the site builds and renders identically.

## 2. Exact Files to Touch

- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/tsconfig.json` — flip the flag.
- MODIFY (fixing surfaced errors; counts from the measurement run, ordered most-errors-first):
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/PaginationComponent.tsx` (12 errors)
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/sitemap.xml.tsx` (8)
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/arena/ArenaGrid.tsx` (8)
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/PostHeader.tsx` (8)
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/search.tsx` (5)
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/ui/pagination-wrapper.tsx` (5)
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/intro-template/index.tsx` (4)
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/hotel/[slug].tsx`, `pages/guide/[slug].tsx`, `pages/food/[slug].tsx`, `pages/arena/[slug].tsx` (3 each)
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/StarRating.tsx`, `components/StarDisplay.tsx`, `components/FoodReviewPage.tsx` (3 each)
  - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/schemas/settings/OpenGraphPreview.tsx` (2)
  - plus a small tail of 1–2-error files revealed by the compiler run in step 2.

## 3. Step-by-Step Implementation Order

1. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/tsconfig.json`, change the line
   ```json
   "strictNullChecks": false
   ```
   to
   ```json
   "strictNullChecks": true
   ```
   Leave `"strict": false` unchanged — full strict mode (implicit-any etc.) is a much larger project and NOT in scope.

2. Run `npx tsc --noEmit 2>&1 | head -120` to get the authoritative error list (expect ~101 errors). Fix files in the order listed in Section 2 (most errors first). After each file, re-run `npx tsc --noEmit` and confirm the count drops.

3. Apply ONLY behavior-preserving fix patterns, choosing per error:
   - **Possibly-undefined prop used in JSX/logic** → optional chaining: `post.title.slice(0, 5)` → `post.title?.slice(0, 5)`.
   - **Value passed to a function requiring non-null** → nullish default that matches the existing runtime behavior: `slug ?? ''`, `items ?? []`, `count ?? 0`. Look at what the code currently does at runtime when the value is undefined (it doesn't crash today — JS coerces), and pick the default that reproduces that output.
   - **Narrowing needed** → early return or guard, e.g.
     ```ts
     if (!settings) return null
     ```
     ONLY where the component already renders nothing/garbage for missing data. If the component currently renders something meaningful with the value missing, use `?.`/`??` instead of an early return so rendered output is unchanged.
   - **`previewData.token` style optional access in the four slug pages** → the pages already compute `const token = preview ? (previewData.token ?? null) : null`; errors here are about `params.slug` and props typing — use `params?.slug as string` (already the pattern in `pages/guide/[slug].tsx`) and type props accurately rather than adding `!`.
   - **FORBIDDEN:** the non-null assertion operator `!`, `as any` casts, and deleting existing runtime guards. If an error seems to require `!`, the type is wrong — fix the type (e.g. mark the prop optional and guard at the use site).

4. Special cases discovered during exploration:
   - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/intro-template/index.tsx` is Sanity's starter-template demo component. Check whether anything imports it: run `grep -rn "intro-template" pages components lib --include=*.tsx --include=*.ts`. If nothing imports it, add `"intro-template"` to the `"exclude"` array in tsconfig.json instead of fixing it (and note in the commit that it's dead template code — deleting it is a separate decision for Kenny).
   - `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/sitemap.xml.tsx` builds URL strings from optional slugs — use `.filter(Boolean)` on the collections or `?? ''` guards, but NEVER emit a URL for an item with a missing slug (emitting `/hotel/undefined` into the sitemap would be an SEO regression; skipping the item matches the intent).
   - `lib/calculateRating.ts` and `lib/calculateArenaRating.ts` already have solid runtime null guards (verified: non-number guard and divide-by-zero guard) — expect few or no errors there; do not restructure them.

5. Run the full verification suite: `npm run type-check`, `npm run lint`, `npm run build` — all must pass with zero errors.

## 4. Edge Cases

- **All Sanity interfaces are all-optional by design** (`lib/sanity.queries.ts` — `Guide`, `HotelReview`, `FoodReview`, etc. declare every field with `?`). Do not "fix" errors by making interface fields required — documents in the dataset genuinely can lack any field, and required types would just move the lie into the type system.
- **`getStaticProps` return types:** with strictNullChecks on, `settings` typed as `Settings | undefined` may conflict with `PageProps` expecting `Settings`. `getSettings()` in `lib/sanity.client.ts` already returns `{}` on failure (never undefined), so the correct fix is trusting its `Promise<Settings>` signature — no change needed; don't add gratuitous `?? {}`.
- **Preview/draft flow must keep working:** the four slug pages pass an optional `token` into `getGuideBySlug(slug, token ?? undefined)` etc. — `token` is `string | null` and the fetchers take `token?: string`. `token ?? undefined` is the established bridge; keep it, do not change signatures to accept `null`.
- **JSX conditional rendering with `&&`:** patterns like `{count && <Badge/>}` render the literal `0` when count is 0. If you touch such a line for a null error, preserve the existing truthiness semantics exactly (use the same expression, just null-guarded) — do not convert `&&` to ternaries in lines the compiler didn't flag.
- **Do not fix errors by widening to `any`** — the codebase already has `coverImage?: any` style fields; adding more `any` silences the compiler without safety. `any` is only acceptable where it already exists.
- **`components/PaginationComponent.tsx` has the most errors (12)** — it manipulates possibly-undefined page numbers with arithmetic. When adding `?? 1`/`?? 0` defaults, verify against the live `/hotels` page that page navigation (next/prev/numbered buttons, ellipsis) behaves identically, including on the last page.

## 5. Acceptance Criteria

### Feature works
- [ ] `grep '"strictNullChecks": true' tsconfig.json` → matches.
- [ ] Run `npm run type-check` → exits 0 with no output.
- [ ] `grep -rn '!\.' <changed files>` shows no NEW non-null assertions introduced by this change (compare with `git diff` — the diff must contain no `!` assertions and no new `as any`).

### Nothing broke (regression check)
- [ ] `npm run build` → completes with zero errors and the same route list as before the change.
- [ ] `npm run lint` → passes.
- [ ] `npm run dev`, then click through: `http://localhost:3000/` → `/hotels` → page 2 via pagination → any hotel detail → back → `/search` with query "arena" → `/sitemap.xml` (valid XML, no `undefined` in any `<loc>`). Every page renders as before.
- [ ] Draft preview still works: `http://localhost:3000/api/preview?secret=<secret>&type=guide&slug=toronto-tempo-coca-cola-coliseum-game-day-guide` renders the draft guide (not 404).
