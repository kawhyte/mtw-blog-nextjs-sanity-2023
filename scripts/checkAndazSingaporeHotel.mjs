#!/usr/bin/env node

/**
 * Andaz Singapore Hotel Review Analysis
 *
 * Analyzes the specific "Andaz Singapore by Hyatt" hotel review document
 * to check its streaming dataset complexity and structure.
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

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

async function analyzeAndazSingapore() {
  try {
    console.log('🏨 Analyzing Andaz Singapore by Hyatt Hotel Review...')

    // 1. Search for Andaz Singapore hotel review
    const andazQuery = `*[_type == "hotelReview" && title match "*Andaz Singapore*"][0] {
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      slug,
      date,
      location,
      category,
      room,
      lounge,
      coverImage {
        _type,
        asset {
          _ref,
          _type
        }
      },
      excerpt2,
      tip,
      gallery[] {
        _type,
        asset {
          _ref,
          _type
        },
        alt
      },
      youtube,
      hotelRating {
        _type,
        // Include all hotelRating fields for size analysis
        ...
      },
      internetSpeed,
      roomAmenities {
        _type,
        // Include all roomAmenities fields
        ...
      },
      techRating {
        _type,
        // Include all techRating fields
        ...
      },
      positives,
      negatives,
      verdict,
      content,
      tags
    }`

    console.log('🔍 Searching for Andaz Singapore hotel review...')
    const andazHotel = await client.fetch(andazQuery)

    if (!andazHotel) {
      console.log('❌ Could not find "Andaz Singapore by Hyatt" hotel review')

      // Let's search for similar titles
      const similarQuery = `*[_type == "hotelReview" && title match "*Andaz*" || title match "*Singapore*"] {
        _id,
        title,
        slug
      }`

      const similarHotels = await client.fetch(similarQuery)
      if (similarHotels.length > 0) {
        console.log('🔍 Found similar hotel reviews:')
        similarHotels.forEach((hotel, index) => {
          console.log(
            `  ${index + 1}. ${hotel.title} (${hotel.slug?.current || 'no-slug'})`,
          )
        })
      }
      return
    }

    console.log(`✅ Found: ${andazHotel.title}`)
    console.log(`📍 Location: ${andazHotel.location}`)
    console.log(`🏨 Category: ${andazHotel.category}`)
    console.log(`🆔 Document ID: ${andazHotel._id}`)
    console.log(`🔗 Slug: ${andazHotel.slug?.current || 'N/A'}`)

    // 2. Analyze document structure in detail
    console.log('\n📊 DETAILED DOCUMENT ANALYSIS:')

    // Count total fields
    const totalFields = Object.keys(andazHotel).length
    console.log(`📋 Total top-level fields: ${totalFields}`)

    // Analyze each major section
    console.log('\n🔍 Field-by-field analysis:')

    // Basic info fields
    console.log('📝 Basic Information:')
    console.log(`  - Title: "${andazHotel.title}"`)
    console.log(
      `  - Date: ${andazHotel.date ? new Date(andazHotel.date).toLocaleDateString() : 'N/A'}`,
    )
    console.log(`  - Room: ${andazHotel.room || 'N/A'}`)
    console.log(`  - Lounge: ${andazHotel.lounge || 'N/A'}`)
    console.log(`  - Internet Speed: ${andazHotel.internetSpeed || 'N/A'} Mbps`)
    console.log(`  - YouTube: ${andazHotel.youtube ? 'Yes' : 'No'}`)

    // Cover image analysis
    if (andazHotel.coverImage) {
      console.log('🖼️ Cover Image: Present')
      console.log(
        `  - Asset Reference: ${andazHotel.coverImage.asset?._ref || 'N/A'}`,
      )
    } else {
      console.log('🖼️ Cover Image: None')
    }

    // Gallery analysis
    if (andazHotel.gallery && Array.isArray(andazHotel.gallery)) {
      console.log(`📸 Photo Gallery: ${andazHotel.gallery.length} images`)
      const galleryWithAlt = andazHotel.gallery.filter((img) => img.alt).length
      console.log(
        `  - Images with alt text: ${galleryWithAlt}/${andazHotel.gallery.length}`,
      )
    } else {
      console.log('📸 Photo Gallery: Empty or missing')
    }

    // Content arrays analysis
    console.log('📄 Content Arrays:')
    if (andazHotel.excerpt2 && Array.isArray(andazHotel.excerpt2)) {
      console.log(`  - Hotel Summary: ${andazHotel.excerpt2.length} blocks`)
    }
    if (andazHotel.tip && Array.isArray(andazHotel.tip)) {
      console.log(`  - Quick Tip: ${andazHotel.tip.length} blocks`)
    }
    if (andazHotel.verdict && Array.isArray(andazHotel.verdict)) {
      console.log(`  - Verdict: ${andazHotel.verdict.length} blocks`)
    }
    if (andazHotel.content && Array.isArray(andazHotel.content)) {
      console.log(`  - Main Content: ${andazHotel.content.length} blocks`)
    }

    // Review elements
    console.log('⭐ Review Elements:')
    if (andazHotel.positives && Array.isArray(andazHotel.positives)) {
      console.log(`  - Positives: ${andazHotel.positives.length} points`)
      andazHotel.positives.slice(0, 3).forEach((positive, index) => {
        console.log(
          `    ${index + 1}. ${positive.substring(0, 50)}${positive.length > 50 ? '...' : ''}`,
        )
      })
    }
    if (andazHotel.negatives && Array.isArray(andazHotel.negatives)) {
      console.log(`  - Negatives: ${andazHotel.negatives.length} points`)
      andazHotel.negatives.slice(0, 3).forEach((negative, index) => {
        console.log(
          `    ${index + 1}. ${negative.substring(0, 50)}${negative.length > 50 ? '...' : ''}`,
        )
      })
    }

    // Tags analysis
    if (andazHotel.tags && Array.isArray(andazHotel.tags)) {
      console.log(`🏷️ Tags: ${andazHotel.tags.length} tags`)
      console.log(`  - Tags: ${andazHotel.tags.join(', ')}`)
    }

    // Rating systems analysis
    console.log('📊 Rating Systems:')
    console.log(
      `  - Hotel Rating: ${andazHotel.hotelRating ? 'Present' : 'Missing'}`,
    )
    console.log(
      `  - Room Amenities: ${andazHotel.roomAmenities ? 'Present' : 'Missing'}`,
    )
    console.log(
      `  - Tech Rating: ${andazHotel.techRating ? 'Present' : 'Missing'}`,
    )

    // 3. Calculate streaming impact
    console.log('\n📡 STREAMING DATASET IMPACT:')

    const documentSize = JSON.stringify(andazHotel).length
    console.log(`📏 Total document size: ${documentSize} characters`)
    console.log(
      `📊 Size category: ${documentSize > 10000 ? 'Large' : documentSize > 5000 ? 'Medium' : 'Small'}`,
    )

    // Calculate field density
    const nonEmptyFields = Object.values(andazHotel).filter((value) => {
      if (value === null || value === undefined || value === '') return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    }).length

    console.log(
      `📈 Field density: ${nonEmptyFields}/${totalFields} (${Math.round((nonEmptyFields / totalFields) * 100)}% populated)`,
    )

    // 4. Compare with streaming limits
    console.log('\n🎯 STREAMING PERFORMANCE ANALYSIS:')
    console.log('✅ Benefits of independent hotel review schema:')
    console.log('  - No cross-type conditional logic')
    console.log('  - Hotel-specific fields only (no food rating complexity)')
    console.log('  - Optimized queries for hotel content')
    console.log('  - Reduced memory footprint per document')
    console.log('  - Better caching and indexing potential')

    console.log('\n💡 Document complexity assessment:')
    const complexityScore =
      (andazHotel.gallery?.length || 0) * 0.1 +
      (andazHotel.content?.length || 0) * 0.2 +
      (andazHotel.positives?.length || 0) * 0.1 +
      (andazHotel.negatives?.length || 0) * 0.1 +
      (andazHotel.tags?.length || 0) * 0.05 +
      (documentSize / 1000) * 0.1

    console.log(
      `📊 Complexity Score: ${complexityScore.toFixed(2)} (lower is better for streaming)`,
    )
    console.log(
      `🚥 Performance Impact: ${complexityScore < 5 ? 'Low' : complexityScore < 10 ? 'Medium' : 'High'}`,
    )

    // 5. URL structure note
    console.log('\n🔗 URL STRUCTURE NOTE:')
    console.log(
      `📍 Old URL (post): /posts/${andazHotel.slug?.current || 'unknown'}`,
    )
    console.log(
      `📍 New URL (hotel): /hotel/${andazHotel.slug?.current || 'unknown'}`,
    )
    console.log('💡 URL structure preserved for SEO during migration')
  } catch (error) {
    console.error('❌ Error analyzing Andaz Singapore hotel:', error)
    process.exit(1)
  }
}

// Run the analysis
analyzeAndazSingapore()
