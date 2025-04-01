import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import {
  // ... keep all existing imports ...
  indexQuery,
  Instagram,
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
  storyQuery,
  storySlugsQuery,
  topWeightedFoodQuery,
  topWeightedHotelsQuery,
  travelEssentialQuery,
  // --- ADD NEW IMPORTS ---
  paginatedHotelPostsQuery, // Import the paginated query for hotels
  hotelPostsTotalCountQuery, // Import the total count query for hotels
  // --- You might already have this or rename hotelQuery if needed ---
  // Assuming hotelQuery fetches ALL hotels with limited fields based on your queries file
  allHotelsQuery, // Assuming you have/rename hotelQuery to allHotelsQuery for clarity
  // --- Keep other imports ...
  Arena,
  arenaQuery,
  type Essential,
  foodAndMoreQuery,
  foodBySlugQuery,
  foodQuery, // Fetches all food posts
  foodSlugsQuery,
  type Hotel,
  hotelAndMoreQuery,
  hotelBySlugQuery,
  // hotelQuery, // <-- This is likely fetching all hotels, let's use allHotelsQuery below if defined
  hotelSlugsQuery,

} from 'lib/sanity.queries'
import { createClient, groq } from 'next-sanity'


/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null

// --- Settings ---
export async function getSettings(): Promise<Settings> {
  if (client) {
    return (await client.fetch(settingsQuery)) || {}
  }
  return {}
}

// --- Generic Posts ---
export async function getAllPosts(): Promise<Post[]> { // Fetches first 6 posts based on indexQuery
  if (client) {
    return (await client.fetch(indexQuery)) || []
  }
  return []
}

// --- Instagram ---
export async function getInstagramPosts(): Promise<Instagram> {
  // ... (keep existing implementation)
  const url =`https://graph.instagram.com/me/media?fields=id,username,thumbnail_url,caption,media_url,timestamp,media_type,permalink&access_token=${process.env.INSTAGRAM_KEY}`
  const data = await fetch(url)
  const feed = await data.json()
  return feed
}


// --- Hotel Posts ---

/** Fetches ALL hotel posts using limited fields (based on allHotelsQuery/hotelQuery) */
export async function getAllHotelPosts(): Promise<Hotel[]> { // Renamed from getHotelPosts
  if (client) {
    // Use the query defined for fetching all hotels (e.g., allHotelsQuery or hotelQuery)
    // const queryToUse = typeof allHotelsQuery !== 'undefined' ? allHotelsQuery : hotelQuery; // Handle potential naming
    return (await client.fetch(allHotelsQuery)) || []
  }
  return []
}

/** NEW: Fetches a specific page/slice of hotel posts */
export async function getPaginatedHotelPosts(start: number, end: number): Promise<Hotel[]> {
    if (client) {
        try {
            // Fetch using the specific paginated query and pass start/end parameters
            const posts = await client.fetch<Hotel[]>(
                paginatedHotelPostsQuery, // Use the imported paginated query
                { start, end } // Pass parameters to the query
            );
            return posts || [];
        } catch (error) {
            console.error("Error fetching paginated hotel posts:", error);
            return []; // Return empty array on error
        }
    }
    return [];
}

/** NEW: Gets the total count of hotel posts */
export async function getHotelPostsTotalCount(): Promise<number> {
    if (client) {
        try {
            const count = await client.fetch<number>(hotelPostsTotalCountQuery);
            return count || 0;
        } catch (error) {
            console.error("Error fetching hotel posts total count:", error);
            return 0; // Return 0 on error
        }
    }
    return 0;
}


// --- Top Weighted Hotel Posts ---
export async function getTopWeightedHotelPosts(): Promise<Hotel[]> {
  if (client) {
    return (await client.fetch(topWeightedHotelsQuery)) || []
  }
  return []
}


// --- Food Posts ---
export async function getFoodPosts(): Promise<Post[]> { // Fetches all food posts
  if (client) {
    // Assuming foodQuery fetches all food posts
    return (await client.fetch(foodQuery)) || []
  }
  return []
}

