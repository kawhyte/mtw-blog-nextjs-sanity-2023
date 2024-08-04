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
          <ArenasIndexPage arenas={arenaPosts?.slice(0, 9)} />

          <section className="container mx-auto  rounded-2xl  bg-gray-100 px-10  py-14 text-gray-600 lg:mb-24  ">
            <div className="flex-cols flex flex-row-reverse justify-between ">
              <div>
                <div>
                  <div className=" flex w-full  justify-between">
                    <div>
                      {/* <h1
                        className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
                      >
                        Our Travel Essential Reviews
                      </h1>
                      <div className="h-1 w-20 rounded bg-pink-500"></div> */}
<SectionTitle>{"Our Travel Essential Reviews"}</SectionTitle>

                      <p
                        className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
                      >
                        Traveling is a great way to experience new cultures and
                        see the world. However, packing for a trip can be
                        daunting, especially if you are trying to pack light.
                        Check out a few travel essentials that you should never
                        leave home without.
                      </p>
                    </div>
                  </div>
                </div>

                {/* <TravelEssentialLayout posts={Essentialposts?.slice(0, 4)} /> */}

                <div className="flex   pt-9 lg:mt-0 lg:flex-shrink-0">
                  <div className=" inline-flex  ">
                    <Button link={'/essentials'}>
                      Travel Essentials Reviews
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className=" container mx-auto my-10 mb-10 flex w-full flex-row justify-between px-10  ">
            <div className=" mb-6 lg:mb-0 lg:w-1/2 ">
              {/* <h1
                className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Our Latest Adventures
              </h1> */}

              {/* <div className="h-1 w-20 rounded bg-pink-500"></div> */}

              <SectionTitle>{"Our Latest Adventures"}</SectionTitle>
              <p
                className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
              >
                Check out some of the places we have been.
              </p>
            </div>
          </div>
          <div className="container mx-auto  px-10 ">
            {posts.length > 0 && <MoreStoriesIndex posts={posts.slice(0, 6)} />}

            <div className="flex justify-center  pt-10  lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex ">
                <Button link="/hotel">More Adventures</Button>
              </div>
            </div>
          </div>
          <IndexTopTen />

          {/* <Categories /> */}

          <YoutubeHighlights />

          {/* <SneakersIndexPage arenas={undefined} /> */}
          {/* <InstagramHighlights instagram={instagram.data} /> */}
        </Container>

        {/* <IntroTemplate /> */}
      </Layout>
      <Footer />
    </>
  )
}
