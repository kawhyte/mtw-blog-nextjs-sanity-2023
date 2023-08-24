import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import MoreStories from 'components/MoreStories'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'

import { CMS_NAME } from '../lib/constants'
import Footer from './Footer'
import ReviewHeader from './ReviewHeader'


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
          <title>{CMS_NAME} - Travel and Food Reviews</title>
        </Head>
        <Container>
          <BlogHeader title={title} description={description} level={1} />

          <ReviewHeader
            title={'Stuff We Like'}
            pattern={'pattern'}
            summary={
              'From sneakers to to the latest Game consoles... here you will find random items that we love ❤️'
            }
            animation={'/all.json'}
          />

          {posts.length > 0 && <MoreStories posts={posts} />}
        </Container>

      </Layout>
      <Footer />
    </>
  )
}
