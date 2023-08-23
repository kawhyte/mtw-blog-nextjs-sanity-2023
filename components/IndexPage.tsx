import { inter } from 'app/fonts'
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import MoreStoriesIndex from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import dynamic from 'next/dynamic'
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
const ReactPlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})

let instagram = [
  {
    url: 'https://www.instagram.com/p/CqzLI_or4QD/',
  },
  {
    url: 'https://www.instagram.com/p/CtDelhSOMYc/',
  },
  {
    url: 'https://www.instagram.com/p/CtSc9f5rTcL/',
  },
  {
    url: 'https://www.instagram.com/p/CuaSdGqvqf8/',
  },
  {
    url: 'https://www.instagram.com/p/CrW6zyzPxVK/',
  },
  {
    url: "https://www.instagram.com/p/CuR4F1auNjp/",
  },
]

let walking = [
  {
    url: 'https://youtu.be/U1zTABvzInk',
  },
  {
    url: 'https://youtu.be/WOX5m1Z0DoY',
  },
  {
    url: 'https://youtu.be/YGXaztMYl3M',
  },
  {
    url: 'https://youtu.be/TietUAnVBoA',
  },
]
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

            <div className="lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex  ">
                <Link href="/hotel" passHref legacyBehavior>
                  <button
                    type="button"
                    className={`${inter.variable} w-full px-4 py-2 text-center font-secondary  text-xs font-semibold text-gray-500 transition duration-200 ease-in hover:underline md:text-base  `}
                  >
                    Show all
                  </button>
                </Link>
              </div>
            </div>
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
            {instagram.map((item) => (
              <div key={item.url}>
                <InstagramEmbed url={item.url} width={328} />
              </div>
            ))}
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
          <div className="grid-col-1 grid justify-items-center gap-5 rounded-lg sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {walking.map((item) => (
              <div key={item.url}>
                <ReactPlayer
                  // className="react-player"
                  url={item.url}
                  width={351}
                  height={197}
                  controls={false}
                  light
                  loop
                  muted
                />
              </div>
            ))}
          </div>
        </div>
        {/* <IntroTemplate /> */}
      </Layout>
      <Footer />
    </>
  )
}
