#!/usr/bin/env node

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2022-11-15'

if (!projectId || !dataset || !process.env.SANITY_API_WRITE_TOKEN) {
  console.error('Missing required env vars. Check .env.local.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const DRY_RUN = process.argv[2] !== '--live'

async function main() {
  const docs = await client.fetch(`*[_type == "post"]{_id, title, linkType}`)

  if (docs.length === 0) {
    console.log('No legacy post documents found. Nothing to delete.')
    return
  }

  console.log(`\nFound ${docs.length} legacy post documents:\n`)
  const breakdown = { hotel: 0, food: 0, story: 0, favorite: 0, other: 0 }
  for (const doc of docs) {
    breakdown[doc.linkType] !== undefined
      ? breakdown[doc.linkType]++
      : breakdown.other++
  }
  console.table(breakdown)

  // Find recommendationList documents that reference legacy posts
  const postIds = docs.map((d) => d._id)
  const referencingDocs = await client.fetch(
    `*[_type == "recommendationList"]{_id, _type, title}`,
  )

  if (referencingDocs.length > 0) {
    console.log(`\nFound ${referencingDocs.length} document(s) referencing legacy posts (will be deleted first):`)
    referencingDocs.forEach((d) => console.log(`  [${d._type}] ${d.title ?? d._id}`))
  }

  if (DRY_RUN) {
    console.log('\n[DRY RUN] No documents deleted.')
    console.log('Run with --live to delete: node scripts/deleteLegacyPosts.mjs --live\n')
    return
  }

  const knownRefIds = referencingDocs.map((d) => d._id)
  if (knownRefIds.length > 0) {
    console.log('\nDeleting referencing documents first...')
    const refTx = client.transaction()
    knownRefIds.forEach((id) => refTx.delete(id))
    await refTx.commit()
    console.log(`  Deleted ${knownRefIds.length} referencing document(s)`)
  }

  console.log('\nDeleting legacy post documents in batches of 50...')
  const BATCH = 50
  let deleted = 0
  const retryIds = []

  // First pass — batch delete, collecting any IDs that still have references
  for (let i = 0; i < postIds.length; i += BATCH) {
    const batch = postIds.slice(i, i + BATCH)
    try {
      const tx = client.transaction()
      batch.forEach((id) => tx.delete(id))
      await tx.commit()
      deleted += batch.length
      console.log(`  Deleted ${deleted}/${postIds.length}`)
    } catch (err) {
      if (!err.message.includes('cannot be deleted as there are references')) throw err
      // Parse all referencing IDs out of the error message
      const afterFrom = err.message.split(' from ')[1] ?? ''
      const refs = [...new Set([...afterFrom.matchAll(/"([^"]+)"/g)].map((m) => m[1]))]
      if (refs.length) {
        console.log(`\n  Found ${refs.length} additional referencing doc(s), removing...`)
        const refDocs = await client.fetch(`*[_id in $ids]{_id, _type, title}`, { ids: refs })
        refDocs.forEach((d) => console.log(`    [${d._type}] ${d.title ?? d._id}`))
        const refTx = client.transaction()
        refs.forEach((id) => refTx.delete(id))
        await refTx.commit()
      }
      batch.forEach((id) => retryIds.push(id))
    }
  }

  // Retry any batches that failed due to references
  if (retryIds.length > 0) {
    console.log(`\nRetrying ${retryIds.length} post(s) whose blockers are now removed...`)
    for (let i = 0; i < retryIds.length; i += BATCH) {
      const batch = retryIds.slice(i, i + BATCH)
      const tx = client.transaction()
      batch.forEach((id) => tx.delete(id))
      await tx.commit()
      deleted += batch.length
      console.log(`  Deleted ${deleted}/${postIds.length}`)
    }
  }

  console.log(`\n✅ Done. ${deleted} legacy post documents deleted.`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
