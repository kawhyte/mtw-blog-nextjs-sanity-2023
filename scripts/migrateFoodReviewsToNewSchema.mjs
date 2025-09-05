#!/usr/bin/env node

/**
 * Migration Script: Post Food Reviews → Independent Food Review Schema
 *
 * This script converts backed-up food post data to the new independent
 * 'foodReview' document type and handles the migration process.
 *
 * Usage:
 *   npm run migrate-food        # Dry run (preview only)
 *   npm run migrate-food:live   # Actual migration
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// Check if this is a dry run
const isDryRun = !process.argv.includes('--no-dry-run')

/**
 * Maps old food post data to new foodReview schema
 */
function mapPostToFoodReview(post) {
  const foodReview = {
    _type: 'foodReview',
    title: post.title,
    slug: post.slug, // Keep the same slug structure
    date: post.date,
    location: post.location,
    diningType: post.diningType || 'dinein', // Default to dinein if missing
    coverImage: post.coverImage,
    excerpt2: post.excerpt2 || post.excerpt, // Use excerpt2, fallback to excerpt
    tip: post.tip,
    individualFoodRating: post.individualFoodRating,
    gallery: post.gallery,
    youtube: post.youtube,
    foodRating: post.foodRating,
    takeoutRating: post.takeoutRating,
    positives: post.positives,
    negatives: post.negatives,
    verdict: post.verdict,
    content: post.content,
    tags: generateTagsFromFoodData(post), // Generate relevant tags
  }

  // Remove undefined fields
  Object.keys(foodReview).forEach((key) => {
    if (foodReview[key] === undefined) {
      delete foodReview[key]
    }
  })

  return foodReview
}

/**
 * Generates relevant tags based on food data
 */
function generateTagsFromFoodData(post) {
  const tags = []

  // Add dining type as tag
  if (post.diningType) {
    tags.push(post.diningType === 'dinein' ? 'dine-in' : 'takeout')
  }

  // Add location-based tags
  if (post.location) {
    const locationParts = post.location.split(',').map((part) => part.trim())
    tags.push(...locationParts)
  }

  // Add food-related tags based on individual ratings
  if (post.individualFoodRating && post.individualFoodRating.length > 0) {
    tags.push('individual ratings')

    // Add cuisine type tags based on dish names (simple keyword matching)
    const dishNames = post.individualFoodRating
      .map((item) => item.name?.toLowerCase() || '')
      .join(' ')

    if (
      dishNames.includes('sushi') ||
      dishNames.includes('ramen') ||
      dishNames.includes('tempura')
    ) {
      tags.push('japanese cuisine')
    }
    if (
      dishNames.includes('pizza') ||
      dishNames.includes('pasta') ||
      dishNames.includes('risotto')
    ) {
      tags.push('italian cuisine')
    }
    if (
      dishNames.includes('burger') ||
      dishNames.includes('fries') ||
      dishNames.includes('bbq')
    ) {
      tags.push('american cuisine')
    }
    if (
      dishNames.includes('taco') ||
      dishNames.includes('burrito') ||
      dishNames.includes('salsa')
    ) {
      tags.push('mexican cuisine')
    }
    if (
      dishNames.includes('curry') ||
      dishNames.includes('naan') ||
      dishNames.includes('biryani')
    ) {
      tags.push('indian cuisine')
    }
  }

  // Add experience-based tags
  if (post.positives && post.positives.length > post.negatives?.length) {
    tags.push('highly rated')
  }

  // Add content-based tags
  if (post.gallery && post.gallery.length > 5) {
    tags.push('photo-rich')
  }

  if (post.youtube) {
    tags.push('video review')
  }

  return tags.slice(0, 8) // Limit to 8 tags max
}

/**
 * Check for references to food posts
 */
async function checkReferences(postIds) {
  const referencesQuery = `*[references(*[_id in $postIds]._id)] {
    _id,
    _type,
    title,
    "referencedPosts": *[_id in $postIds && references(^._id)] { _id, title }
  }`

  try {
    const references = await client.fetch(referencesQuery, { postIds })
    return references.filter(
      (ref) => ref.referencedPosts && ref.referencedPosts.length > 0,
    )
  } catch (error) {
    console.warn('Could not check references:', error.message)
    return []
  }
}

