
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import FoodRatings from 'components/IndividualFoodRating'

import PostBody from 'components/PostBody'
import PostHeader from 'components/PostHeader'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'

import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'

import Footer from './Footer'
import Gallery from './Gallery'
import ProConList from './ProConList'
import RoomTech from './RoomTech'
import Youtube from './Youtube'

export interface PostPageProps {
  preview?: boolean
  loading?: boolean
  post: Post
  morePosts: Post[]
  settings: Settings
}

const NO_POSTS: Post[] = []

const renderLinkTypeComponent = (post: Post) => {
  switch (post.linkType) {
    case 'food':
      return (
        <>
          {post.individualFoodRating?.length > 0 && (
            <FoodRatings food={post.individualFoodRating} />
          )}
          <ProConList
            positives={post.positives}
            negatives={post.negatives}
            verdict2={post.verdict}
          />
        </>
      )
    case 'hotel':
      return (
        <>
          <ProConList
            positives={post.positives}
            negatives={post.negatives}
            verdict2={post.verdict}
          />
          <RoomTech
            techAvailable={post.techRating}
            speed={post.internetSpeed}
            roomAmenitiesAvailiable={post.roomAmenities}
          />
        </>
      )
    default:
      return null
  }
}

export default function PostPage(props: PostPageProps) {
  const { preview, loading, morePosts = NO_POSTS, post, settings } = props
  const { title = demo.title } = settings || {}

  if (!post?.slug && !preview) {
    notFound()
  }


  // Early return if post is not found
  if (!post) {
    return preview ? (
      <Layout preview={preview} loading={loading}>
        <PostTitle>Loading…</PostTitle>
      </Layout>
    ) : (
      notFound()
    )
  }

  const ratingCat = 
  post.linkType === 'food' 
    ? (post.diningType === 'takeout' ? post.takeoutRating : post.foodRating) 
    : post.hotelRating;


  return (
    <div>
      <PostPageHead settings={settings} post={post} />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />
        {/* <Container> */}
          <article className="container mx-auto flex flex-col justify-center items-start sm:pl-4 md:mt-10">
          <PostHeader
  title={post.title}
  coverImage={post.coverImage}
  date={post.date}
  location={post.location}
  room={post.room}
  linkType={post.linkType}         // Pass linkType
  diningType={post.diningType}     // Pass diningType
  excerpt2={post.excerpt2}
  // Pass each rating object directly under its own prop
  hotelRating={post.hotelRating}
  foodRating={post.foodRating}
  takeoutRating={post.takeoutRating}
  gallery={post.gallery}
  category={post.category}
  tip={post.tip}
/>

            {renderLinkTypeComponent(post)}

          </article>
          <div className='container mx-auto'> <PostBody content={post.content} /></div>  
            <Youtube link={post.youtube} />
            {post.gallery?.length > 0 && <Gallery posts={post} heading={''} />}
        {/* </Container> */}
        <Footer />
      </Layout>
    </div>
  )
}