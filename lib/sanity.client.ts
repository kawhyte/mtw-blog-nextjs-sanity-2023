import { cityKey, placeCityKey } from 'lib/cityMatch'
import {
  buildFoodListing,
  foodRowRating,
  type RawFoodListingRow,
} from 'lib/foodListing'
import {
  buildGuideListing,
  type GuideListingItem,
  type RawGuideListingRow,
} from 'lib/guideListing'
import {
  buildHotelListing,
  hotelRowRating,
  type RawHotelListingRow,
} from 'lib/hotelListing'
import type { ListingItem } from 'lib/reviewListing'
import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
// Import queries and types from the updated queries file
import {
  allArenaLocationsQuery,
  allFoodReviewsQuery,
  allGuidesQuery,
  allHotelReviewsQuery,
  // Independent schema types and queries
  type Arena,
  arenaBySlugQuery,
  type ArenaFoodReviewCard,
  type ArenaHighlightCard,
  arenaQuery,
  arenasInLocationQuery,
  arenaSlugsQuery,
  cityLocationsQuery,
  type CityPageData,
  cityPageQuery,
  // Other types
  type Essential,
  foodCardFields,
  foodListingQuery,
  type FoodReview,
  foodReviewBySlugQuery,
  foodReviewsByArenaQuery,
  foodReviewsByDiningTypeQuery,
  foodReviewSlugsQuery,
  type Guide,
  guideBySlugQuery,
  guideCardFields,
  guideListingQuery,
  guideSlugsQuery,
  hotelCardFields,
  hotelListingQuery,
  type HotelReview,
  hotelReviewBySlugQuery,
  hotelReviewsByCategoryQuery,
  hotelReviewSlugsQuery,
  independentGuideFields,
  type Instagram,
  latestIndependentContentQuery,
  type Settings,
  settingsQuery,
  travelEssentialQuery,
  visitedArenasHighlightQuery,
} from 'lib/sanity.queries'
import { createClient, type SanityClient } from 'next-sanity'

/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
export const client: SanityClient | null = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null

/**
 * Returns a draft-aware client for Preview Mode. Only used server-side in
 * getStaticProps when a preview token is present; never bundled to the browser.
 * The `drafts` perspective overlays draft content on top of published documents,
 * so unpublished drafts resolve to exactly one result.
 */
export function getPreviewClient(token: string): SanityClient | null {
  if (!client) return null
  return client.withConfig({
    token,
    useCdn: false,
    perspective: 'drafts',
    ignoreBrowserTokenWarning: true,
  })
}

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
// REMOVED: getIndexPosts() - Use getLatestIndependentContent() instead

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
// REMOVED: Legacy hotel post functions - Use independent hotel review functions instead:
// - getAllHotelPosts() -> getAllHotelReviews()
// - getPaginatedHotelPosts() -> getPaginatedHotelReviews()
// - getHotelPostsTotalCount() -> getHotelReviewsTotalCount()

/** Fetches top weighted hotel posts */
// REMOVED: getTopWeightedHotelPosts() - Use getTopWeightedHotelReviews() instead

// --- Food Posts ---
// REMOVED: Legacy food post functions - Use independent food review functions instead:
// - getAllFoodPosts() -> getAllFoodReviews()
// - getPaginatedFoodPosts() -> getPaginatedFoodReviews()
// - getFoodPostsTotalCount() -> getFoodReviewsTotalCount()
// - getTopWeightedFoodPosts() -> getTopWeightedFoodReviews()

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
      ${foodCardFields}
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

