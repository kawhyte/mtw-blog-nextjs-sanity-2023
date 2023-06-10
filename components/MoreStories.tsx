import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'

export default function MoreStories({ posts }: { posts: Post[] }) {
  return (
    <section className='mt-16'>
  
      <div className=' container mx-auto flex flex-wrap w-full mb-10'>
      <div className='lg:w-1/2 w-full mb-6 lg:mb-0 mx-4 '>
        <h1 className='font-fancy  sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900'>
        More Articles
        </h1>
        <div className='h-1 w-20 bg-pink-500 rounded'></div>
      </div>
    </div>


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
