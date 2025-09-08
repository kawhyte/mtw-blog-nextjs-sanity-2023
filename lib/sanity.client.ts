import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
// Import queries and types from the updated queries file
import {
  // Legacy post queries (for old data)
  allFoodQuery,
  allFoodReviewsQuery,
  allGuidesQuery,
  allHotelReviewsQuery,
  allHotelsQuery,
  allStoriesQuery,
  // Independent schema types and queries
  type Arena,
  arenaBySlugQuery,
  arenaQuery,
  arenaSlugsQuery,
  // Other types
  type Essential,
  // Legacy queries for backward compatibility
  type Food,
  foodAndMoreQuery,
  foodPostsTotalCountQuery,
  type FoodReview,
  foodReviewBySlugQuery,
  foodReviewsByDiningTypeQuery,
  foodReviewSlugsQuery,
  type Guide,
  guideBySlugQuery,
  guidePostsTotalCountQuery,
  guidesByCategoryQuery,
  guideSlugsQuery,
  type Hotel,
  hotelAndMoreQuery,
  hotelBySlugQuery,
  hotelPostsTotalCountQuery,
  type HotelReview,
  hotelReviewBySlugQuery,
  hotelReviewsByCategoryQuery,
  hotelReviewSlugsQuery,
  hotelSlugsQuery,
  independentFoodReviewFields,
  independentGuideFields,
  independentHotelReviewFields,
  // Index and recommendation queries
  indexQuery,
  type Instagram,
  latestIndependentContentQuery,
  paginatedFoodPostsQuery,
  paginatedGuidePostsQuery,
  paginatedHotelPostsQuery,
  type Post,
  postAndMoreStoriesQuery,
  postBySlugQuery,
  postSlugsQuery,
  recommendationQuery,
  type Settings,
  settingsQuery,
  type Story,
  storyAndMoreQuery,
  storyBySlugQuery,
  storySlugsQuery,
  topFoodReviewsQuery,
  topHotelReviewsQuery,
  topWeightedFoodQuery,
  topWeightedHotelsQuery,
  travelEssentialQuery,
} from 'lib/sanity.queries'
import { createClient, type SanityClient } from 'next-sanity'

/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
export const client: SanityClient | null = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null

// --- Helper Function for Fetching is REMOVED ---

// --- Settings ---
export async function getSettings(): Promise<Settings> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return {}
  }
  try {
    const settings = await client.fetch<Settings>(settingsQuery)
    return settings ?? {} // Return fetched settings or default empty object
  } catch (error) {
    console.error(`Error fetching settings:`, error)
    return {} // Return default on error
  }
}

// --- Generic Posts (Index Page) - LEGACY ---
export async function getIndexPosts(): Promise<Post[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const posts = await client.fetch<Post[]>(indexQuery)
    return posts ?? []
  } catch (error) {
    console.error(`Error fetching index posts:`, error)
    return []
  }
}

// --- Latest Independent Content (Index Page) ---
export async function getLatestIndependentContent(): Promise<
  (Guide | HotelReview | FoodReview)[]
> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const response = await client.fetch<{
      allContent: (Guide | HotelReview | FoodReview)[]
    }>(latestIndependentContentQuery)
    return response?.allContent ?? []
  } catch (error) {
    console.error(`Error fetching latest independent content:`, error)
    return []
  }
}

// --- Instagram ---
// (Instagram function does not use the Sanity client, no changes needed here)
export async function getInstagramPosts(): Promise<Instagram | null> {
  try {
    if (!process.env.INSTAGRAM_KEY) {
      console.warn(
        'Instagram Key (INSTAGRAM_KEY) is not defined in environment variables.',
      )
      return null
    }
    const url = `https://graph.instagram.com/me/media?fields=id,username,thumbnail_url,caption,media_url,timestamp,media_type,permalink&access_token=${process.env.INSTAGRAM_KEY}`
    const data = await fetch(url)
    if (!data.ok) {
      const errorBody = await data.text()
      throw new Error(
        `Instagram API error: ${data.status} ${data.statusText} - ${errorBody}`,
      )
    }
    const feed = await data.json()
    return feed as Instagram
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return null
  }
}

// ============================================
// --- Type-Specific Fetching Functions ---
// ============================================

// --- Hotel Posts ---

