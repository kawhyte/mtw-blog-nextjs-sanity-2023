import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import MoreStories from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import type { Post, Recommendation, Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import post from 'schemas/post'

import { CMS_NAME } from '../lib/constants'
import Footer from './Footer'
import ReviewHeader from './ReviewHeader'
import TopListItems from './TopListItems'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Recommendation[]
  settings: Settings
}
let count = 2

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, posts, settings } = props
  const [heroPost, ...morePosts] = posts || []
  const { title = demo.title, description = demo.description } = settings || {}

  // const r = posts.filter(d => d.recommendations.every(c => posts.includes(c.id)));
  const hotels = posts.filter((word) => word.listType === 'hotel')
  const restaurants = posts.filter((word) => word.listType === 'food')

  //  console.log('NEW!7', posts[0].recommendations[0].post)
  //  console.log('NEW!7', posts[0])
  // console.log('result666', hotels[0]?.recommendations[0])
  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
        <title>{CMS_NAME}</title>
          {/* <title>{CMS_NAME}</title> */}
        </Head>
        <Container>
          <BlogHeader title={title} description={description} level={1} />

          <ReviewHeader
            title={'Our Top Picks'}
            arenas={[]}
            summary={
              'We visited over 100 hotels and restaurants over the past few years, these are our top picks for the best service, location and value.'
            }
            animation={'/relaxing.svg'}
          />

          {hotels.length > 0 && (
            <>
              <TopListItems posts={hotels}  />
              <TopListItems posts={restaurants}  />

        

              <section></section>
            </>
          )}
        </Container>
        {/* <IntroTemplate /> */}
      </Layout>
      <Footer />
    </>
  )
}

{
  /* <section className="body-font mb-6 text-gray-600 ">
                <div className="container  mx-auto flex flex-col items-center justify-center px-5 py-10">
                  <div className=" mb-4 rounded-xl border-8 border-yellow-300 bg-white md:p-6  ">
                    <Link
                    
                      href={`/posts/${hotels[0].recommendations[0].post.slug.current}`}
                    
                      className="block h-full w-full"
                    >
                      <p className="absolute   z-10 m-2 rounded-lg bg-yellow-300 px-2  text-xl font-medium text-black md:text-2xl ">
                        1
                      </p>
                      <Image
                        width={440}
                        height={470}
                        blurDataURL={urlForImage(
                          hotels[0]?.recommendations[0]?.post?.coverImage?.asset
                            ?._ref
                        )
                          .width(1240)
                          .height(744)
                          .quality(1)
                          .format('webp')
                          .url()}
                        placeholder="blur"
                        alt={`Cover Image for ${hotels[0].recommendations[0].title}`}
                        className=" relative block object-cover  object-center md:rounded-xl  "
                        src={urlForImage(
                          hotels[0].recommendations[0].post.coverImage.asset
                            ._ref
                        )
                          .width(1240)
                          .height(744)
                          .format('webp')
                          .url()}
                      />
                    </Link>
                    <div className=" my-4 w-full cursor-pointer px-2 text-left">
                      <Link
                        as={`/posts/${hotels[0].recommendations[0].post.coverImage.asset._ref}`}
                        href={`/posts/${hotels[0].recommendations[0].post.coverImage.asset._ref}`}
                        aria-label={hotels[0].recommendations[0].title}
                        className="block h-full w-full"
                      >
                        <h1 className="title-font mb-4 text-lg font-medium text-gray-900 sm:text-2xl">
                          {hotels[0].recommendations[0].post.title}
                        </h1>
                        <p className="text-md  truncate font-light text-gray-500">
                          {hotels[0].recommendations[0].post.location}
                        </p>
                      </Link>
                   
                    </div>
                  </div>
                </div>
              </section> */
}
