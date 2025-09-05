import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2022-11-15',
  useCdn: false
})

async function checkPost() {
  try {
    console.log('Checking for MatCHA Chai Brunch post...\n')
    
    // Check if it exists as foodReview (new structure)
    const foodReview = await client.fetch(`*[_type == "foodReview" && title match "*MatCHA Chai Brunch*"][0]{ _id, title, _type, date }`)
    console.log('Food Review (new structure):', foodReview)
    
    // Check if it exists as legacy post
    const legacyPost = await client.fetch(`*[_type == "post" && title match "*MatCHA Chai Brunch*"][0]{ _id, title, _type, linkType, date }`)
    console.log('Legacy Post:', legacyPost)
    
    // Check what the index page would actually fetch
    const latestContent = await client.fetch(`{
      "allContent": [
        ...*[_type == "guide"] | order(date desc) [0...10] { _id, title, _type, date },
        ...*[_type == "hotelReview"] | order(date desc) [0...10] { _id, title, _type, date },
        ...*[_type == "foodReview"] | order(date desc) [0...10] { _id, title, _type, date }
      ] | order(date desc) [0...6]
    }`)
    
    console.log('\nLatest content from index query:')
    latestContent.allContent.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} (${item._type}) - ${item.date}`)
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkPost()