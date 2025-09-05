#!/usr/bin/env node

/**
 * Migrate Travel Guides to New Schema Script - Version 3
 *
 * This script converts backed-up legacy post documents (linkType="story")
 * to the new independent guide document type with FIXED image handling.
 *
 * Key improvements from v2:
 * - FIXED: Properly handles both expanded and referenced asset objects
 * - FIXED: Correctly migrates cover images and gallery images
 * - Enhanced: Better asset reference validation
 * - Enhanced: Comprehensive image debugging
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
 * FIXED: Validates and converts image object to proper reference format
 */
function validateAndConvertImageObject(imageObj) {
  if (!imageObj || typeof imageObj !== 'object') return null

  let assetId = null

  // Handle expanded asset objects (from backup with resolved references)
  if (imageObj.asset && imageObj.asset._id) {
    assetId = imageObj.asset._id
  }
  // Handle simple reference format
  else if (imageObj.asset && imageObj.asset._ref) {
    assetId = imageObj.asset._ref
  }
  // Handle direct _ref
  else if (imageObj._ref) {
    assetId = imageObj._ref
  }

  if (!assetId) {
    console.log('   ⚠️  Invalid image object - no asset ID found')
    return null
  }

  // Return proper Sanity image format
  const validImage = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  }

  // Preserve additional fields if present
  if (imageObj.alt) validImage.alt = imageObj.alt
  if (imageObj.caption) validImage.caption = imageObj.caption
  if (imageObj.hotspot) validImage.hotspot = imageObj.hotspot
  if (imageObj.crop) validImage.crop = imageObj.crop
  if (imageObj._key) validImage._key = imageObj._key

  return validImage
}

/**
 * FIXED: Validates and converts gallery array with proper image references
 */
