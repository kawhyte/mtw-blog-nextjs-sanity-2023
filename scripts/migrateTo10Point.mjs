#!/usr/bin/env node

/**
 * Migration: Hotel & Food Ratings 5-Point → 10-Point Scale
 *
 * Multiplies every numeric rating field by 2 (e.g. 4.5 → 9.0).
 * Sets _ratingScale: 10 on processed documents to prevent re-migration.
 * N/A sentinel values (0 for Pool/Gym/Internet_Speed) remain 0 after ×2.
 *
 * Scope:
 *   - hotelReview documents (hotelRating object)
 *   - foodReview documents (foodRating and takeoutRating objects)
 *
 * NOT migrated:
 *   - nbaArenas / arenaReview  — already on 1–10 scale
 *   - individualFoodRating     — per-dish stars, separate from weighted scores
 *
 * Usage:
 *   node scripts/migrateTo10Point.mjs          # dry run (default)
 *   node scripts/migrateTo10Point.mjs --live   # write to Sanity
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

// Hotel rating field names stored inside hotelRating object
const HOTEL_RATING_FIELDS = [
  'Location',
  'Room_Cleanliness',
  'Service',
  'Bed_Comfort',
  'Internet_Speed',
  'Room_Amenities',
  'Gym',
  'Pool',
  'Value',
]

// Dine-in food rating field names stored inside foodRating object
const FOOD_RATING_FIELDS = [
  'Restaurant_Location',
  'Flavor_and_Taste',
  'Presentation_on_Plate',
  'Restaurant_Service',
  'Restaurant_Cleanliness',
  'Memorability',
  'Food_Value',
]

// Takeout rating field names stored inside takeoutRating object
const TAKEOUT_RATING_FIELDS = [
  'packaging',
  'tasteAndFlavor',
  'presentation',
  'accuracy',
  'overallSatisfaction',
  'foodValue',
]

/**
 * Multiply all numeric rating fields by 2.
 * Returns a patch object for the given ratingObject key.
 */
function buildRatingPatch(ratingObject, fieldNames, parentKey) {
  if (!ratingObject) return {}
  const patch = {}
  for (const field of fieldNames) {
    const current = ratingObject[field]
    if (typeof current === 'number') {
      patch[`${parentKey}.${field}`] = current * 2
    }
  }
  return patch
}

async function migrateHotelReviews() {
  const docs = await client.fetch(
    `*[_type == "hotelReview" && defined(hotelRating) && _ratingScale != 10]{
      _id, _rev, hotelRating, _ratingScale
    }`,
  )

  console.log(`\nFound ${docs.length} hotelReview document(s) to migrate.`)

  let patched = 0
  for (const doc of docs) {
    const ratingPatch = buildRatingPatch(
      doc.hotelRating,
      HOTEL_RATING_FIELDS,
      'hotelRating',
    )
    if (Object.keys(ratingPatch).length === 0) {
      console.log(`  SKIP ${doc._id} — no numeric fields found`)
      continue
    }

    console.log(`  ${IS_LIVE ? 'PATCH' : 'DRY'} ${doc._id}`)
    for (const [key, val] of Object.entries(ratingPatch)) {
      const old = doc.hotelRating[key.split('.')[1]]
      console.log(`    ${key}: ${old} → ${val}`)
    }

    if (IS_LIVE) {
      await client
        .patch(doc._id)
        .set({ ...ratingPatch, _ratingScale: 10 })
        .commit()
    }
    patched++
  }

  return patched
}

async function migrateFoodReviews() {
  const docs = await client.fetch(
    `*[_type == "foodReview" && (defined(foodRating) || defined(takeoutRating)) && _ratingScale != 10]{
      _id, _rev, foodRating, takeoutRating, _ratingScale
    }`,
  )

  console.log(`\nFound ${docs.length} foodReview document(s) to migrate.`)

  let patched = 0
  for (const doc of docs) {
    const dineInPatch = buildRatingPatch(
      doc.foodRating,
      FOOD_RATING_FIELDS,
      'foodRating',
    )
    const takeoutPatch = buildRatingPatch(
      doc.takeoutRating,
      TAKEOUT_RATING_FIELDS,
      'takeoutRating',
    )
    const combinedPatch = { ...dineInPatch, ...takeoutPatch }

    if (Object.keys(combinedPatch).length === 0) {
      console.log(`  SKIP ${doc._id} — no numeric fields found`)
      continue
    }

    console.log(`  ${IS_LIVE ? 'PATCH' : 'DRY'} ${doc._id}`)
    for (const [key, val] of Object.entries(combinedPatch)) {
      const parts = key.split('.')
      const ratingObj =
        parts[0] === 'foodRating' ? doc.foodRating : doc.takeoutRating
      const old = ratingObj?.[parts[1]]
      console.log(`    ${key}: ${old} → ${val}`)
    }

    if (IS_LIVE) {
      await client
        .patch(doc._id)
        .set({ ...combinedPatch, _ratingScale: 10 })
        .commit()
    }
    patched++
  }

  return patched
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
    process.exit(1)
  }
  if (IS_LIVE && !process.env.SANITY_API_WRITE_TOKEN) {
    console.error('Missing SANITY_API_WRITE_TOKEN — required for --live mode')
    process.exit(1)
  }

  console.log(`\n=== Rating Scale Migration: 5-point → 10-point ===`)
  console.log(
    `Mode: ${IS_LIVE ? 'LIVE (writing to Sanity)' : 'DRY RUN (no writes)'}`,
  )
  console.log(`Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`)

  const hotelCount = await migrateHotelReviews()
  const foodCount = await migrateFoodReviews()

  console.log(`\n=== Summary ===`)
  console.log(`Hotel reviews processed: ${hotelCount}`)
  console.log(`Food reviews processed:  ${foodCount}`)
  console.log(
    IS_LIVE
      ? 'Migration complete.'
      : 'Dry run complete. Re-run with --live to apply.',
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
