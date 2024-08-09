import { inter, oswald } from 'app/fonts'
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import MoreStoriesIndex from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import type { Arena, Esssential, Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import Button from 'ui/Button'

import { CMS_NAME } from '../lib/constants'
import ArenasIndexPage from './ArenasIndexPage'
import Footer from './Footer'
import Hero from './Hero'
import IndexTopTen from './IndexTopTen'
import Welcome from './Welcome'
import YoutubeHighlights from './YoutubeHighlights'
import SectionTitle from './SectionTitle'
import BlogSection from './BlogSection'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  Essentialposts: Esssential[]
  arenaPosts: Arena[]
  settings: Settings
  instagram: any
}

export default function IndexPage(props: IndexPageProps) {
  const {
    preview,
    loading,
    posts,
    Essentialposts,
    arenaPosts,
    settings,
    instagram,
  } = props
  const [heroPost, ...morePosts] = posts || []
  const { title = demo.title, description = demo.description } = settings || {}

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{CMS_NAME}</title>
          {/* <title> { `${CMS_NAME} - Travel and Food Reviews`}</title> */}
        </Head>
        <Container>
          <BlogHeader title={title} description={description} level={1} />

          <Hero />
          <Welcome />

          <BlogSection
            className={
              'bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-50 my-24 md:mt-24'
            }
          >
            <ArenasIndexPage arenas={arenaPosts?.slice(0, 9)} />
          </BlogSection>
          {/* <section className="container mx-auto  rounded-2xl  bg-gray-100 px-10  py-14 text-gray-600 lg:mb-24  ">
            <div className="flex-cols flex flex-row-reverse justify-between "> */}
          <BlogSection className="bg-gray-100">
            {/* <h1
                        className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
                      >
                        Our Travel Essential Reviews
                      </h1>
                      <div className="h-1 w-20 rounded bg-pink-500"></div> */}
            <SectionTitle
              header={'Our Travel Essential Reviews'}
              description={` Traveling is a great way to experience new cultures and see the world. However, packing for a trip can be
                        daunting, especially if you are trying to pack light.
                        Check out a few travel essentials that you should never
                        leave home without.`}
            />

            {/* <p
                        className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
                      >
                        Traveling is a great way to experience new cultures and
                        see the world. However, packing for a trip can be
                        daunting, especially if you are trying to pack light.
                        Check out a few travel essentials that you should never
                        leave home without.
                      </p> */}

            {/* </div> */}

            {/* <TravelEssentialLayout posts={Essentialposts?.slice(0, 4)} /> */}

            <div className="flex   pt-9 lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex  ">
                <Button link={'/essentials'}>Travel Essentials Reviews</Button>
              </div>
            </div>
          </BlogSection>
          {/* </section> */}

          {/* <div className=" container mx-auto my-10 mb-10 flex w-full flex-row justify-between px-10  ">
            <div className=" mb-6 lg:mb-0 lg:w-1/2 "> */}
          {/* <h1
                className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Our Latest Adventures
              </h1> */}

          {/* <div className="h-1 w-20 rounded bg-pink-500"></div> */}

          {/* </div>
          </div> */}
          <BlogSection className={''}>
            <SectionTitle
              header={'Our Latest Adventures'}
              description={'Check out some of the places we have been.'}
            />

            {posts.length > 0 && (
              <MoreStoriesIndex
                posts={posts.slice(0, 6)}
                showPagination={false}
              />
            )}

            <div className="flex   pt-9 lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex ">
                <Button link="/hotel">More Adventures</Button>
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

          {/* <Categories /> */}
          <BlogSection className={undefined}>
            <SectionTitle
              header={'Featured Videos'}
              description={'Walking Tour from our trips'}
            />
            <YoutubeHighlights />
          </BlogSection>

          {/* <SneakersIndexPage arenas={undefined} /> */}
          {/* <InstagramHighlights instagram={instagram.data} /> */}
        </Container>

        {/* <IntroTemplate /> */}
      </Layout>
      <Footer />
    </>
  )
}
