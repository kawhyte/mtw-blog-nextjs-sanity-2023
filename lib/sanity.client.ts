import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
// Import queries and types from the updated queries file
import {
  allFoodQuery,
  allHotelsQuery,
  allStoriesQuery,
  type Arena,
  arenaQuery,
  arenaSlugsQuery, // Import Arena specific queries
  arenaBySlugQuery, // Import Arena specific queries
  type Essential,
  type Food,
  foodAndMoreQuery,
  foodBySlugQuery,
  foodPostsTotalCountQuery,
  foodSlugsQuery,
  guidePostsTotalCountQuery,
  type Hotel,
  hotelAndMoreQuery,
  hotelBySlugQuery,
  hotelPostsTotalCountQuery,
  hotelSlugsQuery,
  indexQuery,
  type Instagram,
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
  topWeightedFoodQuery,
  topWeightedHotelsQuery,
  travelEssentialQuery,
} from 'lib/sanity.queries' // Adjust path if needed
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
    console.warn('Sanity client is not initialized.');
    return {};
  }
  try {
    const settings = await client.fetch<Settings>(settingsQuery);
    return settings ?? {}; // Return fetched settings or default empty object
  } catch (error) {
    console.error(`Error fetching settings:`, error);
    return {}; // Return default on error
  }
}

// --- Generic Posts (Index Page) ---
export async function getIndexPosts(): Promise<Post[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.');
    return [];
  }
  try {
    const posts = await client.fetch<Post[]>(indexQuery);
    return posts ?? [];
  } catch (error) {
    console.error(`Error fetching index posts:`, error);
    return [];
  }
}

// --- Instagram ---
// (Instagram function does not use the Sanity client, no changes needed here)
export async function getInstagramPosts(): Promise<Instagram | null> {
  try {
    if (!process.env.INSTAGRAM_KEY) {
        console.warn("Instagram Key (INSTAGRAM_KEY) is not defined in environment variables.");
        return null;
    }
    const url =`https://graph.instagram.com/me/media?fields=id,username,thumbnail_url,caption,media_url,timestamp,media_type,permalink&access_token=${process.env.INSTAGRAM_KEY}`
    const data = await fetch(url);
    if (!data.ok) {
        const errorBody = await data.text();
        throw new Error(`Instagram API error: ${data.status} ${data.statusText} - ${errorBody}`);
    }
    const feed = await data.json();
    return feed as Instagram;
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
export async function getAllHotelPosts(): Promise<Post[]> {
  if (!client) return [];
  try {
    const results = await client.fetch<Post[]>(allHotelsQuery);
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching all hotel posts:`, error);
    return [];
  }
}

/** Fetches a specific page/slice of hotel posts */
export async function getPaginatedHotelPosts(start: number, end: number): Promise<Post[]> {
  if (!client) return [];
  try {
    const results = await client.fetch<Post[]>(paginatedHotelPostsQuery, { start, end });
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching paginated hotel posts (start: ${start}, end: ${end}):`, error);
    return [];
  }
}

/** Gets the total count of hotel posts */
export async function getHotelPostsTotalCount(): Promise<number> {
  if (!client) return 0;
  try {
    const count = await client.fetch<number>(hotelPostsTotalCountQuery);
    return count ?? 0;
  } catch (error) {
    console.error(`Error fetching hotel posts total count:`, error);
    return 0;
  }
}

/** Fetches top weighted hotel posts */
export async function getTopWeightedHotelPosts(): Promise<Post[]> {
  if (!client) return [];
  try {
    const results = await client.fetch<Post[]>(topWeightedHotelsQuery);
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching top weighted hotel posts:`, error);
    return [];
  }
}


// --- Food Posts ---

/** Fetches ALL food posts using limited fields */
export async function getAllFoodPosts(): Promise<Post[]> {
  if (!client) return [];
  try {
    const results = await client.fetch<Post[]>(allFoodQuery);
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching all food posts:`, error);
    return [];
  }
}

/** Fetches a specific page/slice of food posts */
export async function getPaginatedFoodPosts(start: number, end: number): Promise<Post[]> {
  if (!client) return [];
  try {
    const results = await client.fetch<Post[]>(paginatedFoodPostsQuery, { start, end });
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching paginated food posts (start: ${start}, end: ${end}):`, error);
    return [];
  }
}

/** Gets the total count of food posts */
export async function getFoodPostsTotalCount(): Promise<number> {
  if (!client) return 0;
  try {
    const count = await client.fetch<number>(foodPostsTotalCountQuery);
    return count ?? 0;
  } catch (error) {
    console.error(`Error fetching food posts total count:`, error);
    return 0;
  }
}

/** Fetches top weighted food posts */
export async function getTopWeightedFoodPosts(): Promise<Post[]> {
  if (!client) return [];
  try {
    const results = await client.fetch<Post[]>(topWeightedFoodQuery);
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching top weighted food posts:`, error);
    return [];
  }
}


