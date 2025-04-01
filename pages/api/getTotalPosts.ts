import { NextApiRequest, NextApiResponse } from 'next'
import { sanityClient } from 'lib/sanity.server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = `count(*[_type == "post"])` // Sanity query to count total posts
    const total = await sanityClient.fetch(query)
    res.status(200).json({ total })
  } catch (error) {
    console.error('Error fetching total posts:', error)
    res.status(500).json({ error: 'Failed to fetch total posts' })
  }
}