/** Fetches ALL hotel posts using limited fields */
export async function getAllHotelPosts(): Promise<Post[]> {
  if (!client) return []
  try {
    const results = await client.fetch<Post[]>(allHotelsQuery)
    return results ?? []
  } catch (error) {
    console.error(`Error fetching all hotel posts:`, error)
    return []
  }
}

/** Fetches a specific page/slice of hotel posts */
export async function getPaginatedHotelPosts(
  start: number,
  end: number,
): Promise<Post[]> {
  if (!client) return []
  try {
    const results = await client.fetch<Post[]>(paginatedHotelPostsQuery, {
      start,
      end,
    })
    return results ?? []
  } catch (error) {
    console.error(
      `Error fetching paginated hotel posts (start: ${start}, end: ${end}):`,
      error,
    )
    return []
  }
}

/** Gets the total count of hotel posts */
export async function getHotelPostsTotalCount(): Promise<number> {
  if (!client) return 0
  try {
    const count = await client.fetch<number>(hotelPostsTotalCountQuery)
    return count ?? 0
  } catch (error) {
    console.error(`Error fetching hotel posts total count:`, error)
    return 0
  }
}

/** Fetches top weighted hotel posts */
export async function getTopWeightedHotelPosts(): Promise<Post[]> {
  if (!client) return []
  try {
    const results = await client.fetch<Post[]>(topWeightedHotelsQuery)
    return results ?? []
  } catch (error) {
    console.error(`Error fetching top weighted hotel posts:`, error)
    return []
  }
}

// --- Food Posts ---

/** Fetches ALL food posts using limited fields */
export async function getAllFoodPosts(): Promise<Post[]> {
  if (!client) return []
  try {
    const results = await client.fetch<Post[]>(allFoodQuery)
    return results ?? []
  } catch (error) {
    console.error(`Error fetching all food posts:`, error)
    return []
  }
}

/** Fetches a specific page/slice of food posts */
export async function getPaginatedFoodPosts(
  start: number,
  end: number,
): Promise<Post[]> {
  if (!client) return []
  try {
    const results = await client.fetch<Post[]>(paginatedFoodPostsQuery, {
      start,
      end,
    })
    return results ?? []
  } catch (error) {
    console.error(
      `Error fetching paginated food posts (start: ${start}, end: ${end}):`,
      error,
    )
    return []
  }
}

/** Gets the total count of food posts */
export async function getFoodPostsTotalCount(): Promise<number> {
  if (!client) return 0
  try {
    const count = await client.fetch<number>(foodPostsTotalCountQuery)
    return count ?? 0
  } catch (error) {
    console.error(`Error fetching food posts total count:`, error)
    return 0
  }
}

/** Fetches top weighted food posts */
export async function getTopWeightedFoodPosts(): Promise<Post[]> {
  if (!client) return []
  try {
    const results = await client.fetch<Post[]>(topWeightedFoodQuery)
    return results ?? []
  } catch (error) {
    console.error(`Error fetching top weighted food posts:`, error)
    return []
  }
}

/** Fetches a specific page/slice of independent food reviews */
export async function getPaginatedFoodReviews(
  start: number,
  end: number,
): Promise<FoodReview[]> {
  if (!client) return []
  try {
    const results = await client.fetch<
      FoodReview[]
    >(`*[_type == "foodReview"] | order(date desc) [${start}...${end}] {
      ${independentFoodReviewFields}
    }`)
    return results ?? []
  } catch (error) {
    console.error(
      `Error fetching paginated food reviews (start: ${start}, end: ${end}):`,
      error,
    )
    return []
  }
}

/** Gets the total count of independent food reviews */
export async function getFoodReviewsTotalCount(): Promise<number> {
  if (!client) return 0
  try {
    const count = await client.fetch<number>(`count(*[_type == "foodReview"])`)
    return count ?? 0
  } catch (error) {
    console.error(`Error fetching food reviews total count:`, error)
    return 0
  }
}

/** Fetches a specific page/slice of independent guides */
export async function getPaginatedGuides(
  start: number,
  end: number,
): Promise<Guide[]> {
  if (!client) return []
  try {
    const results = await client.fetch<
      Guide[]
    >(`*[_type == "guide"] | order(date desc) [${start}...${end}] {
      ${independentGuideFields}
    }`)
    return results ?? []
  } catch (error) {
    console.error(
      `Error fetching paginated guides (start: ${start}, end: ${end}):`,
      error,
    )
    return []
  }
}

