import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import MoreStories from 'components/MoreStories'
import IntroTemplate from 'intro-template'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'

import { CMS_NAME } from '../lib/constants'
import Categories from './Categories'
import Footer from './Footer'
import Hero from './Hero'
import IndexTopTen from './IndexTopTen'
import ReviewHeader from './ReviewHeader'
import Welcome from './Welcome'

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
  //  console.log("PODTs ",heroPost )
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
					title={"Stories & Guides"}
					pattern={"hotelpattern"}
					summary={"It's all about the adventure"}
					animation={'/plane.json'}
				/>

          {posts.length > 0 && <MoreStories posts={posts} />}
        </Container>
      </Layout>
      <Footer />
    </>
  )
}
