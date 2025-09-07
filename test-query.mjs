import { createClient } from 'next-sanity'

// Basic client setup
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
})

const latestIndependentContentQuery = `
{
  "allContent": [
    ...*[_type == "guide"] | order(date desc) [0...10] {
      _id,
      title,
      date,
      coverImage,
      category,
      content,
      gallery,
      tags,
      "slug": slug.current,
      _type
    },
    ...*[_type == "hotelReview"] | order(date desc) [0...10] {
      _id,
      title,
      date,
      location,
      category,
      room,
      lounge,
      coverImage,
      excerpt2,
      blurbSource,
      blurbUrl,
      tip,
      gallery,
      youtube,
      hotelRating,
      internetSpeed,
      roomAmenities,
      techRating,
      positives,
      negatives,
      verdict,
      content,
      tags,
      "slug": slug.current,
      _type
    },
    ...*[_type == "foodReview"] | order(date desc) [0...10] {
      _id,
      title,
      date,
      location,
      diningType,
      coverImage,
      excerpt2,
      tip,
      individualFoodRating,
      gallery,
      youtube,
      foodRating,
      takeoutRating,
      positives,
      negatives,
      verdict,
      content,
      tags,
      "slug": slug.current,
      _type
    }
  ] | order(date desc) [0...6]
}`

console.log('Fetching latest independent content...')
try {
  const result = await client.fetch(latestIndependentContentQuery)
  console.log('Results:')
  console.log(JSON.stringify(result, null, 2))

  // Check for the specific post
  const matchingPost = result.allContent.find(
    (post) => post.title && post.title.includes('MatCHA Chai Brunch'),
  )

  if (matchingPost) {
    console.log('\n=== FOUND THE POST ===')
    console.log('Title:', matchingPost.title)
    console.log('Type:', matchingPost._type)
    console.log('ID:', matchingPost._id)
  } else {
    console.log('\n=== POST NOT FOUND in independent schemas ===')
    console.log('This means it must be coming from legacy posts or cache')
  }
} catch (error) {
  console.error('Error:', error)
}
