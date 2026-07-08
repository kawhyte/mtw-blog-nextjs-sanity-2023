# PLAN: Branded 404 and 500 Error Pages

## 1. The Goal

The site has no `pages/404.tsx` or `pages/500.tsx`, so any bad URL (e.g. a mistyped `/hotel/...` slug, which returns `notFound: true` from `getStaticProps`) shows Next.js's unbranded default error screen with no navigation back into the site. This plan adds branded, statically-generated 404 and 500 pages using the existing design system (Tailwind tokens, `Button` UI component, brutalist card styling). Done = bad URLs show a Meet the Whytes–styled page with links back to the main sections.

## 2. Exact Files to Touch

- CREATE `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/404.tsx` — branded not-found page.
- CREATE `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/500.tsx` — branded server-error page.

No existing files are modified.

## 3. Step-by-Step Implementation Order

1. Create `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/404.tsx` with exactly:
   ```tsx
   import { ArrowRight, Home } from 'lucide-react'
   import Head from 'next/head'
   import Link from 'next/link'

   const sections = [
     { href: '/hotels', label: 'Hotel Reviews' },
     { href: '/food', label: 'Food Reviews' },
     { href: '/guides', label: 'Travel Guides' },
     { href: '/arenas', label: 'Arena Quest' },
   ]

   export default function Custom404() {
     return (
       <>
         <Head>
           <title>Page Not Found | Meet the Whytes</title>
           <meta name="robots" content="noindex" />
         </Head>
         <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
           <p className="text-7xl font-black text-primary sm:text-9xl">404</p>
           <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-4xl">
             This page took a wrong turn at the arena.
           </h1>
           <p className="mt-3 max-w-md text-muted-foreground">
             The page you&apos;re looking for doesn&apos;t exist or may have
             moved. Try one of these instead:
           </p>
           <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
             {sections.map((s) => (
               <Link
                 key={s.href}
                 href={s.href}
                 className="group flex items-center gap-1 rounded-full border-2 border-border-bold bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-offsetIndigo transition-transform hover:-translate-y-0.5"
               >
                 {s.label}
                 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </Link>
             ))}
           </div>
           <Link
             href="/"
             className="mt-8 flex items-center gap-2 font-semibold text-primary hover:underline"
           >
             <Home className="h-4 w-4" />
             Back to the homepage
           </Link>
         </main>
       </>
     )
   }
   ```

2. Create `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/500.tsx` with exactly:
   ```tsx
   import { Home } from 'lucide-react'
   import Head from 'next/head'
   import Link from 'next/link'

   export default function Custom500() {
     return (
       <>
         <Head>
           <title>Something Went Wrong | Meet the Whytes</title>
           <meta name="robots" content="noindex" />
         </Head>
         <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
           <p className="text-7xl font-black text-primary sm:text-9xl">500</p>
           <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-4xl">
             Well, that was an airball.
           </h1>
           <p className="mt-3 max-w-md text-muted-foreground">
             Something went wrong on our end. Please refresh the page or try
             again in a minute.
           </p>
           <Link
             href="/"
             className="mt-8 flex items-center gap-2 font-semibold text-primary hover:underline"
           >
             <Home className="h-4 w-4" />
             Back to the homepage
           </Link>
         </main>
       </>
     )
   }
   ```

3. Run `npm run type-check`, `npm run lint`, then `npm run build`.

## 4. Edge Cases

- **Do NOT import `BlogLayout` or any component that fetches Sanity data.** Custom error pages in the Pages Router must not use `getStaticProps` with data dependencies that can fail — a 500 page that itself throws produces an infinite error loop. The snippets above are fully static on purpose. (`components/BlogLayout.tsx` is safe in principle but pulls `AlertBanner`, which expects a `preview` prop — keep error pages dependency-free.)
- **Design tokens:** this codebase uses semantic Tailwind tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `text-primary`, `border-border-bold`, `shadow-offsetIndigo`, `bg-card`) defined in `tailwind.config.js` — the snippets already use them. Do not substitute raw colors like `text-gray-500`; dark mode relies on the semantic tokens.
- **`noindex` meta:** both pages must keep `<meta name="robots" content="noindex" />` so error pages never enter the Google index.
- **Apostrophes:** the repo's ESLint config flags unescaped `'` in JSX (`react/no-unescaped-entities`). The 404 copy uses `&apos;` already — keep it that way or `npm run lint` fails.
- **Existing 404 behavior is correct and must be preserved:** all four slug pages return `{ notFound: true }` from `getStaticProps` (e.g. `/Users/Kenny/Documents/Development/mtw-blog-nextjs-sanity-2023/pages/guide/[slug].tsx` lines 33-37). Nothing in those files changes; Next automatically renders the new `pages/404.tsx` for them. Note: unpublished drafts intentionally 404 for the public and render via Preview Mode with a token — do not "fix" that as part of this plan.

## 5. Acceptance Criteria

### Feature works
- [ ] Run `npm run build` → output lists `○ /404` and `○ /500` as static pages, zero errors.
- [ ] Run `npm run dev`, open `http://localhost:3000/this-page-does-not-exist` → see the branded 404 page with "404", four section links, and a homepage link (not Next's default black-and-white page).
- [ ] Open `http://localhost:3000/hotel/not-a-real-hotel-slug` → same branded 404 page.
- [ ] Click "Hotel Reviews" on the 404 page → lands on `/hotels` and the listing renders.
- [ ] View page source of the 404 page → contains `<meta name="robots" content="noindex"`.

### Nothing broke (regression check)
- [ ] `npm run type-check` → exits 0.
- [ ] `npm run lint` → passes.
- [ ] Open `http://localhost:3000/` and one real detail page (e.g. `/hotel/grand-hyatt-washington-review`) → both render exactly as before.