// --- Top Weighted Food Posts ---
export async function getTopWeightedFoodPosts(): Promise<Post[]> {
  if (client) {
    return (await client.fetch(topWeightedFoodQuery)) || []
  }
  return []
}

// --- Story Posts ---
export async function getStoryPosts(): Promise<Post[]> { // Fetches all story posts
  if (client) {
    // Assuming storyQuery fetches all story posts
    return (await client.fetch(storyQuery)) || []
  }
  return []
}

// --- Recommendations ---
export async function getRecommendationPosts(): Promise<Post[]> { // Adjust return type if needed
  if (client) {
    return (await client.fetch(recommendationQuery)) || []
  }
  return []
}

// --- Travel Essentials ---
export async function getTravelEssentialPosts(): Promise<Essential[]> {
  if (client) {
    return (await client.fetch(travelEssentialQuery)) || []
  }
  return []
}

// --- Arenas ---
export async function getArenaPosts(): Promise<Arena[]> {
  if (client) {
    return (await client.fetch(arenaQuery)) || []
  }
  return []
}

// --- Slugs ---
export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  if (client) {
    const slugs = (await client.fetch<string[]>(postSlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  }
  return []
}

export async function getAllHotelSlugs(): Promise<Pick<Hotel, 'slug'>[]> {
  if (client) {
    const slugs = (await client.fetch<string[]>(hotelSlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  }
  return []
}

export async function getAllStorySlugs(): Promise<Pick<Story, 'slug'>[]> {
  if (client) {
    const slugs = (await client.fetch<string[]>(storySlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  }
  return []
}

export async function getAllFoodReviewSlugs(): Promise<Pick<Post, 'slug'>[]> {
  if (client) {
    const slugs = (await client.fetch<string[]>(foodSlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  }
  return []
}


// --- Get By Slug ---
export async function getPostBySlug(slug: string): Promise<Post> {
  if (client) {
    return (await client.fetch(postBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getHotelBySlug(slug: string, token?: string | null): Promise<Hotel> {
  if (client) {
    // Note: Preview token handling might need adjustment if using getClient() pattern elsewhere
    return (await client.fetch(hotelBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getStoryBySlug(slug: string, token?: string | null): Promise<Story> {
  if (client) {
    return (await client.fetch(storyBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getFoodReviewBySlug(slug: string, token?: string | null): Promise<Post> {
  if (client) {
    return (await client.fetch(foodBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}


// --- Get By Slug And More Stories ---
export async function getHotelAndMore(
  slug: string,
  token?: string | null
): Promise<{ post: Hotel; morePosts: Hotel[] }> {
   // Note: Preview token handling might need adjustment if using getClient() pattern elsewhere
  if (client) {
    return await client.fetch(hotelAndMoreQuery, { slug })
  }
  return { post: null as any, morePosts: [] }
}

export async function getStoryAndMore(
  slug: string,
  token?: string | null
): Promise<{ post: Story; morePosts: Story[] }> {
   // Note: Preview token handling might need adjustment if using getClient() pattern elsewhere
  if (client) {
    return await client.fetch(storyAndMoreQuery, { slug })
  }
  return { post: null as any, morePosts: [] }
}

export async function getFoodReviewAndMore(
  slug: string,
  token?: string | null
): Promise<{ post: Post; morePosts: Post[] }> {
   // Note: Preview token handling might need adjustment if using getClient() pattern elsewhere
  if (client) {
    return await client.fetch(foodAndMoreQuery, { slug })
  }
  return { post: null as any, morePosts: [] }
}

export async function getPostAndMoreStories( // Generic version
  slug: string,
  token?: string | null
): Promise<{ post: Post; morePosts: Post[] }> {
   // Note: This version explicitly creates a client potentially with a token
   // You might want to standardize token handling if preview is important
  if (projectId) {
    const previewClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // Ensure preview uses fresh data
      token: token || undefined,
    })
    return await previewClient.fetch(postAndMoreStoriesQuery, { slug })
  }
  return { post: null, morePosts: [] }
}