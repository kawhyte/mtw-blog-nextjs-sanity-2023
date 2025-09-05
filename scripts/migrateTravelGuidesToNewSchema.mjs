#!/usr/bin/env node

/**
 * Migrate Travel Guides to New Schema Script
 *
 * This script converts backed-up travel guide posts to the new independent guide document type.
 * It maps the old post structure to the new guide schema.
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Sanity client configuration using the same pattern as lib/sanity.api.ts
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

/**
 * Maps old post data to new guide schema
 */
function mapPostToGuide(post) {
  // Determine category based on title/content keywords
  const title = post.title?.toLowerCase() || ''
  let category = 'tips' // default

  if (title.includes('city') || title.includes('guide to')) {
    category = 'city'
  } else if (
    title.includes('transport') ||
    title.includes('flight') ||
    title.includes('train')
  ) {
    category = 'transport'
  } else if (title.includes('culture') || title.includes('history')) {
    category = 'culture'
  } else if (title.includes('adventure') || title.includes('hiking')) {
    category = 'adventure'
  } else if (title.includes('family') || title.includes('kids')) {
    category = 'family'
  } else if (title.includes('budget') || title.includes('cheap')) {
    category = 'budget'
  } else if (title.includes('luxury') || title.includes('premium')) {
    category = 'luxury'
  }

  // Convert excerpt2 from array to array (it should already be array for stories)
  let excerpt2 = post.excerpt2
  if (typeof excerpt2 === 'string') {
    // If somehow it's a string, convert to simple block array
    excerpt2 = [
      {
        _type: 'block',
        _key: 'excerpt',
        style: 'normal',
        children: [{ _type: 'span', text: excerpt2 }],
      },
    ]
  }

  // Extract tags from content or create default ones
  const tags = []
  if (post.location) tags.push(post.location)
  if (category !== 'tips') tags.push(category)
  tags.push('travel', 'guide')

  const newGuide = {
    _type: 'guide',
    title: post.title,
    slug: {
      _type: 'slug',
      current: post.slug,
    },
    date: post.date || post._createdAt,
    excerpt2: excerpt2 || [
      {
        _type: 'block',
        _key: 'defaultExcerpt',
        style: 'normal',
        children: [{ _type: 'span', text: 'Travel guide content' }],
      },
    ],
    coverImage: post.coverImage,
    category: category,
    content: post.content || [
      {
        _type: 'block',
        _key: 'defaultContent',
        style: 'normal',
        children: [{ _type: 'span', text: 'Content to be added...' }],
      },
    ],
    gallery: post.gallery || [],
    tip: post.tip || [],
    tags: tags.filter(Boolean),
    // Preserve original post reference for tracking
    _originalPostId: post._id,
    _migratedAt: new Date().toISOString(),
  }

  return newGuide
}

async function migrateTravelGuides(backupFilePath, options = {}) {
  const { dryRun = true, batchSize = 10 } = options

  try {
    console.log(
      `🔄 ${dryRun ? 'DRY RUN: ' : ''}Starting migration of travel guides...`,
    )

    if (!fs.existsSync(backupFilePath)) {
      throw new Error(`Backup file not found: ${backupFilePath}`)
    }

    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'))
    console.log(`📖 Loaded ${backupData.length} travel guides from backup`)

    const convertedGuides = backupData.map(mapPostToGuide)

    if (dryRun) {
      console.log('\n🔍 DRY RUN - Preview of converted guides:')
      convertedGuides.slice(0, 3).forEach((guide, index) => {
        console.log(`\n${index + 1}. ${guide.title}`)
        console.log(`   Category: ${guide.category}`)
        console.log(`   Slug: ${guide.slug.current}`)
        console.log(`   Tags: ${guide.tags.join(', ')}`)
        console.log(`   Has content: ${guide.content.length > 0}`)
        console.log(`   Has gallery: ${guide.gallery.length > 0}`)
        console.log(`   Original ID: ${guide._originalPostId}`)
      })

      if (convertedGuides.length > 3) {
        console.log(`\n... and ${convertedGuides.length - 3} more guides`)
      }

      console.log(
        `\n✅ DRY RUN COMPLETE - ${convertedGuides.length} guides ready for migration`,
      )
      console.log(`\nTo actually migrate, run with --no-dry-run flag`)
      return { dryRun: true, count: convertedGuides.length }
    }

    // Actual migration
    console.log(
      `\n🚀 Creating ${convertedGuides.length} new guide documents...`,
    )

    const results = []
    for (let i = 0; i < convertedGuides.length; i += batchSize) {
      const batch = convertedGuides.slice(i, i + batchSize)
      console.log(
        `   Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(convertedGuides.length / batchSize)}...`,
      )

      const batchResults = await Promise.all(
        batch.map(async (guide) => {
          try {
            const result = await client.create(guide)
            console.log(`   ✅ Created: ${result.title} (${result._id})`)
            return { success: true, id: result._id, title: result.title }
          } catch (error) {
            console.error(`   ❌ Failed: ${guide.title} - ${error.message}`)
            return { success: false, title: guide.title, error: error.message }
          }
        }),
      )

      results.push(...batchResults)

      // Small delay between batches
      if (i + batchSize < convertedGuides.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    const successful = results.filter((r) => r.success)
    const failed = results.filter((r) => !r.success)

    console.log(`\n📊 Migration Results:`)
    console.log(`   ✅ Successful: ${successful.length}`)
    console.log(`   ❌ Failed: ${failed.length}`)

    if (failed.length > 0) {
      console.log(`\n❌ Failed migrations:`)
      failed.forEach((f) => console.log(`   - ${f.title}: ${f.error}`))
    }

    // Save migration log
    const logData = {
      migrationDate: new Date().toISOString(),
      sourceFile: backupFilePath,
      total: convertedGuides.length,
      successful: successful.length,
      failed: failed.length,
      results: results,
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5)
    const logPath = path.join(
      path.dirname(backupFilePath),
      `migration-log-${timestamp}.json`,
    )
    fs.writeFileSync(logPath, JSON.stringify(logData, null, 2))
    console.log(`📋 Migration log saved: ${logPath}`)

    return logData
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Command line interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const dryRun = !args.includes('--no-dry-run')
  const backupFile =
    args.find((arg) => arg.endsWith('.json')) ||
    (() => {
      // Find the most recent backup file
      const backupDir = path.join(process.cwd(), 'backups')
      if (!fs.existsSync(backupDir)) {
        throw new Error('No backups directory found. Run backup script first.')
      }

      const files = fs
        .readdirSync(backupDir)
        .filter(
          (f) => f.startsWith('travel-guides-backup-') && f.endsWith('.json'),
        )
        .sort()
        .reverse()

      if (files.length === 0) {
        throw new Error('No backup files found. Run backup script first.')
      }

      return path.join(backupDir, files[0])
    })()

  console.log(`Using backup file: ${backupFile}`)

  migrateTravelGuides(backupFile, { dryRun })
    .then((result) => {
      if (result.dryRun) {
        console.log(
          `\n🎯 Ready to migrate ${result.count} travel guides to new schema!`,
        )
      } else {
        console.log(
          `\n🎉 Migration complete! ${result.successful}/${result.total} guides migrated successfully.`,
        )
      }
    })
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}

export { migrateTravelGuides }
