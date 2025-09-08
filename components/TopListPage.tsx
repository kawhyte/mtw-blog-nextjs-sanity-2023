import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import * as demo from 'lib/demo.data'
import { getSettings, getTopWeightedHotelReviews } from 'lib/sanity.client'
import type { HotelReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from 'next/head'

import { CMS_NAME } from '../lib/constants'
import Footer from './Footer'
import ReviewHeader from './ReviewHeader'
import TopListItems from './TopListItems'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: any[] // Made generic to accept Post[] or HotelReview[]
  settings: Settings
  postHeader: string
  img: string
  summary: string
  contentType?: 'post' | 'hotel' | 'food' // Add contentType prop
}

let count = 2

export default function IndexPage(props: IndexPageProps) {
  const {
    preview,
    loading,
    posts,
    settings,
    postHeader,
    img,
    summary,
    contentType = 'post',
  } = props
  const { title = demo.title, description = demo.description } = settings || {}

  // Define a reusable function to filter and sort posts by linkType and rating.
  // const getTopPostsByType = (posts, linkType) => {
  //   return posts
  //     .filter((post) => post?.linkType === linkType)
  //     .sort((a, b) => {
  //       const ratingA = a?.weightedAverageRating ?? 0
  //       const ratingB = b?.weightedAverageRating ?? 0
  //       return ratingB - ratingA // Sort descending by rating
  //     })
  // }

  // Use the reusable function to get top hotels and restaurants.
  // const topHotels = getTopPostsByType(posts, 'hotel')
  // const topRestaurants = getTopPostsByType(posts, 'food')

  // console.log('topRestaurants1', topRestaurants)

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Head>
          <title>{CMS_NAME}</title>
        </Head>

        <BlogHeader title={title} description={description} level={1} />

        <ReviewHeader
          title={postHeader}
          summary={summary || 'Our top picks'}
          img={img}
        />

        {posts.length > 0 && (
          <>
            <TopListItems posts={posts} contentType={contentType} />
          </>
        )}
        {/* {topHotels.length > 0 && (
          <>
            <TopListItems posts={topHotels} />

            
            {topRestaurants.length > 0 && (
              <>
                <TopListItems posts={topRestaurants} />
                <section></section>
              </>
            )}
          </>
        )} */}
      </Layout>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps<IndexPageProps> = async (
  context,
) => {
  const { preview = false } = context
  const settings = await getSettings()
  const topWeightedHotelPosts = await getTopWeightedHotelReviews() // Fetch the top weighted hotels

  return {
    props: {
      preview,
      loading: preview,
      posts: topWeightedHotelPosts, // Pass the top weighted hotels as 'posts'
      settings,
      postHeader: 'Top Hotels and Restaurants', // Add the missing postHeader property
      img: '/top2.json',
      summary:
        'Our top 10 hotels based on weighted average ratings, and our curated food guide. Discover the best experiences for your next adventure.',
    },
    revalidate: 10,
  }
}
