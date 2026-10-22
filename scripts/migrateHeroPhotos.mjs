#!/usr/bin/env node

/**
 * Hero Photos migration, copies each page's current hero photos into the new
 * `heroPhotos` field on hotelReview, foodReview and arenas documents.
 *
 * SAFETY (additive only):
 *   - Writes a full JSON backup of every affected document (drafts included)
 *     before doing anything, and aborts if the backup can't be verified.
 *   - Only ever sets `heroPhotos`, and only where it is missing (setIfMissing).
 *     No field is unset, edited or reordered; coverImage, gallery, arenaImage,
 *     photoGallerySection and imageGallery are left exactly as they are.
 *   - Image assets are only referenced, never uploaded, moved or deleted, so
 *     Media library folders/tags are untouched.
 *   - Each patch is guarded by the document's _rev, so an edit made in Studio
 *     while this runs is never overwritten (that doc is skipped and reported).
 *   - After a live run, every document is re-fetched and compared field-by-field
 *     with the backup (ignoring only _rev, _updatedAt and heroPhotos).
 *
 * Usage:
 *   npm run migrate-hero-photos        # backup + dry run (no writes)
 *   npm run migrate-hero-photos:live   # backup + write + verify
 */

import { createClient } from '@sanity/client'
import crypto from 'crypto'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const LIVE = process.argv.includes('--live')
const TYPES = ['hotelReview', 'foodReview', 'arenas']
const HERO_MAX = 5
const IGNORED_ON_VERIFY = new Set(['_rev', '_updatedAt', 'heroPhotos'])

for (const key of [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_WRITE_TOKEN',
]) {
  if (!process.env[key]) throw new Error(`${key} is not set in .env.local`)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: 'raw', // published + drafts
})

const fetchAll = () =>
  client.fetch(`*[_type in $types] | order(_id asc)`, { types: TYPES })

// Stable stringify so key order never causes a false mismatch
const canonical = (value) =>
  JSON.stringify(value, (_k, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, v[k]]))
      : v,
  )

const withoutIgnored = (doc) =>
  Object.fromEntries(Object.entries(doc).filter(([k]) => !IGNORED_ON_VERIFY.has(k)))

const hasAsset = (img) => Boolean(img?.asset?._ref)

/** What the page shows in its hero today (same order as the current site). */
function currentHeroPhotos(doc) {
  let candidates
  if (doc._type === 'arenas') {
    const legacy = [
      doc.photoGallerySection?.mainImage,
      ...(doc.photoGallerySection?.otherImages || []),
      ...(doc.imageGallery || []),
    ].filter(hasAsset)
    candidates = legacy.length > 0 ? legacy : [doc.arenaImage]
  } else {
    candidates = [doc.coverImage, ...(doc.gallery || [])]
  }

  const seen = new Set()
  const photos = []
  for (const img of candidates) {
    if (!hasAsset(img) || seen.has(img.asset._ref)) continue
    seen.add(img.asset._ref)
    // Copy the image as-is (asset ref, hotspot, crop, alt, caption, category);
    // only the array _key is new.
    const { _key, ...rest } = img
    photos.push({ ...rest, _type: 'image', _key: crypto.randomBytes(6).toString('hex') })
    if (photos.length === HERO_MAX) break
  }
  return photos
}

const label = (doc) => doc.title || doc.name || doc._id

async function main() {
  console.log(`\n🖼️  Hero Photos migration, ${LIVE ? 'LIVE' : 'DRY RUN (no writes)'}\n`)

  // 1. Backup ---------------------------------------------------------------
  const before = await fetchAll()
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join('backups', `hero-photos-backup-${stamp}.json`)
  fs.mkdirSync('backups', { recursive: true })
  fs.writeFileSync(backupPath, JSON.stringify(before, null, 2))
  const reread = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  if (reread.length !== before.length || canonical(reread) !== canonical(before)) {
    throw new Error('Backup verification failed, aborting before any writes.')
  }
  console.log(`💾 Backup: ${before.length} documents → ${backupPath}\n`)

  // 2. Plan -----------------------------------------------------------------
  const plan = []
  const skipped = []
  for (const doc of before) {
    if (Array.isArray(doc.heroPhotos) && doc.heroPhotos.length > 0) {
      skipped.push([doc, 'already has heroPhotos'])
      continue
    }
    const heroPhotos = currentHeroPhotos(doc)
    if (heroPhotos.length === 0) {
      skipped.push([doc, 'no photos to copy'])
      continue
    }
    plan.push({ doc, heroPhotos })
  }

  for (const type of TYPES) {
    const rows = plan.filter((p) => p.doc._type === type)
    console.log(`── ${type}: ${rows.length} to update`)
    for (const { doc, heroPhotos } of rows) {
      const draft = doc._id.startsWith('drafts.') ? ' [draft]' : ''
      console.log(`   ${String(heroPhotos.length)} photos  ${label(doc)}${draft}`)
    }
  }
  if (skipped.length) {
    console.log(`\n── Skipped: ${skipped.length}`)
    for (const [doc, why] of skipped) console.log(`   ${label(doc)} (${doc._id}), ${why}`)
  }

  if (!LIVE) {
    console.log('\nDry run only. Re-run with --live to write.\n')
    return
  }

  // 3. Write (additive, revision-guarded) -----------------------------------
  const conflicts = []
  for (const { doc, heroPhotos } of plan) {
    try {
      await client
        .patch(doc._id)
        .ifRevisionId(doc._rev)
        .setIfMissing({ heroPhotos })
        .commit({ autoGenerateArrayKeys: false })
    } catch (err) {
      conflicts.push([doc, err.message])
    }
  }
  console.log(`\n✍️  Patched ${plan.length - conflicts.length}/${plan.length} documents`)
  for (const [doc, msg] of conflicts) {
    console.log(`   ⚠️  Skipped ${label(doc)} (${doc._id}): ${msg}`)
  }

  // 4. Verify ---------------------------------------------------------------
  const after = await fetchAll()
  const afterById = new Map(after.map((d) => [d._id, d]))
  const problems = []
  for (const orig of before) {
    const now = afterById.get(orig._id)
    if (!now) {
      // Only possible if someone deleted it in Studio during the run
      problems.push(`${orig._id}: missing after migration`)
      continue
    }
    if (canonical(withoutIgnored(orig)) !== canonical(withoutIgnored(now))) {
      problems.push(`${orig._id}: other fields differ from backup`)
    }
  }
  for (const { doc, heroPhotos } of plan) {
    if (conflicts.some(([c]) => c._id === doc._id)) continue
    const got = afterById.get(doc._id)?.heroPhotos
    if (!Array.isArray(got) || got.length !== heroPhotos.length) {
      problems.push(`${doc._id}: heroPhotos not written as expected`)
    }
  }

  if (problems.length) {
    console.log(`\n❌ Verification found ${problems.length} issue(s):`)
    problems.forEach((p) => console.log(`   ${p}`))
    console.log(`\nNothing was deleted. Backup: ${backupPath}\n`)
    process.exitCode = 1
  } else {
    console.log(
      `\n✅ Verified: all ${before.length} documents unchanged apart from the new heroPhotos field.\n`,
    )
  }
}

main().catch((err) => {
  console.error('\n❌', err.message)
  process.exit(1)
})
