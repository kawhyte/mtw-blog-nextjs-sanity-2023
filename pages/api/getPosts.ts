import { NextApiRequest, NextApiResponse } from 'next'
import { sanityClient } from 'lib/sanity.server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        query = `
          *[_type == "post"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id,
            _type,
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
        resultKey = 'posts'
        break
      case 'all':
      default:
        // Fetch all content types together
        const [posts, hotelReviews, foodReviews, guides] = await Promise.all([
          sanityClient.fetch(`*[_type == "post"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id, _type, title, slug, coverImage, date, author, excerpt2, location, category, linkType
          }`),
          sanityClient.fetch(`*[_type == "hotelReview"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id, _type, title, slug, coverImage, date, location, category
          }`),
          sanityClient.fetch(`*[_type == "foodReview"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id, _type, title, slug, coverImage, date, location, diningType
          }`),
          sanityClient.fetch(`*[_type == "guide"] | order(_createdAt desc) [${start}...${+start + +limit}] {
            _id, _type, title, slug, coverImage, date, category
          }`)
        ])
        
        return res.status(200).json({
          content: {
            posts,
            hotelReviews,
            foodReviews,
            guides
          },
          total: posts.length + hotelReviews.length + foodReviews.length + guides.length
        })
    }

    const content = await sanityClient.fetch(query)
    res.status(200).json({ [resultKey]: content })
  } catch (error) {
    console.error('Error fetching content:', error)
    res.status(500).json({ error: 'Failed to fetch content' })
  }
}