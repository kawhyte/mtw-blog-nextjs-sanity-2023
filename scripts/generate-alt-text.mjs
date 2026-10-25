#!/usr/bin/env node

/**
 * Bulk photo alt text + category, Meet the Whytes
 *
 * Two steps, so what gets written is exactly what Kenny reviewed:
 *
 *   npm run generate-alt-text        Suggest: asks Gemini for alt text and a
 *                                    photo category for every hero / gallery
 *                                    photo missing either, saves them to
 *                                    scripts/photo-suggestions/ and builds
 *                                    review.html there. Nothing is written to
 *                                    Sanity. Safe to stop and rerun: photos
 *                                    already suggested are skipped.
 *   npm run generate-alt-text:live   Write: copies the saved suggestions into
 *                                    Sanity (published and draft), only into
 *                                    fields that are still empty, after a
 *                                    backup in backups/.
 *
 * Options: --only=arenas,hotelReview,foodReview   --limit=50
 *
 * Built for Gemini's free tier: one call per photo, a pause between calls,
 * waits out per-minute limits and stops cleanly at the daily one (run again
 * tomorrow and it picks up where it left off).
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  altTextPrompt,
  stripDashes,
  trimToSentence,
} from '../lib/gemini-voice.ts'

dotenv.config({ path: '.env.local' })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent'

const isLive = process.argv.includes('--no-dry-run')
const arg = (name) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]
const only = arg('only')?.split(',')
const limit = Number(arg('limit')) || Infinity

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(HERE, 'photo-suggestions')
const SUGGESTIONS = path.join(OUT_DIR, 'suggestions.json')
const REVIEW = path.join(OUT_DIR, 'review.html')

// Gap between Gemini calls, keeps us under the free per-minute limit
const PACE_MS = 5000

// Same lists as the schemas (schemas/nbaArenas.ts, hotelReview.ts, foodReview.ts)
const TYPES = {
  arenas: {
    label: 'Arena',
    title: 'name',
    fields: ['heroPhotos', 'imageGallery'],
    categories: {
      court: 'Seating & Game Floor: court, baskets, view from your seat',
      concessions: 'Concessions & Food: food stalls, menu boards, food shots',
      exterior: 'Exterior: outside the building, signage, plaza',
      lobby: 'Entrances & Lobby: inside entrance, hallways, common areas',
      other: "Additional Photos: anything that doesn't fit above",
    },
  },
  hotelReview: {
    label: 'Hotel',
    title: 'title',
    fields: ['heroPhotos', 'gallery'],
    categories: {
      bedroom: 'Bedroom: bed, pillows, sleeping area',
      bathroom: 'Bathroom: shower, tub, vanity',
      'living-area': 'Living Area: sofa, desk, sitting space',
      'kitchen-coffee':
        'Kitchen / Coffee Station: coffee maker, mini fridge, kitchenette',
      view: 'View from the Room: cityscape, scenery, or balcony shot as seen from inside the room',
      'pool-fitness': 'Pool & Fitness: gym equipment, pool area',
      other: "Additional Photos: anything that doesn't fit above",
    },
  },
  foodReview: {
    label: 'Food',
    title: 'title',
    fields: ['heroPhotos', 'gallery'],
    categories: {
      'food-drinks': 'Food & Drinks: dishes, cocktails, desserts',
      interior: 'Interior & Atmosphere: dining room, tables, decor',
      exterior: 'Exterior: outside the building, signage, patio',
      menu: 'Menu: printed or digital menu shots',
      other: "Additional Photos: anything that doesn't fit above",
    },
  },
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: 'raw',
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const isEmpty = (value) => !value || !String(value).trim()
const baseId = (id) => id.replace(/^drafts\./, '')

// "image-{hexid}-{WxH}-{format}" → a sized JPEG from the Sanity CDN
function photoUrl(assetRef, width) {
  const withoutPrefix = assetRef.replace(/^image-/, '')
  const lastHyphen = withoutPrefix.lastIndexOf('-')
  const idAndDims = withoutPrefix.slice(0, lastHyphen)
  const format = withoutPrefix.slice(lastHyphen + 1)
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${idAndDims}.${format}?w=${width}&fit=max&fm=jpg&q=80`
}

function readSuggestions() {
  return fs.existsSync(SUGGESTIONS)
    ? JSON.parse(fs.readFileSync(SUGGESTIONS, 'utf8'))
    : {}
}

function saveSuggestions(suggestions) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(SUGGESTIONS, JSON.stringify(suggestions, null, 2))
}

/** Every hero / gallery photo, one entry per photo across draft + published */
async function findPhotos() {
  const types = Object.keys(TYPES).filter((t) => !only || only.includes(t))
  const docs = await client.fetch(
    `*[_type in $types]{ _id, _type, name, title,
      heroPhotos[]{ _key, alt, category, "assetRef": asset._ref },
      imageGallery[]{ _key, alt, category, "assetRef": asset._ref },
      gallery[]{ _key, alt, category, "assetRef": asset._ref } }`,
    { types },
  )
  // Published first, so its values win over an older draft's
  docs.sort(
    (a, b) =>
      Number(a._id.startsWith('drafts.')) - Number(b._id.startsWith('drafts.')),
  )

  const photos = new Map()
  for (const doc of docs) {
    const type = TYPES[doc._type]
    for (const field of type.fields) {
      for (const item of doc[field] ?? []) {
        if (!item?._key || !item.assetRef) continue
        const id = `${baseId(doc._id)}:${field}:${item._key}`
        const photo = photos.get(id) ?? {
          id,
          docId: baseId(doc._id),
          docType: doc._type,
          docTitle: doc[type.title] ?? '',
          field,
          key: item._key,
          assetRef: item.assetRef,
          needAlt: false,
          needCategory: false,
        }
        // Needs work if any version is missing it
        photo.needAlt ||= isEmpty(item.alt)
        photo.needCategory ||= isEmpty(item.category)
        photos.set(id, photo)
      }
    }
  }
  return [...photos.values()]
    .filter((p) => p.needAlt || p.needCategory)
    .sort(
      (a, b) =>
        a.docType.localeCompare(b.docType) ||
        a.docTitle.localeCompare(b.docTitle),
    )
}

