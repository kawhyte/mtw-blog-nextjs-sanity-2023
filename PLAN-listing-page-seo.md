# PLAN: Unique Canonical + Open Graph for Top-Picks & Essentials Pages, robots.txt Cleanup

## 1. The Goal

`/top-hotel-picks`, `/top-restaurant-picks`, and `/essentials` currently render the generic homepage head (`IndexPageHead`) plus a bare `<title>` override — they have NO canonical URL, NO page-specific Open Graph/Twitter tags, and share the homepage's social preview. This plan adds a small reusable `StaticPageHead` component (modeled on the existing `CategoryPageHead`), wires it into `TopListPage` and `TravelEssentialPage`, removes dead `Head` imports from three listing pages, and removes the useless `Crawl-delay` from robots.txt. Done = each of the three pages has its own title, description, canonical, and OG/Twitter card.

## 2. Exact Files to Touch

- CREATE `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/StaticPageHead.tsx` — reusable head for static marketing/list pages.
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/TopListPage.tsx` — replace `IndexPageHead` + inline `<Head>` with `StaticPageHead`.
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/TravelEssentialPage.tsx` — same replacement.
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/top-hotel-picks.tsx` — pass `path` + `description` props.
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/top-restaurant-picks.tsx` — same.
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/hotels.tsx` — delete unused `import Head from 'next/head'` (line 13).
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/food.tsx` — delete unused `import Head from 'next/head'` (line 10).
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/guides.tsx` — delete unused `import Head from 'next/head'` (line 10).
- MODIFY `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/public/robots.txt` — remove `Crawl-delay: 1` (and its comment line).

## 3. Step-by-Step Implementation Order

1. Create `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/StaticPageHead.tsx` with exactly:
   ```tsx
   import BlogMeta from 'components/BlogMeta'
   import { urlForImage } from 'lib/sanity.image'
   import { Settings } from 'lib/sanity.queries'
   import Head from 'next/head'

   const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

   export interface StaticPageHeadProps {
     settings: Settings
     title: string
     description: string
     /** Path starting with '/', e.g. '/top-hotel-picks' */
     path: string
   }

   export default function StaticPageHead({
     settings,
     title,
     description,
     path,
   }: StaticPageHeadProps) {
     const { ogImage } = settings || {}

     let ogImageUrl = `${SITE_URL}/MeettheWhytes.jpg`
     if (ogImage?.asset?._ref) {
       ogImageUrl = urlForImage(ogImage)
         .width(1200)
         .height(630)
         .fit('crop')
         .url()
     }
     if (ogImageUrl && !ogImageUrl.startsWith('http')) {
       ogImageUrl = `${SITE_URL}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`
     }

     const pageUrl = `${SITE_URL}${path}`

     return (
       <Head>
         <BlogMeta />
         <title>{title}</title>
         <meta key="description" name="description" content={description} />

         <meta property="og:type" content="website" />
         <meta property="og:locale" content="en_US" />
         <meta property="og:title" content={title} />
         <meta property="og:description" content={description} />
         <meta property="og:url" content={pageUrl} />
         <meta property="og:image" content={ogImageUrl} />
         <meta property="og:image:width" content="1200" />
         <meta property="og:image:height" content="630" />
         <meta property="og:image:alt" content={title} />

         <meta name="twitter:card" content="summary_large_image" />
         <meta name="twitter:site" content="@meetthewhytes" />
         <meta name="twitter:title" content={title} />
         <meta name="twitter:description" content={description} />
         <meta name="twitter:image" content={ogImageUrl} />
         <meta name="twitter:url" content={pageUrl} />

         <link rel="canonical" href={pageUrl} />
       </Head>
     )
   }
   ```
   (This mirrors `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/CategoryPageHead.tsx` — same ogImage fallback logic, same tag set — but takes free-form title/description/path instead of a fixed category enum.)

2. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/TopListPage.tsx`:
   a. Add to the `IndexPageProps` interface (after the line `pageTitle?: string`):
   ```ts
   pageDescription?: string
   pagePath?: string
   ```
   b. Destructure them in the component body (after `pageTitle,` in the destructuring block): `pageDescription,` and `pagePath,`.
   c. Replace the line `import IndexPageHead from 'components/IndexPageHead'` with `import StaticPageHead from 'components/StaticPageHead'`. Delete the now-unused `import Head from 'next/head'` line.
   d. Replace this block:
   ```tsx
   <IndexPageHead settings={settings} />

   <Layout preview={preview} loading={loading}>
     <Head>
       <title>{pageTitle || postHeader || title}</title>
     </Head>
   ```
   with:
   ```tsx
   <StaticPageHead
     settings={settings}
     title={pageTitle || postHeader || title}
     description={pageDescription || summary || 'Our top picks'}
     path={pagePath || '/'}
   />

   <Layout preview={preview} loading={loading}>
   ```

3. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/top-hotel-picks.tsx`, in the non-preview `<TopListPage ...>` render (the one that passes `pageTitle="Our Top Hotel Picks | Meet The Whytes"`), add two props:
   ```tsx
   pagePath="/top-hotel-picks"
   pageDescription="Our top 10 hotels ranked by weighted ratings from our NBA & WNBA arena travels — the best places we've actually stayed."
   ```

4. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/top-restaurant-picks.tsx`, same pattern:
   ```tsx
   pagePath="/top-restaurant-picks"
   pageDescription="Our top 10 restaurants ranked by weighted ratings — the best meals we've found near NBA & WNBA arenas and beyond."
   ```

5. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/components/TravelEssentialPage.tsx`:
   a. Replace `import IndexPageHead from 'components/IndexPageHead'` with `import StaticPageHead from 'components/StaticPageHead'`. Delete `import Head from 'next/head'` ONLY if `<Head>` appears nowhere else in the file after step 5b (check with a search).
   b. Replace this block (currently around lines 64-73):
   ```tsx
   <IndexPageHead settings={settings} />

   <Layout preview={preview} loading={loading}>
     <Head>
       <title>{`What We Pack — Travel Gear | ${CMS_NAME}`}</title>
       <meta
         name="description"
         content="Our tried-and-tested gear for NBA games, cruises, day trips, and beyond. ~20 curated picks, no fluff."
       />
     </Head>
   ```
   with:
   ```tsx
   <StaticPageHead
     settings={settings}
     title={`What We Pack — Travel Gear | ${CMS_NAME}`}
     description="Our tried-and-tested gear for NBA games, cruises, day trips, and beyond. ~20 curated picks, no fluff."
     path="/essentials"
   />

   <Layout preview={preview} loading={loading}>
   ```

6. Delete the unused `import Head from 'next/head'` lines: `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/hotels.tsx` line 13, `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/food.tsx` line 10, `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/guides.tsx` line 10. (Verified: `<Head` is used 0 times in each of these files.)

7. In `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/public/robots.txt`, delete the final two lines:
   ```
   # Additional crawl optimization
   Crawl-delay: 1
   ```
   (Google ignores `Crawl-delay`; Bing/Yandex honor it and it needlessly throttles them. Everything else in robots.txt stays.)

8. Run `npm run type-check`, `npm run lint`, `npm run build`.

## 4. Edge Cases

- **Duplicate `<title>` collapse:** `BlogLayout` (used via `Layout`) also emits a default `<title>` and `<meta name="description">`. Next.js deduplicates `<title>` (last one wins) and dedupes metas by `key` — that's why `StaticPageHead`'s description meta MUST keep `key="description"` (same convention as `CategoryPageHead.tsx` line 65). Do not remove the `key`.
- **`TopListPage` is shared:** it's rendered by BOTH `/top-hotel-picks` and `/top-restaurant-picks` and also as a preview fallback with empty props (`postHeader={''}`). The new props are optional with fallbacks (`pagePath || '/'`), so the preview fallback path compiles and renders unchanged.
- **`CMS_NAME` import:** `TravelEssentialPage.tsx` already imports `CMS_NAME` from `lib/constants` for the title string — keep that import; only the `IndexPageHead` and (if unused) `Head` imports change.
- **`SITE_URL` env:** `NEXT_PUBLIC_SITE_URL` may be unset in local dev, producing relative canonical `/top-hotel-picks`. This matches the existing behavior of `CategoryPageHead` — acceptable locally; production Vercel env has it set. Do not hardcode the domain.
- **`settings.ogImage` may be undefined:** the fallback chain to `/MeettheWhytes.jpg` (copied from `CategoryPageHead`) handles it; do not "simplify" it away.
- **Preview mode on top-picks pages:** the preview branch renders `PreviewIndexPage` and never reaches `TopListPage`'s head — fine, previews don't need SEO tags.

## 5. Acceptance Criteria

### Feature works
- [ ] Run `npm run build` → zero errors.
- [ ] `npm run dev`, then `curl -s http://localhost:3000/top-hotel-picks | grep -o '<link rel="canonical"[^>]*>'` → outputs a canonical tag ending in `/top-hotel-picks`.
- [ ] `curl -s http://localhost:3000/top-restaurant-picks | grep -o 'og:title" content="[^"]*"'` → contains "Top" restaurant-specific title, not the homepage title.
- [ ] `curl -s http://localhost:3000/essentials | grep -c 'og:url'` → outputs `1`, and the og:url ends in `/essentials`.
- [ ] `curl -s http://localhost:3000/hotels | grep -o '<link rel="canonical"[^>]*>'` → still outputs canonical ending in `/hotels` (CategoryPageHead untouched).
- [ ] `public/robots.txt` no longer contains `Crawl-delay`.

### Nothing broke (regression check)
- [ ] `npm run type-check` → exits 0.
- [ ] `npm run lint` → passes (proves the deleted `Head` imports were truly unused).
- [ ] Open `http://localhost:3000/top-hotel-picks` in a browser → page renders with header, Lottie image, and 10 hotel cards exactly as before.
- [ ] Open `http://localhost:3000/essentials` → gear list, filters, and counts render exactly as before.
