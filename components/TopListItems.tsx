import PostPreview from 'components/PostPreview'
import { urlForImage } from 'lib/sanity.image'
import type { Post } from 'lib/sanity.queries' // Changed import to Post
import Image from 'next/image'
import Link from 'next/link'

import PostHeader from './PostHeader'
import PostTitle, { CardTitle } from './PostTitle'
import SectionTitle from './SectionTitle'

let count = 2
export default function TopListItems(
  { posts }: { posts: Post[] }, // Updated prop type to Post[]
  { color = 'bg-red-200' }
) {
  return (
    <section className={`container    mx-auto my-16  rounded-2xl   `}>
      <div className="  mb-10 flex w-full flex-wrap ">
        <div className="mx-4 my-6 w-full lg:mb-0 lg:w-1/2 ">
          {posts[0]?.title && (
            <SectionTitle
              header={`Best ${
                posts[0].linkType === 'hotel' ? 'Hotels' : 'Restaurants'
              }`}
              description={undefined}
            />
          )}
        </div>
      </div>

      <div className="container mx-auto  mt-14 grid grid-cols-1 place-content-center place-items-center gap-x-5 gap-y-20 md:gap-y-24  px-3 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:px-6 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {posts.slice(0, 10).map(
          // Directly mapping over the top weighted posts
          (post, i) => (
            <div
              key={post._id}
              className="h-90 group relative m-auto   flex cursor-pointer  items-baseline     rounded-lg font-montserrat   xl:w-96   "
            >
              <span className=" font-san  absolute -left-6 -top-10 z-40   flex w-20 flex-col   text-[6.9rem] font-bold  leading-[0.88] tracking-[-1.0rem] text-pink-500 drop-shadow-lg sm:text-[7.9rem] sm:tracking-[-1.2rem] md:text-[12.5rem]">
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
    </section>
  )
}
