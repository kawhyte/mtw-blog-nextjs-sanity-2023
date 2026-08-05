# PLAN: Next 13 → 15 + next-sanity 4 → 9 Upgrade

## 1. The Goal

Clear the remaining Dependabot exposure on this repo — **48 `next` alerts including the only critical**, plus 3 `postcss`. After the Aug 2026 dependency sweep (`ea4bcde`), 52 real alerts remain and every one of them is blocked behind this single upgrade. Done = `next@15.5.22` running the site and the embedded Studio, `npm audit` clear of critical/high, and live preview working again on all 12 preview-enabled pages.

This is the upgrade that could not be done incrementally. It is scoped as its own piece of work because it involves a genuine API migration, not a version bump.

## 2. Why this cannot be split into smaller steps

The dependency graph forces one atomic change:

```
next 15.5.x  ──requires──>  next-sanity ^9      (v4.3.3 peers next ^13)
next-sanity 9 ──requires──>  sanity ^3.88.2     (we are pinned at 3.22.3)
sanity 3.88+  ──requires──>  @sanity/ui ^2  +  styled-components ^6.1.15
```

`sanity@3.22.3` (current) is the **last release on `@sanity/ui` v1 + styled-components v5**. Anything above it pulls `@sanity/ui` v2, which `next-sanity@4.3.3` refuses (`@sanity/ui ^1.0.0`). So Next, next-sanity, sanity, @sanity/ui and styled-components all move together or none do. This was confirmed empirically in the Aug 2026 sweep — 3.22.3 is where that attempt deliberately stopped.

**Good news that reduces risk: React 19 is NOT required.** Every target below peers on `react ^18.3`, so React stays on the 18 line. Only a patch bump (18.2.0 → 18.3.1) is needed to satisfy `sanity-plugin-media`.

## 3. Target versions (each verified against the npm registry)

| Package | From | To | Note |
|---|---|---|---|
| `next` | 13.4.4 | **15.5.22** | 15.5.21+ required; many advisories were never backported to 14.x |
| `eslint-config-next` | 13.4.4 | **15.5.22** | must track `next` exactly |
| `react` / `react-dom` | 18.2.0 | **18.3.1** | stay on React 18 |
| `next-sanity` | 4.3.3 | **9.12.3** | peers `next ^14.2 \|\| ^15`, `sanity ^3.88.2` |
| `sanity` | 3.22.3 | **3.99.0** | last of the v3 line |
| `@sanity/vision` | 3.22.3 | **3.99.0** | must match `sanity` |
| `styled-components` | 5.3.11 | **6.1.x** | required by sanity 3.99 (`^6.1.15`) |
| `sanity-plugin-media` | 2.0.6 | **4.3.6** | ⚠️ NOT latest (6.1.1) — that peers `sanity ^5` + React 19 |
| `sanity-plugin-asset-source-unsplash` | 1.1.0 | **3.1.0** | ⚠️ NOT latest (7.0.21) — same reason |

The two plugin pins are the easiest thing to get wrong. `npm i <plugin>@latest` installs a version that requires Sanity v5/v6 and React 19, which will not work here. Pin them explicitly.

## 4. Exact Files to Touch

**Dependency manifests**
- `package.json`, `package-lock.json`

**Preview system rewrite — the actual work (19 files, ~51 call sites)**
- `lib/sanity.preview.ts` — `definePreview` no longer exists; delete or replace
- `components/PreviewSuspense.tsx` — `PreviewSuspense` removed from next-sanity; delete
- 5 preview components: `components/Preview{Index,Arena,HotelReview,FoodReview,Guide}Page.tsx`
- 12 pages calling them: `pages/{index,arenas,food,guides,hotels,essentials,top-restaurant-picks,top-hotel-picks}.tsx` and `pages/{hotel,food,guide,arena}/[slug].tsx`

**Likely small changes**
- `pages/studio/[[...index]].tsx` — `next-sanity/studio` API surface
- `pages/api/revalidate.ts`, `pages/api/preview.ts` — `next-sanity/webhook`
- `next.config.mjs` — verify the `compiler.styledComponents` flag still applies under sc v6
- `schemas/settings/OpenGraphInput.tsx`, `OpenGraphPreview.tsx` — only styled-components consumers in app code

## 5. Step-by-Step Implementation Order

Do this on `chore/next-15-upgrade`, branched from `main`. Commit after each stage so any stage can be reverted alone.

**Stage 1 — styled-components v5 → v6 (isolated, do first)**

Bump only `styled-components` to `^6.1`. It is the one prerequisite that can be verified independently, and only two app files import it. Check `OpenGraphInput.tsx` / `OpenGraphPreview.tsx` render correctly in the Studio, and confirm `next.config.mjs`'s `compiler.styledComponents` still behaves. Commit.

