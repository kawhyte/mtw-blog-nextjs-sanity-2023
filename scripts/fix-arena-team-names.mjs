#!/usr/bin/env node

/**
 * Fix Arena Team Names Script
 *
 * Updates short team nicknames (e.g., "Rockets") to full names
 * (e.g., "Houston Rockets") in the gallery[] array of all arena documents.
 * This is required for search to work correctly via gallery[].name match.
 *
 * Usage:
 *   npm run fix-arena-teams          # Dry run (preview only, no changes)
 *   npm run fix-arena-teams:live     # Apply changes to Sanity
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

// Comprehensive short name → full name map (NBA + WNBA)
const TEAM_NAME_MAP = {
  // NBA
  Hawks: 'Atlanta Hawks',
  Celtics: 'Boston Celtics',
  Nets: 'Brooklyn Nets',
  Hornets: 'Charlotte Hornets',
  Bulls: 'Chicago Bulls',
  Cavaliers: 'Cleveland Cavaliers',
  Cavs: 'Cleveland Cavaliers',
  Mavericks: 'Dallas Mavericks',
  Mavs: 'Dallas Mavericks',
  Nuggets: 'Denver Nuggets',
  Pistons: 'Detroit Pistons',
  Warriors: 'Golden State Warriors',
  Rockets: 'Houston Rockets',
  Pacers: 'Indiana Pacers',
  Clippers: 'Los Angeles Clippers',
  Lakers: 'Los Angeles Lakers',
  Grizzlies: 'Memphis Grizzlies',
  Heat: 'Miami Heat',
  Bucks: 'Milwaukee Bucks',
  Timberwolves: 'Minnesota Timberwolves',
  Wolves: 'Minnesota Timberwolves',
  Pelicans: 'New Orleans Pelicans',
  Knicks: 'New York Knicks',
  Thunder: 'Oklahoma City Thunder',
  Magic: 'Orlando Magic',
  '76ers': 'Philadelphia 76ers',
  Sixers: 'Philadelphia 76ers',
  Suns: 'Phoenix Suns',
  'Trail Blazers': 'Portland Trail Blazers',
  Blazers: 'Portland Trail Blazers',
  Kings: 'Sacramento Kings',
  Spurs: 'San Antonio Spurs',
  Raptors: 'Toronto Raptors',
  Jazz: 'Utah Jazz',
  Wizards: 'Washington Wizards',
  // WNBA
  Dream: 'Atlanta Dream',
  Sky: 'Chicago Sky',
  Sun: 'Connecticut Sun',
  Wings: 'Dallas Wings',
  Valkyries: 'Golden State Valkyries',
  Fever: 'Indiana Fever',
  Aces: 'Las Vegas Aces',
  Sparks: 'Los Angeles Sparks',
  Lynx: 'Minnesota Lynx',
  Liberty: 'New York Liberty',
  Mercury: 'Phoenix Mercury',
  Storm: 'Seattle Storm',
  Mystics: 'Washington Mystics',
}

async function run() {
  console.log(`\n🏀 Arena Team Name Fix — ${isDryRun ? 'DRY RUN' : 'LIVE RUN'}\n`)

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
    process.exit(1)
  }

  if (!isDryRun && !process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ SANITY_API_WRITE_TOKEN is required for live runs')
    process.exit(1)
  }

  const arenas = await client.fetch(
    `*[_type == "arenas"] { _id, name, gallery[] { _key, name, teamType, played, link, alt, asset } }`
  )

  console.log(`Found ${arenas.length} arena document(s)\n`)

  let updatedCount = 0

  for (const arena of arenas) {
    if (!arena.gallery || arena.gallery.length === 0) {
      console.log(`⚪ ${arena.name} — no gallery entries, skipping`)
      continue
    }

    const updatedGallery = arena.gallery.map((entry) => {
      const currentName = entry.name?.trim()
      const fullName = TEAM_NAME_MAP[currentName]

      if (fullName && fullName !== currentName) {
        console.log(`  ✏️  "${currentName}" → "${fullName}"`)
        return { ...entry, name: fullName }
      }

      return entry
    })

    const hasChanges = updatedGallery.some(
      (entry, i) => entry.name !== arena.gallery[i].name
    )

    if (!hasChanges) {
      console.log(`✅ ${arena.name} — all team names already correct`)
      continue
    }

    console.log(`🔄 ${arena.name} (${arena._id})`)

    if (!isDryRun) {
      await client
        .patch(arena._id)
        .set({ gallery: updatedGallery })
        .commit()
      console.log(`   ✅ Saved`)
    } else {
      console.log(`   [dry run — no changes written]`)
    }

    updatedCount++
  }

  console.log(`\n${isDryRun ? 'Dry run complete' : 'Done'} — ${updatedCount} arena(s) ${isDryRun ? 'would be' : 'were'} updated.`)

  if (isDryRun && updatedCount > 0) {
    console.log(`\nRun with --no-dry-run to apply changes:\n  npm run fix-arena-teams:live\n`)
  }
}

run().catch((err) => {
  console.error('❌ Script failed:', err.message)
  process.exit(1)
})
