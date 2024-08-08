import { Pagination } from '@mantine/core'
import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'
import { useState } from 'react'

const itemsPerPage = 12
export default function MoreStories({ posts }: { posts: Post[] }) {
  const [visiblePosts, setvisiblePosts] = useState(posts.slice(0, itemsPerPage))

  const [activePage, setPage] = useState(1)

  const total = Math.ceil(posts.length / itemsPerPage)
  function displayNewPage(e) {
    //console.log('E', e)
    setPage(e)

    const start = (e - 1) * itemsPerPage
    const end = start + itemsPerPage
    setvisiblePosts(posts.slice(start, end))
  }

   //console.log('activePage', posts[0])

  return (
    <section className="container mx-auto mt-8">
          <div className="container mx-auto  mt-14 grid grid-cols-1 place-content-center place-items-center gap-x-16 gap-y-10 px-3 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:px-6 lg:grid-cols-3 2xl:grid-cols-4">
          {visiblePosts.map((post) => (
          <PostPreview
            key={post._id}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt2={post.excerpt2}
            location={post.location}
            category={post.category}
          />
        ))}
      </div>
    { visiblePosts.length >= 10 ?  <div className="pt-14 pb-6">
        <Pagination
          total={total}
          value={activePage}
          onChange={displayNewPage}
          position="center"
          size="md"
          styles={(theme) => ({
            control: {
              '&[data-active]': {
                backgroundImage: theme.fn.gradient({
                  from: '#F0BBDD',
                  to: 'pink',
                }),
                border: 0,
              },
            },
          })}
        />
      </div> : ""}
    </section>
  )
}
