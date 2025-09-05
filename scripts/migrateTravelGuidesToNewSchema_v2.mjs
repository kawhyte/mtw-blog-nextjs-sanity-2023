#!/usr/bin/env node

/**
 * Migrate Travel Guides to New Schema Script - Version 2
 *
 * This script converts backed-up legacy post documents (linkType="story")
 * to the new independent guide document type with improved field mapping.
 *
 * Key improvements from v1:
 * - Skips excerpt2 and tip fields (per user request)
 * - Proper image asset reference handling
 * - Enhanced category generation logic
 * - Better error handling and logging
 * - Improved field validation
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

/**
 * Generates category based on title and content analysis
 */
function generateCategory(title, content) {
  if (!title) return 'tips'

  const titleLower = title.toLowerCase()

  // Analyze title for category keywords
  if (titleLower.includes('city') || titleLower.includes('guide to')) {
    return 'city'
  }
  if (
    titleLower.includes('transport') ||
    titleLower.includes('flight') ||
    titleLower.includes('train') ||
    titleLower.includes('rental') ||
    titleLower.includes('megabus')
  ) {
    return 'transport'
  }
  if (titleLower.includes('culture') || titleLower.includes('history')) {
    return 'culture'
  }
  if (titleLower.includes('adventure') || titleLower.includes('hiking')) {
    return 'adventure'
  }
  if (titleLower.includes('family') || titleLower.includes('kids')) {
    return 'family'
  }
  if (
    titleLower.includes('budget') ||
    titleLower.includes('cheap') ||
    titleLower.includes('day trip')
  ) {
    return 'budget'
  }
  if (
    titleLower.includes('luxury') ||
    titleLower.includes('premium') ||
    titleLower.includes('fine hotels') ||
    titleLower.includes('centurion')
  ) {
    return 'luxury'
  }
  if (titleLower.includes('cruise') || titleLower.includes('european')) {
    return 'adventure'
  }

  return 'tips' // default
}

/**
 * Generates tags from post data
 */
function generateTags(post) {
  const tags = []

  // Add location-based tags if available
  if (post.location && typeof post.location === 'string') {
    const locationParts = post.location.split(',').map((part) => part.trim())
    tags.push(...locationParts.slice(0, 2)) // Max 2 location parts
  }

  // Add category as tag (except 'tips' since it's default)
  const category = generateCategory(post.title, post.content)
  if (category !== 'tips') {
    tags.push(category)
  }

  // Add travel-related tags based on title analysis
  const titleLower = post.title?.toLowerCase() || ''
  if (titleLower.includes('lounge')) tags.push('airport lounge')
  if (titleLower.includes('hotel') || titleLower.includes('resort'))
    tags.push('accommodation')
  if (titleLower.includes('cruise')) tags.push('cruise')
  if (titleLower.includes('review')) tags.push('review')
  if (titleLower.includes('elite') || titleLower.includes('status'))
    tags.push('loyalty program')

  // Add default travel tags
  tags.push('travel', 'guide')

  // Remove duplicates and limit to 8 tags
  return [...new Set(tags)].filter(Boolean).slice(0, 8)
}

/**
 * Validates and cleans image object
 */
function validateImageObject(imageObj) {
  if (!imageObj || typeof imageObj !== 'object') return null

  // Must have asset reference
  if (!imageObj.asset || !imageObj.asset._ref) return null

  return {
    ...imageObj,
    // Ensure asset reference is properly formatted
    asset: {
      _type: 'reference',
      _ref: imageObj.asset._ref,
    },
  }
}

/**
 * Validates and cleans gallery array
 */
function validateGallery(gallery) {
  if (!Array.isArray(gallery)) return []

  return gallery.map(validateImageObject).filter(Boolean) // Remove null/invalid images
}

/**
 * Validates portable text content
 */