/** Gets the total count of independent guides */
export async function getGuidesTotalCount(): Promise<number> {
  if (!client) return 0
  try {
    const count = await client.fetch<number>(`count(*[_type == "guide"])`)
    return count ?? 0
  } catch (error) {
    console.error(`Error fetching guides total count:`, error)
    return 0
  }
}

// --- Story/Guide Posts (assuming linkType == 'story') ---

/** Fetches ALL story posts using limited fields */
export async function getAllStoryPosts(): Promise<Post[]> {
  if (!client) return []
  try {
    const results = await client.fetch<Post[]>(allStoriesQuery)
    return results ?? []
  } catch (error) {
    console.error(`Error fetching all story posts:`, error)
    return []
  }
}

/** Fetches a specific page/slice of story/guide posts */
export async function getPaginatedGuidePosts(
  start: number,
  end: number,
): Promise<Post[]> {
  if (!client) return []
  try {
    const results = await client.fetch<Post[]>(paginatedGuidePostsQuery, {
      start,
      end,
    })
    return results ?? []
  } catch (error) {
    console.error(
      `Error fetching paginated guide posts (start: ${start}, end: ${end}):`,
      error,
    )
    return []
  }
}

/** Gets the total count of story/guide posts */
export async function getGuidePostsTotalCount(): Promise<number> {
  if (!client) return 0
  try {
    const count = await client.fetch<number>(guidePostsTotalCountQuery)
    return count ?? 0
  } catch (error) {
    console.error(`Error fetching guide posts total count:`, error)
    return 0
  }
}

// --- Recommendations ---
export async function getRecommendationPosts(): Promise<any[]> {
  // TODO: Define Recommendation List type
  if (!client) return []
  try {
    const results = await client.fetch<any[]>(recommendationQuery)
    return results ?? []
  } catch (error) {
    console.error(`Error fetching recommendation posts:`, error)
    return []
  }
}

// --- Travel Essentials ---
export async function getTravelEssentialPosts(): Promise<Essential[]> {
  if (!client) return []
  try {
    const results = await client.fetch<Essential[]>(travelEssentialQuery)
    return results ?? []
  } catch (error) {
    console.error(`Error fetching travel essential posts:`, error)
    return []
  }
}

// --- Arenas ---
/** Fetches ALL arena documents */
export async function getArenaPosts(): Promise<Arena[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const results = await client.fetch<Arena[]>(arenaQuery)
    return results ?? [] // Handle null/undefined from fetch
  } catch (error) {
    console.error(`Error fetching arena posts:`, error)
    return [] // Return default on error
  }
}

// --- Fetch Single Arena by Slug ---
/**
 * Fetches a single Arena document by its slug.
 * Used by getStaticProps in pages/arena/[slug].tsx
 * @param slug The slug of the arena to fetch.
 * @returns The Arena object or null if not found or on error.
 */
export async function getArenaBySlug(slug: string): Promise<Arena | null> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return null
  }
  try {
    const arena = await client.fetch<Arena | undefined>(arenaBySlugQuery, {
      slug,
    })
    return arena ?? null // Return the arena or null
  } catch (error) {
    console.error(`Error fetching arena by slug "${slug}":`, error)
    return null // Return null on error
  }
}
// --- End Arenas Section ---

// ============================================
// --- Slug Fetching ---
// ============================================

export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  if (!client) return []
  try {
    const slugs = await client.fetch<string[]>(postSlugsQuery)
    return slugs ? slugs.map((slug) => ({ slug })) : []
  } catch (error) {
    console.error(`Error fetching all post slugs:`, error)
    return []
  }
}

export async function getAllHotelSlugs(): Promise<Pick<Hotel, 'slug'>[]> {
  if (!client) return []
  try {
    const slugs = await client.fetch<string[]>(hotelSlugsQuery)
    return slugs ? slugs.map((slug) => ({ slug })) : []
  } catch (error) {
    console.error(`Error fetching all hotel slugs:`, error)
    return []
  }
}

export async function getAllStorySlugs(): Promise<Pick<Story, 'slug'>[]> {
  if (!client) return []
  try {
    const slugs = await client.fetch<string[]>(storySlugsQuery)
    return slugs ? slugs.map((slug) => ({ slug })) : []
  } catch (error) {
    console.error(`Error fetching all story slugs:`, error)
    return []
  }
}

// Legacy food function removed - now using independent foodReview schema

