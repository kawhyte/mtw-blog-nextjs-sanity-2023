import { NextApiRequest, NextApiResponse } from 'next'
import { sanityClient } from 'lib/sanity.server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { start = 0, limit = 12 } = req.query

  try {
    const query = `
      *[_type == "post"] | order(_createdAt desc) [${start}...${+start + +limit}] {
        _id,
        title,
        slug,
        coverImage,
        date,
        author,
        excerpt2,
        location,
        category,
        linkType,
        foodRating,
        hotelRating,
        takeoutRating,
        diningType
      }
    `
    const posts = await sanityClient.fetch(query)
    res.status(200).json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
}