class DailyLimitError extends Error {}

/** One Gemini call: alt text and category together */
async function suggest(photo) {
  const type = TYPES[photo.docType]
  const categories = Object.entries(type.categories)
  const prompt = `${altTextPrompt(photo.docType, photo.docTitle)}

Also pick the one photo category that fits best:
${categories.map(([value, text]) => `- ${value}: ${text}`).join('\n')}

Answer as JSON: {"alt": "the alt text", "category": "one of the values above"}`

  const imageRes = await fetch(photoUrl(photo.assetRef, 1024), {
    signal: AbortSignal.timeout(15000),
  })
  if (!imageRes.ok) throw new Error(`photo failed to load (${imageRes.status})`)
  const data = Buffer.from(await imageRes.arrayBuffer()).toString('base64')

  for (let attempt = 1; ; attempt++) {
    let res
    try {
      res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data } },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 200,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                alt: { type: 'STRING' },
                category: {
                  type: 'STRING',
                  enum: categories.map(([value]) => value),
                },
              },
              required: ['alt', 'category'],
            },
          },
        }),
      })
    } catch (err) {
      // Gemini sometimes hangs when it's busy: give it two more tries
      if (attempt <= 2) {
        await sleep(10000)
        continue
      }
      throw new Error(`Gemini didn't answer (${err.message})`)
    }

    if (res.ok) {
      const json = await res.json()
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text
      const answer = JSON.parse(text ?? '{}')
      if (!answer.alt || !type.categories[answer.category])
        throw new Error('Gemini gave an incomplete answer')
      const clean = stripDashes(answer.alt.trim())
      return {
        alt: clean.length > 150 ? trimToSentence(clean, 120) : clean,
        category: answer.category,
      }
    }

    const body = await res.json().catch(() => null)
    const message = body?.error?.message ?? `Gemini error ${res.status}`
    if (res.status === 429) {
      if (/per ?day|daily/i.test(JSON.stringify(body)))
        throw new DailyLimitError(message)
      // Per-minute limit: wait as long as Gemini asks, then try again
      const retry = body?.error?.details?.find((d) => d.retryDelay)?.retryDelay
      const waitMs = (parseFloat(retry) || 30) * 1000 + 1000
      if (attempt <= 3) {
        console.log(
          `   ⏳ Gemini's per-minute limit, waiting ${Math.round(waitMs / 1000)}s`,
        )
        await sleep(waitMs)
        continue
      }
    } else if (res.status >= 500 && attempt <= 2) {
      await sleep(5000)
      continue
    }
    throw new Error(message)
  }
}

const escape = (s) =>
  String(s ?? '').replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
  )

