import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import FoodRatings from 'components/IndividualFoodRating'
import MoreStories from 'components/MoreStories'
import PostBody from 'components/PostBody'
import PostHeader from 'components/PostHeader'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import SectionSeparator from 'components/SectionSeparator'
import * as demo from 'lib/demo.data'
import type { Post, Settings } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'

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

export default function PostPage(props: PostPageProps) {
  const { preview, loading, morePosts = NO_POSTS, post, settings } = props
  const { title = demo.title } = settings || {}

  const slug = post?.slug

  if (!slug && !preview) {
    notFound()
  }

  const ratingCat =
    post?.linkType === 'food' ? post?.foodRating : post?.hotelRating
  //console.log('Post Page post.FoodRating Ken  ', post)
  //  console.log("POST PAGE linkedtype ", post.linkType)
  return (
    <div className="containe mx-aut ">
      <PostPageHead settings={settings} post={post} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} level={2} />

          {preview && !post ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <>
              <div className="container mx-auto ">
                <article>
                  <PostHeader
                    title={post.title}
                    coverImage={post.coverImage}
                    date={post.date}
                    author={post.author}
                    location={post.location}
                    room={post.room}
                    linkType={post.linkType}
                    excerpt2={post.excerpt2}
                    hotelRating={ratingCat}
                    gallery={post.gallery}
                    category={post.category}
                    tip={post.tip}
                  />
<FoodRatings food={post?.individualFoodRating} />
             

                  {post.linkType == 'hotel' || post.linkType == 'food' ? (
                    <ProConList
                      positives={post.positives}
                      negatives={post.negatives}
                      verdict2={post.verdict}
                    />
                  ) : (
                    ''
                  )}

                  {post.linkType == 'hotel' ? (
                    <>
                      <RoomTech
                        techAvailable={post.techRating}
                        speed={post.internetSpeed}
                        roomAmenitiesAvailiable={post.roomAmenities}
                      />
                    </>
                  ) : (
                    ''
                  )}

                  <PostBody content={post.content} />

                  <Youtube link={post.youtube} />

                  <Gallery posts={post} heading={''} />
                </article>
              </div>

              {/* {morePosts?.length > 0 && <MoreStories posts={morePosts} />} */}
            </>
          )}
        </Container>
      </Layout>
    </div>
  )
}
