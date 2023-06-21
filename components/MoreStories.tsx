import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'

export default function MoreStories({ posts }: { posts: Post[] }) {
  return (
    <section className='mt-16'>
      <div className="mb-32 grid grid-cols-1 gap-y-9 gap-x-10 gap- md:grid-cols-2 lg:grid-cols-3 md:gap-x-16 md:gap-y-20 gap- lg:gap-x-16">
        {posts.map((post) => (
          <PostPreview
            key={post._id}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
            location={post.location}
          />
        ))}
      </div>
    </section>
  )
}