function validateContent(content) {
  if (!Array.isArray(content) || content.length === 0) {
    // Create default content if missing
    return [
      {
        _type: 'block',
        _key: 'defaultContent',
        style: 'normal',
        children: [{ _type: 'span', text: 'Content to be added...' }],
        markDefs: [],
      },
    ]
  }

  return content
}

/**
 * Maps legacy post data to new guide schema
 */
function mapPostToGuide(post, index) {
  try {
    // Validate required fields
    if (!post.title || !post.slug) {
      throw new Error('Missing required fields: title or slug')
    }

    const category = generateCategory(post.title, post.content)
    const tags = generateTags(post)

    const newGuide = {
      _type: 'guide',
      title: post.title,
      slug: {
        _type: 'slug',
        current: post.slug,
      },
      date: post.date || post._createdAt,
      category: category,
      content: validateContent(post.content),
      tags: tags,
    }

    // Add cover image if available and valid
    const coverImage = validateImageObject(post.coverImage)
    if (coverImage) {
      newGuide.coverImage = coverImage
    }

    // Add gallery if available and valid
    const gallery = validateGallery(post.gallery)
    if (gallery.length > 0) {
      newGuide.gallery = gallery
    }

    // Preserve original metadata for tracking
    newGuide._originalPostId = post._id
    newGuide._migratedAt = new Date().toISOString()
    newGuide._migrationVersion = 'v2'

    return { success: true, guide: newGuide, originalId: post._id }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      originalId: post._id,
      title: post.title,
    }
  }
}

