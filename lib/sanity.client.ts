import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
// Import queries and types from the updated queries file
import {
  type Arena,
  arenaQuery,
  type Essential,
  travelEssentialQuery,
  type Settings,
  settingsQuery,
  type Instagram,
  type Post, // Using the base Post type for broader compatibility
  type Hotel, // Keep specific types if needed elsewhere
  type Food,  // Keep specific types if needed elsewhere
  type Story, // Keep specific types if needed elsewhere
  indexQuery, // For getAllPosts (fetches first 6)
  postSlugsQuery,
  hotelSlugsQuery,
  storySlugsQuery,
  foodSlugsQuery,
  postBySlugQuery,
  hotelBySlugQuery,
  storyBySlugQuery,
  foodBySlugQuery,
  postAndMoreStoriesQuery,
  hotelAndMoreQuery,
  storyAndMoreQuery,
  foodAndMoreQuery,
  recommendationQuery,
  topWeightedHotelsQuery,
  topWeightedFoodQuery,
  // Import queries for fetching ALL posts of a type
  allHotelsQuery,
  allFoodQuery, // Use the renamed query
  allStoriesQuery, // Use the renamed query
  // Import specific pagination queries
  paginatedHotelPostsQuery,
  hotelPostsTotalCountQuery,
  paginatedFoodPostsQuery, // Newly added
  foodPostsTotalCountQuery, // Newly added
  paginatedGuidePostsQuery, // Newly added (assuming linkType 'story' for guides)
  guidePostsTotalCountQuery, // Newly added (assuming linkType 'story' for guides)
} from 'lib/sanity.queries'
import { createClient, type SanityClient } from 'next-sanity' // Import SanityClient type if needed

/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
export const client: SanityClient | null = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null

// --- Helper Function for Fetching (Optional but reduces repetition) ---
async function performFetch<T>(query: string, params = {}): Promise<T | undefined> {
  if (client) {
    try {
      const result = await client.fetch<T>(query, params);
      // Return result directly, handling null/undefined might happen here or in calling function
      return result;
    } catch (error) {
      console.error(`Error fetching data for query "${query}":`, error);
      // Return undefined or throw error based on desired handling
      return undefined;
    }
  }
  return undefined;
}


// --- Settings ---
export async function getSettings(): Promise<Settings> {
  return (await performFetch<Settings>(settingsQuery)) || {};
}

// --- Generic Posts (Index Page) ---
export async function getIndexPosts(): Promise<Post[]> { // Renamed for clarity from getAllPosts
  // Fetches first 6 posts based on indexQuery defined in sanity.queries
  return (await performFetch<Post[]>(indexQuery)) || [];
}

// --- Instagram ---
export async function getInstagramPosts(): Promise<Instagram | null> { // Return null on failure
  try {
      const url =`https://graph.instagram.com/me/media?fields=id,username,thumbnail_url,caption,media_url,timestamp,media_type,permalink&access_token=${process.env.INSTAGRAM_KEY}`
      const data = await fetch(url);
      if (!data.ok) {
          throw new Error(`Instagram API error: ${data.statusText}`);
      }
      const feed = await data.json();
      // TODO: Add validation for the feed structure if necessary
      return feed as Instagram; // Add type assertion after validation
  } catch (error) {
      console.error("Error fetching Instagram posts:", error);
      return null;
  }
}


// ============================================
// --- Type-Specific Fetching Functions ---
// ============================================

// --- Hotel Posts ---

/** Fetches ALL hotel posts using limited fields */
export async function getAllHotelPosts(): Promise<Post[]> { // Return Post[] for consistency if Hotel is compatible
  // Using allHotelsQuery which uses hotelFieldsLimited
  return (await performFetch<Post[]>(allHotelsQuery)) || [];
}

/** Fetches a specific page/slice of hotel posts */
export async function getPaginatedHotelPosts(start: number, end: number): Promise<Post[]> {
  return (await performFetch<Post[]>(paginatedHotelPostsQuery, { start, end })) || [];
}

/** Gets the total count of hotel posts */
export async function getHotelPostsTotalCount(): Promise<number> {
  return (await performFetch<number>(hotelPostsTotalCountQuery)) || 0;
}

/** Fetches top weighted hotel posts */
export async function getTopWeightedHotelPosts(): Promise<Post[]> { // Return Post[] for consistency
  return (await performFetch<Post[]>(topWeightedHotelsQuery)) || [];
}


// --- Food Posts ---

/** Fetches ALL food posts using limited fields */
export async function getAllFoodPosts(): Promise<Post[]> { // Renamed, uses allFoodQuery
  return (await performFetch<Post[]>(allFoodQuery)) || [];
}

/** Fetches a specific page/slice of food posts */
export async function getPaginatedFoodPosts(start: number, end: number): Promise<Post[]> {
  return (await performFetch<Post[]>(paginatedFoodPostsQuery, { start, end })) || [];
}

/** Gets the total count of food posts */
export async function getFoodPostsTotalCount(): Promise<number> {
  return (await performFetch<number>(foodPostsTotalCountQuery)) || 0;
}

