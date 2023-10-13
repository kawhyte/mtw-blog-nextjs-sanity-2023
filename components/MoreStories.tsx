import { Pagination } from '@mantine/core'
import { range, usePagination } from '@mantine/hooks'
import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
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
      <div className="mx-2 mb-12 grid grid-cols-1 gap-x-7 gap-y-9 sm:grid-cols-2 md:grid-cols-2 md:gap-x-7 lg:grid-cols-3 lg:gap-x-7 xl:grid-cols-3">
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
      <div className="pb-8">
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
      </div>
    </section>
  )
}
