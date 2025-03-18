import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import {
  Arena,
  arenaQuery,
  type Esssential,
  foodAndMoreQuery, // Import new query
  foodBySlugQuery, // Import new query
  foodQuery,
  foodSlugsQuery, // Import new query
  type Hotel,
  hotelAndMoreQuery, // Import the new query
  hotelBySlugQuery, // Import the new query
  hotelQuery,
  hotelSlugsQuery, // Import the new query
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
  storyAndMoreQuery, // Import new query
  storyBySlugQuery, // Import new query
  storyQuery,
  storySlugsQuery, // Import new query
  travelEssentialQuery,
} from 'lib/sanity.queries'
import { createClient, groq } from 'next-sanity'


/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null

export async function getSettings(): Promise<Settings> {
  if (client) {
    return (await client.fetch(settingsQuery)) || {}
  }
  return {}
}

export async function getAllPosts(): Promise<Post[]> {
  if (client) {
    return (await client.fetch(indexQuery)) || []
  }
  return []
}

export async function getInstagramPosts(): Promise<Instagram> {

  const url =`https://graph.instagram.com/me/media?fields=id,username,thumbnail_url,caption,media_url,timestamp,media_type,permalink&access_token=${process.env.INSTAGRAM_KEY}`
  const data = await fetch(url)
  const feed = await data.json()
 
 //console.log("Instagram feed ", feed)

 return feed

}

export async function getHotelPosts(): Promise<Hotel[]> {
  if (client) {
    return (await client.fetch(hotelQuery)) || []
  }
  return []
}

export async function getFoodPosts(): Promise<Post[]> {
  if (client) {
    return (await client.fetch(foodQuery)) || []
  }
  return []
}

export async function getStoryPosts(): Promise<Post[]> {
  if (client) {
    return (await client.fetch(storyQuery)) || []
  }
  return []
}
export async function getRecommendationPosts(): Promise<Post[]> {
  if (client) {
    return (await client.fetch(recommendationQuery)) || []
  }
  return []
}
export async function getTravelEssentialPosts(): Promise<Esssential[]> {
  if (client) {
    return (await client.fetch(travelEssentialQuery)) || []
  }
  return []
}

export async function getArenaPosts(): Promise<Arena[]> {
  if (client) {
    return (await client.fetch(arenaQuery)) || []
  }
  return []
}

export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  if (client) {
    const slugs = (await client.fetch<string[]>(postSlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  }
  return []
}

export async function getPostBySlug(slug: string): Promise<Post> {
  if (client) {
    return (await client.fetch(postBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getAllHotelSlugs(): Promise<Pick<Hotel, 'slug'>[]> {
  //const client = getClient()
  if (client) {
    const slugs = (await client.fetch<string[]>(hotelSlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  }
  return []
}

export async function getHotelBySlug(slug: string, token?: string | null): Promise<Hotel> {
  // const client = getClient(token)
  if (client) {
    return (await client.fetch(hotelBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getHotelAndMore(
  slug: string,
  token?: string | null
): Promise<{ post: Hotel; morePosts: Hotel[] }> {
  // const client = getClient(token)
  if (client) {
    return await client.fetch(hotelAndMoreQuery, { slug })
  }
  return { post: null as any, morePosts: [] } // Use null as any because the type expects Hotel
}


// Story Specific Functions
export async function getAllStorySlugs(): Promise<Pick<Story, 'slug'>[]> { // Assuming your Story type extends Post or has a slug
  // const client = getClient()
  if (client) {
    const slugs = (await client.fetch<string[]>(storySlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  }
  return []
}

export async function getStoryBySlug(slug: string, token?: string | null): Promise<Story> { // Assuming your Story type extends Post
  // const client = getClient(token)
  if (client) {
    return (await client.fetch(storyBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getStoryAndMore(
  slug: string,
  token?: string | null
): Promise<{ post: Story; morePosts: Story[] }> { // Assuming your Story type extends Post
  // const client = getClient(token)
  if (client) {
    return await client.fetch(storyAndMoreQuery, { slug })
  }
  return { post: null as any, morePosts: [] }
}


// Food Review Specific Functions
export async function getAllFoodReviewSlugs(): Promise<Pick<Post, 'slug'>[]> { // Assuming your FoodReview type extends Post or has a slug
  // const client = getClient()
  if (client) {
    const slugs = (await client.fetch<string[]>(foodSlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  }
  return []
}

export async function getFoodReviewBySlug(slug: string, token?: string | null): Promise<Post> { // Assuming your FoodReview type extends Post
  // const client = getClient(token)
  if (client) {
    return (await client.fetch(foodBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getFoodReviewAndMore(
  slug: string,
  token?: string | null
): Promise<{ post: Post; morePosts: Post[] }> { // Assuming your FoodReview type extends Post
  // const client = getClient(token)
  if (client) {
    return await client.fetch(foodAndMoreQuery, { slug })
  }
  return { post: null as any, morePosts: [] }
}

export async function getPostAndMoreStories(
  slug: string,
  token?: string | null
): Promise<{ post: Post; morePosts: Post[] }> {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: token || undefined,
    })
    return await client.fetch(postAndMoreStoriesQuery, { slug })
  }
  return { post: null, morePosts: [] }
}
