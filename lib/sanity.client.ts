import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import {
  foodQuery,
  hotelQuery,
  indexQuery,
  Instagram,
  type Post,
  postAndMoreStoriesQuery,
  postBySlugQuery,
  postSlugsQuery,
  recommendationQuery,
  type Settings,
  settingsQuery,
  storyQuery,
} from 'lib/sanity.queries'
import { createClient } from 'next-sanity'


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

  const url =`https://graph.instagram.com/me/media?fields=id,username,caption,media_url,timestamp,media_type,permalink&access_token=${process.env.INSTAGRAM_KEY}`
  const data = await fetch(url)
  const feed = await data.json()
 
 //console.log("Instagram feed ", feed)

 return feed

}

export async function getHotelPosts(): Promise<Post[]> {
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
