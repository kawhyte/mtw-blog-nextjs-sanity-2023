#!/usr/bin/env node

/**
 * Backup Travel Guide Data Script
 *
 * This script exports all posts with linkType='story' to create a backup
 * before migrating them to the new independent guide document type.
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

// Query to get all travel guide posts
const travelGuidesQuery = `
  *[_type == "post" && linkType == "story"] {
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
    linkType,
    // Note: excerpt2, tip, positives, negatives, verdict, youtube, location are hidden for stories
    // So we'll include them in case they have data
    excerpt2,
    tip,
    positives,
    negatives,
    verdict,
    youtube,
    location
  }
`

async function backupTravelGuides() {
  try {
    console.log('🔍 Fetching travel guide data from Sanity...')

    const travelGuides = await client.fetch(travelGuidesQuery)

    console.log(`📊 Found ${travelGuides.length} travel guide posts`)

    if (travelGuides.length === 0) {
      console.log('ℹ️  No travel guides found with linkType="story"')
      return
    }

    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Create timestamped backup file
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5)
    const backupFileName = `travel-guides-backup-${timestamp}.json`
    const backupFilePath = path.join(backupDir, backupFileName)

    // Write backup file
    fs.writeFileSync(backupFilePath, JSON.stringify(travelGuides, null, 2))

    console.log(`✅ Backup created: ${backupFilePath}`)

    // Create summary report
    const summary = {
      totalGuides: travelGuides.length,
      backupDate: new Date().toISOString(),
      guides: travelGuides.map((guide) => ({
        id: guide._id,
        title: guide.title,
        slug: guide.slug,
        date: guide.date,
        hasContent: !!guide.content && guide.content.length > 0,
        hasGallery: !!guide.gallery && guide.gallery.length > 0,
        hasCoverImage: !!guide.coverImage,
        hasExcerpt: !!guide.excerpt2,
        hasTip: !!guide.tip,
      })),
    }

    const summaryFileName = `travel-guides-summary-${timestamp}.json`
    const summaryFilePath = path.join(backupDir, summaryFileName)
    fs.writeFileSync(summaryFilePath, JSON.stringify(summary, null, 2))

    console.log(`📋 Summary created: ${summaryFilePath}`)
    console.log(`\n📈 Summary:`)
    console.log(`   - Total guides: ${summary.totalGuides}`)
    console.log(
      `   - With content: ${summary.guides.filter((g) => g.hasContent).length}`,
    )
    console.log(
      `   - With gallery: ${summary.guides.filter((g) => g.hasGallery).length}`,
    )
    console.log(
      `   - With cover image: ${summary.guides.filter((g) => g.hasCoverImage).length}`,
    )
    console.log(
      `   - With excerpt: ${summary.guides.filter((g) => g.hasExcerpt).length}`,
    )
    console.log(
      `   - With tips: ${summary.guides.filter((g) => g.hasTip).length}`,
    )

    return {
      backupFile: backupFilePath,
      summaryFile: summaryFilePath,
      count: travelGuides.length,
    }
  } catch (error) {
    console.error('❌ Error backing up travel guides:', error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  backupTravelGuides()
    .then((result) => {
      if (result) {
        console.log(
          `\n🎉 Backup complete! ${result.count} travel guides backed up.`,
        )
        console.log(`\n📝 Next steps:`)
        console.log(`   1. Review the backup files in the 'backups' directory`)
        console.log(
          `   2. Test creating new guide documents with the new schema`,
        )
        console.log(
          `   3. Use the migration script to convert old posts to new guides`,
        )
      }
    })
    .catch((error) => {
      console.error('Failed to backup travel guides:', error)
      process.exit(1)
    })
}

export { backupTravelGuides }
