import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead' // Keep if settings are used here
import MoreStories from 'components/MoreStories' // This component handles pagination internally now
import * as demo from 'lib/demo.data'
// Import Hotel type
import type { Hotel, Settings } from 'lib/sanity.queries' // Change Post to Hotel
import Head from 'next/head'

import { CMS_NAME } from '../lib/constants'
import Footer from './Footer'
import ReviewHeader from './ReviewHeader'

// --- Renamed and Updated Props Interface ---
export interface HotelReviewsPageProps {
  preview?: boolean
  loading?: boolean
  initialPosts: Hotel[]     // Renamed from posts, type changed to Hotel
  totalPostsCount: number   // Added total count
  itemsPerPage: number      // Added items per page
  settings: Settings
}

// --- Renamed Component ---
export default function HotelReviewsPage(props: HotelReviewsPageProps) {
  // --- Updated Props Destructuring ---
  const {
    preview,
    loading,
    initialPosts, // Use initialPosts
    totalPostsCount, // Use totalPostsCount
    itemsPerPage, // Use itemsPerPage
    settings,
   } = props

  // Remove hero post logic as MoreStories now handles the display list
  // const [heroPost, ...morePosts] = initialPosts || [] // <-- REMOVE THIS

  const { title = demo.title, description = demo.description } = settings || {}
  // console.log("Hotel Review Page Initial Posts:", initialPosts) // Log initial posts if needed

  return (
    <>
      {/* IndexPageHead likely uses settings, keep it if needed */}
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          {/* Update title if desired */}
          <title>{`Hotel Reviews - ${CMS_NAME}`}</title>
        </Head>
        {/* <Container> */}

          <BlogHeader title={title} description={description} level={1} />

          <ReviewHeader
            title={'Hotel Reviews'}
            arenas={[]} // Provide an empty array or appropriate value
            summary={
              'Discover honest reviews from real travelers. We’ve stayed in the hotels, experienced the good, the bad, and the ugly. No fluff, just real talk on everything from beds to breakfast. Let’s explore the world together, one hotel at a time!'
            }
            animation={'/sand.svg'} // Make sure this path is correct
          />

          {/* --- Update MoreStories Props --- */}
          {/* Render MoreStories only if there are posts potentially available */}
          {totalPostsCount > 0 ? (
            <MoreStories
              initialPosts={initialPosts} // Pass initial posts for page 1
              totalPostsCount={totalPostsCount} // Pass total count for pagination calculation
              itemsPerPage={itemsPerPage} // Pass items per page setting
              showPagination={true} // Keep pagination visible
              showRating={true} // Keep rating visible (adjust as needed)
            />
          ) : (
            // Optional: Display a message if no posts are found at all
            !loading && <Container><p className="text-center my-10">No hotel reviews found.</p></Container>
          )}
        {/* </Container> */}
        {/* <IntroTemplate /> */}
      </Layout>
      <Footer />
    </>
  )
}