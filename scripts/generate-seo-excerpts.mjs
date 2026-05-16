#!/usr/bin/env node

/**
 * Bulk SEO Excerpt Generator — Meet the Whytes
 *
 * For every published hotel review and food review that has no seoExcerpt,
 * calls Gemini to generate a 120-155 character, human-sounding meta description
 * grounded in the document's real content, then patches Sanity.
 *
 * Usage:
 *   npm run generate-seo-excerpts          # Dry run (prints, no changes)
 *   npm run generate-seo-excerpts:live     # Write to Sanity
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.error('❌  GEMINI_API_KEY is not set in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const isDryRun = !process.argv.includes('--no-dry-run')

// Strip Sanity Portable Text to a plain string
function toPlainText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((c) => c.text || '').join(''))
    .join(' ')
    .trim()
}

function buildHotelPrompt(doc) {
  const highlights = (doc.positives || [])
    .slice(0, 3)
    .join(' | ')

  const wouldReturnMap = {
    yes: 'Yes, absolutely',
    if_prices_drop: 'Yes, if prices drop',
    maybe: 'Maybe',
    no: 'No',
  }

  const summary = toPlainText(doc.excerpt2)

  return `You are writing SEO meta descriptions for "Meet the Whytes," a travel blog by a family that visits NBA arenas and reviews hotels along the way.

Hotel: ${doc.title}
City / Location: ${doc.location || 'Unknown'}
Type: ${doc.category || 'hotel'}
${highlights ? `What stood out during our stay: ${highlights}` : ''}
${summary ? `Our summary: ${summary.slice(0, 200)}` : ''}
${doc.wouldReturn ? `Would we go back: ${wouldReturnMap[doc.wouldReturn] || doc.wouldReturn}` : ''}

Write ONE meta description for Google search results. It MUST:
- Be between 120 and 155 characters — count every character carefully
- Sound like a real traveler wrote it, not marketing copy or AI
- Include the hotel name and city/location
- Mention at least one specific, honest detail from the stay
- End with something that makes a reader want to click through
- NEVER use: stunning, vibrant, nestled, boasting, offering, showcasing, modern, iconic, world-class, state-of-the-art, perfect for, ideal for, luxurious

Return ONLY the meta description. No quotes. No explanation. No label.`
}

function buildFoodPrompt(doc) {
  const highlights = (doc.positives || [])
    .slice(0, 3)
    .join(' | ')

  const summary = toPlainText(doc.excerpt2)
  const diningLabel = doc.diningType === 'takeout' ? 'Takeout' : 'Dine-in'

  return `You are writing SEO meta descriptions for "Meet the Whytes," a travel blog by a family that visits NBA arenas and reviews restaurants along the way.

Restaurant: ${doc.title}
City / Location: ${doc.location || 'Unknown'}
Experience type: ${diningLabel}
${highlights ? `What stood out: ${highlights}` : ''}
${summary ? `Our summary: ${summary.slice(0, 200)}` : ''}

Write ONE meta description for Google search results. It MUST:
- Be between 120 and 155 characters — count every character carefully
- Sound like a real person wrote it, not a food critic or AI
- Include the restaurant name and city/location
- Mention something specific and honest about the food or experience
- NEVER use: stunning, vibrant, nestled, boasting, offering, showcasing, modern, iconic, world-class, mouthwatering, delightful, exquisite

Return ONLY the meta description. No quotes. No explanation. No label.`
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let totalGenerated = 0
let totalSkipped = 0
let totalErrors = 0

async function generateExcerpt(prompt) {
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 60, temperature: 0.5 },
      }),
    },
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error?.message ?? `Gemini error ${res.status}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!text) throw new Error('Empty response from Gemini')
  // Strip any surrounding quotes Gemini sometimes adds
  return text.replace(/^["']|["']$/g, '').trim()
}

async function processDoc(label, doc, buildPrompt) {
  if (doc.seoExcerpt?.trim()) {
    console.log(`  ⏭  ${label} — already has seoExcerpt, skipping`)
    totalSkipped++
    return
  }

  try {
    const excerpt = await generateExcerpt(buildPrompt(doc))
    const charCount = excerpt.length
    const warning = charCount < 120 || charCount > 155 ? ` ⚠ ${charCount} chars` : ` (${charCount} chars)`

    console.log(`  ✅  ${label}${warning}`)
    console.log(`      → "${excerpt}"`)

    if (!isDryRun) {
      await client.patch(doc._id).set({ seoExcerpt: excerpt }).commit()
    }

    totalGenerated++
    await sleep(5000)
  } catch (err) {
    console.error(`  ❌  ${label} — ${err.message}`)
    totalErrors++
    await sleep(2000)
  }
}

// ─── HOTEL REVIEWS ───────────────────────────────────────────────────────────

async function processHotelReviews() {
  console.log('\n🏨  Processing Hotel Reviews…')

  const hotels = await client.fetch(
    `*[_type == "hotelReview" && (!defined(publishedAt) || publishedAt <= now())] | order(title asc) {
      _id, title, location, category, excerpt2, positives, wouldReturn, priceTier, seoExcerpt
    }`,
  )

  console.log(`   Found ${hotels.length} hotel reviews`)

  for (const hotel of hotels) {
    await processDoc(hotel.title ?? hotel._id, hotel, buildHotelPrompt)
  }
}

// ─── FOOD REVIEWS ────────────────────────────────────────────────────────────

async function processFoodReviews() {
  console.log('\n🍽  Processing Food Reviews…')

  const foods = await client.fetch(
    `*[_type == "foodReview" && (!defined(publishedAt) || publishedAt <= now())] | order(title asc) {
      _id, title, location, diningType, excerpt2, positives, priceTier, seoExcerpt
    }`,
  )

  console.log(`   Found ${foods.length} food reviews`)

  for (const food of foods) {
    await processDoc(food.title ?? food._id, food, buildFoodPrompt)
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Meet the Whytes — Bulk SEO Excerpt Generator')
  console.log(`  Mode: ${isDryRun ? '🔍 DRY RUN (no changes)' : '✍️  LIVE (writing to Sanity)'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await processHotelReviews()
  await processFoodReviews()

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  ✅ Generated: ${totalGenerated}`)
  console.log(`  ⏭  Skipped:   ${totalSkipped}`)
  console.log(`  ❌ Errors:    ${totalErrors}`)
  if (isDryRun) {
    console.log('\n  Run with --no-dry-run to write changes to Sanity.')
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
