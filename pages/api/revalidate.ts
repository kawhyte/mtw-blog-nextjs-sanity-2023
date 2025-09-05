/**
 * This code is responsible for revalidating the cache when a post or author is updated.
 *
 * It is set up to receive a validated GROQ-powered Webhook from Sanity.io:
 * https://www.sanity.io/docs/webhooks
 *
 * 1. Go to the API section of your Sanity project on sanity.io/manage or run `npx sanity hook create`
 * 2. Click "Create webhook"
 * 3. Set the URL to https://YOUR_NEXTJS_SITE_URL/api/revalidate
 * 4. Trigger on: "Create", "Update", and "Delete"
 * 5. Filter: _type == "post" || _type == "author" || _type == "settings" || _type == "hotelReview" || _type == "foodReview" || _type == "guide"
 * 6. Projection: Leave empty
 * 7. HTTP method: POST
 * 8. API version: v2021-03-25
 * 9. Include drafts: No
 * 10. HTTP Headers: Leave empty
 * 11. Secret: Set to the same value as SANITY_REVALIDATE_SECRET (create a random one if you haven't)
 * 12. Save the cofiguration
 * 13. Add the secret to Vercel: `npx vercel env add SANITY_REVALIDATE_SECRET`
 * 14. Redeploy with `npx vercel --prod` to apply the new environment variable
 */

import { apiVersion, dataset, projectId } from 'lib/sanity.api'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient, groq, type SanityClient } from 'next-sanity'
import { type ParseBody, parseBody } from 'next-sanity/webhook'

export { config } from 'next-sanity/webhook'

export default async function revalidate(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { body, isValidSignature } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )
    if (isValidSignature === false) {
      const message = 'Invalid signature'
      console.log(message)
      return res.status(401).send(message)
    }

    if (typeof body._id !== 'string' || !body._id) {
      const invalidId = 'Invalid _id'
      console.error(invalidId, { body })
      return res.status(400).send(invalidId)
    }

    const staleRoutes = await queryStaleRoutes(body as any)
    await Promise.all(staleRoutes.map((route) => res.revalidate(route)))

    const updatedRoutes = `Updated routes: ${staleRoutes.join(', ')}`
    console.log(updatedRoutes)
    return res.status(200).send(updatedRoutes)
  } catch (err) {
    console.error(err)
    return res.status(500).send(err.message)
  }
}

type StaleRoute =
  | '/'
  | `/posts/${string}`
  | `/hotel/${string}`
  | `/food/${string}`
  | `/guide/${string}`

async function queryStaleRoutes(
  body: Pick<ParseBody['body'], '_type' | '_id' | 'date' | 'slug'>,
): Promise<StaleRoute[]> {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: false })
  console.log('BODY')
  // Handle possible deletions for all content types
  if (['post', 'hotelReview', 'foodReview', 'guide'].includes(body._type)) {
    const exists = await client.fetch(groq`*[_id == $id][0]`, { id: body._id })
    if (!exists) {
      let staleRoutes: StaleRoute[] = ['/']
      if ((body.slug as any)?.current) {
        // Route to appropriate path based on content type
        switch (body._type) {
          case 'post':
            staleRoutes.push(`/posts/${(body.slug as any).current}`)
            break
          case 'hotelReview':
            staleRoutes.push(`/hotel/${(body.slug as any).current}`)
            break
          case 'foodReview':
            staleRoutes.push(`/food/${(body.slug as any).current}`)
            break
          case 'guide':
            staleRoutes.push(`/guide/${(body.slug as any).current}`)
            break
        }
      }
      // For deletions, also revalidate the listing pages
      switch (body._type) {
        case 'post':
          // Check if we need to revalidate all legacy posts
          const moreStories = await client.fetch(
            groq`count(
              *[_type == "post"] | order(date desc, _updatedAt desc) [0...3] [dateTime(date) > dateTime($date)]
            )`,
            { date: body.date },
          )
          if (moreStories < 3) {
            return [
              ...new Set([...(await queryAllRoutes(client)), ...staleRoutes]),
            ]
          }
          break
        case 'hotelReview':
          staleRoutes.push('/hotels')
          break
        case 'foodReview':
          staleRoutes.push('/food')
          break
        case 'guide':
          staleRoutes.push('/guides')
          break
      }
      return staleRoutes
    }
  }

  switch (body._type) {
    case 'author':
      return await queryStaleAuthorRoutes(client, body._id)
    case 'post':
      return await queryStalePostRoutes(client, body._id)
    case 'hotelReview':
      return await queryStaleHotelReviewRoutes(client, body._id)
    case 'foodReview':
      return await queryStaleFoodReviewRoutes(client, body._id)
    case 'guide':
      return await queryStaleGuideRoutes(client, body._id)
    case 'settings':
      return await queryAllRoutes(client)
    default:
      throw new TypeError(`Unknown type: ${body._type}`)
  }
}

