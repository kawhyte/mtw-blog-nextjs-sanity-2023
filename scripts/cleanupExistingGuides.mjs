#!/usr/bin/env node

/**
 * Cleanup Existing Guide Documents Script
 *
 * This script backs up and removes any existing 'guide' documents
 * to prepare for a fresh migration from legacy post documents.
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Sanity client configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2022-11-15'

if (!projectId || !dataset) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SANITY_PROJECT_ID:', projectId ? '✅' : '❌')
  console.error('   NEXT_PUBLIC_SANITY_DATASET:', dataset ? '✅' : '❌')
  console.error(
    '   SANITY_API_WRITE_TOKEN:',
    process.env.SANITY_API_WRITE_TOKEN ? '✅' : '❌',
  )
  console.error('\nMake sure these are set in your .env.local file')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

// Query to get all existing guide documents
const existingGuidesQuery = `
  *[_type == "guide"] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    date,
    coverImage {
      ...,
      asset-> {
        ...,
        url
      }
    },
    gallery[] {
      ...,
      asset-> {
        ...,
        url
      },
      alt
    },
    content,
    category,
    tags,
    excerpt2,
    tip
  }
`

async function cleanupExistingGuides() {
  const isDryRun = !process.argv.includes('--no-dry-run')

  try {
    console.log('🧹 Starting cleanup of existing guide documents...')
    console.log(
      isDryRun
        ? '🔍 DRY RUN MODE - No changes will be made'
        : '🚀 LIVE MODE - Changes will be applied',
    )

    // Fetch existing guide documents
    const existingGuides = await client.fetch(existingGuidesQuery)

    console.log(`📊 Found ${existingGuides.length} existing guide documents`)

    if (existingGuides.length === 0) {
      console.log('✅ No existing guide documents found. Nothing to cleanup.')
      return { cleaned: 0, backed_up: 0 }
    }

    // Show what we found
    console.log('\n📋 Existing guide documents:')
    existingGuides.forEach((guide, index) => {
      console.log(`   ${index + 1}. ${guide.title} (${guide._id})`)
      console.log(`      Slug: ${guide.slug}`)
      console.log(`      Category: ${guide.category || 'N/A'}`)
      console.log(`      Date: ${guide.date}`)
    })

    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Create timestamped backup file for existing guides
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5)
    const backupFileName = `existing-guides-backup-${timestamp}.json`
    const backupFilePath = path.join(backupDir, backupFileName)

    // Write backup file
    fs.writeFileSync(backupFilePath, JSON.stringify(existingGuides, null, 2))
    console.log(`\n💾 Backup created: ${backupFilePath}`)

    if (isDryRun) {
      console.log('\n🔍 DRY RUN COMPLETE')
      console.log('📋 Summary of what would happen:')
      console.log(`  📦 Backup: ${existingGuides.length} guide documents`)
      console.log(`  🗑️ Delete: ${existingGuides.length} guide documents`)
      console.log('\n📌 To run the actual cleanup:')
      console.log('   node scripts/cleanupExistingGuides.mjs --no-dry-run')
      return { dryRun: true, count: existingGuides.length }
    }

    // LIVE CLEANUP - Delete existing guides
    console.log('\n🚀 Starting live cleanup...')

    const deleteResults = []
    for (const guide of existingGuides) {
      try {
        await client.delete(guide._id)
        console.log(`   ✅ Deleted: ${guide.title} (${guide._id})`)
        deleteResults.push({ success: true, id: guide._id, title: guide.title })
      } catch (error) {
        console.error(
          `   ❌ Failed to delete: ${guide.title} - ${error.message}`,
        )
        deleteResults.push({
          success: false,
          id: guide._id,
          title: guide.title,
          error: error.message,
        })
      }
    }

    const successful = deleteResults.filter((r) => r.success)
    const failed = deleteResults.filter((r) => !r.success)

    console.log(`\n📊 Cleanup Results:`)
    console.log(`   ✅ Deleted: ${successful.length}`)
    console.log(`   ❌ Failed: ${failed.length}`)

    if (failed.length > 0) {
      console.log(`\n❌ Failed deletions:`)
      failed.forEach((f) =>
        console.log(`   - ${f.title} (${f.id}): ${f.error}`),
      )
    }

    // Save cleanup log
    const logData = {
      cleanupDate: new Date().toISOString(),
      backupFile: backupFilePath,
      totalGuides: existingGuides.length,
      successful: successful.length,
      failed: failed.length,
      results: deleteResults,
    }

    const logPath = path.join(backupDir, `guide-cleanup-log-${timestamp}.json`)
    fs.writeFileSync(logPath, JSON.stringify(logData, null, 2))
    console.log(`📋 Cleanup log saved: ${logPath}`)

    console.log('\n✅ CLEANUP COMPLETED!')
    console.log(
      `📊 Summary: ${successful.length}/${existingGuides.length} guides cleaned up successfully`,
    )

    return logData
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupExistingGuides()
    .then((result) => {
      if (result.dryRun) {
        console.log(
          `\n🎯 Ready to cleanup ${result.count} existing guide documents!`,
        )
      } else {
        console.log(
          `\n🎉 Cleanup complete! ${result.successful}/${result.totalGuides} guides cleaned up.`,
        )
        console.log('\n📝 Next steps:')
        console.log('   1. Create fresh backup of legacy guide data')
        console.log('   2. Run the new migration script')
      }
    })
    .catch((error) => {
      console.error('Cleanup failed:', error)
      process.exit(1)
    })
}

export { cleanupExistingGuides }
