import { sanityClient } from 'lib/sanity.server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { start = 0, limit = 12, type = 'all' } = req.query

  try {
    let query: string
    let resultKey: string

    switch (type) {
      case 'hotel':
        query = `
          *[_type == "hotelReview"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id,
            _type,
            title,
            slug,
            coverImage,
            date,
            location,
            category,
            hotelRating
          }
        `
        resultKey = 'hotelReviews'
        break
      case 'food':
        query = `
          *[_type == "foodReview"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id,
            _type,
            title,
            slug,
            coverImage,
            date,
            location,
            diningType,
            foodRating,
            takeoutRating
          }
        `
        resultKey = 'foodReviews'
        break
      case 'guide':
        query = `
          *[_type == "guide"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id,
            _type,
            title,
            slug,
            coverImage,
            date,
            category
          }
        `
        resultKey = 'guides'
        break
      case 'post':
        // Legacy post support removed - redirect to 'all' instead
        return res.status(400).json({ 
          error: 'Legacy post type no longer supported. Use hotel, food, guide, or all instead.' 
        })
      case 'all':
      default:
        // Fetch all content types together (excluding legacy posts)
        const [hotelReviews, foodReviews, guides] = await Promise.all([
          sanityClient.fetch(`*[_type == "hotelReview"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id, _type, title, slug, coverImage, date, location, category, hotelRating
          }`),
          sanityClient.fetch(`*[_type == "foodReview"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id, _type, title, slug, coverImage, date, location, diningType, foodRating, takeoutRating
          }`),
          sanityClient.fetch(`*[_type == "guide"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id, _type, title, slug, coverImage, date, category
          }`),
        ])

        return res.status(200).json({
          content: {
            hotelReviews,
            foodReviews,
            guides,
          },
          total:
            hotelReviews.length +
            foodReviews.length +
            guides.length,
        })
    }

    const content = await sanityClient.fetch(query)
    res.status(200).json({ [resultKey]: content })
  } catch (error) {
    console.error('Error fetching content:', error)
    res.status(500).json({ error: 'Failed to fetch content' })
  }
}
