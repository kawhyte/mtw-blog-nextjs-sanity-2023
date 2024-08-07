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
import SectionSeparator from './SectionSeparator'

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

  const hotels = posts.filter((word) => word.listType === 'hotel')
  const restaurants = posts.filter((word) => word.listType === 'food')

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
              'Our top 10 hotels and food guide curates the best experiences. Luxurious stays, cozy retreats, gourmet feasts, and local flavors await. Let us inspire your next adventure.'
            }
            animation={'/relaxing.svg'}
          />

          {hotels.length > 0 && (
            <>
              <TopListItems posts={hotels}  />

              <SectionSeparator />
              <TopListItems posts={restaurants}  />

        

              <section></section>
            </>
          )}
        </Container>

      </Layout>
      <Footer />
    </>
  )
}