// --- Fetch All Arena Slugs ---
/**
 * Fetches the slugs for all arena documents.
 * Used by getStaticPaths in pages/arena/[slug].tsx
 * @returns An array of arena slugs, or an empty array on error/no slugs.
 */
export async function getAllArenaSlugs(): Promise<string[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const slugs = await client.fetch<string[]>(arenaSlugsQuery)
    return slugs ?? [] // Return the fetched slugs or an empty array
  } catch (error) {
    console.error(`Error fetching all arena slugs:`, error)
    return [] // Return empty array on error
  }
}
// --- End Slug Fetching Section ---

// ============================================
// --- Get By Slug ---
// ============================================

// Generic post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!client) return null
  try {
    const post = await client.fetch<Post | undefined>(postBySlugQuery, { slug })
    return post ?? null
  } catch (error) {
    console.error(`Error fetching post by slug "${slug}":`, error)
    return null
  }
}

// Specific types by slug
export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  if (!client) return null
  try {
    const hotel = await client.fetch<Hotel | undefined>(hotelBySlugQuery, {
      slug,
    })
    return hotel ?? null
  } catch (error) {
    console.error(`Error fetching hotel by slug "${slug}":`, error)
    return null
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  if (!client) return null
  try {
    const story = await client.fetch<Story | undefined>(storyBySlugQuery, {
      slug,
    })
    return story ?? null
  } catch (error) {
    console.error(`Error fetching story by slug "${slug}":`, error)
    return null
  }
}

// Legacy food function removed - now using independent foodReview schema

// NOTE: getArenaBySlug is already updated above in the 'Arenas' section.

// ============================================
// --- Guides ---
// ============================================

/**
 * Fetches a single guide by its slug.
 * @param slug The slug of the guide to fetch.
 * @returns The Guide object or null if not found or on error.
 */
export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return null
  }
  try {
    const guide = await client.fetch(guideBySlugQuery, { slug })
    return guide || null
  } catch (error) {
    console.error(`Error fetching guide with slug "${slug}":`, error)
    return null
  }
}

/**
 * Fetches all guide slugs for static generation.
 * @returns An array of guide slugs, or an empty array on error/no slugs.
 */
export async function getAllGuideSlugs(): Promise<string[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const slugs = await client.fetch(guideSlugsQuery)
    return slugs || []
  } catch (error) {
    console.error('Error fetching guide slugs:', error)
    return []
  }
}

// ============================================
// --- Hotel Reviews ---
// ============================================

/**
 * Fetches a single hotel review by its slug.
 * @param slug The slug of the hotel review to fetch.
 * @returns The HotelReview object or null if not found or on error.
 */
export async function getHotelReviewBySlug(
  slug: string,
): Promise<HotelReview | null> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return null
  }
  try {
    const hotelReview = await client.fetch(hotelReviewBySlugQuery, { slug })
    return hotelReview || null
  } catch (error) {
    console.error(`Error fetching hotel review with slug "${slug}":`, error)
    return null
  }
}

/**
 * Fetches all hotel review slugs for static generation.
 * @returns An array of hotel review slugs, or an empty array on error/no slugs.
 */
export async function getAllHotelReviewSlugs(): Promise<string[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const slugs = await client.fetch(hotelReviewSlugsQuery)
    return slugs || []
  } catch (error) {
    console.error('Error fetching hotel review slugs:', error)
    return []
  }
}

// ============================================
// --- Food Reviews ---
// ============================================

/**
 * Fetches a single food review by its slug.
 * @param slug The slug of the food review to fetch.
 * @returns The FoodReview object or null if not found or on error.
 */
export async function getFoodReviewBySlug(
  slug: string,
): Promise<FoodReview | null> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return null
  }
  try {
    const foodReview = await client.fetch(foodReviewBySlugQuery, { slug })
    return foodReview || null
  } catch (error) {
    console.error(`Error fetching food review with slug "${slug}":`, error)
    return null
  }
}

/**
 * Fetches all food review slugs for static generation.
 * @returns An array of food review slugs, or an empty array on error/no slugs.
 */
export async function getAllFoodReviewSlugs(): Promise<string[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const slugs = await client.fetch(foodReviewSlugsQuery)
    return slugs || []
  } catch (error) {
    console.error('Error fetching food review slugs:', error)
    return []
  }
}

// ============================================
// --- Collection Functions for Independent Schemas ---
// ============================================

/**
 * Fetches all guides for listing pages.
 * @returns An array of Guide objects, or an empty array on error.
 */
