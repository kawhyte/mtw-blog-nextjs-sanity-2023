#!/usr/bin/env node

/**
 * Add SEO Excerpts to Arena Documents
 *
 * Patches the `excerpt` field on every arena document in Sanity with a
 * pre-written, SEO-optimised, human-sounding description (under 155 chars).
 * Skips any arena that already has an excerpt set.
 *
 * Usage:
 *   npm run add-arena-excerpts          # Dry run (preview only, no changes)
 *   npm run add-arena-excerpts:live     # Write to Sanity
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const isDryRun = !process.argv.includes('--no-dry-run')

// SEO excerpts keyed by arena slug — all under 155 characters
const ARENA_EXCERPTS = {
  // --- VISITED ---
  'target-center':
    "First-timer's guide to Target Center — where to park, what to eat, and why the upper bowl is secretly the best seat in the house for a Wolves game.",

  't-mobile-arena':
    "Caught an NBA game at T-Mobile Arena in Las Vegas — our honest take on the food, the sightlines, and whether it's worth building a trip around.",

  'moda-center':
    "Our review of Moda Center in Portland — great sightlines, solid food options, and one of the more underrated game-day atmospheres in the NBA.",

  'gainbridge-fieldhouse':
    "We've seen both Pacers and Fever games at Gainbridge Fieldhouse. Guide to parking, entry, best food spots, and what makes this arena worth the drive.",

  'mohegan-sun-arena':
    "Our review of Mohegan Sun Arena in Uncasville, CT — the only NBA venue inside a casino resort, with tips on the Sun game experience and what to do after.",

  'amway-center':
    "Our Amway Center review — the Magic's home in Orlando has great screens, solid sightlines, and a pretty fun game-day vibe even during a rebuild.",

  'state-farm-arena':
    "State Farm Arena is one of the sleeper picks on our arena tour — renovated, loud, and in the heart of downtown Atlanta. Our full Hawks game guide.",

  'entertainment-and-sports-arena':
    "Our guide to the Entertainment and Sports Arena in D.C. — the intimate WNBA-first venue where the Mystics play, and why it's a must for any hoops fan.",

  'fiserv-forum':
    "Fiserv Forum might be the best arena we've visited — electric atmosphere, great food, and a Deer District outside that makes game day feel like an event.",

  'paycom-center':
    "We were blown away by the atmosphere at Paycom Center in OKC. The Thunder faithful make this one of the loudest barns in the league — our full review.",

  'spectrum-center':
    "Our honest review of Spectrum Center in Charlotte — solid sightlines, good food options, and a Hornets crowd that shows up on the right night.",

  'gateway-center-arena':
    "Our review of Gateway Center Arena in College Park — the Atlanta Dream's home court is small, loud, and one of the most fun WNBA venues we've visited.",

  'wells-fargo-center':
    "The Philly crowd at Wells Fargo Center is an experience in itself. Our full guide to seeing a Sixers game — parking, food, seating, and what to expect.",

  'footprint-center':
    "We've done both Suns and Mercury games at Footprint Center in Phoenix — full guide to seats, food, and what makes this desert arena worth visiting.",

  'little-caesars-arena':
    "Little Caesars Arena is a hockey arena that moonlights as an NBA venue, but the Pistons experience there still delivers. Our full Detroit review.",

  'college-park-center':
    "Our review of College Park Center in Arlington — the Dallas Wings' home court is a college gym turned pro, and the atmosphere is surprisingly great.",

  'wintrust-arena':
    "Wintrust Arena is one of the best WNBA venues we've been to — intimate, loud, and right in Chicago's South Loop. Our full Chicago Sky game guide.",

  'crypto-com-arena':
    "We've been to Crypto.com Arena for both Lakers and Sparks games — Hollywood's home court lives up to the hype but also has quirks. Our full LA guide.",

  'rocket-mortgage-fieldhouse':
    "Our full review of Rocket Mortgage FieldHouse in Cleveland — one of the most improved arenas in the league and a fanbase that brings serious energy.",

  'td-garden':
    "One of the most storied buildings in basketball — our TD Garden review covers the real experience of a Celtics game, from parking to the parquet floor.",

  'climate-pledge-arena':
    "Climate Pledge Arena is one of the coolest buildings we've visited — gorgeous design, great food, and a Storm fanbase that absolutely shows up.",

  'madison-square-garden':
    "We finally checked off the World's Most Famous Arena — our honest MSG review on whether it lives up to the legend, from the seats to the $22 beers.",

  'delta-center':
    "Our Delta Center review — the Utah Jazz faithful are some of the most passionate fans we've encountered, and Salt Lake City itself is worth the trip.",

  'intuit-dome':
    "Intuit Dome is the newest arena on our list and already one of the best — the Clippers built something special in Inglewood. Our full first impressions.",

  'capital-one-arena':
    "Our Capital One Arena review — the Wizards' home in the heart of D.C. has character, good food, and a location that makes pre- and post-game plans easy.",

  'michelob-ultra-arena':
    "The Aces pack Michelob Ultra Arena with some of the best energy in the WNBA — our guide to getting to the game and making the most of Las Vegas.",

  'ball-arena':
    "Ball Arena sits a mile high and the Denver crowd makes you feel every foot of it — our honest review of Nuggets game day from parking to the final buzzer.",

  'barclays-center':
    "Our Barclays Center review — the Nets' and Liberty's home in Brooklyn has a distinct vibe from MSG, with better parking, solid food, and a younger crowd.",

  'golden-1-center':
    "Golden 1 Center is one of the most underrated arenas in the league — the Kings crowd is wild, the building is stunning, and Sacramento surprised us.",

  'united-center':
    "The United Center is one of the grand old buildings of the NBA — our Bulls game guide covers parking, best seats, food, and the Jordan statue outside.",

  'kaseya-center':
    "Kaseya Center in Miami gave us one of our favorite road trip experiences — the Heat culture is real, the view is great, and South Beach doesn't hurt.",

  'chase-center':
    "Our Chase Center review — the Warriors built something special in San Francisco. Our honest take on the game experience, the food, and the bay views.",

  // --- NOT YET VISITED (written timelessly — no bucket-list language) ---
  'toyota-center':
    "Our guide to Toyota Center in Houston — home of the Rockets and one of the loudest arenas in the South. Tips on parking, food, and what to expect.",

  'smoothie-king-center':
    "Our guide to Smoothie King Center in New Orleans — Pelicans basketball in one of the best food cities in the country. Everything you need for game day.",

  'frost-bank-center':
    "Our guide to Frost Bank Center in San Antonio — home of one of the most storied franchises in NBA history and a fanbase that takes their Spurs seriously.",

  'scotiabank-arena':
    "Our guide to Scotiabank Arena in Toronto — the only NBA arena outside the US, home of the Raptors and a fanbase that takes basketball seriously.",

  'american-airlines-center':
    "Our guide to American Airlines Center in Dallas — home of the Mavericks and one of the most passionate fanbases in the league. Tips for visiting.",

  'fedexforum':
    "Our guide to FedExForum in Memphis — Grizzlies basketball has one of the most unique team cultures in the NBA and the arena atmosphere backs it up.",
}

async function run() {
  console.log(`\n🏀 Arena SEO Excerpts — ${isDryRun ? 'DRY RUN' : 'LIVE RUN'}\n`)

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
    process.exit(1)
  }

  if (!isDryRun && !process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ SANITY_API_WRITE_TOKEN is required for live runs')
    process.exit(1)
  }

  const arenas = await client.fetch(
    `*[_type == "arenas"] { _id, name, "slug": slug.current, excerpt } | order(name asc)`
  )

  console.log(`Found ${arenas.length} arena document(s)\n`)

  let updatedCount = 0
  let skippedCount = 0
  let unknownCount = 0

  for (const arena of arenas) {
    const slug = arena.slug
    const excerpt = ARENA_EXCERPTS[slug]

    if (!excerpt) {
      console.log(`⚠️  ${arena.name} (${slug}) — no excerpt defined, skipping`)
      unknownCount++
      continue
    }

    if (arena.excerpt && arena.excerpt.trim()) {
      console.log(`✅ ${arena.name} — already has excerpt, skipping`)
      skippedCount++
      continue
    }

    console.log(`🔄 ${arena.name}`)
    console.log(`   "${excerpt}"`)

    if (!isDryRun) {
      await client.patch(arena._id).set({ excerpt }).commit()
      console.log(`   ✅ Saved`)
    } else {
      console.log(`   [dry run — no changes written]`)
    }

    updatedCount++
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`${isDryRun ? 'Dry run complete' : 'Done'}`)
  console.log(`  ${updatedCount} arena(s) ${isDryRun ? 'would be' : 'were'} updated`)
  console.log(`  ${skippedCount} already had excerpts`)
  if (unknownCount > 0) console.log(`  ${unknownCount} had no excerpt defined`)

  if (isDryRun && updatedCount > 0) {
    console.log(`\nRun with --no-dry-run to apply changes:\n  npm run add-arena-excerpts:live\n`)
  }
}

run().catch((err) => {
  console.error('❌ Script failed:', err.message)
  process.exit(1)
})
