#!/usr/bin/env node

/**
 * One-time cleanup script — Meet the Whytes
 *
 * Fixes two pre-existing Sanity Studio warnings that appear on hotel and food reviews:
 *
 * 1. "Invalid property value — must be type array, current value is null"
 *    Caused by optional array fields (negatives, tip, gallery, etc.) that were explicitly
 *    stored as null rather than being absent. Fix: unset them so they're simply absent.
 *
 * 2. "Unknown field found — Robes: No"
 *    The Robes field was removed from the roomAmenities schema but still exists in old
 *    hotel documents. Fix: unset roomAmenities.Robes from those documents.
 *
 * These errors predate any recent changes — no rating data, content, or other fields
 * are touched by this script.
 *
 * Usage:
 *   npm run fix-null-fields          # Dry run (prints, no changes)
 *   npm run fix-null-fields:live     # Write to Sanity
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const isDryRun = !process.argv.includes('--no-dry-run')

// Optional array fields that may be stored as null on hotel reviews
const HOTEL_ARRAY_FIELDS = ['negatives', 'tip', 'gallery', 'content', 'tags', 'bestFor']

// Optional array fields that may be stored as null on food reviews
const FOOD_ARRAY_FIELDS = ['negatives', 'tip', 'gallery', 'content', 'tags', 'excerpt2', 'individualFoodRating']

let totalFixed = 0
let totalClean = 0
let totalErrors = 0

async function fixDocument(docId, label, fieldsToUnset) {
  if (fieldsToUnset.length === 0) {
    totalClean++
    return
  }

  console.log(`  🔧  ${label}`)
  console.log(`      unset: ${fieldsToUnset.join(', ')}`)

  if (!isDryRun) {
    try {
      await client.patch(docId).unset(fieldsToUnset).commit()
      totalFixed++
    } catch (err) {
      console.error(`  ❌  ${label} — ${err.message}`)
      totalErrors++
    }
  } else {
    totalFixed++
  }
}

// ─── HOTEL REVIEWS ───────────────────────────────────────────────────────────

async function fixHotelReviews() {
  console.log('\n🏨  Checking Hotel Reviews…')

  const hotels = await client.fetch(
    `*[_type == "hotelReview"] | order(title asc) {
      _id,
      title,
      negatives,
      tip,
      gallery,
      content,
      tags,
      bestFor,
      "robes": roomAmenities.Robes
    }`,
  )

  console.log(`   Found ${hotels.length} hotel reviews`)

  let needsWork = 0

  for (const hotel of hotels) {
    const label = hotel.title ?? hotel._id
    const toUnset = []

    // Check each optional array field for null
    for (const field of HOTEL_ARRAY_FIELDS) {
      if (hotel[field] === null) {
        toUnset.push(field)
      }
    }

    // Check for orphaned Robes field
    if (hotel.robes !== undefined && hotel.robes !== null) {
      toUnset.push('roomAmenities.Robes')
    }

    if (toUnset.length > 0) needsWork++
    await fixDocument(hotel._id, label, toUnset)
  }

  console.log(`   ${needsWork} documents need cleanup, ${hotels.length - needsWork} are clean`)
}

// ─── FOOD REVIEWS ────────────────────────────────────────────────────────────

async function fixFoodReviews() {
  console.log('\n🍽  Checking Food Reviews…')

  const foods = await client.fetch(
    `*[_type == "foodReview"] | order(title asc) {
      _id,
      title,
      negatives,
      tip,
      gallery,
      content,
      tags,
      excerpt2,
      individualFoodRating
    }`,
  )

  console.log(`   Found ${foods.length} food reviews`)

  let needsWork = 0

  for (const food of foods) {
    const label = food.title ?? food._id
    const toUnset = []

    for (const field of FOOD_ARRAY_FIELDS) {
      if (food[field] === null) {
        toUnset.push(field)
      }
    }

    if (toUnset.length > 0) needsWork++
    await fixDocument(food._id, label, toUnset)
  }

  console.log(`   ${needsWork} documents need cleanup, ${foods.length - needsWork} are clean`)
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Meet the Whytes — Null Field Cleanup')
  console.log(`  Mode: ${isDryRun ? '🔍 DRY RUN (no changes)' : '✍️  LIVE (writing to Sanity)'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  This script only removes null values and')
  console.log('  orphaned fields. No real data is deleted.')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await fixHotelReviews()
  await fixFoodReviews()

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  🔧 Fixed:  ${totalFixed}`)
  console.log(`  ✅ Clean:  ${totalClean}`)
  console.log(`  ❌ Errors: ${totalErrors}`)
  if (isDryRun) {
    console.log('\n  Run with --no-dry-run to apply fixes to Sanity.')
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