function validateAndConvertGallery(gallery) {
  if (!Array.isArray(gallery)) return []

  console.log(`   🖼️  Processing gallery with ${gallery.length} images`)

  const convertedImages = gallery
    .map((img, index) => {
      const converted = validateAndConvertImageObject(img)
      if (!converted) {
        console.log(`   ⚠️  Gallery image ${index + 1} invalid - skipping`)
      } else {
        console.log(`   ✅ Gallery image ${index + 1} converted`)
      }
      return converted
    })
    .filter(Boolean) // Remove null/invalid images

  console.log(
    `   📊 Gallery result: ${convertedImages.length}/${gallery.length} images converted`,
  )
  return convertedImages
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
 * FIXED: Maps legacy post data to new guide schema with proper image handling
 */
function mapPostToGuide(post, index) {
  try {
    // Validate required fields
    if (!post.title || !post.slug) {
      throw new Error('Missing required fields: title or slug')
    }

    console.log(`\n📝 Processing: ${post.title}`)

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

    // FIXED: Handle cover image with proper asset reference conversion
    if (post.coverImage) {
      console.log('   🖼️  Processing cover image...')
      const coverImage = validateAndConvertImageObject(post.coverImage)
      if (coverImage) {
        newGuide.coverImage = coverImage
        console.log('   ✅ Cover image migrated')
      } else {
        console.log('   ❌ Cover image failed validation')
      }
    } else {
      console.log('   ℹ️  No cover image')
    }

    // FIXED: Handle gallery with proper asset reference conversion
    if (post.gallery && Array.isArray(post.gallery)) {
      console.log('   🖼️  Processing gallery...')
      const gallery = validateAndConvertGallery(post.gallery)
      if (gallery.length > 0) {
        newGuide.gallery = gallery
        console.log(`   ✅ Gallery migrated: ${gallery.length} images`)
      } else {
        console.log('   ⚠️  Gallery present but no valid images')
      }
    } else {
      console.log('   ℹ️  No gallery images')
    }

    // Preserve original metadata for tracking
    newGuide._originalPostId = post._id
    newGuide._migratedAt = new Date().toISOString()
    newGuide._migrationVersion = 'v3-fixed-images'

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
      `🚀 ${dryRun ? 'DRY RUN: ' : ''}Starting travel guide migration v3 (FIXED IMAGES)...`,
    )

    if (!fs.existsSync(backupFilePath)) {
      throw new Error(`Backup file not found: ${backupFilePath}`)
    }

    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'))
    console.log(`📖 Loaded ${backupData.length} legacy guide posts from backup`)

    // Check image availability in backup
    const withCoverImages = backupData.filter((p) => p.coverImage).length
    const withGallery = backupData.filter(
      (p) => p.gallery && p.gallery.length > 0,
    ).length
    console.log(`📊 Backup image summary:`)
    console.log(`   Cover images: ${withCoverImages}/${backupData.length}`)
    console.log(`   Gallery images: ${withGallery}/${backupData.length}`)

    // Convert all posts to guides
    console.log('\n🔄 Converting legacy posts to guide documents...')
    const conversionResults = backupData.map(mapPostToGuide)

    const successful = conversionResults.filter((r) => r.success)
    const failed = conversionResults.filter((r) => !r.success)

    console.log(`\n📊 Conversion Results:`)
    console.log(`   ✅ Successful: ${successful.length}`)
    console.log(`   ❌ Failed: ${failed.length}`)

    // Check converted image counts
    const convertedWithCover = successful.filter(
      (r) => r.guide.coverImage,
    ).length
    const convertedWithGallery = successful.filter(
      (r) => r.guide.gallery && r.guide.gallery.length > 0,
    ).length
    console.log(`📊 Converted image summary:`)
    console.log(`   Cover images: ${convertedWithCover}/${successful.length}`)
    console.log(
      `   Gallery images: ${convertedWithGallery}/${successful.length}`,
    )

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
      successful.slice(0, 3).forEach((result, index) => {
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

      if (successful.length > 3) {
        console.log(`\n... and ${successful.length - 3} more guides`)
      }

      console.log(
        `\n✅ DRY RUN COMPLETE - ${successful.length} guides ready for migration`,
      )
      console.log(`📊 Images ready for migration:`)
      console.log(`   Cover images: ${convertedWithCover}`)
      console.log(`   Gallery images: ${convertedWithGallery}`)
      console.log(`\n📌 To actually migrate, run with --no-dry-run flag`)
      return {
        dryRun: true,
        count: successful.length,
        failed: failed.length,
        images: { cover: convertedWithCover, gallery: convertedWithGallery },
      }
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
            const coverImg = guide.coverImage ? '🖼️' : '📄'
            const galleryImg =
              guide.gallery?.length > 0 ? `🖼️x${guide.gallery.length}` : ''
            console.log(
              `   ✅ Created: ${result.title} (${result._id}) ${coverImg}${galleryImg}`,
            )
            return {
              success: true,
              id: result._id,
              title: result.title,
              originalId: guide._originalPostId,
              hasCover: !!guide.coverImage,
              galleryCount: guide.gallery?.length || 0,
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

    // Count final images
    const finalCoverImages = migrationSuccessful.filter(
      (r) => r.hasCover,
    ).length
    const finalGalleryImages = migrationSuccessful.reduce(
      (total, r) => total + r.galleryCount,
      0,
    )

    console.log(`\n📊 Migration Results:`)
    console.log(`   ✅ Successfully created: ${migrationSuccessful.length}`)
    console.log(`   ❌ Failed to create: ${migrationFailed.length}`)
    console.log(`   🖼️ Cover images migrated: ${finalCoverImages}`)
    console.log(`   🖼️ Gallery images migrated: ${finalGalleryImages}`)

    if (migrationFailed.length > 0) {
      console.log(`\n❌ Failed migrations:`)
      migrationFailed.forEach((f) => console.log(`   - ${f.title}: ${f.error}`))
    }

    // Save comprehensive migration log
    const logData = {
      migrationDate: new Date().toISOString(),
      migrationVersion: 'v3-fixed-images',
      sourceFile: backupFilePath,
      totalOriginalPosts: backupData.length,
      conversionSuccessful: successful.length,
      conversionFailed: failed.length,
      migrationSuccessful: migrationSuccessful.length,
      migrationFailed: migrationFailed.length,
      imagesMigrated: {
        coverImages: finalCoverImages,
        galleryImages: finalGalleryImages,
      },
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
      `guide-migration-v3-fixed-images-log-${timestamp}.json`,
    )
    fs.writeFileSync(logPath, JSON.stringify(logData, null, 2))
    console.log(`📋 Detailed migration log saved: ${logPath}`)

    console.log('\n✅ MIGRATION COMPLETED!')
    console.log(`📈 Final Summary:`)
    console.log(`   📄 Legacy posts: ${backupData.length}`)
    console.log(`   ✅ Successfully migrated: ${migrationSuccessful.length}`)
    console.log(
      `   🖼️ Cover images: ${finalCoverImages}/${withCoverImages} migrated`,
    )
    console.log(`   🖼️ Gallery images: ${finalGalleryImages} total migrated`)
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
        console.log(
          `📊 Images ready: ${result.images.cover} cover, ${result.images.gallery} with galleries`,
        )
        if (result.failed > 0) {
          console.log(
            `⚠️ Note: ${result.failed} guides had conversion errors and will be skipped`,
          )
        }
        console.log(`\n📌 Run with --no-dry-run to execute the migration`)
      } else {
        const success = result.migrationSuccessful || 0
        const total = result.totalOriginalPosts || 0
        const coverImages = result.imagesMigrated?.coverImages || 0
        const galleryImages = result.imagesMigrated?.galleryImages || 0
        console.log(
          `\n🎉 Migration complete! ${success}/${total} guides migrated successfully.`,
        )
        console.log(
          `🖼️ Images migrated: ${coverImages} cover + ${galleryImages} gallery`,
        )

        if (success > 0) {
          console.log(`\n📝 Next steps:`)
          console.log(`   1. Check Sanity Studio to verify new guide documents`)
          console.log(`   2. Test guide queries and frontend pages`)
          console.log(`   3. Verify images display correctly in frontend`)
        }
      }
    })
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}

export { migrateTravelGuides }