export async function getAllGuides(): Promise<Guide[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const guides = await client.fetch(allGuidesQuery)
    return guides || []
  } catch (error) {
    console.error('Error fetching all guides:', error)
    return []
  }
}

/**
 * Fetches guides filtered by category.
 * @param category The category to filter by.
 * @returns An array of Guide objects, or an empty array on error.
 */
export async function getGuidesByCategory(category: string): Promise<Guide[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const guides = await client.fetch(guidesByCategoryQuery, { category })
    return guides || []
  } catch (error) {
    console.error(`Error fetching guides by category "${category}":`, error)
    return []
  }
}

/**
 * Fetches all hotel reviews for listing pages.
 * @returns An array of HotelReview objects, or an empty array on error.
 */
export async function getAllHotelReviews(): Promise<HotelReview[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const hotelReviews = await client.fetch(allHotelReviewsQuery)
    return hotelReviews || []
  } catch (error) {
    console.error('Error fetching all hotel reviews:', error)
    return []
  }
}

/**
 * Fetches top weighted hotel reviews sorted by rating.
 * @param limit Maximum number of reviews to return (default: 10)
 * @returns An array of HotelReview objects sorted by weighted rating, or empty array on error.
 */
export async function getTopWeightedHotelReviews(
  limit: number = 10,
): Promise<HotelReview[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }

  try {
    const hotelReviews = await client.fetch(topHotelReviewsQuery)

    if (!hotelReviews || hotelReviews.length === 0) {
      return []
    }

    // Import weights and calculate ratings
    const { calculateRating } = await import('./calculateRating')
    const { HOTEL_WEIGHTS } = await import('./ratingWeights')

    // Calculate weighted ratings and sort
    const reviewsWithRatings = hotelReviews
      .map((review: HotelReview) => {
        if (!review.hotelRating) {
          return { ...review, calculatedRating: 0 }
        }

        const { numericalRating } = calculateRating(
          review.hotelRating,
          HOTEL_WEIGHTS,
        )
        return { ...review, calculatedRating: numericalRating }
      })
      .sort((a: any, b: any) => b.calculatedRating - a.calculatedRating)
      .slice(0, limit)

    // Remove the temporary calculatedRating property
    return reviewsWithRatings.map(({ calculatedRating, ...review }) => review)
  } catch (error) {
    console.error('Error fetching top weighted hotel reviews:', error)
    return []
  }
}

/**
 * Fetches the top weighted food reviews based on calculated ratings
 * @param limit The maximum number of food reviews to return (default: 10)
 * @returns An array of FoodReview objects sorted by weighted rating, or an empty array on error.
 */
export async function getTopWeightedFoodReviews(
  limit: number = 10,
): Promise<FoodReview[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }

  try {
    const foodReviews = await client.fetch(topFoodReviewsQuery)

    if (!foodReviews || foodReviews.length === 0) {
      return []
    }

    // Import weights and calculate ratings
    const { calculateRating } = await import('./calculateRating')
    const { FOOD_WEIGHTS } = await import('./ratingWeights')

    // Calculate weighted ratings and sort
    const reviewsWithRatings = foodReviews
      .map((review: FoodReview) => {
        // Use foodRating for dine-in experiences, fallback to takeoutRating
        const ratingsToUse = review.foodRating || review.takeoutRating

        if (!ratingsToUse) {
          return { ...review, calculatedRating: 0 }
        }

        const { numericalRating } = calculateRating(ratingsToUse, FOOD_WEIGHTS)
        return { ...review, calculatedRating: numericalRating }
      })
      .sort((a: any, b: any) => b.calculatedRating - a.calculatedRating)
      .slice(0, limit)

    // Remove the temporary calculatedRating property
    return reviewsWithRatings.map(({ calculatedRating, ...review }) => review)
  } catch (error) {
    console.error('Error fetching top weighted food reviews:', error)
    return []
  }
}

/**
 * Fetches hotel reviews filtered by category.
 * @param category The category to filter by (luxury, mid-scale, economy).
 * @returns An array of HotelReview objects, or an empty array on error.
 */
export async function getHotelReviewsByCategory(
  category: string,
): Promise<HotelReview[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const hotelReviews = await client.fetch(hotelReviewsByCategoryQuery, {
      category,
    })
    return hotelReviews || []
  } catch (error) {
    console.error(
      `Error fetching hotel reviews by category "${category}":`,
      error,
    )
    return []
  }
}