async function _queryAllRoutes(client: SanityClient): Promise<string[]> {
  return await client.fetch(groq`*[_type == "post"].slug.current`)
}

async function _queryAllHotelReviewRoutes(
  client: SanityClient,
): Promise<string[]> {
  return await client.fetch(groq`*[_type == "hotelReview"].slug.current`)
}

async function _queryAllFoodReviewRoutes(
  client: SanityClient,
): Promise<string[]> {
  return await client.fetch(groq`*[_type == "foodReview"].slug.current`)
}

async function _queryAllGuideRoutes(client: SanityClient): Promise<string[]> {
  return await client.fetch(groq`*[_type == "guide"].slug.current`)
}

async function queryAllRoutes(client: SanityClient): Promise<StaleRoute[]> {
  const [postSlugs, hotelSlugs, foodSlugs, guideSlugs] = await Promise.all([
    _queryAllRoutes(client),
    _queryAllHotelReviewRoutes(client),
    _queryAllFoodReviewRoutes(client),
    _queryAllGuideRoutes(client),
  ])

  return [
    '/',
    '/hotels',
    '/food',
    '/guides',
    ...postSlugs.map((slug) => `/posts/${slug}` as StaleRoute),
    ...hotelSlugs.map((slug) => `/hotel/${slug}` as StaleRoute),
    ...foodSlugs.map((slug) => `/food/${slug}` as StaleRoute),
    ...guideSlugs.map((slug) => `/guide/${slug}` as StaleRoute),
  ]
}

async function mergeWithMoreStories(
  client,
  slugs: string[],
): Promise<string[]> {
  const moreStories = await client.fetch(
    groq`*[_type == "post"] | order(date desc, _updatedAt desc) [0...3].slug.current`,
  )
  if (slugs.some((slug) => moreStories.includes(slug))) {
    const allSlugs = await _queryAllRoutes(client)
    return [...new Set([...slugs, ...allSlugs])]
  }

  return slugs
}

async function queryStaleAuthorRoutes(
  client: SanityClient,
  id: string,
): Promise<StaleRoute[]> {
  let slugs = await client.fetch(
    groq`*[_type == "author" && _id == $id] {
    "slug": *[_type == "post" && references(^._id)].slug.current
  }["slug"][]`,
    { id },
  )

  if (slugs.length > 0) {
    slugs = await mergeWithMoreStories(client, slugs)
    return ['/', ...slugs.map((slug) => `/posts/${slug}`)]
  }

  return []
}

async function queryStalePostRoutes(
  client: SanityClient,
  id: string,
): Promise<StaleRoute[]> {
  let slugs = await client.fetch(
    groq`*[_type == "post" && _id == $id].slug.current`,
    { id },
  )

  slugs = await mergeWithMoreStories(client, slugs)

  return ['/', ...slugs.map((slug) => `/posts/${slug}`)]
}

async function queryStaleHotelReviewRoutes(
  client: SanityClient,
  id: string,
): Promise<StaleRoute[]> {
  const slugs = await client.fetch(
    groq`*[_type == "hotelReview" && _id == $id].slug.current`,
    { id },
  )

  if (slugs.length > 0) {
    return ['/', '/hotels', ...slugs.map((slug) => `/hotel/${slug}`)]
  }

  return []
}

async function queryStaleFoodReviewRoutes(
  client: SanityClient,
  id: string,
): Promise<StaleRoute[]> {
  const slugs = await client.fetch(
    groq`*[_type == "foodReview" && _id == $id].slug.current`,
    { id },
  )

  if (slugs.length > 0) {
    return ['/', '/food', ...slugs.map((slug) => `/food/${slug}`)]
  }

  return []
}

async function queryStaleGuideRoutes(
  client: SanityClient,
  id: string,
): Promise<StaleRoute[]> {
  const slugs = await client.fetch(
    groq`*[_type == "guide" && _id == $id].slug.current`,
    { id },
  )

  if (slugs.length > 0) {
    return ['/', '/guides', ...slugs.map((slug) => `/guide/${slug}`)]
  }

  return []
}
