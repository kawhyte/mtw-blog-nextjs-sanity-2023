#!/usr/bin/env node

/**
 * Bulk Summary Rewriter — Meet the Whytes
 *
 * For every published hotel review and food review that already has an excerpt2
 * (Hotel Summary / Restaurant Summary), rewrites it in the Meet the Whytes voice
 * using Gemini — keeping all the facts but stripping the copy-pasted brochure tone.
 *
 * Usage:
 *   npm run generate-summaries          # Dry run (prints before/after, no changes)
 *   npm run generate-summaries:live     # Write to Sanity
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

if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.error('❌  SANITY_API_WRITE_TOKEN is not set in .env.local')
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

// ─── UTILITIES ───────────────────────────────────────────────────────────────

function toPlainText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((c) => c.text || '').join(''))
    .join(' ')
    .trim()
}

function textToBlocks(text) {
  return text
    .split('\n\n')
    .filter(Boolean)
    .map((para) => ({
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).slice(2),
          text: para.trim(),
          marks: [],
        },
      ],
    }))
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const VOICE_RULES = `VOICE RULES — follow every one:
- Write as "we" (a couple traveling together)
- Use "&" instead of "and" in casual phrasing — not every sentence, just naturally
- State opinions directly: "top-notch", "exactly what we needed", "worth the stay"
- If the original mentions anything practical or honest, keep it
- FORBIDDEN words — never use: showcasing, stunning, vibrant, world-class, nestled, boasting, iconic, impeccable, seamlessly, state-of-the-art, culinary, modern amenities`

// ─── PROMPT BUILDERS ─────────────────────────────────────────────────────────

function buildHotelPrompt(doc, currentText) {
  return `You are rewriting the intro summary for "Meet the Whytes," a travel couple's blog covering hotels, NBA arenas, and food.

The current summary was copied from the hotel's website and reads like marketing copy. Rewrite it so it sounds like a real couple wrote it after staying there — honest, direct, and grounded in real travel.

CURRENT SUMMARY (keep the facts, change the voice):
"${currentText}"

Hotel: ${doc.title}
Location: ${doc.location || 'Unknown'}

${VOICE_RULES}

SEO RULES:
- Include "${doc.title}" naturally (do not force it in awkwardly)
- Include "${doc.location || 'the city'}" at least once
- Target exactly 400–500 characters total — count carefully, do not go under 400 or over 500

Return ONLY the rewritten summary. No quotes. No explanation. No label.`
}

function buildFoodPrompt(doc, currentText) {
  const diningLabel = doc.diningType === 'takeout' ? 'takeout' : 'dine-in'

  return `You are rewriting the intro summary for "Meet the Whytes," a travel couple's blog covering restaurants, hotels, and NBA arenas.

The current summary was copied from the restaurant's website and reads like marketing copy. Rewrite it so it sounds like a real couple wrote it after eating there — honest, direct, and grounded in real experience.

CURRENT SUMMARY (keep the facts, change the voice):
"${currentText}"

Restaurant: ${doc.title}
Location: ${doc.location || 'Unknown'}
Experience type: ${diningLabel}

${VOICE_RULES}
- Use sensory food language when relevant: textures, flavors, temperatures

SEO RULES:
- Include "${doc.title}" naturally
- Include "${doc.location || 'the city'}" at least once
- Target exactly 400–500 characters total — count carefully, do not go under 400 or over 500

Return ONLY the rewritten summary. No quotes. No explanation. No label.`
}

// ─── GEMINI CALL ─────────────────────────────────────────────────────────────

async function rewriteSummary(prompt) {
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.75 },
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
  return text.replace(/^["']|["']$/g, '').trim()
}

// ─── PROCESS ONE DOC ─────────────────────────────────────────────────────────

let totalRewritten = 0
let totalSkipped = 0
let totalErrors = 0

async function processDoc(label, doc, buildPrompt) {
  const currentText = toPlainText(doc.excerpt2)

  if (!currentText) {
    console.log(`  ⏭  ${label} — no existing summary, skipping`)
    totalSkipped++
    return
  }

  try {
    const rewritten = await rewriteSummary(buildPrompt(doc, currentText))
    const charCount = rewritten.length
    const warning =
      charCount < 400 || charCount > 500 ? ` ⚠ ${charCount} chars` : ` (${charCount} chars)`

    console.log(`  ✅  ${label}${warning}`)
    console.log(`      BEFORE: "${currentText.slice(0, 120)}${currentText.length > 120 ? '…' : ''}"`)
    console.log(`      AFTER:  "${rewritten}"`)

    if (!isDryRun) {
      await client.patch(doc._id).set({ excerpt2: textToBlocks(rewritten) }).commit()
    }

    totalRewritten++
    await sleep(1000)
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
    `*[_type == "hotelReview" && !(_id in path("drafts.**")) && defined(excerpt2) && length(excerpt2) > 0] | order(title asc) {
      _id, title, location, diningType, excerpt2
    }`,
  )

  console.log(`   Found ${hotels.length} hotel reviews with summaries`)

  for (const hotel of hotels) {
    await processDoc(hotel.title ?? hotel._id, hotel, buildHotelPrompt)
  }
}

// ─── FOOD REVIEWS ────────────────────────────────────────────────────────────

async function processFoodReviews() {
  console.log('\n🍽  Processing Food Reviews…')

  const foods = await client.fetch(
    `*[_type == "foodReview" && !(_id in path("drafts.**")) && defined(excerpt2) && length(excerpt2) > 0] | order(title asc) {
      _id, title, location, diningType, excerpt2
    }`,
  )

  console.log(`   Found ${foods.length} food reviews with summaries`)

  for (const food of foods) {
    await processDoc(food.title ?? food._id, food, buildFoodPrompt)
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Meet the Whytes — Bulk Summary Rewriter')
  console.log(`  Mode: ${isDryRun ? '🔍 DRY RUN (no changes made)' : '✍️  LIVE (writing to Sanity)'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await processHotelReviews()
  await processFoodReviews()

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  ✅ Rewritten: ${totalRewritten}`)
  console.log(`  ⏭  Skipped:  ${totalSkipped}`)
  console.log(`  ❌ Errors:   ${totalErrors}`)
  if (isDryRun) {
    console.log('\n  Run with --no-dry-run to write changes to Sanity.')
    console.log('  npm run generate-summaries:live')
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