/** Fetches top weighted food posts */
export async function getTopWeightedFoodPosts(): Promise<Post[]> {
  return (await performFetch<Post[]>(topWeightedFoodQuery)) || [];
}


// --- Story/Guide Posts (assuming linkType == 'story') ---

/** Fetches ALL story posts using limited fields */
export async function getAllStoryPosts(): Promise<Post[]> { // Renamed, uses allStoriesQuery
  return (await performFetch<Post[]>(allStoriesQuery)) || [];
}

/** Fetches a specific page/slice of story/guide posts */
export async function getPaginatedGuidePosts(start: number, end: number): Promise<Post[]> {
  return (await performFetch<Post[]>(paginatedGuidePostsQuery, { start, end })) || [];
}

/** Gets the total count of story/guide posts */
export async function getGuidePostsTotalCount(): Promise<number> {
  return (await performFetch<number>(guidePostsTotalCountQuery)) || 0;
}


// --- Recommendations ---
export async function getRecommendationPosts(): Promise<any[]> { // Adjust type if Recommendation List type is defined
  return (await performFetch<any[]>(recommendationQuery)) || [];
}

// --- Travel Essentials ---
export async function getTravelEssentialPosts(): Promise<Essential[]> {
  return (await performFetch<Essential[]>(travelEssentialQuery)) || [];
}

// --- Arenas ---
export async function getArenaPosts(): Promise<Arena[]> {
  return (await performFetch<Arena[]>(arenaQuery)) || [];
}

// ============================================
// --- Slug Fetching ---
// ============================================

export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  const slugs = await performFetch<string[]>(postSlugsQuery);
  return slugs ? slugs.map((slug) => ({ slug })) : [];
}

export async function getAllHotelSlugs(): Promise<Pick<Hotel, 'slug'>[]> {
  const slugs = await performFetch<string[]>(hotelSlugsQuery);
  return slugs ? slugs.map((slug) => ({ slug })) : [];
}

export async function getAllStorySlugs(): Promise<Pick<Story, 'slug'>[]> {
  const slugs = await performFetch<string[]>(storySlugsQuery);
  return slugs ? slugs.map((slug) => ({ slug })) : [];
}

export async function getAllFoodReviewSlugs(): Promise<Pick<Food, 'slug'>[]> { // Use Food type if defined
  const slugs = await performFetch<string[]>(foodSlugsQuery);
  return slugs ? slugs.map((slug) => ({ slug })) : [];
}


// ============================================
// --- Get By Slug ---
// ============================================

// Generic post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  return (await performFetch<Post>(postBySlugQuery, { slug })) || null;
}

// Specific types by slug
export async function getHotelBySlug(slug: string): Promise<Hotel | null> { // Use specific type Hotel
  return (await performFetch<Hotel>(hotelBySlugQuery, { slug })) || null;
}

export async function getStoryBySlug(slug: string): Promise<Story | null> { // Use specific type Story
  return (await performFetch<Story>(storyBySlugQuery, { slug })) || null;
}

export async function getFoodReviewBySlug(slug: string): Promise<Food | null> { // Use specific type Food
  return (await performFetch<Food>(foodBySlugQuery, { slug })) || null;
}


// ============================================
// --- Get By Slug And More Stories ---
// ============================================
// Note: Preview token handling might need a separate client instance
// The performFetch helper currently doesn't handle tokens.
// If preview is needed for these, you might need dedicated functions or enhance performFetch.

export async function getHotelAndMore(
  slug: string
): Promise<{ post: Hotel | null; morePosts: Post[] }> {
  const result = await performFetch<{ post: Hotel; morePosts: Post[] }>(hotelAndMoreQuery, { slug });
  return result || { post: null, morePosts: [] };
}

export async function getStoryAndMore(
  slug: string
): Promise<{ post: Story | null; morePosts: Post[] }> {
  const result = await performFetch<{ post: Story; morePosts: Post[] }>(storyAndMoreQuery, { slug });
  return result || { post: null, morePosts: [] };
}

export async function getFoodReviewAndMore(
  slug: string
): Promise<{ post: Food | null; morePosts: Post[] }> { // Use Food type for main post
  const result = await performFetch<{ post: Food; morePosts: Post[] }>(foodAndMoreQuery, { slug });
  return result || { post: null, morePosts: [] };
}

export async function getPostAndMoreStories( // Generic version
  slug: string
): Promise<{ post: Post | null; morePosts: Post[] }> {
  // This function used a separate client for preview - keep separate or adapt performFetch
   if (projectId) {
      try {
         // Using the main client here, doesn't handle preview token separately
         const result = await client?.fetch<{ post: Post; morePosts: Post[] }>(postAndMoreStoriesQuery, { slug });
         return result || { post: null, morePosts: [] }
      } catch (error) {
          console.error(`Error fetching post and more stories for slug "${slug}":`, error);
          return { post: null, morePosts: [] };
      }
   }
   return { post: null, morePosts: [] }
}