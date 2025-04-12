
import Container from 'components/BlogContainer'
// BlogHeader might be redundant if Hero covers the top section well
// import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import MoreStoriesIndex from 'components/MoreStories' // Your generic, paginated component
import * as demo from 'lib/demo.data'
// Import Post type and potentially the query used for the paginated components
import type { Post, Settings } from 'lib/sanity.queries'
import { paginatedAllPostsQuery } from 'lib/sanity.queries' // Import a valid query as a placeholder
import { BriefcaseConveyorBelt, Plane, Trophy } from 'lucide-react'
import Head from 'next/head'
import Button from 'ui/Button'

import { CMS_NAME } from '../lib/constants'
import BlogHeader from './BlogHeader'
import BlogSection from './BlogSection'
import Footer from './Footer'
import Hero from './Hero'
import IndexTopTen from './IndexTopTen'
import SectionTitle from './SectionTitle'
import Welcome from './Welcome'
import YoutubeHighlights from './YoutubeHighlights'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[] // These are the initial posts for the index page (e.g., first 6)
  settings: Settings
  // Add other props if needed (like arenaPosts, etc.)
  // arenaPosts?: Arena[]
}

export default function IndexPage(props: IndexPageProps) {
  const {
    preview,
    loading,
    posts, // Contains the limited set of posts for the index page
    settings,
    // arenaPosts,
  } = props

  // This hero logic might conflict if posts is empty, handle gracefully
  const heroPost = posts?.[0]; // Example: Safely access hero post if needed elsewhere
  const { title = demo.title, description = demo.description } = settings || {}

  // Calculate props needed for MoreStories, even though pagination is off
  const itemsPerPageForIndex = posts?.length || 6; // Set itemsPerPage >= number of posts
  const totalPostsForIndex = posts?.length || 0;

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{CMS_NAME}</title>
        </Head>
        {/* Removed BlogHeader, assuming Hero covers this */}
        <BlogHeader title={title} description={description} level={1} />
        <Container>
          <Hero />

          <BlogSection className=" mt-24 ">
            <Welcome />
          </BlogSection>

          <BlogSection className="bg-gray-100">
            <div>
              <SectionTitle
                header={'Travel Gear and Gadgets'}
                description={`Speedy thumbs up/down ratings and bite-sized, Twitter-style reviews of travel gadgets. Discover what truly enhances your adventures with our concise assessments.`}
              />
              <div className="flex   pt-9 lg:mt-0 lg:flex-shrink-0">
                <div className=" inline-flex px-5  ">
                  <Button
                    icon={<Plane className="text-pink-500" />}
                    link={'/essentials'}
                  >
                    Gear and Gadgets Reviews
                  </Button>
                </div>
              </div>
            </div>
          </BlogSection>

          <BlogSection className={''}>
            <SectionTitle
              header={'Our Latest Adventures'}
              description={'Check out some of the places we have been.'}
            />

            {/* --- Updated MoreStoriesIndex Call --- */}
            {posts && posts.length > 0 && (
              <MoreStoriesIndex
                // Pass required props, calculated for non-pagination display
                initialPosts={posts}
                totalPostsCount={totalPostsForIndex}
                itemsPerPage={itemsPerPageForIndex} // Ensures totalPages <= 1
                paginatedQuery={paginatedAllPostsQuery} // Provide a valid query (won't be used if showPagination=false or totalPages=1)
                // Explicitly disable pagination and control rating display
                showPagination={false}
                showRating={true}
              />
            )}

            {/* You might want a button linking to the actual paginated page */}
            <div className="flex justify-center  pt-9 lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex ">
                <Button
                  icon={<BriefcaseConveyorBelt className="text-pink-500" />}
                  link="/hotels" // Link to the page that shows ALL reviews/guides with pagination
                >
                  More Adventures & Reviews
                </Button>
              </div>
            </div>
          </BlogSection>

          <BlogSection
            className={
              'bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-50'
            }
          >
            <IndexTopTen />
          </BlogSection>

          <BlogSection className={undefined}>
            <SectionTitle
              header={'Featured Videos'}
              description={'Walking Tour from our trips'}
            />
            <YoutubeHighlights />
          </BlogSection>

          {/* Example: Conditional Arena Section */}
          {/* {arenaPosts && arenaPosts.length > 0 && (
            <BlogSection
              className={
                'my-24 bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-50 md:mt-24'
              }
            >
              <ArenasIndexPage arenas={arenaPosts.slice(0, 8)} />
            </BlogSection>
          )} */}

        </Container>
      </Layout>
      <Footer />
    </>
  )
}


// IMPORTANT: getStaticProps for this IndexPage should fetch a LIMITED number of posts
// using a query like `indexQuery` or similar, NOT all posts.

// Example getStaticProps (ensure yours fetches limited posts):
/*
export const getStaticProps: GetStaticProps<IndexPageProps> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  // Fetch settings and the LIMITED posts for the index page (using indexQuery)
  const [settings, posts = []] = await Promise.all([
    getSettings(),
    getIndexPosts() // Use function that fetches limited posts (e.g., via indexQuery)
    // Fetch other needed data like arenaPosts, essentialPosts if uncommented
  ])

  return {
    props: {
      posts,
      settings,
      preview,
      token: previewData.token ?? null,
      // arenaPosts, // Pass other data if fetched
    },
    revalidate: 60 // Or your desired revalidation time
  }
}
*/