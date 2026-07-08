#!/usr/bin/env node
/**
 * Creates or updates an UNPUBLISHED guide draft in Sanity from a JSON payload.
 * Used by the kenny-mtw-content skill (.claude/skills/kenny-mtw-content).
 *
 * Usage: node scripts/create-guide-draft.mjs <path-to-payload.json>
 *
 * Payload: { title, slug, date?, category?, location?, summary?, tags?, content }
 * See .claude/skills/kenny-mtw-content/references/sanity-guide-schema.md
 *
 * Writes to a deterministic draft ID (drafts.guide-<slug>) so re-runs update
 * the same draft instead of duplicating. Never publishes.
 */

import fs from 'node:fs'

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const VALID_CATEGORIES = [
  'city',
  'tips',
  'transport',
  'culture',
  'adventure',
  'family',
  'budget',
  'luxury',
]

const fail = (msg) => {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

const file = process.argv[2]
if (!file) fail('Usage: node scripts/create-guide-draft.mjs <path-to-payload.json>')
if (!fs.existsSync(file)) fail(`File not found: ${file}`)

let payload
try {
  payload = JSON.parse(fs.readFileSync(file, 'utf8'))
} catch (e) {
  fail(`Invalid JSON in ${file}: ${e.message}`)
}

// ── Validation ────────────────────────────────────────────────────────────
const errors = []

if (!payload.title?.trim()) errors.push('title is required')
if (!payload.slug?.trim()) errors.push('slug is required')
if (payload.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(payload.slug))
  errors.push(`slug "${payload.slug}" must be lowercase-hyphenated (a-z, 0-9, -)`)
if (payload.slug && payload.slug.length > 96) errors.push('slug exceeds 96 chars')
if (payload.summary && payload.summary.length > 160)
  errors.push(`summary is ${payload.summary.length} chars (max 160)`)
if (payload.category && !VALID_CATEGORIES.includes(payload.category))
  errors.push(`category "${payload.category}" is not one of: ${VALID_CATEGORIES.join(', ')}`)
if (!Array.isArray(payload.content) || payload.content.length === 0)
  errors.push('content must be a non-empty array of portable text blocks')

for (const [i, blk] of (payload.content ?? []).entries()) {
  if (blk._type === 'videoEmbed' && !blk.url)
    errors.push(`content[${i}]: videoEmbed requires a url`)
  if (blk._type === 'callout' && !Array.isArray(blk.text))
    errors.push(`content[${i}]: callout.text must be an array of blocks`)
  if (blk._type === 'imageGroup') {
    const n = blk.images?.length ?? 0
    if (n < 2 || n > 4) errors.push(`content[${i}]: imageGroup needs 2–4 images (has ${n})`)
  }
}

if (errors.length) {
  errors.forEach((e) => console.error(`✗ ${e}`))
  process.exit(1)
}

// ── Backfill missing _key on every nested object in the content tree ─────
let keyCounter = 0
const withKeys = (node) => {
  if (Array.isArray(node)) return node.map(withKeys)
  if (node && typeof node === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(node)) out[k] = withKeys(v)
    if (out._type && !out._key) out._key = `ak${Date.now().toString(36)}${++keyCounter}`
    return out
  }
  return node
}

// ── Build the document ────────────────────────────────────────────────────
const doc = {
  _id: `drafts.guide-${payload.slug}`,
  _type: 'guide',
  title: payload.title.trim(),
  slug: { _type: 'slug', current: payload.slug },
  date: payload.date || new Date().toISOString(),
  content: withKeys(payload.content),
  ...(payload.category && { category: payload.category }),
  ...(payload.location && { location: payload.location }),
  ...(payload.summary && { summary: payload.summary }),
  ...(Array.isArray(payload.tags) && payload.tags.length && { tags: payload.tags }),
}

// ── Write to Sanity ───────────────────────────────────────────────────────
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_API_PROJECT_ID
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_API_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) fail('Missing Sanity project ID / dataset in .env.local')
if (!token) fail('Missing SANITY_API_WRITE_TOKEN in .env.local')

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-05-03',
  token,
  useCdn: false,
})

try {
  const res = await client.createOrReplace(doc)
  console.log(`✓ Draft saved: ${res._id}`)
  console.log(`  Title:    ${res.title}`)
  console.log(`  Category: ${res.category ?? '(none)'}`)
  console.log(`  Location: ${res.location ?? '(none)'}`)
  console.log(`  Summary:  ${res.summary ? `${res.summary.length} chars` : '(none)'}`)
  console.log(`  Blocks:   ${res.content.length}`)
  console.log(`  Studio:   http://localhost:3000/studio/desk/guide;guide-${payload.slug}`)
} catch (e) {
  fail(`Sanity write failed: ${e.message}`)
}