**Stage 2 — Sanity 3.22.3 → 3.99.0 + plugin pins**

```bash
npm i sanity@3.99.0 @sanity/vision@3.99.0 sanity-plugin-media@4.3.6 sanity-plugin-asset-source-unsplash@3.1.0 react@18.3.1 react-dom@18.3.1
```

This pulls `@sanity/ui` v2. Expect `next-sanity@4.3.3` to emit a peer warning — that is expected and is resolved in Stage 3. The Studio may not build cleanly until Stage 3 lands; these two stages are one logical unit even though they are separate commits.

**Stage 3 — next-sanity 4 → 9 + Next 13 → 15**

```bash
npm i next@15.5.22 next-sanity@9.12.3 && npm i -D eslint-config-next@15.5.22
```

Then the preview migration. The v4 API (`definePreview` / `usePreview` / `PreviewSuspense`) is gone. For the Pages Router the replacement is `next-sanity/preview/live-query` (confirmed present in 9.12.3's export map, backed by `@sanity/preview-kit` v6), which exposes `LiveQueryProvider` + `useLiveQuery`.

The shape change is architectural, not cosmetic:

- **v4**: `usePreview(token, query, params)` fetched everything client-side from scratch; `PreviewSuspense` provided the fallback.
- **v9**: `useLiveQuery(initialData, query, params)` takes server-rendered data as its starting point and live-patches it. `LiveQueryProvider` wraps the tree once (in `_app.tsx` or per preview page) instead of a per-page `PreviewSuspense`.

This is a net improvement — every one of the 12 pages already has its data from `getStaticProps`, which becomes the `initialData` argument, so the preview components stop double-fetching. But it does mean each of the 5 `Preview*Page` components changes signature to accept its initial data as a prop.

**Confirm the exact API against the next-sanity 9 docs before writing the code.** The export path and backing package are verified; the precise call signatures are not, and this plan should not be trusted over the current docs on that point.

`documentLimit: 20000` and the `includeTypes` allowlist in `lib/sanity.preview.ts` exist because the dataset passed 3,000 documents in July 2026. Whatever replaces that file must preserve equivalent limits or preview will throw again.

**Stage 4 — codemods and cleanup**

Run `npx @next/codemod@latest upgrade` for mechanical Next 15 changes. Pages Router is far less affected than App Router, but check: `next/image` behaviour, `next/font` (`app/fonts.ts`), and any `getStaticProps` typing drift.

## 6. Verification

Each of these must pass before merge — the same bar the Aug 2026 sweep was held to:

1. `npm run type-check` — clean
2. `npm run build` — succeeds, all ~227 pages generated
3. `npm run lint` — no new errors (import-sort warnings are pre-existing)
4. `npm ls @sanity/ui styled-components` — single deduped version of each, no peer conflicts
5. Public site on `localhost:3333`: homepage, `/arenas`, a hotel review page, `/search`
6. **Studio on `localhost:3333/studio`** (`http://localhost:3333` is already an allowed CORS origin with credentials): all 7 schemas, a document list, the editor, the **Open Graph preview field**, and the **Preview tab**
7. **Live preview on all 12 pages** — the one thing the sweep could not test, and the highest-risk surface here
8. `npm audit` — no critical, no high

Item 7 is the real acceptance test. Items 1–4 will pass long before the preview rewrite is actually correct.

## 7. Rollback

```bash
git switch main && npm ci
```

`main` is at `ea4bcde` with the verified dependency sweep already merged. Every stage is a separate commit, so a single bad stage can be reverted with `git revert` without discarding the rest.

## 8. Risks and open questions

- **The preview rewrite is the whole risk.** 19 files, ~51 call sites, and an API whose shape changed rather than just its name. Budget real time for it; it is not a find-and-replace.
- **Untested write path.** The Aug 2026 sweep verified the Studio renders but never published a document. Before trusting this upgrade, publish one test document and confirm `/api/revalidate` fires and the page updates.
- **`@vercel/og`** (`pages/api/og.tsx`) is on 0.5.6 and unverified against Next 15's runtime. Check the OG route renders.
- **Vercel deploy** is unverified by any local check. Deploy to a preview URL before promoting to production.
- **`@sanity/ui` v1 → v2** may shift Studio styling. Cosmetic, but expect visual diffs in custom input components.

## 9. What this does not fix

The 6 `vite` alerts will likely persist. That is acceptable: **vite never executes in this project.** Next builds the site and the embedded Studio with webpack/SWC; `vite` arrives only as a dependency of the Sanity CLI (`sanity dev` / `sanity build`), which no script in `package.json` invokes. The built client bundle contains zero vite runtime markers. Those alerts can be dismissed on GitHub as "Vulnerable code is not actually used."
