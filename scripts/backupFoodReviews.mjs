#!/usr/bin/env node

/**
 * Backup Script for Food Review Data
 *
 * This script exports all existing 'post' documents with linkType == 'food'
 * to prepare for migration to the new independent 'foodReview' schema.
 *
 * Usage:
 *   npm run backup-food
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

async function backupFoodReviews() {
  try {
    console.log('🍽️ Starting Food Review Data Backup...')

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

    // Query to fetch all food posts
    const foodPostsQuery = `*[_type == "post" && linkType == "food"] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      slug,
      date,
      location,
      diningType,
      coverImage,
      excerpt,
      excerpt2,
      tip,
      individualFoodRating,
      gallery,
      youtube,
      foodRating,
      takeoutRating,
      positives,
      negatives,
      verdict,
      content,
      linkType
    }`

    console.log('📊 Fetching food review posts...')
    const foodPosts = await client.fetch(foodPostsQuery)

    if (!foodPosts || foodPosts.length === 0) {
      console.log('ℹ️ No food review posts found to backup.')
      return
    }

    console.log(`✅ Found ${foodPosts.length} food review posts`)

    // Create backup directory if it doesn't exist
    const backupDir = 'backups'
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Generate timestamp for backup files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = path.join(
      backupDir,
      `food-reviews-backup-${timestamp}.json`,
    )
    const summaryFile = path.join(
      backupDir,
      `food-reviews-summary-${timestamp}.json`,
    )

    // Save the full backup
    fs.writeFileSync(backupFile, JSON.stringify(foodPosts, null, 2))
    console.log(`💾 Full backup saved to: ${backupFile}`)

    // Create a summary report
    const summary = {
      timestamp: new Date().toISOString(),
      totalDocuments: foodPosts.length,
      documentIds: foodPosts.map((post) => post._id),
      diningTypes: {
        dinein: foodPosts.filter((p) => p.diningType === 'dinein').length,
        takeout: foodPosts.filter((p) => p.diningType === 'takeout').length,
        undefined: foodPosts.filter((p) => !p.diningType).length,
      },
      fieldsAnalysis: {
        withLocation: foodPosts.filter((p) => p.location).length,
        withDiningType: foodPosts.filter((p) => p.diningType).length,
        withIndividualFoodRating: foodPosts.filter(
          (p) => p.individualFoodRating && p.individualFoodRating.length > 0,
        ).length,
        withGallery: foodPosts.filter((p) => p.gallery && p.gallery.length > 0)
          .length,
        withYoutube: foodPosts.filter((p) => p.youtube).length,
        withFoodRating: foodPosts.filter((p) => p.foodRating).length,
        withTakeoutRating: foodPosts.filter((p) => p.takeoutRating).length,
        withPositives: foodPosts.filter(
          (p) => p.positives && p.positives.length > 0,
        ).length,
        withNegatives: foodPosts.filter(
          (p) => p.negatives && p.negatives.length > 0,
        ).length,
        withVerdict: foodPosts.filter((p) => p.verdict).length,
        withContent: foodPosts.filter((p) => p.content).length,
      },
      individualFoodRatingStats: {
        totalRestaurantsWithIndividualRatings: foodPosts.filter(
          (p) => p.individualFoodRating && p.individualFoodRating.length > 0,
        ).length,
        totalIndividualDishRatings: foodPosts.reduce(
          (sum, post) => sum + (post.individualFoodRating?.length || 0),
          0,
        ),
        averageDishesPerRestaurant: Math.round(
          foodPosts.reduce(
            (sum, post) => sum + (post.individualFoodRating?.length || 0),
            0,
          ) /
            Math.max(
              foodPosts.filter(
                (p) =>
                  p.individualFoodRating && p.individualFoodRating.length > 0,
              ).length,
              1,
            ),
        ),
      },
      sampleTitles: foodPosts.slice(0, 5).map((p) => p.title),
    }

    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2))
    console.log(`📋 Summary report saved to: ${summaryFile}`)

    // Display summary
    console.log('\n📊 BACKUP SUMMARY:')
    console.log(`📄 Total food review posts: ${summary.totalDocuments}`)
    console.log(`🍽️ Dining types breakdown:`)
    console.log(`  - Dine-in: ${summary.diningTypes.dinein}`)
    console.log(`  - Takeout: ${summary.diningTypes.takeout}`)
    console.log(`  - No Dining Type: ${summary.diningTypes.undefined}`)

    console.log(`\n🔍 Data completeness:`)
    console.log(
      `  - With Location: ${summary.fieldsAnalysis.withLocation}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Dining Type: ${summary.fieldsAnalysis.withDiningType}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Individual Food Ratings: ${summary.fieldsAnalysis.withIndividualFoodRating}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Gallery: ${summary.fieldsAnalysis.withGallery}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Food Rating (Dine-in): ${summary.fieldsAnalysis.withFoodRating}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Takeout Rating: ${summary.fieldsAnalysis.withTakeoutRating}/${summary.totalDocuments}`,
    )
    console.log(
      `  - With Content: ${summary.fieldsAnalysis.withContent}/${summary.totalDocuments}`,
    )

    console.log(`\n🎖️ Individual Food Rating Statistics:`)
    console.log(
      `  - Restaurants with individual dish ratings: ${summary.individualFoodRatingStats.totalRestaurantsWithIndividualRatings}`,
    )
    console.log(
      `  - Total individual dish/drink ratings: ${summary.individualFoodRatingStats.totalIndividualDishRatings}`,
    )
    console.log(
      `  - Average dishes per restaurant: ${summary.individualFoodRatingStats.averageDishesPerRestaurant}`,
    )

    if (summary.sampleTitles.length > 0) {
      console.log(`\n📝 Sample titles:`)
      summary.sampleTitles.forEach((title, index) => {
        console.log(`  ${index + 1}. ${title}`)
      })
    }

    console.log('\n✅ Food Review backup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('  1. Review the backup files')
    console.log('  2. Run preview migration: npm run migrate-food (dry run)')
    console.log('  3. Run actual migration: npm run migrate-food:live')
  } catch (error) {
    console.error('❌ Error during backup:', error)
    process.exit(1)
  }
}

// Run the backup
backupFoodReviews()
