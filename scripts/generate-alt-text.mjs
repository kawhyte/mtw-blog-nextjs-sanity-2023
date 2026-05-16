#!/usr/bin/env node

/**
 * Bulk Alt Text Generator — Meet the Whytes
 *
 * Iterates over all published arenas, hotel reviews, and food reviews.
 * For each image field that has no alt text, calls Gemini 1.5 Flash to
 * generate SEO-rich, human-sounding alt text, then patches Sanity.
 * Skips any image that already has alt text.
 *
 * Usage:
 *   npm run generate-alt-text          # Dry run (no changes)
 *   npm run generate-alt-text:live     # Write to Sanity
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

// "image-{hexid}-{WxH}-{format}" → Sanity CDN URL
function assetRefToUrl(ref) {
  const withoutPrefix = ref.replace(/^image-/, '')
  const lastHyphen = withoutPrefix.lastIndexOf('-')
  const idAndDims = withoutPrefix.slice(0, lastHyphen)
  const format = withoutPrefix.slice(lastHyphen + 1)
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${idAndDims}.${format}`
}

function buildPrompt(contentType, docTitle) {
  const base = `You are writing alt text for "Meet the Whytes," a travel blog about NBA/WNBA arena visits, hotel stays, and food experiences.`

  const context =
    {
      arenas: `This image is from an NBA/WNBA arena visit${docTitle ? ` — ${docTitle}` : ''}.`,
      hotelReview: `This image is from a hotel stay${docTitle ? ` at ${docTitle}` : ''}.`,
      foodReview: `This image is from a meal or restaurant${docTitle ? ` — ${docTitle}` : ''}.`,
    }[contentType] ?? ''

  return `${base} ${context}

Write alt text the way a travel writer would naturally caption a photo — specific, direct, and real. It must sound like a human wrote it, not an AI.

Rules:
- Describe exactly what is shown (the court, the seats, the dish, the room, the view, etc.)
- Include specific details: arena name, city, hotel name, dish name — only if clearly visible or inferable
- 50–120 characters total
- Do NOT use these AI/marketing words: "showcasing", "featuring", "stunning", "vibrant", "modern", "iconic", "offering", "boasting", "nestled", "beautiful views of", "world-class", "state-of-the-art"
- Do NOT start with "image of", "photo of", or "picture of"
- Write like you're texting a friend what the photo shows

Return ONLY the alt text. No quotes. No explanation.`
}

async function generateAltText(assetRef, contentType, docTitle) {
  const imageUrl = assetRefToUrl(assetRef)

  const imageRes = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) })
  if (!imageRes.ok) throw new Error(`Image fetch failed: ${imageRes.status} ${imageUrl}`)

  const mimeType = (imageRes.headers.get('content-type') ?? 'image/jpeg').split(';')[0]
  const imageBuffer = await imageRes.arrayBuffer()
  const base64 = Buffer.from(imageBuffer).toString('base64')

  const geminiRes = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inlineData: { mimeType, data: base64 } },
              { text: buildPrompt(contentType, docTitle) },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 80, temperature: 0.4 },
      }),
    },
  )

  if (!geminiRes.ok) {
    const err = await geminiRes.json()
    throw new Error(err?.error?.message ?? `Gemini error ${geminiRes.status}`)
  }

  const data = await geminiRes.json()
  const altText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!altText) throw new Error('Empty response from Gemini')
  return altText
}

// Rate limit: 1 request per 5 seconds (12/min, safely under the 15/min free tier)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let totalGenerated = 0
let totalSkipped = 0
let totalErrors = 0

async function processImage(label, assetRef, existingAlt, patchFn, contentType, docTitle) {
  if (existingAlt?.trim()) {
    console.log(`  ⏭  ${label} — already has alt text, skipping`)
    totalSkipped++
    return
  }

  if (!assetRef) {
    console.log(`  ⚠  ${label} — no asset ref, skipping`)
    totalSkipped++
    return
  }

  try {
    const altText = await generateAltText(assetRef, contentType, docTitle)
    console.log(`  ✅  ${label}`)
    console.log(`      → "${altText}"`)

    if (!isDryRun) {
      await patchFn(altText)
    }

    totalGenerated++
    await sleep(5000)
  } catch (err) {
    console.error(`  ❌  ${label} — ${err.message}`)
    totalErrors++
    await sleep(8000)
  }
}

// ─── ARENAS ──────────────────────────────────────────────────────────────────

async function processArenas() {
  console.log('\n🏟  Processing Arenas…')

  const arenas = await client.fetch(
    `*[_type == "arenas"] | order(name asc) {
      _id, name,
      arenaImage { "assetRef": asset._ref, alt },
      imageGallery[] { _key, "assetRef": asset._ref, alt }
    }`,
  )

  console.log(`   Found ${arenas.length} arenas`)

  for (const arena of arenas) {
    const label = arena.name ?? arena._id
    console.log(`\n  📍 ${label}`)

    // coverImage (arenaImage)
    if (arena.arenaImage?.assetRef) {
      await processImage(
        'arenaImage.alt',
        arena.arenaImage.assetRef,
        arena.arenaImage.alt,
        async (altText) => {
          await client
            .patch(arena._id)
            .set({ 'arenaImage.alt': altText })
            .commit()
        },
        'arenas',
        arena.name,
      )
    }

    // imageGallery items
    if (arena.imageGallery?.length) {
      const updated = [...arena.imageGallery]
      let changed = false

      for (let i = 0; i < updated.length; i++) {
        const item = updated[i]
        if (!item.assetRef || item.alt?.trim()) {
          if (item.alt?.trim()) {
            console.log(`  ⏭  imageGallery[${i}].alt — already has alt text, skipping`)
            totalSkipped++
          }
          continue
        }

        try {
          const altText = await generateAltText(item.assetRef, 'arenas', arena.name)
          console.log(`  ✅  imageGallery[${i}].alt`)
          console.log(`      → "${altText}"`)
          updated[i] = { ...item, alt: altText }
          changed = true
          totalGenerated++
          await sleep(5000)
        } catch (err) {
          console.error(`  ❌  imageGallery[${i}].alt — ${err.message}`)
          totalErrors++
          await sleep(8000)
        }
      }

      if (changed && !isDryRun) {
        await client.patch(arena._id).set({ imageGallery: updated }).commit()
      }
    }
  }
}

// ─── HOTEL REVIEWS ───────────────────────────────────────────────────────────

async function processHotelReviews() {
  console.log('\n🏨  Processing Hotel Reviews…')

  const hotels = await client.fetch(
    `*[_type == "hotelReview" && (!defined(publishedAt) || publishedAt <= now())] | order(title asc) {
      _id, title,
      coverImage { "assetRef": asset._ref, alt },
      gallery[] { _key, "assetRef": asset._ref, alt }
    }`,
  )

  console.log(`   Found ${hotels.length} hotel reviews`)

  for (const hotel of hotels) {
    console.log(`\n  📍 ${hotel.title ?? hotel._id}`)

    // coverImage
    if (hotel.coverImage?.assetRef) {
      await processImage(
        'coverImage.alt',
        hotel.coverImage.assetRef,
        hotel.coverImage.alt,
        async (altText) => {
          await client
            .patch(hotel._id)
            .set({ 'coverImage.alt': altText })
            .commit()
        },
        'hotelReview',
        hotel.title,
      )
    }

    // gallery items
    if (hotel.gallery?.length) {
      const updated = [...hotel.gallery]
      let changed = false

      for (let i = 0; i < updated.length; i++) {
        const item = updated[i]
        if (!item.assetRef || item.alt?.trim()) {
          if (item.alt?.trim()) {
            console.log(`  ⏭  gallery[${i}].alt — already has alt text, skipping`)
            totalSkipped++
          }
          continue
        }

        try {
          const altText = await generateAltText(item.assetRef, 'hotelReview', hotel.title)
          console.log(`  ✅  gallery[${i}].alt`)
          console.log(`      → "${altText}"`)
          updated[i] = { ...item, alt: altText }
          changed = true
          totalGenerated++
          await sleep(5000)
        } catch (err) {
          console.error(`  ❌  gallery[${i}].alt — ${err.message}`)
          totalErrors++
          await sleep(8000)
        }
      }

      if (changed && !isDryRun) {
        await client.patch(hotel._id).set({ gallery: updated }).commit()
      }
    }
  }
}

// ─── FOOD REVIEWS ────────────────────────────────────────────────────────────

async function processFoodReviews() {
  console.log('\n🍽  Processing Food Reviews…')

  const foods = await client.fetch(
    `*[_type == "foodReview" && (!defined(publishedAt) || publishedAt <= now())] | order(title asc) {
      _id, title,
      coverImage { "assetRef": asset._ref, alt },
      gallery[] { _key, "assetRef": asset._ref, alt }
    }`,
  )

  console.log(`   Found ${foods.length} food reviews`)

  for (const food of foods) {
    console.log(`\n  📍 ${food.title ?? food._id}`)

    // coverImage
    if (food.coverImage?.assetRef) {
      await processImage(
        'coverImage.alt',
        food.coverImage.assetRef,
        food.coverImage.alt,
        async (altText) => {
          await client
            .patch(food._id)
            .set({ 'coverImage.alt': altText })
            .commit()
        },
        'foodReview',
        food.title,
      )
    }

    // gallery items
    if (food.gallery?.length) {
      const updated = [...food.gallery]
      let changed = false

      for (let i = 0; i < updated.length; i++) {
        const item = updated[i]
        if (!item.assetRef || item.alt?.trim()) {
          if (item.alt?.trim()) {
            console.log(`  ⏭  gallery[${i}].alt — already has alt text, skipping`)
            totalSkipped++
          }
          continue
        }

        try {
          const altText = await generateAltText(item.assetRef, 'foodReview', food.title)
          console.log(`  ✅  gallery[${i}].alt`)
          console.log(`      → "${altText}"`)
          updated[i] = { ...item, alt: altText }
          changed = true
          totalGenerated++
          await sleep(5000)
        } catch (err) {
          console.error(`  ❌  gallery[${i}].alt — ${err.message}`)
          totalErrors++
          await sleep(8000)
        }
      }

      if (changed && !isDryRun) {
        await client.patch(food._id).set({ gallery: updated }).commit()
      }
    }
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Meet the Whytes — Bulk Alt Text Generator')
  console.log(`  Mode: ${isDryRun ? '🔍 DRY RUN (no changes)' : '✍️  LIVE (writing to Sanity)'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await processArenas()
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
