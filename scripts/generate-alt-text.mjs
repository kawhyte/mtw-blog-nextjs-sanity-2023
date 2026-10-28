#!/usr/bin/env node

/**
 * Bulk photo alt text, caption + category, Meet the Whytes
 *
 * Two steps, so what gets written is exactly what Kenny reviewed:
 *
 *   npm run generate-alt-text        Suggest: asks Gemini for alt text, a
 *                                    caption and a photo category for every
 *                                    hero / gallery photo missing any of
 *                                    them, saves them to
 *                                    scripts/photo-suggestions/ and builds
 *                                    review.html there. Nothing is written to
 *                                    Sanity. Safe to stop and rerun: photos
 *                                    already suggested are skipped.
 *   npm run generate-alt-text:live   Write: copies the saved suggestions into
 *                                    Sanity (published and draft), only into
 *                                    fields that are still empty, after a
 *                                    backup in backups/.
 *
 * Guides get alt text only: their main image and gallery have no caption or
 * category fields (photos inside the story are left to the Studio buttons).
 *
 * Options: --only=arenas,hotelReview,foodReview,guide   --limit=50
 *          --review   rebuild review.html from what's saved, no Gemini calls
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
  altTextRules,
  captionRules,
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
const reviewOnly = process.argv.includes('--review')
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

// Same lists as the schemas (schemas/nbaArenas.ts, hotelReview.ts,
// foodReview.ts, guide.ts). A field holds a list of photos, or one photo
// (coverImage); a type without categories or captions doesn't ask for them.
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
  guide: {
    label: 'Guide',
    title: 'title',
    fields: ['coverImage', 'gallery'],
    categories: null,
    captions: false,
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
// A suggestion with everything its photo needs (a photo suggested before
// captions were added still needs one)
const isDone = (s) =>
  Boolean(s && !s.error && s.alt && (!s.needCaption || s.caption))

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
      heroPhotos[]{ _key, alt, caption, category, "assetRef": asset._ref },
      imageGallery[]{ _key, alt, caption, category, "assetRef": asset._ref },
      gallery[]{ _key, alt, caption, category, "assetRef": asset._ref },
      coverImage{ alt, "assetRef": asset._ref } }`,
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
      const value = doc[field]
      const items = Array.isArray(value) ? value : value ? [value] : []
      for (const item of items) {
        if (!item?.assetRef || (Array.isArray(value) && !item._key)) continue
        const id = `${baseId(doc._id)}:${field}:${item._key ?? 'main'}`
        const photo = photos.get(id) ?? {
          id,
          docId: baseId(doc._id),
          docType: doc._type,
          docTitle: doc[type.title] ?? '',
          field,
          key: item._key ?? null,
          assetRef: item.assetRef,
          needAlt: false,
          needCaption: false,
          needCategory: false,
        }
        // Needs work if any version is missing it
        photo.needAlt ||= isEmpty(item.alt)
        photo.needCaption ||= type.captions !== false && isEmpty(item.caption)
        photo.needCategory ||=
          Boolean(type.categories) && isEmpty(item.category)
        photos.set(id, photo)
      }
    }
  }
  return [...photos.values()]
    .filter((p) => p.needAlt || p.needCaption || p.needCategory)
    .sort(
      (a, b) =>
        a.docType.localeCompare(b.docType) ||
        a.docTitle.localeCompare(b.docTitle),
    )
}

class DailyLimitError extends Error {}
class OfflineError extends Error {}

const isOnline = () =>
  fetch('https://cdn.sanity.io', {
    method: 'HEAD',
    signal: AbortSignal.timeout(10000),
  }).then(
    () => true,
    () => false,
  )

/** No connection (Wi-Fi dropped, Mac asleep): wait it out instead of skipping photos */
async function waitForNetwork() {
  console.log('\n   📡 No internet connection, waiting for it to come back…')
  while (!(await isOnline())) await sleep(30000)
  console.log('   📡 Back online, carrying on')
}

