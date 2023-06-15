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

import { CMS_NAME } from '../lib/constants'
import Footer from './Footer'
import ReviewHeader from './ReviewHeader'

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

  // console.log('NEW!7', posts[0].recommendations[0].post)
  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>Travel and Food Reviews by {CMS_NAME}</title>
        </Head>
        <Container>
          <BlogHeader title={title} description={description} level={1} />

          <ReviewHeader
            title={'Our Top Picks'}
            pattern={'foodpattern'}
            summary={
              'We visited over 100 hotels and restaurants over the past few years, these are our top picks for the best service, location and value.'
            }
            animation={'/top.json'}
          />

          {posts.length > 0 && (
            <>
              <section className="body-font mb-6 text-gray-600 ">
                <div className="container  mx-auto flex flex-col items-center justify-center px-5 py-10">
                  <div className=" mb-4 rounded-xl border-8 border-yellow-300 bg-white md:p-6  ">
                    <Link
                      // as={`/posts/${numberOne.slug}`}
                      href={`/posts/${posts[0].recommendations[0].post.slug.current}`}
                      // aria-label={numberOne.title}
                      className="block h-full w-full"
                    >
                      <p className="absolute   z-10 m-2 rounded-xl bg-yellow-300 px-2  text-xl font-medium text-black md:text-2xl ">
                        1
                      </p>
                      <Image
                        width={940}
                        height={470}
                        blurDataURL={urlForImage(
                          posts[0].recommendations[0].post.coverImage.asset._ref
                        )
                          .width(1240)
                          .height(744)
                          .quality(1)
                          .format('webp')
                          .url()}
                        placeholder="blur"
                        alt={`Cover Image for ${posts[0].recommendations[0].title}`}
                        className=" relative block object-cover  object-center md:rounded-xl  "
                        src={urlForImage(
                          posts[0].recommendations[0].post.coverImage.asset._ref
                        )
                          .width(1240)
                          .height(744)
                          .format('webp')
                          .url()}
                      />
                    </Link>
                    <div className=" my-4 w-full cursor-pointer px-2 text-left">
                      <Link
                        as={`/posts/${posts[0].recommendations[0].post.coverImage.asset._ref}`}
                        href={`/posts/${posts[0].recommendations[0].post.coverImage.asset._ref}`}
                        aria-label={posts[0].recommendations[0].title}
                        className="block h-full w-full"
                      >
                        <h1 className="title-font mb-4 text-xl font-medium text-gray-900 sm:text-4xl">
                          {posts[0].recommendations[0].post.title}
                        </h1>
                        <p className="text-md  truncate font-light text-gray-500">
                          {posts[0].recommendations[0].post.location}
                        </p>
                      </Link>
                      {/*<PostBody className="line-clamp-3" content={numberOne.blurb} />*/}
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 xl:grid-cols-3">
                {posts[0].recommendations.slice(1, 20).map(
                  (item, i) =>
                    // item.linkType === type &&
                    count <= 10 && (
                      <div
                        key={item._id}
                        className="h-90 m-auto w-60 cursor-pointer overflow-hidden rounded-lg shadow-lg md:w-80"
                      >
                        <div className="relative">
                          <Link
                            as={`/posts/${item.post.slug.current}`}
                            href={`/posts/${item.post.slug.current}`}
                            aria-label={item.title}
                            className="block h-full w-full"
                          >
                            <p className="absolute z-10 m-2 rounded-xl bg-white px-2 text-xl font-medium text-black md:text-xl">
                              {count++}
                            </p>
                            <Image
                              width={1240}
                              height={770}
                              blurDataURL={urlForImage(
                                item.post.coverImage.asset._ref
                              )
                                .width(1240)
                                .height(744)
                                .quality(1)
                                .format('webp')
                                .url()}
                              placeholder="blur"
                              alt={`Cover Image for ${item.title}`}
                              className=" block object-cover object-center  "
                              src={urlForImage(item.post.coverImage.asset._ref)
                                .width(1240)
                                .height(744)
                                .format('webp')
                                .url()}
                            />
                            <div className="w-full bg-white   p-4">
                              <p className="mb-2  truncate text-xl font-medium text-gray-800">
                                {item.post.title}
                              </p>
                              <p className="text-md  truncate font-light text-gray-500">
                                {item.post.location}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )
                )}
              </div>
            </>
          )}
        </Container>
        {/* <IntroTemplate /> */}
      </Layout>
      <Footer />
    </>
  )
}
