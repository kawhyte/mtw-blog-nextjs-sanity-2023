import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

import Categories from './Categories'

export default function MoreStories({ posts }: { posts: Post[] }) {
  return (
    <section className="container mx-auto mt-8">
      <div className="xs:grid-cols-2 mb-12 grid grid-cols-1 gap-x-7 gap-y-9 sm:grid-cols-2 md:grid-cols-3 md:gap-x-7 lg:grid-cols-3 lg:gap-x-7 xl:grid-cols-4">
        {posts.map((post) => (
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
