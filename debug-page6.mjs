import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2022-11-15',
  useCdn: false
})

async function debugPagination() {
  try {
    console.log('Debugging hotel reviews pagination...\n')
    
    // Get total count
    const totalCount = await client.fetch(`count(*[_type == "hotelReview"])`)
    console.log('Total hotel reviews:', totalCount)
    
    const itemsPerPage = 12
    const totalPages = Math.ceil(totalCount / itemsPerPage)
    console.log('Items per page:', itemsPerPage)
    console.log('Total pages:', totalPages)
    
    // Check each page
    for (let page = 1; page <= Math.min(totalPages, 7); page++) {
      const start = (page - 1) * itemsPerPage
      const end = page * itemsPerPage
      
      const pageData = await client.fetch(`*[_type == "hotelReview"] | order(date desc) [${start}...${end}] {
        _id,
        title,
        date,
        coverImage,
        hotelRating
      }`)
      
      console.log(`\nPage ${page} (items ${start + 1}-${Math.min(end, totalCount)}):`)
      console.log(`  - Items returned: ${pageData.length}`)
      
      pageData.forEach((item, index) => {
        const hasImage = !!item.coverImage
        const hasRating = !!item.hotelRating
        const hasLongTitle = item.title && item.title.length > 50
        
        console.log(`  ${start + index + 1}. ${item.title?.substring(0, 40)}${item.title?.length > 40 ? '...' : ''} | Image: ${hasImage ? '✓' : '✗'} | Rating: ${hasRating ? '✓' : '✗'} | Long: ${hasLongTitle ? '✓' : '✗'}`)
      })
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

debugPagination()