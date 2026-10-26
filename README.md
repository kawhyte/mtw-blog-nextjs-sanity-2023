# 🏀 Meet the Whytes<!-- omit in toc -->

### One family. One quest. Every NBA & WNBA arena.<!-- omit in toc -->

[![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Sanity](https://img.shields.io/badge/CMS-Sanity%20v3-f03e2f?logo=sanity)](https://www.sanity.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)](https://vercel.com/)

---

## 🎟️ The Quest

We're chasing every arena in the NBA and WNBA — and writing down everything we learn along the way. This repo is the engine behind **[Meet the Whytes](https://www.meetthewhytes.com)**: honest hotel reviews, local food guides, and city-by-city travel guides for fellow basketball road-trippers, all managed through a Sanity Studio and served up by Next.js.

If you've ever wondered "where do we stay," "where do we eat," and "how do we get game-day right" in an arena city — that's exactly what we're building here.

## Table of Contents

- [The Quest](#-the-quest)
- [Starting Lineup](#-starting-lineup-tech-stack)
- [Game Film](#-game-film-whats-on-the-site)
- [Playbook](#-playbook-project-layout)
- [Warm-Up](#-warm-up-local-setup)
- [Team Stats](#-team-stats-npm-scripts)

## 🏆 Starting Lineup (Tech Stack)

| Position | Player | Role |
| --- | --- | --- |
| Point Guard | **Next.js 13** (Pages Router) | Runs the offense — routing, SSG/ISR, API routes |
| Center | **Sanity v3 Studio** | The paint — content modeling, editing, real-time preview |
| Shooting Guard | **TypeScript** | Precision — type safety across queries and components |
| Small Forward | **Tailwind CSS + Radix UI** | Style and finish — layout, components, accessibility |
| Sixth Man | **@vercel/og + Vercel Speed Insights** | Comes off the bench for social share images and perf monitoring |

## 🎥 Game Film (What's on the site)

- 🏨 **Hotel Reviews** — weighted ratings across location, bed comfort, service, value, and more
- 🍜 **Food Reviews** — separate rating logic for dine-in vs. takeout experiences
- 🗺️ **City & Travel Guides** — standalone guides for planning an arena trip
- 🏟️ **NBA & WNBA Arena Reviews** — the heart of the quest, tracked arena by arena
- 🎒 **Travel Essentials** — the packing list and trip-prep content
- 🔍 **Site-wide search** across all content types
- ⚡ Instant, side-by-side content previews and real-time collaborative editing in Sanity Studio
- 🔁 Webhook-triggered Incremental Static Revalidation — publish without a full rebuild

## 📖 Playbook (Project layout)

| Path | What lives there |
| --- | --- |
| `pages/` | Routes: `/hotels`, `/food`, `/guides`, `/arenas`, `/essentials`, `/city/[slug]`, `/search`, and more |
| `pages/studio/[[...index]].tsx` | Where Sanity Studio is mounted (`/studio`) |
| `pages/api/revalidate.ts` | Serverless route that triggers ISR |
| `pages/api/preview.ts` | Serverless route that triggers Preview mode |
| `schemas/` | Content models: `hotelReview`, `foodReview`, `guide`, `nbaArenas`, `arenaReview`, `travelEssentials`, legacy `post` |
| `lib/sanity.queries.ts` | GROQ queries + TypeScript interfaces for all content |
| `lib/calculateRatings.ts`, `lib/calculateRating.ts` | The weighted rating engine for hotels, food, and arenas |
| `components/` | Page and UI components, organized by feature |
| `scripts/` | One-off and recurring data ops: backups, schema migrations, SEO/alt-text generation |
| `sanity.config.ts` / `sanity.cli.ts` | Studio and CLI configuration |

## 🔥 Warm-Up (Local setup)

```bash
git clone https://github.com/kawhyte/mtw-blog-nextjs-sanity-2023.git
cd mtw-blog-nextjs-sanity-2023
npx vercel link
npx vercel env pull   # pulls the Sanity project env vars
npm install
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000), and the Studio at [http://localhost:3000/studio](http://localhost:3000/studio).

## 📊 Team Stats (npm scripts)

**Dev**

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start the production server |

**Code Quality**

| Script | Description |
| --- | --- |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Lint with auto-fix + formatting |
| `npm run format` | Format with Prettier |
| `npm run type-check` | TypeScript type checking |

**Data Migration**

| Script | Description |
| --- | --- |
| `npm run backup-guides` / `backup-hotels` / `backup-food` | Back up content before migrating |
| `npm run migrate-guides` / `migrate-hotels` / `migrate-food` | Dry-run schema migrations |
| `npm run migrate-guides:live` / `migrate-hotels:live` / `migrate-food:live` | Live schema migrations |
| `npm run check-doc-size` | Check document sizes against Sanity limits |

**Content Ops**

| Script | Description |
| --- | --- |
| `npm run generate-alt-text` | Suggest alt text, captions + photo categories and build a review page (add `:live` to write the reviewed ones) |
| `npm run generate-seo-excerpts` | Generate SEO excerpts (add `:live` to write) |
| `npm run generate-summaries` | Generate content summaries (add `:live` to write) |
| `npm run fix-null-fields` | Backfill null fields (add `:live` to write) |
| `npm run fix-arena-teams` | Fix arena/team name data (add `:live` to write) |
| `npm run add-arena-excerpts` | Add arena excerpts (add `:live` to write) |

---

_Next arena on the list, then the next hotel, then the next taco stand. 🏀🧳_