async function migrateFoodReviews() {
  try {
    console.log('🍽️ Starting Food Review Migration...')
    console.log(
      isDryRun
        ? '🔍 DRY RUN MODE - No changes will be made'
        : '🚀 LIVE MODE - Changes will be applied',
    )

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local')
    }
    if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
      throw new Error('NEXT_PUBLIC_SANITY_DATASET is not set in .env.local')
    }
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      throw new Error('SANITY_API_WRITE_TOKEN is not set in .env.local')
    }

    // Find the most recent backup file
    const backupDir = 'backups'
    const backupFiles = fs
      .readdirSync(backupDir)
      .filter(
        (file) =>
          file.startsWith('food-reviews-backup-') && file.endsWith('.json'),
      )
      .sort()
      .reverse()

    if (backupFiles.length === 0) {
      throw new Error(
        'No food review backup files found. Please run backup script first.',
      )
    }

    const latestBackupFile = path.join(backupDir, backupFiles[0])
    console.log(`📂 Using backup file: ${latestBackupFile}`)

    // Load backup data
    const backupData = JSON.parse(fs.readFileSync(latestBackupFile, 'utf8'))
    console.log(`📊 Found ${backupData.length} food posts to migrate`)

    if (backupData.length === 0) {
      console.log('ℹ️ No food posts to migrate.')
      return
    }

    // Check for references
    console.log('🔍 Checking for references to food posts...')
    const postIds = backupData.map((post) => post._id)
    const references = await checkReferences(postIds)

    if (references.length > 0) {
      console.log(
        `⚠️ Found ${references.length} documents referencing food posts:`,
      )
      references.slice(0, 5).forEach((ref) => {
        console.log(
          `  - ${ref._type}: "${ref.title || ref._id}" references ${ref.referencedPosts?.length || 0} food posts`,
        )
      })
      if (references.length > 5) {
        console.log(`  ... and ${references.length - 5} more`)
      }
    } else {
      console.log('✅ No references found to food posts')
    }

    // Convert posts to food reviews
    const foodReviews = backupData.map(mapPostToFoodReview)

    console.log('\n🔄 Migration Preview:')
    console.log(`📄 Documents to create: ${foodReviews.length}`)

    if (references.length > 0) {
      console.log(
        `⚠️ Strategy: CREATE ONLY (old posts will remain due to references)`,
      )
      console.log(
        `📝 Recommendation: Update references manually, then delete old posts`,
      )
    } else {
      console.log(
        `✅ Strategy: CREATE + DELETE (no references blocking deletion)`,
      )
    }

    // Show sample conversion
    if (foodReviews.length > 0) {
      const sample = foodReviews[0]
      console.log(`\n📝 Sample conversion:`)
      console.log(`  Title: ${sample.title}`)
      console.log(`  Slug: ${sample.slug?.current || 'N/A'}`)
      console.log(`  Dining Type: ${sample.diningType}`)
      console.log(`  Location: ${sample.location || 'N/A'}`)
      console.log(
        `  Individual Food Ratings: ${sample.individualFoodRating?.length || 0} dishes`,
      )
      console.log(`  Food Rating System: ${sample.foodRating ? 'Yes' : 'No'}`)
      console.log(
        `  Takeout Rating System: ${sample.takeoutRating ? 'Yes' : 'No'}`,
      )
      console.log(`  Tags: ${sample.tags?.join(', ') || 'None'}`)
    }

    if (isDryRun) {
      console.log('\n🔍 DRY RUN COMPLETE')
      console.log('📋 Summary of what would happen:')
      console.log(
        `  ✅ Create ${foodReviews.length} new 'foodReview' documents`,
      )

      if (references.length > 0) {
        console.log(
          `  ⚠️ Keep ${backupData.length} old 'post' documents (due to references)`,
        )
        console.log(`  📝 Manual cleanup needed after updating references`)
      } else {
        console.log(`  🗑️ Delete ${backupData.length} old 'post' documents`)
      }

      console.log('\n📌 To run the actual migration:')
      console.log('   npm run migrate-food:live')
      return
    }

    // LIVE MIGRATION
    console.log('\n🚀 Starting live migration...')

    // Strategy: Create new documents (safer approach)
    console.log('📝 Creating new food review documents...')
    const createdDocuments = []

    for (const foodReview of foodReviews) {
      try {
        const created = await client.create(foodReview)
        createdDocuments.push(created)
        console.log(
          `✅ Created: ${created.title} (${created.diningType}) - ${created._id}`,
        )
      } catch (error) {
        console.error(`❌ Failed to create: ${foodReview.title}`, error.message)
      }
    }

    console.log('\n✅ MIGRATION COMPLETED!')
    console.log(`📊 Results:`)
    console.log(
      `  ✅ Created: ${createdDocuments.length}/${foodReviews.length} food review documents`,
    )

    if (references.length > 0) {
      console.log(
        `  ⚠️ Kept: ${backupData.length} old food post documents (due to references)`,
      )
      console.log('\n📋 Next Steps:')
      console.log(
        '  1. Update any references to point to new food review documents',
      )
      console.log(
        '  2. Manually delete old food posts when no longer referenced',
      )
      console.log('  3. Test new food review functionality')
    } else {
      console.log(`  🎯 Old posts can be safely deleted if needed`)
    }

    // Show dining type breakdown
    const diningBreakdown = {
      dinein: createdDocuments.filter((doc) => doc.diningType === 'dinein')
        .length,
      takeout: createdDocuments.filter((doc) => doc.diningType === 'takeout')
        .length,
    }

    console.log('\n🍽️ Dining Type Breakdown:')
    console.log(`  - Dine-in experiences: ${diningBreakdown.dinein}`)
    console.log(`  - Takeout experiences: ${diningBreakdown.takeout}`)

    console.log('\n🎉 Food reviews are now available as independent documents!')
  } catch (error) {
    console.error('❌ Error during migration:', error)

    if (!isDryRun) {
      console.log('\n🔄 Migration failed. Your data is still safe.')
      console.log('📂 Original data is preserved in backup files.')
    }

    process.exit(1)
  }
}

// Run the migration
migrateFoodReviews()
