import { inter, oswald } from 'app/fonts'
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import MoreStoriesIndex from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import Link from 'next/link'

import { CMS_NAME } from '../lib/constants'
import Footer from './Footer'
import Hero from './Hero'
import IndexTopTen from './IndexTopTen'
import InstagramHighlights from './InstagramHighlights'
import TravelEssentials from './TravelEssentials'
import Welcome from './Welcome'
import YoutubeHighlights from './YoutubeHighlights'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  settings: Settings
  instagram: any
}

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, posts, settings, instagram } = props
  const [heroPost, ...morePosts] = posts || []
  const { title = demo.title, description = demo.description } = settings || {}
  // console.log("PODTs ",heroPost )
  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{CMS_NAME} - Travel and Food Reviews </title>
        </Head>
        <Container>
          <BlogHeader title={title} description={description} level={1} />

          <Hero />
          <Welcome />
          <TravelEssentials />

          {/* {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt2={heroPost.excerpt2}
              hotelRating={heroPost.hotelRating}
              location={heroPost.location}
            />
          )} */}

          {/* <div className=" container mx-auto mb-10 flex w-full flex-wrap">
            <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
              <h1 className="font-fancy  title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
                More Articles
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
            </div>
          </div> */}

          <div className=" container mx-auto my-10 mb-10 flex w-full flex-row justify-between px-10  ">
            <div className=" mb-6 lg:mb-0 lg:w-1/2 ">
              <h1
                className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Our Latest Adventures
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
            </div>

            <div className="lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex  ">
                <Link href="/hotel" passHref legacyBehavior>
                  <button
                    type="button"
                    className={`${inter.variable} font-secondary w-full px-4 py-2 text-center  text-xs font-semibold text-gray-500 transition duration-200 ease-in hover:underline md:text-base  `}
                  >
                    Show all
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="container mx-auto  px-10">
            {posts.length > 0 && <MoreStoriesIndex posts={posts.slice(0, 6)} />}
          </div>
          <IndexTopTen />

          {/* <Categories /> */}

          <YoutubeHighlights />
        </Container>
        {/* <InstagramHighlights instagram={instagram.data} /> */}

        {/* <IntroTemplate /> */}
      </Layout>
      <Footer />
    </>
  )
}
