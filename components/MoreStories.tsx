import { Pagination } from '@mantine/core'
import { usePagination } from '@mantine/hooks'
import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'
import { useState } from 'react'

const itemsPerPage = 12
export default function MoreStories({ posts, showPagination, showRating }: { posts: Post[], showPagination: boolean, showRating:boolean }) {
  const [visiblePosts, setvisiblePosts] = useState(posts.slice(0, itemsPerPage))

  const pagination = usePagination({ total: 10, initialPage: 1 })

  //  console.log("pagination.range;", pagination.range)

  const [activePage, setPage] = useState(1)

  const total = Math.ceil(posts.length / itemsPerPage)
  function displayNewPage(e) {
    // console.log('displayNewPage E', e)
    // console.log('total E', total)
    setPage(e)

    const start = (e - 1) * itemsPerPage
    const end = start + itemsPerPage
    setvisiblePosts(posts.slice(start, end))
  }
  //console.log("DRY001", visiblePosts[1])
//  console.log("DRY3 Title", visiblePosts[0].title)
  //  console.log('activePage', posts[0])

  return (
    <section className="container mx-auto mt-2">
      <div className="container mx-auto  mt-10 grid grid-cols-1 place-content-center place-items-center gap-x-16 gap-y-10 px-3 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:px-6 lg:grid-cols-3 2xl:grid-cols-4">
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
            linkType={post.linkType}
            foodRating={post.foodRating}
            hotelRating={post.hotelRating}
            takeoutRating={post.takeoutRating}
            diningType={post.diningType}
            showRating={showRating}
          />
        ))}
      </div>

    { showPagination &&  <div className="pb-6 pt-14">
        <Pagination
          total={total}
          value={activePage}
          onChange={displayNewPage}
          position="center"
          size="lg"
          pt={10}
          styles={(theme) => ({
            control: {
              '&[data-active]': {
                backgroundImage: theme.fn.gradient({
                  from: 'pink',
                  to: 'pink',
                }),
                border: 0,
              },
            },
          })}
        />
      </div>}
    </section>
  )
}
