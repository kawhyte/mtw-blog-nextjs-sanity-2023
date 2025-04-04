
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'

import { CMS_NAME } from '../lib/constants'
import Footer from './Footer'
import ReviewHeader from './ReviewHeader'
import TravelEssentialLayout from './TravelEssentialsLayout'


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
        <title>{CMS_NAME}</title>
        {/* <title> { `${CMS_NAME} - Travel and Food Reviews`}</title> */}
        </Head>
        {/* <Container> */}
          <BlogHeader title={title} description={description} level={1} />

          <ReviewHeader
					title={"Travel Gear and Gadgets"}

					summary={"Ready to upgrade your travel game? We put the latest travel gear and gadgets to the test! Get quick thumbs up/down verdicts and bite-sized reviews (think Twitter-short) to see what's worth packing for your next adventure."}
					img={'/top.json'}
				/>

          {posts.length > 0 && <TravelEssentialLayout posts={posts}  />}
        {/* </Container> */}
      </Layout>
      <Footer />
    </>
  )
}
