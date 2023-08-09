import { inter } from 'app/fonts'
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import MoreStoriesIndex from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import Link from 'next/link'
import {
  InstagramEmbed,
  TikTokEmbed,
  YouTubeEmbed,
} from 'react-social-media-embed'

import Categories from './Categories'
import Footer from './Footer'
import Hero from './Hero'
import IndexTopTen from './IndexTopTen'
import TravelEssentials from './TravelEssentials'
import Welcome from './Welcome'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  settings: Settings
}

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, posts, settings } = props
  const [heroPost, ...morePosts] = posts || []
  const { title = demo.title, description = demo.description } = settings || {}
  // console.log("PODTs ",heroPost )
  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
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

          <div className=" flex-wra container mx-auto my-16 mb-10 flex w-full flex-row justify-between  ">
            <div className=" mb-6 lg:mb-0 lg:w-1/2 ">
              <h1 className=" title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
                Our Latest Adventures
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
            </div>
            {/* 
            <div className="lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex rounded-md shadow ">
                <Link href="/hotel" passHref legacyBehavior>
                  <button
                    type="button"
                    className={`${inter.variable} font-secondary py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-xs md:text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg `}
                  >
                    View more
                  </button>
                </Link>
              </div>
            </div> */}

            {/* <div className="flex items-center ">
<Link href="/hotel" passHref legacyBehavior>
    <button type="button" className="  underline  hover:bg-indigo-100  text-indigo-500 hover:bg-indigo-100flex flex-row items-center text-base content-between text-gray-600 p-1 pr-4 pl-2 rounded-full">
      All Hotel Reviews
    </button></Link>
    <Link href="/food" passHref legacyBehavior>
    <button type="button" className="  underline  hover:bg-pink-100 text-pink-500 flex flex-row items-center text-base content-between text-gray-600 p-1 pr-4 pl-2 rounded-full">
      All Food Reviews
    </button></Link>
</div> */}
          </div>

          {posts.length > 0 && <MoreStoriesIndex posts={posts.slice(0, 8)} />}
          {/* <Categories /> */}
          <IndexTopTen />
          {/* <Categories /> */}
        </Container>
        <div className="rounded-xl bg-yellow-50 px-10 py-12 ">
          <div className=" container mx-auto mb-10 flex w-full flex-wrap">
            <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
              <h1 className="font-fancy  title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
                Featured Instagram Posts
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
            </div>
          </div>
          <div className="grid justify-items-center gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
            <div>
              <InstagramEmbed
                url="https://www.instagram.com/p/CqzLI_or4QD/"
                width={328}
              />
            </div>
            <div>
              <InstagramEmbed
                url="https://www.instagram.com/p/CuR4F1auNjp/"
                width={328}
              />
            </div>
            <div>
              <InstagramEmbed
                url="https://www.instagram.com/p/CtDelhSOMYc/"
                width={328}
              />
            </div>
            <div>
              <InstagramEmbed
                url="https://www.instagram.com/p/CtSc9f5rTcL/"
                width={328}
              />
            </div>
            <div>
              <InstagramEmbed
                url="https://www.instagram.com/p/CuaSdGqvqf8/"
                width={328}
              />
            </div>
            <div>
              <InstagramEmbed
                url="https://www.instagram.com/p/CrW6zyzPxVK/"
                width={328}
              />
            </div>
          </div>
        </div>

        <div className="my-12 rounded-xl bg-pink-50 px-10 py-12 ">
          <div className=" container mx-auto mb-10 flex w-full flex-wrap">
            <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
              <h1 className="font-fancy  title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
               Walking tours
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
            </div>
          </div>
          <div className="grid justify-items-center gap-5 grid-col-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
            <YouTubeEmbed
              url="https://youtu.be/U1zTABvzInk"
              width={425}
              height={220}
              
            />
            <YouTubeEmbed
              url="https://youtu.be/WOX5m1Z0DoY"
              width={425}
              height={220}
            />
            <YouTubeEmbed
              url="https://youtu.be/TietUAnVBoA"
              width={425}
              height={220}
            />
            <YouTubeEmbed
              url="https://youtu.be/YGXaztMYl3M"
              width={425}
              height={220}
            />
    
          </div>
        </div>
        {/* <div className="rounded-xl bg-pink-50 px-10 py-12 mt-12 ">
          <div className=" container mx-auto mb-10 flex w-full flex-wrap">
            <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
              <h1 className="font-fancy  title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
                Featured Youtube Videos
              </h1>
              <div className="h-1 w-20 rounded bg-pink-500"></div>
            </div>
          </div>
          <div className="grid grid-cols-3">
          <YouTubeEmbed url="https://www.youtube.com/watch?v=SsJd34yM0K4" width={425} height={220} />
          <YouTubeEmbed url="https://www.youtube.com/watch?v=SsJd34yM0K4" width={425} height={220} />
          <YouTubeEmbed url="https://www.youtube.com/watch?v=SsJd34yM0K4" width={425} height={220} />

          

          </div>
        </div> */}
        {/* <IntroTemplate /> */}
      </Layout>
      <Footer />
    </>
  )
}