// --- Story/Guide Posts (assuming linkType == 'story') ---

/** Fetches ALL story posts using limited fields */
export async function getAllStoryPosts(): Promise<Post[]> {
  if (!client) return [];
  try {
    const results = await client.fetch<Post[]>(allStoriesQuery);
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching all story posts:`, error);
    return [];
  }
}

/** Fetches a specific page/slice of story/guide posts */
export async function getPaginatedGuidePosts(start: number, end: number): Promise<Post[]> {
  if (!client) return [];
  try {
    const results = await client.fetch<Post[]>(paginatedGuidePostsQuery, { start, end });
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching paginated guide posts (start: ${start}, end: ${end}):`, error);
    return [];
  }
}

/** Gets the total count of story/guide posts */
export async function getGuidePostsTotalCount(): Promise<number> {
  if (!client) return 0;
  try {
    const count = await client.fetch<number>(guidePostsTotalCountQuery);
    return count ?? 0;
  } catch (error) {
    console.error(`Error fetching guide posts total count:`, error);
    return 0;
  }
}


// --- Recommendations ---
export async function getRecommendationPosts(): Promise<any[]> { // TODO: Define Recommendation List type
  if (!client) return [];
  try {
    const results = await client.fetch<any[]>(recommendationQuery);
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching recommendation posts:`, error);
    return [];
  }
}

// --- Travel Essentials ---
export async function getTravelEssentialPosts(): Promise<Essential[]> {
  if (!client) return [];
  try {
    const results = await client.fetch<Essential[]>(travelEssentialQuery);
    return results ?? [];
  } catch (error) {
    console.error(`Error fetching travel essential posts:`, error);
    return [];
  }
}

// --- Arenas ---
/** Fetches ALL arena documents */
export async function getArenaPosts(): Promise<Arena[]> {
  if (!client) {
      console.warn('Sanity client is not initialized.');
      return [];
  }
  try {
    const results = await client.fetch<Arena[]>(arenaQuery);
    return results ?? []; // Handle null/undefined from fetch
  } catch (error) {
    console.error(`Error fetching arena posts:`, error);
    return []; // Return default on error
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
    console.warn('Sanity client is not initialized.');
    return null;
  }
  try {
    const arena = await client.fetch<Arena | undefined>(arenaBySlugQuery, { slug });
    return arena ?? null; // Return the arena or null
  } catch (error) {
    console.error(`Error fetching arena by slug "${slug}":`, error);
    return null; // Return null on error
  }
}
// --- End Arenas Section ---


// ============================================
// --- Slug Fetching ---
// ============================================

export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  if (!client) return [];
  try {
    const slugs = await client.fetch<string[]>(postSlugsQuery);
    return slugs ? slugs.map((slug) => ({ slug })) : [];
  } catch (error) {
    console.error(`Error fetching all post slugs:`, error);
    return [];
  }
}

export async function getAllHotelSlugs(): Promise<Pick<Hotel, 'slug'>[]> {
  if (!client) return [];
  try {
    const slugs = await client.fetch<string[]>(hotelSlugsQuery);
    return slugs ? slugs.map((slug) => ({ slug })) : [];
  } catch (error) {
    console.error(`Error fetching all hotel slugs:`, error);
    return [];
  }
}

export async function getAllStorySlugs(): Promise<Pick<Story, 'slug'>[]> {
  if (!client) return [];
  try {
    const slugs = await client.fetch<string[]>(storySlugsQuery);
    return slugs ? slugs.map((slug) => ({ slug })) : [];
  } catch (error) {
    console.error(`Error fetching all story slugs:`, error);
    return [];
  }
}

export async function getAllFoodReviewSlugs(): Promise<Pick<Food, 'slug'>[]> {
  if (!client) return [];
  try {
    const slugs = await client.fetch<string[]>(foodSlugsQuery);
    return slugs ? slugs.map((slug) => ({ slug })) : [];
  } catch (error) {
    console.error(`Error fetching all food review slugs:`, error);
    return [];
  }
}

// --- Fetch All Arena Slugs ---
/**
 * Fetches the slugs for all arena documents.
 * Used by getStaticPaths in pages/arena/[slug].tsx
 * @returns An array of arena slugs, or an empty array on error/no slugs.
 */
export async function getAllArenaSlugs(): Promise<string[]> {
  if (!client) {
    console.warn('Sanity client is not initialized.');
    return [];
  }
  try {
    const slugs = await client.fetch<string[]>(arenaSlugsQuery);
    return slugs ?? []; // Return the fetched slugs or an empty array
  } catch (error) {
    console.error(`Error fetching all arena slugs:`, error);
    return []; // Return empty array on error
  }
}
// --- End Slug Fetching Section ---


// ============================================
// --- Get By Slug ---
// ============================================

// Generic post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!client) return null;
  try {
    const post = await client.fetch<Post | undefined>(postBySlugQuery, { slug });
    return post ?? null;
  } catch (error) {
    console.error(`Error fetching post by slug "${slug}":`, error);
    return null;
  }
}

// Specific types by slug
export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  if (!client) return null;
  try {
    const hotel = await client.fetch<Hotel | undefined>(hotelBySlugQuery, { slug });
    return hotel ?? null;
  } catch (error) {
    console.error(`Error fetching hotel by slug "${slug}":`, error);
    return null;
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  if (!client) return null;
  try {
    const story = await client.fetch<Story | undefined>(storyBySlugQuery, { slug });
    return story ?? null;
  } catch (error) {
    console.error(`Error fetching story by slug "${slug}":`, error);
    return null;
  }
}

export async function getFoodReviewBySlug(slug: string): Promise<Food | null> {
  if (!client) return null;
  try {
    const food = await client.fetch<Food | undefined>(foodBySlugQuery, { slug });
    return food ?? null;
  } catch (error) {
    console.error(`Error fetching food review by slug "${slug}":`, error);
    return null;
  }
}

// NOTE: getArenaBySlug is already updated above in the 'Arenas' section.


// ============================================
// --- Get By Slug And More Stories ---
// ============================================
// These already used client.fetch directly in the original code,
// but we'll ensure the pattern is consistent (check client, try/catch)

const defaultAndMoreResult = { post: null, morePosts: [] };

export async function getHotelAndMore(
  slug: string
): Promise<{ post: Hotel | null; morePosts: Post[] }> {
  if (!client) return defaultAndMoreResult;
  try {
    const result = await client.fetch<{ post: Hotel; morePosts: Post[] }>(hotelAndMoreQuery, { slug });
    return {
        post: result?.post ?? null,
        morePosts: result?.morePosts ?? []
    };
  } catch (error) {
    console.error(`Error fetching hotel and more for slug "${slug}":`, error);
    return defaultAndMoreResult;
  }
}

export async function getStoryAndMore(
  slug: string
): Promise<{ post: Story | null; morePosts: Post[] }> {
  if (!client) return defaultAndMoreResult;
  try {
    const result = await client.fetch<{ post: Story; morePosts: Post[] }>(storyAndMoreQuery, { slug });
     return {
        post: result?.post ?? null,
        morePosts: result?.morePosts ?? []
    };
  } catch (error) {
    console.error(`Error fetching story and more for slug "${slug}":`, error);
    return defaultAndMoreResult;
  }
}

export async function getFoodReviewAndMore(
  slug: string
): Promise<{ post: Food | null; morePosts: Post[] }> {
  if (!client) return defaultAndMoreResult;
  try {
    const result = await client.fetch<{ post: Food; morePosts: Post[] }>(foodAndMoreQuery, { slug });
     return {
        post: result?.post ?? null,
        morePosts: result?.morePosts ?? []
    };
  } catch (error) {
    console.error(`Error fetching food review and more for slug "${slug}":`, error);
    return defaultAndMoreResult;
  }
}

export async function getPostAndMoreStories( // Generic version
  slug: string
): Promise<{ post: Post | null; morePosts: Post[] }> {
   if (!client) return defaultAndMoreResult;
   try {
     const result = await client.fetch<{ post: Post; morePosts: Post[] }>(postAndMoreStoriesQuery, { slug });
     return {
         post: result?.post ?? null,
         morePosts: result?.morePosts ?? []
     };
   } catch (error) {
       console.error(`Error fetching post and more stories for slug "${slug}":`, error);
       return defaultAndMoreResult;
   }
}