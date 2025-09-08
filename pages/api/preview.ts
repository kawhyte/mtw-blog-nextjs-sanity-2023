import {
  apiVersion,
  dataset,
  previewSecretId,
  projectId,
  useCdn,
} from 'lib/sanity.api'
import {
  arenaBySlugQuery,
  foodReviewBySlugQuery,
  guideBySlugQuery,
  hotelReviewBySlugQuery,
  // Removed legacy postBySlugQuery import
} from 'lib/sanity.queries'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { PageConfig } from 'next/types'
import { createClient } from 'next-sanity'
import { getSecret } from 'plugins/productionUrl/utils'

// res.setPreviewData only exists in the nodejs runtime, setting the config here allows changing the global runtime
// option in next.config.mjs without breaking preview mode
export const config: PageConfig = { runtime: 'nodejs' }

function redirectToPreview(
  res: NextApiResponse<string | void>,
  previewData: { token?: string },
  Location:
    | '/'
    | `/posts/${string}`
    | `/arena/${string}`
    | `/guide/${string}`
    | `/hotel/${string}`
    | `/food/${string}`,
): void {
  // Enable Preview Mode by setting the cookies
  res.setPreviewData(previewData)
  // Redirect to a preview capable route
  res.writeHead(307, { Location })
  res.end()
}

const _client = createClient({ projectId, dataset, apiVersion, useCdn })

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse<string | void>,
) {
  const previewData: { token?: string } = {}
  // If you want to require preview mode sessions to be started from the Studio, set the SANITY_REQUIRE_PREVIEW_SECRET
  // environment variable to 'true'. The benefit of doing this that unauthorized users attempting to brute force into your
  // preview mode won't make it past the secret check, and only legitimate users are able to bypass the statically generated pages and load up
  // the serverless-powered preview mode.
  if (
    process.env.SANITY_REQUIRE_PREVIEW_SECRET === 'true' &&
    !req.query.secret
  ) {
    return res.status(401).send('Invalid secret')
  }

  // If a secret is present in the URL, verify it and if valid we upgrade to token based preview mode, which works in Safari and Incognito mode
  if (req.query.secret) {
    const token = process.env.SANITY_API_READ_TOKEN
    if (!token) {
      throw new Error(
        'A secret is provided but there is no `SANITY_API_READ_TOKEN` environment variable setup.',
      )
    }
    const client = _client.withConfig({ useCdn: false, token })
    const secret = await getSecret(client, previewSecretId)
    if (req.query.secret !== secret) {
      return res.status(401).send('Invalid secret')
    }
    previewData.token = token
  }

  // If no slug is provided open preview mode on the frontpage
  const slug = req.query.slug as string | undefined
  const type = req.query.type as string | undefined // Read the 'type' parameter

  // If no slug AND no type is provided, redirect to the frontpage
  if (!slug && !type) {
    return redirectToPreview(res, previewData, '/')
  }

  // Check if the post with the given `slug` exists
  const client = _client.withConfig({
    // Fallback to using the WRITE token until https://www.sanity.io/docs/vercel-integration starts shipping a READ token.
    // As this client only exists on the server and the token is never shared with the browser, we don't risk escalating permissions to untrustworthy users
    token:
      process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
  })
  // Legacy post preview removed - posts redirect through /posts/[slug].tsx
  const post = null

  // If the slug doesn't exist prevent preview mode from being enabled
  // if (!post) {
  //   return res.status(401).send('Invalid slug')
  // }

  let document: { slug?: string } | null = null
  let documentPath:
    | `/posts/${string}`
    | `/arena/${string}`
    | `/guide/${string}`
    | `/hotel/${string}`
    | `/food/${string}`
    | null = null

  // Determine which document type to fetch and where to redirect
  if (type === 'post' && slug) {
    // Legacy posts are handled by the redirect system in /pages/posts/[slug].tsx
    document = null
    documentPath = `/posts/${slug}` // Let the redirect system handle it
  } else if (type === 'arena' && slug) {
    // Handle arena documents
    document = await client.fetch(arenaBySlugQuery, { slug })
    if (document) {
      documentPath = `/arena/${document.slug}`
    }
  } else if (type === 'guide' && slug) {
    // Handle guide documents
    document = await client.fetch(guideBySlugQuery, { slug })
    if (document) {
      documentPath = `/guide/${document.slug}`
    }
  } else if (type === 'hotelReview' && slug) {
    // Handle hotel review documents
    document = await client.fetch(hotelReviewBySlugQuery, { slug })
    if (document) {
      documentPath = `/hotel/${document.slug}`
    }
  } else if (type === 'foodReview' && slug) {
    // Handle food review documents
    document = await client.fetch(foodReviewBySlugQuery, { slug })
    if (document) {
      documentPath = `/food/${document.slug}`
    }
  } else {
    // Handle cases where type is missing, unknown, or slug is missing for a known type
    return res.status(401).send('Invalid request: missing slug or type')
  }

  // If the document was not found for the given slug and type
  if (!document || !documentPath) {
    return res
      .status(401)
      .send(
        `Invalid slug or type: Could not find document with slug "${slug}" of type "${type}"`,
      )
  }

  // redirectToPreview(res, previewData, `/posts/${post.slug}`)
  redirectToPreview(res, previewData, documentPath)
}