/** A page with every suggestion next to its photo, grouped by review */
function writeReview(suggestions) {
  const all = Object.values(suggestions)
  const ready = all.filter((s) => s.alt)
  const failed = all.filter((s) => s.error)
  const groups = new Map()
  for (const s of all) {
    const k = `${TYPES[s.docType].label}: ${s.docTitle}`
    groups.set(k, [...(groups.get(k) ?? []), s])
  }
  const card = (s) => `
    <figure${s.error ? ' class="err"' : ''}>
      <img loading="lazy" src="${photoUrl(s.assetRef, 400)}" alt="">
      <figcaption>
        <span class="tag">${escape(s.field)}</span>
        ${
          s.error
            ? `<p class="error">Not done: ${escape(s.error)}</p>`
            : `
        <p>${s.needAlt ? escape(s.alt) : '<i>keeps its alt text</i>'}</p>
        <p class="cat">${s.needCategory ? escape(TYPES[s.docType].categories[s.category]?.split(':')[0]) : '<i>keeps its category</i>'}</p>`
        }
      </figcaption>
    </figure>`
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Photo Alt Text Review</title>
<style>
  :root { --bg:#fff; --fg:#1f2937; --muted:#78716c; --line:#e7e5e4; --soft:#f7f5f2; --bad:#b91c1c; }
  @media (prefers-color-scheme: dark) { :root { --bg:#1c1917; --fg:#f5f5f4; --muted:#a8a29e; --line:#44403c; --soft:#292524; --bad:#f87171; } }
  body { margin:0; padding:24px 16px 64px; background:var(--bg); color:var(--fg); font:15px/1.5 system-ui, sans-serif; }
  main { max-width:1200px; margin:0 auto; }
  h1 { font-size:28px; margin:0 0 4px; } h2 { font-size:18px; margin:32px 0 12px; }
  .sub { color:var(--muted); margin:0 0 8px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:16px; }
  figure { margin:0; border:2px solid var(--line); border-radius:16px; overflow:hidden; background:var(--soft); }
  figure.err { border-color:var(--bad); }
  img { display:block; width:100%; aspect-ratio:4/3; object-fit:cover; background:var(--line); }
  figcaption { padding:10px 12px 12px; } figcaption p { margin:6px 0 0; }
  .tag { font-size:12px; color:var(--muted); } .cat { font-weight:700; } .error { color:var(--bad); }
  i { color:var(--muted); }
</style></head><body><main>
<h1>Photo alt text review</h1>
<p class="sub">${ready.length} photos ready to write${failed.length ? `, ${failed.length} not done yet (they'll retry on the next run)` : ''}. Nothing is in Sanity yet.</p>
<p class="sub">Tell Claude which ones to change, or say "write the photo suggestions" to save them.</p>
${[...groups].map(([name, items]) => `<h2>${escape(name)} (${items.length})</h2><div class="grid">${items.map(card).join('')}</div>`).join('\n')}
</main></body></html>`
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(REVIEW, html)
}

async function runSuggest() {
  if (!GEMINI_API_KEY)
    throw new Error('GEMINI_API_KEY is not set in .env.local')
  const suggestions = readSuggestions()
  const photos = await findPhotos()
  const todo = photos.filter((p) => !suggestions[p.id]?.alt).slice(0, limit)
  console.log(
    `📷 ${photos.length} photos need alt text or a category; ${todo.length} to ask Gemini about`,
  )

  let done = 0
  try {
    for (const photo of todo) {
      process.stdout.write(
        `   ${++done}/${todo.length} ${photo.docTitle}, ${photo.field} … `,
      )
      try {
        const answer = await suggest(photo)
        suggestions[photo.id] = { ...photo, ...answer, error: undefined }
        console.log(`✓ ${answer.category}`)
      } catch (err) {
        if (err instanceof DailyLimitError) throw err
        suggestions[photo.id] = { ...photo, error: err.message }
        console.log(`✗ ${err.message}`)
      }
      saveSuggestions(suggestions)
      await sleep(PACE_MS)
    }
  } catch (err) {
    if (!(err instanceof DailyLimitError)) throw err
    console.log(
      `\n🛑 Gemini's daily free limit is used up. Run this again tomorrow; it picks up where it stopped.`,
    )
  }

  writeReview(suggestions)
  console.log(
    `\n📝 Review the suggestions: ${path.relative(process.cwd(), REVIEW)}`,
  )
  console.log('   Nothing was written to Sanity.')
}

async function runWrite() {
  const ready = Object.values(readSuggestions()).filter(
    (s) => s.alt && !s.error,
  )
  if (!ready.length)
    return console.log(
      'No reviewed suggestions to write. Run `npm run generate-alt-text` first.',
    )

  const ids = [...new Set(ready.map((s) => s.docId))]
  const docs = await client.fetch(`*[_id in $ids]`, {
    ids: ids.flatMap((id) => [id, `drafts.${id}`]),
  })
  const backup = path.join(
    HERE,
    '..',
    'backups',
    `photo-alt-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  )
  fs.writeFileSync(backup, JSON.stringify(docs, null, 2))
  console.log(
    `💾 Backed up ${docs.length} documents to ${path.relative(process.cwd(), backup)}`,
  )

  let fields = 0
  for (const doc of docs) {
    const set = {}
    for (const s of ready.filter((r) => r.docId === baseId(doc._id))) {
      const item = doc[s.field]?.find((i) => i?._key === s.key)
      if (!item) continue
      const at = `${s.field}[_key=="${s.key}"]`
      // Only fill what's still empty: never replace anything Kenny wrote
      if (s.needAlt && isEmpty(item.alt)) set[`${at}.alt`] = s.alt
      if (s.needCategory && isEmpty(item.category))
        set[`${at}.category`] = s.category
    }
    if (!Object.keys(set).length) continue
    await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit()
    fields += Object.keys(set).length
    console.log(
      `   ✓ ${doc._id.startsWith('drafts.') ? '[draft] ' : ''}${doc.name ?? doc.title}: ${Object.keys(set).length} fields`,
    )
  }
  console.log(`\n✅ Wrote ${fields} fields across ${docs.length} documents.`)
}

;(isLive ? runWrite() : runSuggest()).catch((err) => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
