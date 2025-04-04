import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries' // Changed import to Post

import SectionTitle from './SectionTitle'

export default function TopListItems(
  { posts }: { posts: Post[] }, // Updated prop type to Post[]

) {
  return (
    <>
      {/* <div className="  mb-10 flex w-full flex-wrap ">
        <div className="mx-4 my-6 w-full lg:mb-0 lg:w-1/2 ">
          {posts[0]?.title && (
            <SectionTitle
              header={`Top ${
                posts[0].linkType === 'hotel' ? 'Hotel' : 'Restaurant'
              } Picks 🔥 `}
              description={undefined}
            />
          )}
        </div>
      </div> */}

      {/* <div className="container mx-auto  mt-14 grid grid-cols-2 place-content-center place-items-center gap-x-5  gap-y-10 sm:gap-y-20 px-3  sm:grid-cols-2 md:grid-cols-3  md:gap-10 md:px-6 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"> */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-4 px-4 sm:px-6 lg:px-8 container mx-auto max-w-8xl">
        {posts.map(
          // Directly mapping over the top weighted posts
          (post, i) => (
            <div
              key={post._id}
              className="h-90 group relative m-auto w-full rounded-lg font-montserrat overflow-hidden"
            >
              <span className=" absolute left-2 top-2 md:-left-6 md:-top-10 z-40 flex w-20 flex-col   text-[3.2rem] font-bold  leading-[0.88]  text-pink-500 drop-shadow-lg sm:text-[7.9rem] sm:tracking-[-1.2rem] md:text-[12.5rem]">
                {i + 1}
              </span>

              {/* <div className="absolute z-40 top-5 right-9 bg-green-300 px-2 ox-3">{post.weightedAverageRating}</div> */}

              <div className="relative">
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
                  showRating={false}
                />
              </div>
            </div>
          )
        )}
      </div>
    </>
  )
}
