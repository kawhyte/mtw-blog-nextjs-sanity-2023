#!/usr/bin/env node

/**
 * Test Guide Queries Script
 *
 * This script tests all the guide-related queries to ensure they work
 * correctly with the newly migrated guide documents.
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2022-11-15',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

// Import queries from the main queries file
const queries = {
  // Test basic guide count
  guideCount: `count(*[_type == "guide"])`,

  // Test all guides query (simplified)
  allGuides: `*[_type == "guide"] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    date,
    category,
    tags,
    coverImage,
    gallery
  }`,

  // Test single guide by slug (using first guide)
  guideBySlug: `*[_type == "guide"][0] {
    _id,
    title,
    "slug": slug.current,
    date,
    category,
    content,
    coverImage,
    gallery,
    tags
  }`,

  // Test guides by category
  guidesByCategory: `*[_type == "guide" && category == "tips"] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    date
  }`,

  // Test image validation
  guidesWithImages: `*[_type == "guide" && defined(coverImage)] {
    _id,
    title,
    coverImage {
      asset->,
      alt
    }
  }`,

  // Test content validation
  guidesWithContent: `*[_type == "guide" && defined(content) && count(content) > 0] {
    _id,
    title,
    "contentBlocks": count(content)
  }`,
}

async function testQuery(name, query, description) {
  try {
    console.log(`\n🔍 Testing: ${name}`)
    console.log(`   Description: ${description}`)

    const startTime = Date.now()
    const result = await client.fetch(query)
    const duration = Date.now() - startTime

    console.log(`   ✅ Success (${duration}ms)`)

    if (typeof result === 'number') {
      console.log(`   📊 Result: ${result}`)
    } else if (Array.isArray(result)) {
      console.log(`   📊 Results: ${result.length} items`)
      if (result.length > 0 && result.length <= 3) {
        result.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.title || item._id}`)
        })
      } else if (result.length > 0) {
        console.log(`   Sample: ${result[0].title || result[0]._id}`)
      }
    } else if (result && typeof result === 'object') {
      console.log(`   📄 Single result: ${result.title || result._id}`)
      if (result.contentBlocks) {
        console.log(`   📝 Content blocks: ${result.contentBlocks}`)
      }
      if (result.category) {
        console.log(`   🏷️ Category: ${result.category}`)
      }
      if (result.tags) {
        console.log(`   🏷️ Tags: ${result.tags.join(', ')}`)
      }
    }

    return { success: true, result, duration }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function testGuideQueries() {
  console.log('🧪 Testing Guide Queries after Migration\n')
  console.log('='.repeat(50))

  const results = {}

  // Test 1: Basic count
  results.count = await testQuery(
    'Guide Count',
    queries.guideCount,
    'Count total number of guide documents',
  )

  // Test 2: All guides
  results.allGuides = await testQuery(
    'All Guides',
    queries.allGuides,
    'Fetch all guide documents with basic fields',
  )

  // Test 3: Single guide
  results.singleGuide = await testQuery(
    'Single Guide',
    queries.guideBySlug,
    'Fetch detailed view of a single guide',
  )

  // Test 4: Category filtering
  results.categoryGuides = await testQuery(
    'Guides by Category',
    queries.guidesByCategory,
    'Filter guides by category (tips)',
  )

  // Test 5: Guides with images
  results.guidesWithImages = await testQuery(
    'Guides with Cover Images',
    queries.guidesWithImages,
    'Guides that have cover images with valid asset references',
  )

  // Test 6: Guides with content
  results.guidesWithContent = await testQuery(
    'Guides with Content',
    queries.guidesWithContent,
    'Guides that have portable text content',
  )

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 QUERY TEST SUMMARY')
  console.log('='.repeat(50))

  const successful = Object.values(results).filter((r) => r.success).length
  const total = Object.keys(results).length

  console.log(`✅ Successful queries: ${successful}/${total}`)

  if (results.count?.success && results.allGuides?.success) {
    const expectedCount = results.count.result
    const actualCount = results.allGuides.result?.length || 0
    console.log(
      `📊 Data consistency: ${expectedCount === actualCount ? '✅' : '❌'} (Count: ${expectedCount}, Fetched: ${actualCount})`,
    )
  }

  if (results.guidesWithImages?.success) {
    const withImages = results.guidesWithImages.result?.length || 0
    console.log(`🖼️ Guides with cover images: ${withImages}`)
  }

  if (results.guidesWithContent?.success) {
    const withContent = results.guidesWithContent.result?.length || 0
    console.log(`📝 Guides with content: ${withContent}`)
  }

  const failed = Object.entries(results).filter(
    ([name, result]) => !result.success,
  )
  if (failed.length > 0) {
    console.log('\n❌ Failed queries:')
    failed.forEach(([name, result]) => {
      console.log(`   - ${name}: ${result.error}`)
    })
  }

  // Performance summary
  const avgDuration =
    Object.values(results)
      .filter((r) => r.success)
      .reduce((sum, r) => sum + r.duration, 0) / successful

  console.log(`⚡ Average query time: ${Math.round(avgDuration)}ms`)

  console.log('\n🎯 Guide migration query testing complete!')

  return results
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testGuideQueries()
    .then((results) => {
      const allSuccess = Object.values(results).every((r) => r.success)
      if (allSuccess) {
        console.log(
          '\n✅ All queries passed! Guide migration is working correctly.',
        )
        process.exit(0)
      } else {
        console.log('\n❌ Some queries failed. Please check the migration.')
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('Query testing failed:', error)
      process.exit(1)
    })
}

export { testGuideQueries }
