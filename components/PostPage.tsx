import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
// Import fallback components for legacy posts
import PostBody from 'components/PostBody'
import PostHeader from 'components/PostHeader'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'

import FoodReviewPage from './FoodReviewPage'
import Footer from './Footer'
import GuidePage from './GuidePage'
// Import the dedicated page components for each content type
import HotelReviewPage from './HotelReviewPage'
import ImageGallery from './ImageGallery'
import VideoPlayer from './Youtube'

export interface PostPageProps {
  preview?: boolean
  loading?: boolean
  post: Post
  morePosts: Post[]
  settings: Settings
}

export default function PostPage(props: PostPageProps) {
  const { preview, loading, morePosts, post, settings } = props

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

  // Route to appropriate dedicated page component based on linkType
  // Note: The new independent schemas (hotel, food, guide) should use their dedicated routes
  // This PostPage component now primarily handles legacy "favorite" posts

  switch (post.linkType) {
    case 'hotel':
      console.warn(
        'Legacy hotel post detected. Consider migrating to hotelReview schema:',
        post.slug,
      )
      // For legacy hotel posts, we can still use the old display logic or redirect
      // But ideally, these should be migrated to the new hotelReview schema
      break
    case 'food':
      console.warn(
        'Legacy food post detected. Consider migrating to foodReview schema:',
        post.slug,
      )
      // For legacy food posts, similar approach
      break
    case 'story':
      console.warn(
        'Legacy story post detected. Consider migrating to guide schema:',
        post.slug,
      )
      // For legacy story posts, similar approach
      break
  }

  // For now, render legacy posts using the original layout
  // This handles "favorite" posts and any remaining legacy posts
  const { title = demo.title } = settings || {}

  return (
    <div>
      <PostPageHead settings={settings} post={post} />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />
        <article className="container mx-auto px-4 py-12 md:px-6 lg:px-36 lg:py-20 xl:py-36">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            location={post.location}
            room={post.room}
            linkType={post.linkType}
            diningType={post.diningType}
            excerpt2={post.excerpt2}
            hotelRating={post.hotelRating}
            foodRating={post.foodRating}
            takeoutRating={post.takeoutRating}
            gallery={post.gallery}
            category={post.category}
            tip={post.tip}
          />
        </article>

        <div className="container mx-auto">
          <PostBody content={post.content} />
        </div>

        <VideoPlayer url={post.youtube} />

        {post.gallery?.length > 0 && (
          <ImageGallery title="Photo Gallery" images={post.gallery} />
        )}

        <Footer />
      </Layout>
    </div>
  )
}
