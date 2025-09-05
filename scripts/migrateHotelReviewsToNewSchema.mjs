#!/usr/bin/env node

/**
 * Migration Script: Post Hotel Reviews → Independent Hotel Review Schema
 *
 * This script converts backed-up hotel post data to the new independent
 * 'hotelReview' document type and handles the migration process.
 *
 * Usage:
 *   npm run migrate-hotels        # Dry run (preview only)
 *   npm run migrate-hotels:live   # Actual migration
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
 * Maps old hotel post data to new hotelReview schema
 */
function mapPostToHotelReview(post) {
  const hotelReview = {
    _type: 'hotelReview',
    title: post.title,
    slug: post.slug, // Keep the same slug structure
    date: post.date,
    location: post.location,
    category: post.category || 'mid-scale', // Default to mid-scale if missing
    room: post.room,
    lounge: post.lounge || 'No', // Default to 'No' if missing
    coverImage: post.coverImage,
    excerpt2: post.excerpt2 || post.excerpt, // Use excerpt2, fallback to excerpt
    tip: post.tip,
    gallery: post.gallery,
    youtube: post.youtube,
    hotelRating: post.hotelRating,
    internetSpeed: post.internetSpeed,
    roomAmenities: post.roomAmenities,
    techRating: post.techRating,
    positives: post.positives,
    negatives: post.negatives,
    verdict: post.verdict,
    content: post.content,
    tags: generateTagsFromHotelData(post), // Generate relevant tags
  }

  // Remove undefined fields
  Object.keys(hotelReview).forEach((key) => {
    if (hotelReview[key] === undefined) {
      delete hotelReview[key]
    }
  })

  return hotelReview
}

/**
 * Generates relevant tags based on hotel data
 */
function generateTagsFromHotelData(post) {
  const tags = []

  // Add category as tag
  if (post.category) {
    tags.push(post.category)
  }

  // Add location-based tags
  if (post.location) {
    const locationParts = post.location.split(',').map((part) => part.trim())
    tags.push(...locationParts)
  }

  // Add amenity-based tags
  if (post.lounge && post.lounge !== 'No') {
    tags.push('lounge access')
  }

  if (post.internetSpeed && post.internetSpeed > 50) {
    tags.push('high-speed internet')
  }

  // Add business-related tags based on room amenities or tech rating
  if (post.roomAmenities || post.techRating) {
    tags.push('business travel')
  }

  // Add rating-based tags
  if (post.hotelRating) {
    tags.push('reviewed')
  }

  return tags.slice(0, 8) // Limit to 8 tags max
}

async function migrateHotelReviews() {
  try {
    console.log('🏨 Starting Hotel Review Migration...')
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
          file.startsWith('hotel-reviews-backup-') && file.endsWith('.json'),
      )
      .sort()
      .reverse()

    if (backupFiles.length === 0) {
      throw new Error(
        'No hotel review backup files found. Please run backup script first.',
      )
    }

    const latestBackupFile = path.join(backupDir, backupFiles[0])
    console.log(`📂 Using backup file: ${latestBackupFile}`)

    // Load backup data
    const backupData = JSON.parse(fs.readFileSync(latestBackupFile, 'utf8'))
    console.log(`📊 Found ${backupData.length} hotel posts to migrate`)

    if (backupData.length === 0) {
      console.log('ℹ️ No hotel posts to migrate.')
      return
    }

    // Convert posts to hotel reviews
    const hotelReviews = backupData.map(mapPostToHotelReview)

    console.log('\n🔄 Migration Preview:')
    console.log(`📄 Documents to create: ${hotelReviews.length}`)

    // Show sample conversion
    if (hotelReviews.length > 0) {
      const sample = hotelReviews[0]
      console.log(`\n📝 Sample conversion:`)
      console.log(`  Title: ${sample.title}`)
      console.log(`  Slug: ${sample.slug?.current || 'N/A'}`)
      console.log(`  Category: ${sample.category}`)
      console.log(`  Location: ${sample.location || 'N/A'}`)
      console.log(`  Tags: ${sample.tags?.join(', ') || 'None'}`)
    }

    if (isDryRun) {
      console.log('\n🔍 DRY RUN COMPLETE')
      console.log('📋 Summary of what would happen:')
      console.log(
        `  ✅ Create ${hotelReviews.length} new 'hotelReview' documents`,
      )
      console.log(
        `  🗑️ Delete ${backupData.length} old 'post' documents with linkType='hotel'`,
      )
      console.log('\n📌 To run the actual migration:')
      console.log('   npm run migrate-hotels:live')
      return
    }

    // LIVE MIGRATION
    console.log('\n🚀 Starting live migration...')

    const transaction = client.transaction()

    // Create new hotel review documents
    hotelReviews.forEach((hotelReview) => {
      transaction.create(hotelReview)
    })

    // Delete old hotel post documents
    backupData.forEach((post) => {
      transaction.delete(post._id)
    })

    // Execute transaction
    console.log('💾 Executing transaction...')
    const result = await transaction.commit()

    console.log('\n✅ MIGRATION COMPLETED SUCCESSFULLY!')
    console.log(`📊 Results:`)
    console.log(`  ✅ Created: ${hotelReviews.length} hotel review documents`)
    console.log(`  🗑️ Deleted: ${backupData.length} old hotel post documents`)
    console.log(`  📋 Transaction ID: ${result.transactionId || 'N/A'}`)

    // Log sample of created documents
    if (result.results && result.results.length > 0) {
      console.log(`\n📝 Sample created documents:`)
      result.results.slice(0, 3).forEach((doc, index) => {
        if (doc.operation === 'create') {
          console.log(
            `  ${index + 1}. ${doc.document?.title || 'N/A'} (${doc.document?._id})`,
          )
        }
      })
    }

    console.log('\n🎉 Hotel reviews are now independent documents!')
    console.log('📋 Next steps:')
    console.log('  1. Test the new hotel review documents in Sanity Studio')
    console.log('  2. Verify preview functionality works')
    console.log('  3. Create /hotel/[slug].tsx page for frontend display')
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
migrateHotelReviews()
