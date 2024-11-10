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
          <BlogHeader title={title} description={description} level={1} />
        <Container>

          <Hero  />

          <BlogSection className=" mt-56 ">
          <Welcome /></BlogSection>

         
          <BlogSection className="bg-gray-100">
            <SectionTitle
              header={'Our Travel Essential Reviews'}
              description={` Traveling is a great way to experience new cultures and see the world. However, packing for a trip can be
                        daunting, especially if you are trying to pack light.
                        Check out a few travel essentials that you should never
                        leave home without.`}
            />

            <div className="flex   pt-9 lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex  ">
                <Button link={'/essentials'}>Travel Essentials Reviews</Button>
              </div>
            </div>
          </BlogSection>

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

          <BlogSection
            className={
              'my-24 bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-50 md:mt-24'
            }
          >
            <ArenasIndexPage arenas={arenaPosts?.slice(0, 8)} />
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