/** One Gemini call: alt text, plus a caption and category where the type has them */
async function suggest(photo) {
  const type = TYPES[photo.docType]
  const categories = Object.entries(type.categories ?? {})
  const wantCaption = type.captions !== false
  const wantCategory = categories.length > 0

  const sections = [
    `ALT TEXT\n${altTextRules(photo.docType, photo.docTitle)}`,
    wantCaption &&
      `CAPTION\n${captionRules(photo.docType, photo.docTitle)}\n\nThe caption is shown under the photo; don't just repeat the alt text.`,
    wantCategory &&
      `CATEGORY\nPick the one photo category that fits best:\n${categories.map(([value, text]) => `- ${value}: ${text}`).join('\n')}`,
  ].filter(Boolean)
  const shape = [
    '"alt": "the alt text"',
    wantCaption && '"caption": "the caption"',
    wantCategory && '"category": "one of the values above"',
  ].filter(Boolean)
  const prompt = `Write the following for this photo.

${sections.map((text, i) => `${i + 1}. ${text}`).join('\n\n')}

Answer as JSON: {${shape.join(', ')}}`

  const properties = { alt: { type: 'STRING' } }
  if (wantCaption) properties.caption = { type: 'STRING' }
  if (wantCategory)
    properties.category = {
      type: 'STRING',
      enum: categories.map(([value]) => value),
    }

  const imageRes = await fetch(photoUrl(photo.assetRef, 1024), {
    signal: AbortSignal.timeout(15000),
  }).catch(async (err) => {
    throw (await isOnline()) ? err : new OfflineError(err.message)
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
            maxOutputTokens: 400,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties,
              required: Object.keys(properties),
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
      if (!(await isOnline())) throw new OfflineError(err.message)
      throw new Error(`Gemini didn't answer (${err.message})`)
    }

    if (res.ok) {
      const json = await res.json()
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text
      const answer = JSON.parse(text ?? '{}')
      if (
        !answer.alt ||
        (wantCaption && !answer.caption) ||
        (wantCategory && !type.categories[answer.category])
      )
        throw new Error('Gemini gave an incomplete answer')
      // Prompts ask for 50 to 120 and 80 to 160 chars; only trim a bad overshoot
      const alt = stripDashes(answer.alt.trim())
      const caption = wantCaption ? stripDashes(answer.caption.trim()) : ''
      return {
        alt: alt.length > 150 ? trimToSentence(alt, 120) : alt,
        ...(wantCaption && {
          caption:
            caption.length > 200 ? trimToSentence(caption, 160) : caption,
        }),
        ...(wantCategory && { category: answer.category }),
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
  const ready = all.filter(isDone)
  const failed = all.filter((s) => !isDone(s))
  const groups = new Map()
  for (const s of all) {
    const k = `${TYPES[s.docType].label}: ${s.docTitle}`
    groups.set(k, [...(groups.get(k) ?? []), s])
  }
  const card = (s) => `
    <figure${isDone(s) ? '' : ' class="err"'}>
      <img loading="lazy" src="${photoUrl(s.assetRef, 400)}" alt="">
      <figcaption>
        <span class="tag">${escape(s.field)}</span>
        ${
          !isDone(s)
            ? `<p class="error">Not done: ${escape(s.error ?? 'needs a caption')}</p>`
            : `<p><b>Alt</b> ${s.needAlt ? escape(s.alt) : '<i>keeps its alt text</i>'}</p>
               ${TYPES[s.docType].captions === false ? '' : `<p><b>Caption</b> ${s.needCaption ? escape(s.caption) : '<i>keeps its caption</i>'}</p>`}`
        }
      </figcaption>
    </figure>`
  // Within a review, one row per category in the schema's order, so a
  // bedroom photo sitting among the bathrooms stands out
  const sections = (items) => {
    const type = TYPES[items[0].docType]
    const rows = !type.categories
      ? [
          ['Photos', items.filter(isDone)],
          ['Not done yet', items.filter((s) => !isDone(s))],
        ]
      : [
          ...Object.entries(type.categories).map(([value, text]) => [
            text.split(':')[0],
            items.filter(
              (s) => isDone(s) && s.needCategory && s.category === value,
            ),
          ]),
          [
            'Already has a category',
            items.filter((s) => isDone(s) && !s.needCategory),
          ],
          ['Not done yet', items.filter((s) => !isDone(s))],
        ]
    return rows
      .filter(([, row]) => row.length)
      .map(
        ([label, row]) =>
          `<h3>${escape(label)} <span>${row.length}</span></h3><div class="grid">${row.map(card).join('')}</div>`,
      )
      .join('\n')
  }
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Photo Text Review</title>
<style>
  :root { --bg:#fff; --fg:#1f2937; --muted:#78716c; --line:#e7e5e4; --soft:#f7f5f2; --bad:#b91c1c; }
  @media (prefers-color-scheme: dark) { :root { --bg:#1c1917; --fg:#f5f5f4; --muted:#a8a29e; --line:#44403c; --soft:#292524; --bad:#f87171; } }
  body { margin:0; padding:24px 16px 64px; background:var(--bg); color:var(--fg); font:15px/1.5 system-ui, sans-serif; }
  main { max-width:1200px; margin:0 auto; }
  h1 { font-size:28px; margin:0 0 4px; } h2 { font-size:20px; margin:40px 0 4px; padding-top:16px; border-top:2px solid var(--line); }
  h3 { font-size:15px; margin:16px 0 8px; } h3 span { color:var(--muted); font-weight:400; }
  .sub { color:var(--muted); margin:0 0 8px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:16px; }
  figure { margin:0; border:2px solid var(--line); border-radius:16px; overflow:hidden; background:var(--soft); }
  figure.err { border-color:var(--bad); }
  img { display:block; width:100%; aspect-ratio:4/3; object-fit:cover; background:var(--line); }
  figcaption { padding:10px 12px 12px; } figcaption p { margin:6px 0 0; }
  .tag { font-size:12px; color:var(--muted); } .error { color:var(--bad); }
  i, b { color:var(--muted); } b { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; margin-right:4px; }
</style></head><body><main>
<h1>Photo alt text and caption review</h1>
<p class="sub">${ready.length} photos ready to write${failed.length ? `, ${failed.length} not done yet (they'll retry on the next run)` : ''}. Nothing is in Sanity yet.</p>
<p class="sub">Tell Claude which ones to change, or say "write the photo suggestions" to save them.</p>
${[...groups].map(([name, items]) => `<h2>${escape(name)} (${items.length})</h2>${sections(items)}`).join('\n')}
</main></body></html>`
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(REVIEW, html)
}

async function runSuggest() {
  if (!GEMINI_API_KEY)
    throw new Error('GEMINI_API_KEY is not set in .env.local')
  const photos = await findPhotos()
  // Keep only photos that still need something, with today's needs (a photo
  // written yesterday may now only be missing its caption)
  const saved = readSuggestions()
  const suggestions = Object.fromEntries(
    photos
      .filter((p) => saved[p.id])
      .map((p) => [p.id, { ...saved[p.id], ...p }]),
  )
  const todo = photos.filter((p) => !isDone(suggestions[p.id])).slice(0, limit)
  console.log(
    `📷 ${photos.length} photos need alt text, a caption or a category; ${todo.length} to ask Gemini about`,
  )

  let done = 0
  try {
    for (const photo of todo) {
      process.stdout.write(
        `   ${++done}/${todo.length} ${photo.docTitle}, ${photo.field} … `,
      )
      try {
        let answer
        // An outage isn't the photo's fault: wait, then try the same photo again
        for (;;) {
          try {
            answer = await suggest(photo)
            break
          } catch (err) {
            if (!(err instanceof OfflineError)) throw err
            await waitForNetwork()
          }
        }
        suggestions[photo.id] = { ...photo, ...answer, error: undefined }
        console.log(`✓ ${answer.category ?? 'alt text'}`)
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
  const ready = Object.values(readSuggestions()).filter(isDone)
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
      const item = s.key
        ? doc[s.field]?.find((i) => i?._key === s.key)
        : doc[s.field]
      if (!item) continue
      if (!item?.asset) continue
      const at = s.key ? `${s.field}[_key=="${s.key}"]` : s.field
      // Only fill what's still empty: never replace anything Kenny wrote
      if (s.needAlt && isEmpty(item.alt)) set[`${at}.alt`] = s.alt
      if (s.needCaption && s.caption && isEmpty(item.caption))
        set[`${at}.caption`] = s.caption
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

;(isLive
  ? runWrite()
  : reviewOnly
    ? Promise.resolve(writeReview(readSuggestions())).then(() =>
        console.log(`📝 ${path.relative(process.cwd(), REVIEW)}`),
      )
    : runSuggest()
).catch((err) => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
