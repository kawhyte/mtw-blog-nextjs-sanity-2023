import { inter, oswald } from 'app/fonts'
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import MoreStoriesIndex from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import type { Arena, Esssential, Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import Link from 'next/link'

import { CMS_NAME } from '../lib/constants'
import Arenas from './Arenas'
import ArenasIndexPage from './ArenasIndexPage'
import Footer from './Footer'
import Hero from './Hero'
import IndexTopTen from './IndexTopTen'
import InstagramHighlights from './InstagramHighlights'
import TravelEssentialLayout from './TravelEssentialsLayout'
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
  //console.log("arenaPosts={arenaPosts} ",arenaPosts )
  //console.log('Essentialposts 1 ', Essentialposts)
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

          <ArenasIndexPage arenas={arenaPosts?.slice(0, 9)} />
          {/* <Welcome /> */}
          {/* <TravelEssentials /> */}

          <section className="container mx-auto px-10  py-14 text-gray-600 ">
            <div>
              <div className=" flex w-full  justify-between">
                <div>
                  <h1
                    className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
                  >
                    Our Travel Essential Picks
                  </h1>
                  <div className="h-1 w-20 rounded bg-pink-500"></div>
                  <p
                    className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
                  >
                    Traveling is a great way to experience new cultures and see
                    the world. However, packing for a trip can be daunting,
                    especially if you are trying to pack light. Here are a few
                    travel essentials that you should never leave home without:
                  </p>
                </div>
              </div>
            </div>

            <TravelEssentialLayout posts={Essentialposts?.slice(0, 6)} />

            <div className="flex justify-center  pt-9 lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex  ">
                <Link href="/essentials" passHref legacyBehavior>
                  <button
                    className={`${inter.variable} inline-flex items-center rounded-lg bg-pink-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:bg-pink-500 dark:hover:bg-pink-600 dark:focus:ring-pink-800 `}
                  >
                    More Travel Essentials
                    <svg
                      className="ml-2 h-3.5 w-3.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>

                  {/* <button
                    type="button"
                    className={`${inter.variable} font-secondary w-full px-4 py-2 text-center  text-xs font-semibold text-gray-500 transition duration-200 ease-in hover:underline md:text-base  `}
                  >
                    Show all
                  </button> */}
                </Link>
              </div>
            </div>
          </section>

          <div className=" container mx-auto my-10 mb-10 flex w-full flex-row justify-between px-10  ">
            <div className=" mb-6 lg:mb-0 lg:w-1/2 ">
              <h1
                className={`${oswald.variable}  title-font mb-3 font-heading text-3xl font-medium text-gray-900 sm:text-4xl`}
              >
                Our Latest Adventures
              </h1>

              <div className="h-1 w-20 rounded bg-pink-500"></div>
              <p
                className={` ${inter.variable} font-secondary mt-4 text-sm leading-relaxed md:text-base  lg:text-base `}
              >
                Check out some of the places we have been.
              </p>
            </div>
          </div>
          <div className="container mx-auto  px-10">
            {posts.length > 0 && <MoreStoriesIndex posts={posts.slice(0, 6)} />}

            <div className="flex justify-center  lg:mt-0 lg:flex-shrink-0">
              <div className=" inline-flex  ">
                <Link href="/hotel" passHref legacyBehavior>
                  {/* <button
                    type="button"
                    className={`${inter.variable} inline-flex justify-center align-middle font-secondary w-full rounded-full  border bg-pink-500 px-4  py-2 text-center text-base font-semibold text-white shadow-md transition duration-200 ease-in hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2  focus:ring-offset-pink-200`}
                  >
                    View more
                    <svg className="w-3.5 h-3.5 ml-2 mt-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
                  </button> */}

                  <button
                    className={`${inter.variable} inline-flex items-center rounded-lg bg-pink-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:bg-pink-500 dark:hover:bg-pink-600 dark:focus:ring-pink-800`}
                  >
                    More Adventures
                    <svg
                      className="ml-2 h-3.5 w-3.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </button>

                  {/* <button
                    type="button"
                    className={`${inter.variable} font-secondary w-full px-4 py-2 text-center  text-xs font-semibold text-gray-500 transition duration-200 ease-in hover:underline md:text-base  `}
                  >
                    Show all
                  </button> */}
                </Link>
              </div>
            </div>
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
