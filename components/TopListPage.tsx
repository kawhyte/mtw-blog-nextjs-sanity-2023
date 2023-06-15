import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import MoreStories from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import type { Post, Recommendation,Settings } from 'lib/sanity.queries'
import Head from 'next/head'
import Link from 'next/link'

import { CMS_NAME } from '../lib/constants'
import Footer from './Footer'
import ReviewHeader from './ReviewHeader'
import Image from 'next/image'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Recommendation[]
  settings: Settings
 
}

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, posts, settings } = props
  const [heroPost, ...morePosts] = posts || []
  const { title = demo.title, description = demo.description } = settings || {}
  
  console.log("NEW!6", posts[0].recommendations[1].post.coverImage.asset._ref)
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
				title={"Our Top Picks"}
				pattern={"foodpattern"}
				summary={"We visited over 100 hotels and restaurants over the past few years, these are our top picks for the best service, location and value."}
				animation={'/top.json'}
			/>

          {posts.length > 0 && 
          
          
          
          
          
          
          






          <section className='text-gray-600 body-font mb-6 '>
						<div className='container  mx-auto flex px-5 py-10 items-center justify-center flex-col'>
							<div className=' border-8 bg-white border-yellow-300 md:p-6 mb-4 rounded-xl  '>
								
							<Link
                                // as={`/posts/${numberOne.slug}`}
                                href='/posts/[slug]'
                                // aria-label={numberOne.title}
                                className='w-full block h-full'>

                                <p className='text-black   absolute text-xl md:text-2xl font-medium bg-yellow-300  rounded-xl z-10 px-2 m-2 '>
                                        1
                                    </p>
                                <Image
									width={940}
									height={470}
									blurDataURL={urlForImage(posts[0].recommendations[1].post.coverImage.asset._ref)
										.width(1240)
										.height(744)
										.quality(1)
										.format("webp")
										.url()}
									placeholder='blur'
									alt={`Cover Image for ${posts[0].recommendations[0].title}`}
									className=' object-cover object-center block  relative md:rounded-xl  '
									src={urlForImage(posts[0].recommendations[1].post.coverImage.asset._ref)
										.width(1240)
										.height(744)
										.format("webp")
										.url()}
								/> 
                            </Link>
								<div className=' px-2 w-full my-4 cursor-pointer text-left'>
									<Link
                                        as={`/posts/${posts[0].recommendations[1].post.coverImage.asset._ref}`}
                                        href={`/posts/${posts[0].recommendations[1].post.coverImage.asset._ref}`}
                                        aria-label={posts[0].recommendations[0].title}
                                        className='w-full block h-full'>

                                        <h1 className='title-font text-xl sm:text-4xl mb-4 font-medium text-gray-900'>
                                            {posts[0].recommendations[1].post.title}
                                        </h1>
                                        <p className='text-gray-500  font-light text-md truncate'>
                                            {posts[0].recommendations[1].post.location}
                                        </p>

                                    </Link>
									{/*<PostBody className="line-clamp-3" content={numberOne.blurb} />*/}
								</div>
							</div>
						</div>
					</section>
                }
        </Container>
        {/* <IntroTemplate /> */}
      </Layout>
      <Footer />
    </>
  )
}
