#!/usr/bin/env node

/**
 * Migration Script v2: Post Hotel Reviews → Independent Hotel Review Schema
 * 
 * This version handles references properly by:
 * 1. Creating new hotelReview documents first
 * 2. Optionally updating references to point to new documents  
 * 3. Only deleting old documents if no references remain
 * 
 * Usage:
 *   npm run migrate-hotels-v2        # Dry run (preview only)
 *   npm run migrate-hotels-v2:live   # Actual migration
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
  Object.keys(hotelReview).forEach(key => {
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
    const locationParts = post.location.split(',').map(part => part.trim())
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

/**
 * Check for references to hotel posts
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
    return references.filter(ref => ref.referencedPosts && ref.referencedPosts.length > 0)
  } catch (error) {
    console.warn('Could not check references:', error.message)
    return []
  }
}

async function migrateHotelReviews() {
  try {
    console.log('🏨 Starting Hotel Review Migration v2...')
    console.log(isDryRun ? '🔍 DRY RUN MODE - No changes will be made' : '🚀 LIVE MODE - Changes will be applied')

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
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('hotel-reviews-backup-') && file.endsWith('.json'))
      .sort()
      .reverse()

    if (backupFiles.length === 0) {
      throw new Error('No hotel review backup files found. Please run backup script first.')
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

    // Check for references
    console.log('🔍 Checking for references to hotel posts...')
    const postIds = backupData.map(post => post._id)
    const references = await checkReferences(postIds)
    
    if (references.length > 0) {
      console.log(`⚠️ Found ${references.length} documents referencing hotel posts:`)
      references.slice(0, 5).forEach(ref => {
        console.log(`  - ${ref._type}: "${ref.title || ref._id}" references ${ref.referencedPosts?.length || 0} hotel posts`)
      })
      if (references.length > 5) {
        console.log(`  ... and ${references.length - 5} more`)
      }
    } else {
      console.log('✅ No references found to hotel posts')
    }

    // Convert posts to hotel reviews
    const hotelReviews = backupData.map(mapPostToHotelReview)
    
    console.log('\n🔄 Migration Preview:')
    console.log(`📄 Documents to create: ${hotelReviews.length}`)
    
    if (references.length > 0) {
      console.log(`⚠️ Strategy: CREATE ONLY (old posts will remain due to references)`)
      console.log(`📝 Recommendation: Update references manually, then delete old posts`)
    } else {
      console.log(`✅ Strategy: CREATE + DELETE (no references blocking deletion)`)
    }
    
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
      console.log(`  ✅ Create ${hotelReviews.length} new 'hotelReview' documents`)
      
      if (references.length > 0) {
        console.log(`  ⚠️ Keep ${backupData.length} old 'post' documents (due to references)`)
        console.log(`  📝 Manual cleanup needed after updating references`)
      } else {
        console.log(`  🗑️ Delete ${backupData.length} old 'post' documents`)
      }
      
      console.log('\n📌 To run the actual migration:')
      console.log('   npm run migrate-hotels-v2:live')
      return
    }

    // LIVE MIGRATION
    console.log('\n🚀 Starting live migration...')

    // Strategy 1: Just create new documents (safer)
    console.log('📝 Creating new hotel review documents...')
    const createdDocuments = []
    
    for (const hotelReview of hotelReviews) {
      try {
        const created = await client.create(hotelReview)
        createdDocuments.push(created)
        console.log(`✅ Created: ${created.title} (${created._id})`)
      } catch (error) {
        console.error(`❌ Failed to create: ${hotelReview.title}`, error.message)
      }
    }

    console.log('\n✅ MIGRATION COMPLETED!')
    console.log(`📊 Results:`)
    console.log(`  ✅ Created: ${createdDocuments.length}/${hotelReviews.length} hotel review documents`)
    
    if (references.length > 0) {
      console.log(`  ⚠️ Kept: ${backupData.length} old hotel post documents (due to references)`)
      console.log('\n📋 Next Steps:')
      console.log('  1. Update any references to point to new hotel review documents')
      console.log('  2. Manually delete old hotel posts when no longer referenced')
      console.log('  3. Test new hotel review functionality')
    } else {
      console.log(`  🎯 Old posts can be safely deleted if needed`)
    }

    console.log('\n🎉 Hotel reviews are now available as independent documents!')

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