async function migrateTravelGuides(backupFilePath, options = {}) {
  const { dryRun = true, batchSize = 10 } = options

  try {
    console.log(
      `🚀 ${dryRun ? 'DRY RUN: ' : ''}Starting travel guide migration v2...`,
    )

    if (!fs.existsSync(backupFilePath)) {
      throw new Error(`Backup file not found: ${backupFilePath}`)
    }

    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'))
    console.log(`📖 Loaded ${backupData.length} legacy guide posts from backup`)

    // Convert all posts to guides
    console.log('\n🔄 Converting legacy posts to guide documents...')
    const conversionResults = backupData.map(mapPostToGuide)

    const successful = conversionResults.filter((r) => r.success)
    const failed = conversionResults.filter((r) => !r.success)

    console.log(`📊 Conversion Results:`)
    console.log(`   ✅ Successful: ${successful.length}`)
    console.log(`   ❌ Failed: ${failed.length}`)

    if (failed.length > 0) {
      console.log(`\n❌ Failed conversions:`)
      failed.forEach((f) =>
        console.log(
          `   - ${f.title || 'Unknown'} (${f.originalId}): ${f.error}`,
        ),
      )
    }

    if (successful.length === 0) {
      console.log('\n⚠️ No guides were successfully converted. Aborting.')
      return { success: false, message: 'No valid guides to migrate' }
    }

    if (dryRun) {
      console.log('\n🔍 DRY RUN - Preview of converted guides:')
      successful.slice(0, 5).forEach((result, index) => {
        const guide = result.guide
        console.log(`\n${index + 1}. ${guide.title}`)
        console.log(`   Category: ${guide.category}`)
        console.log(`   Slug: ${guide.slug.current}`)
        console.log(`   Tags: ${guide.tags.join(', ')}`)
        console.log(`   Has cover image: ${!!guide.coverImage}`)
        console.log(`   Gallery images: ${guide.gallery?.length || 0}`)
        console.log(`   Content blocks: ${guide.content?.length || 0}`)
        console.log(`   Original ID: ${guide._originalPostId}`)
      })

      if (successful.length > 5) {
        console.log(`\n... and ${successful.length - 5} more guides`)
      }

      console.log(
        `\n✅ DRY RUN COMPLETE - ${successful.length} guides ready for migration`,
      )
      console.log(`\n📌 To actually migrate, run with --no-dry-run flag`)
      return { dryRun: true, count: successful.length, failed: failed.length }
    }

    // LIVE MIGRATION
    console.log(`\n🚀 Creating ${successful.length} new guide documents...`)

    const guides = successful.map((r) => r.guide)
    const migrationResults = []

    for (let i = 0; i < guides.length; i += batchSize) {
      const batch = guides.slice(i, i + batchSize)
      const batchNumber = Math.floor(i / batchSize) + 1
      const totalBatches = Math.ceil(guides.length / batchSize)

      console.log(
        `   📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} guides)...`,
      )

      const batchResults = await Promise.all(
        batch.map(async (guide) => {
          try {
            const result = await client.create(guide)
            console.log(`   ✅ Created: ${result.title} (${result._id})`)
            return {
              success: true,
              id: result._id,
              title: result.title,
              originalId: guide._originalPostId,
            }
          } catch (error) {
            console.error(`   ❌ Failed: ${guide.title} - ${error.message}`)
            return {
              success: false,
              title: guide.title,
              error: error.message,
              originalId: guide._originalPostId,
            }
          }
        }),
      )

      migrationResults.push(...batchResults)

      // Small delay between batches to avoid rate limits
      if (i + batchSize < guides.length) {
        console.log('   ⏱️ Waiting 2s before next batch...')
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    const migrationSuccessful = migrationResults.filter((r) => r.success)
    const migrationFailed = migrationResults.filter((r) => !r.success)

    console.log(`\n📊 Migration Results:`)
    console.log(`   ✅ Successfully created: ${migrationSuccessful.length}`)
    console.log(`   ❌ Failed to create: ${migrationFailed.length}`)

    if (migrationFailed.length > 0) {
      console.log(`\n❌ Failed migrations:`)
      migrationFailed.forEach((f) => console.log(`   - ${f.title}: ${f.error}`))
    }

    // Save comprehensive migration log
    const logData = {
      migrationDate: new Date().toISOString(),
      migrationVersion: 'v2',
      sourceFile: backupFilePath,
      totalOriginalPosts: backupData.length,
      conversionSuccessful: successful.length,
      conversionFailed: failed.length,
      migrationSuccessful: migrationSuccessful.length,
      migrationFailed: migrationFailed.length,
      conversionErrors: failed,
      migrationErrors: migrationFailed,
      successfulMigrations: migrationSuccessful,
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5)
    const logPath = path.join(
      path.dirname(backupFilePath),
      `guide-migration-v2-log-${timestamp}.json`,
    )
    fs.writeFileSync(logPath, JSON.stringify(logData, null, 2))
    console.log(`📋 Detailed migration log saved: ${logPath}`)

    console.log('\n✅ MIGRATION COMPLETED!')
    console.log(`📈 Final Summary:`)
    console.log(`   📄 Legacy posts: ${backupData.length}`)
    console.log(`   ✅ Successfully migrated: ${migrationSuccessful.length}`)
    console.log(`   ❌ Total failed: ${failed.length + migrationFailed.length}`)

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
        throw new Error(
          'No travel guide backup files found. Run backup script first.',
        )
      }

      return path.join(backupDir, files[0])
    })()

  console.log(`📂 Using backup file: ${backupFile}`)

  migrateTravelGuides(backupFile, { dryRun })
    .then((result) => {
      if (result.dryRun) {
        console.log(`\n🎯 Ready to migrate ${result.count} travel guides!`)
        if (result.failed > 0) {
          console.log(
            `⚠️ Note: ${result.failed} guides had conversion errors and will be skipped`,
          )
        }
        console.log(`\n📌 Run with --no-dry-run to execute the migration`)
      } else {
        const success = result.migrationSuccessful || 0
        const total = result.totalOriginalPosts || 0
        console.log(
          `\n🎉 Migration complete! ${success}/${total} guides migrated successfully.`,
        )

        if (success > 0) {
          console.log(`\n📝 Next steps:`)
          console.log(`   1. Check Sanity Studio to verify new guide documents`)
          console.log(`   2. Test guide queries and frontend pages`)
          console.log(
            `   3. Update any hardcoded references to old post structure`,
          )
        }
      }
    })
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}

export { migrateTravelGuides }
