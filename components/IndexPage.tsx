import Container from 'components/BlogContainer'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import MoreStoriesIndex from 'components/MoreStories' // Your generic, paginated component
import * as demo from 'lib/demo.data'
// Import Post type and potentially the query used for the paginated components
import type {
  FoodReview,
  Guide,
  HotelReview,
  Settings,
} from 'lib/sanity.queries'
import type { YoutubeVideo } from 'lib/youtube'
// Removed legacy import - pagination is disabled on index page
import { BriefcaseConveyorBelt, Plane, Trophy } from 'lucide-react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Button from 'ui/Button'

const GearLottie = dynamic(
  () =>
    import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
)

import type { ArenaHighlightCard } from 'lib/sanity.queries'

import { CMS_NAME } from '../lib/constants'
import ArenaHighlights from './ArenaHighlights'
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
  posts: (Guide | HotelReview | FoodReview)[]
  settings: Settings
  youtubeVideos?: YoutubeVideo[]
  youtubeShorts?: YoutubeVideo[]
  arenas?: ArenaHighlightCard[]
}

export default function IndexPage(props: IndexPageProps) {
  const {
    preview,
    loading,
    posts,
    settings,
    youtubeVideos = [],
    youtubeShorts = [],
    arenas = [],
  } = props

  // This hero logic might conflict if posts is empty, handle gracefully
  const heroPost = posts?.[0] // Example: Safely access hero post if needed elsewhere
  const { title = demo.title, description = demo.description } = settings || {}

  // Calculate props needed for MoreStories, even though pagination is off
  const itemsPerPageForIndex = posts?.length || 6 // Set itemsPerPage >= number of posts
  const totalPostsForIndex = posts?.length || 0

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{CMS_NAME}</title>
        </Head>

        <BlogHeader title={title} description={description} level={1} />
        <Container>
          <Hero />

          <BlogSection className=" mt-24 ">
            <Welcome />
          </BlogSection>

          {arenas.length > 0 && (
            <BlogSection className="bg-indigo-50 py-10 md:py-14 mb-10 md:mb-14">
              <ArenaHighlights arenas={arenas} />
            </BlogSection>
          )}

          <BlogSection className="bg-pink-100 py-10 md:py-14">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
              {/* Left: text + button */}
              <div className="flex w-full flex-col lg:w-1/2">
                <SectionTitle
                  header={'Travel Gear and Gadgets'}
                  description={`Our tried-and-tested gear we pack  for NBA games, cruises, day trips, and beyond.`}
                />
                <div className="flex pt-9 lg:mt-0 lg:shrink-0">
                  <div className="flex flex-col gap-3 md:flex-row md:gap-6 px-6 w-full">
                    <Button
                      icon={<Plane className="text-pink-500" />}
                      link={'/essentials'}
                    >
                      See What We Pack
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right: Lottie animation — mirrors IndexTopTen layout */}
              <div className="mt-12 w-full hidden lg:flex lg:w-1/2 lg:justify-center lg:items-center lg:mt-0">
                <div className="w-full max-w-[220px]">
                  <GearLottie
                    autoplay
                    loop
                    src={'/plane.json'}
                    className="w-full h-auto"
                  />
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
                paginatedQuery={null} // Not used since showPagination=false
                // Explicitly disable pagination and control rating display
                showPagination={false}
                showRating={true}
              />
            )}

            {/* You might want a button linking to the actual paginated page */}
            <div className="flex justify-center  pt-9 lg:mt-0 lg:shrink-0">
              <div className="w-fit">
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
              'bg-linear-to-r from-indigo-200 via-pink-200 to-yellow-50 py-10 md:py-14'
            }
          >
            <IndexTopTen />
          </BlogSection>

          <BlogSection className={undefined}>
            <YoutubeHighlights
              videos={youtubeVideos}
              featuredVideo={settings?.featuredVideo}
              shorts={youtubeShorts}
            />
          </BlogSection>
        </Container>
      </Layout>
      <Footer />
    </>
  )
}
