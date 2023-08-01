import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'

export default function MoreStories({ posts }: { posts: Post[] }) {
  return (
    <section className='mt-8 mx-1'>
      <div className="mb-12 grid grid-cols-1 gap-y-9 gap-x-7 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-x-7 lg:gap-x-7">
        {posts.map ((post) => (
          <PostPreview
            key={post._id}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt2={post.excerpt2}
            location={post.location}
          />
        ))}
      </div>
    </section>
  )
}
