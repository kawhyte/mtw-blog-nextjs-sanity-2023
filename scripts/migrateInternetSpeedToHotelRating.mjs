#!/usr/bin/env node

/**
 * Migration: Copy top-level internetSpeed → hotelRating.internetSpeed
 *
 * Previous schema stored the measured Mbps value at hotelReview.internetSpeed.
 * The new schema stores it at hotelReview.hotelRating.internetSpeed so it lives
 * alongside the other rating fields in Studio.
 *
 * This script copies the old value into the new location for every document
 * that has the old value but not the new one. Safe to re-run — only touches
 * documents where hotelRating.internetSpeed is still undefined.
 *
 * Usage:
 *   node scripts/migrateInternetSpeedToHotelRating.mjs          # dry run (default)
 *   node scripts/migrateInternetSpeedToHotelRating.mjs --live   # write to Sanity
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

const IS_LIVE = process.argv.includes('--live')

async function run() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
    process.exit(1)
  }
  if (IS_LIVE && !process.env.SANITY_API_WRITE_TOKEN) {
    console.error('Missing SANITY_API_WRITE_TOKEN — required for --live mode')
    process.exit(1)
  }

  console.log('\n=== Migrate internetSpeed → hotelRating.internetSpeed ===')
  console.log(`Mode:    ${IS_LIVE ? 'LIVE (writing to Sanity)' : 'DRY RUN (no writes)'}`)
  console.log(`Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}\n`)

  const docs = await client.fetch(
    `*[_type == "hotelReview" && defined(internetSpeed) && !defined(hotelRating.internetSpeed)]{
      _id, _rev, title, internetSpeed
    }`,
  )

  console.log(`Found ${docs.length} document(s) to migrate.\n`)

  if (docs.length === 0) {
    console.log('Nothing to do — all documents are already up to date.')
    return
  }

  let patched = 0
  for (const doc of docs) {
    console.log(`  ${IS_LIVE ? 'PATCH' : 'DRY  '} ${doc._id}  "${doc.title}"`)
    console.log(`         internetSpeed: ${doc.internetSpeed} → hotelRating.internetSpeed: ${doc.internetSpeed}`)

    if (IS_LIVE) {
      await client
        .patch(doc._id)
        .set({ 'hotelRating.internetSpeed': doc.internetSpeed })
        .commit()
    }
    patched++
  }

  console.log(`\n=== Summary ===`)
  console.log(`Documents ${IS_LIVE ? 'patched' : 'identified'}: ${patched}`)
  console.log(
    IS_LIVE
      ? 'Migration complete.'
      : 'Dry run complete. Re-run with --live to apply.',
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
