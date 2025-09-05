#!/usr/bin/env node

/**
 * Backup Script for Hotel Review Data
 *
 * This script exports all existing 'post' documents with linkType == 'hotel'
 * to prepare for migration to the new independent 'hotelReview' schema.
 *
 * Usage:
 *   npm run backup-hotels
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

async function backupHotelReviews() {
  try {
    console.log('🏨 Starting Hotel Review Data Backup...')

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

    // Query to fetch all hotel posts
    const hotelPostsQuery = `*[_type == "post" && linkType == "hotel"] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      date,
      location,
      category,
      room,
      lounge,
      coverImage,
      excerpt,
      excerpt2,
      tip,
      gallery,
      youtube,
      hotelRating,
      internetSpeed,
      roomAmenities,
      techRating,
      positives,
      negatives,
      verdict,
      content,
      linkType
    }`

    console.log('📊 Fetching hotel review posts...')
    const hotelPosts = await client.fetch(hotelPostsQuery)

    if (!hotelPosts || hotelPosts.length === 0) {
      console.log('ℹ️ No hotel review posts found to backup.')
      return
    }

    console.log(`✅ Found ${hotelPosts.length} hotel review posts`)

    // Create backup directory if it doesn't exist
    const backupDir = 'backups'
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Generate timestamp for backup files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = path.join(
      backupDir,
      `hotel-reviews-backup-${timestamp}.json`,
    )
    const summaryFile = path.join(
      backupDir,
      `hotel-reviews-summary-${timestamp}.json`,
    )

    // Save the full backup
    fs.writeFileSync(backupFile, JSON.stringify(hotelPosts, null, 2))
    console.log(`💾 Full backup saved to: ${backupFile}`)

    // Create a summary report
    const summary = {
      timestamp: new Date().toISOString(),
      totalDocuments: hotelPosts.length,
      documentIds: hotelPosts.map((post) => post._id),
      categories: {
        luxury: hotelPosts.filter((p) => p.category === 'luxury').length,
        'mid-scale': hotelPosts.filter((p) => p.category === 'mid-scale')
          .length,
        economy: hotelPosts.filter((p) => p.category === 'economy').length,
        undefined: hotelPosts.filter((p) => !p.category).length,
      },
      fieldsAnalysis: {
        withLocation: hotelPosts.filter((p) => p.location).length,
        withRoom: hotelPosts.filter((p) => p.room).length,
        withLounge: hotelPosts.filter((p) => p.lounge).length,
        withGallery: hotelPosts.filter((p) => p.gallery && p.gallery.length > 0)
          .length,
        withYoutube: hotelPosts.filter((p) => p.youtube).length,
        withHotelRating: hotelPosts.filter((p) => p.hotelRating).length,
        withInternetSpeed: hotelPosts.filter((p) => p.internetSpeed).length,
        withRoomAmenities: hotelPosts.filter((p) => p.roomAmenities).length,
        withTechRating: hotelPosts.filter((p) => p.techRating).length,
        withPositives: hotelPosts.filter(
          (p) => p.positives && p.positives.length > 0,
        ).length,
        withNegatives: hotelPosts.filter(
          (p) => p.negatives && p.negatives.length > 0,
        ).length,
        withVerdict: hotelPosts.filter((p) => p.verdict).length,
        withContent: hotelPosts.filter((p) => p.content).length,
      },
      sampleTitles: hotelPosts.slice(0, 5).map((p) => p.title),
    }

    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2))
    console.log(`📋 Summary report saved to: ${summaryFile}`)

    // Display summary
    console.log('\n📊 BACKUP SUMMARY:')
    console.log(`📄 Total hotel review posts: ${summary.totalDocuments}`)
    console.log(`🏨 Categories breakdown:`)
    console.log(`  - Luxury: ${summary.categories.luxury}`)
    console.log(`  - Mid-Scale: ${summary.categories['mid-scale']}`)
    console.log(`  - Economy: ${summary.categories.economy}`)
    console.log(`  - No Category: ${summary.categories.undefined}`)

    console.log(`\n🔍 Data completeness:`)
    console.log(
      `  - With Location: ${summary.fieldsAnalysis.withLocation}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Room Info: ${summary.fieldsAnalysis.withRoom}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Gallery: ${summary.fieldsAnalysis.withGallery}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Hotel Rating: ${summary.fieldsAnalysis.withHotelRating}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Content: ${summary.fieldsAnalysis.withContent}/${summary.totalDocuments}`,
    )

    if (summary.sampleTitles.length > 0) {
      console.log(`\n📝 Sample titles:`)
      summary.sampleTitles.forEach((title, index) => {
        console.log(`  ${index + 1}. ${title}`)
      })
    }

    console.log('\n✅ Hotel Review backup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('  1. Review the backup files')
    console.log('  2. Run preview migration: npm run migrate-hotels (dry run)')
    console.log('  3. Run actual migration: npm run migrate-hotels:live')
  } catch (error) {
    console.error('❌ Error during backup:', error)
    process.exit(1)
  }
}

// Run the backup
backupHotelReviews()