/** How many arenas, hotels, restaurants and guides there are, for the search page's section tiles */
export async function getSearchSectionCounts(): Promise<{
  arenas: number
  hotels: number
  food: number
  guides: number
}> {
  const empty = { arenas: 0, hotels: 0, food: 0, guides: 0 }
  if (!client) return empty
  const live =
    '(!defined(publishedAt) || publishedAt <= now()) && defined(slug.current)'
  try {
    const counts = await client.fetch(`{
      "arenas": count(*[_type == "arenas" && visited == true]),
      "hotels": count(*[_type == "hotelReview" && ${live}]),
      "food": count(*[_type == "foodReview" && ${live}]),
      "guides": count(*[_type == "guide" && ${live}])
    }`)
    return { ...empty, ...counts }
  } catch (error) {
    console.error('Error fetching search section counts:', error)
    return empty
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

// --- Story/Guide Posts ---
// REMOVED: Legacy story/guide post functions - Use independent guide functions instead:
// - getAllStoryPosts() -> getAllGuides()
// - getPaginatedGuidePosts() -> getPaginatedGuides()
// - getGuidePostsTotalCount() -> getGuidesTotalCount()

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
export async function getArenaBySlug(
  slug: string,
  token?: string,
): Promise<Arena | null> {
  const c = token ? getPreviewClient(token) : client
  if (!c) {
    console.warn('Sanity client is not initialized.')
    return null
  }
  try {
    const arena = await c.fetch<Arena | undefined>(arenaBySlugQuery, {
      slug,
    })
    return arena ?? null // Return the arena or null
  } catch (error) {
    console.error(`Error fetching arena by slug "${slug}":`, error)
    return null // Return null on error
  }
}
/** Every published hotel as a lean card list for /hotels (see lib/hotelListing). */
export async function getHotelListing(): Promise<ListingItem[]> {
  if (!client) return []
  try {
    const rows = await client.fetch<RawHotelListingRow[]>(hotelListingQuery)
    return buildHotelListing(rows ?? [])
  } catch (error) {
    console.error('Error fetching hotel listing:', error)
    return []
  }
}

/** Every published guide as a lean card list (see lib/guideListing). */
export async function getGuideListing(): Promise<GuideListingItem[]> {
  if (!client) return []
  try {
    const rows = await client.fetch<RawGuideListingRow[]>(guideListingQuery)
    return buildGuideListing(rows ?? [])
  } catch (error) {
    console.error('Error fetching guide listing:', error)
    return []
  }
}

/** Every published food review as a lean card list for /food (see lib/foodListing). */
export async function getFoodListing(): Promise<ListingItem[]> {
  if (!client) return []
  try {
    const rows = await client.fetch<RawFoodListingRow[]>(foodListingQuery)
    return buildFoodListing(rows ?? [])
  } catch (error) {
    console.error('Error fetching food listing:', error)
    return []
  }
}

/** Arenas in the same city as a review, for the "Going to a game?" box. */
export async function getArenasInLocation(
  location?: string,
): Promise<{ name: string; slug: string; location: string }[]> {
  if (!client || !location?.trim()) return []
  try {
    const arenas = await client.fetch(arenasInLocationQuery, {
      location: location.trim(),
    })
    return arenas ?? []
  } catch (error) {
    console.error('Error fetching arenas in location:', error)
    return []
  }
}

export async function getAllArenaLocations(): Promise<string[]> {
  if (!client) return []
  try {
    const locations = await client.fetch<string[]>(allArenaLocationsQuery)
    return (locations ?? []).filter(Boolean)
  } catch (error) {
    console.error('Error fetching arena locations:', error)
    return []
  }
}

/**
 * Everything for a city page. Places are matched in code (lib/cityMatch), so
 * "Paradise, NV", a full street address or "Aria Hotel Las Vegas" all land
 * on the Las Vegas page. Hotel and food scores are worked out here.
 */
export async function getCityPageData(
  location: string,
  arenaLocations: string[],
): Promise<CityPageData> {
  const empty: CityPageData = { arenas: [], hotels: [], food: [], guides: [] }
  if (!client) return empty
  try {
    const arenaCityKeys = [...new Set(arenaLocations.map(cityKey))]
    const key = cityKey(location)
    const places =
      await client.fetch<{ _id: string; location?: string }[]>(
        cityLocationsQuery,
      )
    const ids = (places ?? [])
      .filter((place) => placeCityKey(place.location, arenaCityKeys) === key)
      .map((place) => place._id)
    const data = await client.fetch<any>(cityPageQuery, { ids })
    if (!data) return empty
    return {
      arenas: data.arenas ?? [],
      guides: data.guides ?? [],
      hotels: (data.hotels ?? []).map(
        ({ hotelRating, internetSpeed, revisits, ...hotel }) => ({
          ...hotel,
          rating: hotelRowRating({ hotelRating, internetSpeed, revisits }),
        }),
      ),
      food: (data.food ?? []).map(
        ({ foodRating, takeoutRating, revisits, ...review }) => ({
          ...review,
          rating: foodRowRating({
            diningType: review.diningType,
            foodRating,
            takeoutRating,
            revisits,
          }),
        }),
      ),
    }
  } catch (error) {
    console.error(`Error fetching city page data for "${location}":`, error)
    return empty
  }
}

/** Every visited arena, newest visit first, with its overall score (homepage). */
export async function getVisitedArenaCards(): Promise<ArenaHighlightCard[]> {
  if (!client) return []
  try {
    const results = await client.fetch<ArenaHighlightCard[]>(
      visitedArenasHighlightQuery,
    )
    if (!results) return []
    const { getArenaDisplayRating } = await import('utils/arena/arenaUtils')
    return results.map((arena) => {
      const { average, textRating, color } = getArenaDisplayRating(arena as any)
      return { ...arena, displayRating: { average, textRating, color } }
    })
  } catch (error) {
    console.error('Error fetching visited arenas:', error)
    return []
  }
}

export async function getFoodReviewsByArena(
  arenaId: string,
): Promise<ArenaFoodReviewCard[]> {
  if (!client) return []
  try {
    const results = await client.fetch<ArenaFoodReviewCard[]>(
      foodReviewsByArenaQuery,
      { arenaId },
    )
    return results ?? []
  } catch (error) {
    console.error(`Error fetching food reviews for arena "${arenaId}":`, error)
    return []
  }
}

// --- End Arenas Section ---

// ============================================
// --- Legacy Slug Fetching (REMOVED) ---
// ============================================
// REMOVED: Legacy slug functions - Use independent schema slug functions instead:
// - getAllPostsSlugs() -> Use type-specific functions instead
// - getAllHotelSlugs() -> getAllHotelReviewSlugs()
// - getAllStorySlugs() -> getAllGuideSlugs()

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
// --- Legacy Get By Slug (REMOVED) ---
// ============================================
// REMOVED: Legacy bySlug functions - Use independent schema functions instead:
// - getPostBySlug() -> Use type-specific functions or redirect system in /posts/[slug].tsx
// - getHotelBySlug() -> getHotelReviewBySlug()
// - getStoryBySlug() -> getGuideBySlug()

// NOTE: Modern independent bySlug functions are implemented below in their respective sections.

// ============================================
// --- Guides ---
// ============================================

/**
 * Fetches a single guide by its slug.
 * @param slug The slug of the guide to fetch.
 * @returns The Guide object or null if not found or on error.
 */
export async function getGuideBySlug(
  slug: string,
  token?: string,
): Promise<Guide | null> {
  const c = token ? getPreviewClient(token) : client
  if (!c) {
    console.warn('Sanity client is not initialized.')
    return null
  }
  try {
    const guide = await c.fetch(guideBySlugQuery, { slug, preview: !!token })
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
  token?: string,
): Promise<HotelReview | null> {
  const c = token ? getPreviewClient(token) : client
  if (!c) {
    console.warn('Sanity client is not initialized.')
    return null
  }
  try {
    const hotelReview = await c.fetch(hotelReviewBySlugQuery, {
      slug,
      preview: !!token,
    })
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
  token?: string,
): Promise<FoodReview | null> {
  const c = token ? getPreviewClient(token) : client
  if (!c) {
    console.warn('Sanity client is not initialized.')
    return null
  }
  try {
    const foodReview = await c.fetch(foodReviewBySlugQuery, {
      slug,
      preview: !!token,
    })
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
      ${hotelCardFields}
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
// --- Legacy "And More" Functions (REMOVED) ---
// ============================================
// REMOVED: Legacy "AndMore" functions that fetched related posts - No longer needed:
// - getHotelAndMore() -> Use getHotelReviewBySlug() + separate related content fetching if needed
// - getStoryAndMore() -> Use getGuideBySlug() + separate related content fetching if needed
// - getFoodReviewAndMore() -> Use getFoodReviewBySlug() + separate related content fetching if needed
// - getPostAndMoreStories() -> Use type-specific functions instead
//
// Modern approach: Fetch individual content and related items separately for better caching and flexibility