/** Fetches a specific page/slice of independent hotel reviews */
export async function getPaginatedHotelReviews(
  start: number,
  end: number,
): Promise<HotelReview[]> {
  if (!client) return []
  try {
    const results = await client.fetch<
      HotelReview[]
    >(`*[_type == "hotelReview"] | order(date desc) [${start}...${end}] {
      ${independentHotelReviewFields}
    }`)
    return results || []
  } catch (error) {
    console.error(
      `Error fetching paginated hotel reviews (${start}-${end}):`,
      error,
    )
    return []
  }
}

/** Gets the total count of independent hotel reviews */
export async function getHotelReviewsTotalCount(): Promise<number> {
  if (!client) return 0
  try {
    const count = await client.fetch<number>(`count(*[_type == "hotelReview"])`)
    return count ?? 0
  } catch (error) {
    console.error('Error getting hotel reviews total count:', error)
    return 0
  }
}

/**
 * Fetches all food reviews for listing pages.
 * @returns An array of FoodReview objects, or an empty array on error.
 */
export async function getAllFoodReviews(): Promise<FoodReview[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const foodReviews = await client.fetch(allFoodReviewsQuery)
    return foodReviews || []
  } catch (error) {
    console.error('Error fetching all food reviews:', error)
    return []
  }
}

/**
 * Fetches food reviews filtered by dining type.
 * @param diningType The dining type to filter by (dinein, takeout).
 * @returns An array of FoodReview objects, or an empty array on error.
 */
export async function getFoodReviewsByDiningType(
  diningType: 'dinein' | 'takeout',
): Promise<FoodReview[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.')
    return []
  }
  try {
    const foodReviews = await client.fetch(foodReviewsByDiningTypeQuery, {
      diningType,
    })
    return foodReviews || []
  } catch (error) {
    console.error(
      `Error fetching food reviews by dining type "${diningType}":`,
      error,
    )
    return []
  }
}

// ============================================
// --- Get By Slug And More Stories ---
// ============================================
// These already used client.fetch directly in the original code,
// but we'll ensure the pattern is consistent (check client, try/catch)

const defaultAndMoreResult = { post: null, morePosts: [] }

export async function getHotelAndMore(
  slug: string,
): Promise<{ post: Hotel | null; morePosts: Post[] }> {
  if (!client) return defaultAndMoreResult
  try {
    const result = await client.fetch<{ post: Hotel; morePosts: Post[] }>(
      hotelAndMoreQuery,
      { slug },
    )
    return {
      post: result?.post ?? null,
      morePosts: result?.morePosts ?? [],
    }
  } catch (error) {
    console.error(`Error fetching hotel and more for slug "${slug}":`, error)
    return defaultAndMoreResult
  }
}

export async function getStoryAndMore(
  slug: string,
): Promise<{ post: Story | null; morePosts: Post[] }> {
  if (!client) return defaultAndMoreResult
  try {
    const result = await client.fetch<{ post: Story; morePosts: Post[] }>(
      storyAndMoreQuery,
      { slug },
    )
    return {
      post: result?.post ?? null,
      morePosts: result?.morePosts ?? [],
    }
  } catch (error) {
    console.error(`Error fetching story and more for slug "${slug}":`, error)
    return defaultAndMoreResult
  }
}

export async function getFoodReviewAndMore(
  slug: string,
): Promise<{ post: Food | null; morePosts: Post[] }> {
  if (!client) return defaultAndMoreResult
  try {
    const result = await client.fetch<{ post: Food; morePosts: Post[] }>(
      foodAndMoreQuery,
      { slug },
    )
    return {
      post: result?.post ?? null,
      morePosts: result?.morePosts ?? [],
    }
  } catch (error) {
    console.error(
      `Error fetching food review and more for slug "${slug}":`,
      error,
    )
    return defaultAndMoreResult
  }
}

export async function getPostAndMoreStories( // Generic version
  slug: string,
): Promise<{ post: Post | null; morePosts: Post[] }> {
  if (!client) return defaultAndMoreResult
  try {
    const result = await client.fetch<{ post: Post; morePosts: Post[] }>(
      postAndMoreStoriesQuery,
      { slug },
    )
    return {
      post: result?.post ?? null,
      morePosts: result?.morePosts ?? [],
    }
  } catch (error) {
    console.error(
      `Error fetching post and more stories for slug "${slug}":`,
      error,
    )
    return defaultAndMoreResult
  }
}
