import PostPreview from 'components/PostPreview'
import { urlForImage } from 'lib/sanity.image'
import type { Recommendation } from 'lib/sanity.queries'
import Image from 'next/image'
import Link from 'next/link'

let count = 1
export default function TopListItems({ posts }: { posts: Recommendation[] }) {
  return (
    <section className="mt-16">
        <div className='text-gray-900 text-7xl dark:text-red-200'>{posts[0].title}</div>
      <div className="gap- gap- mb-32 grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-2 md:gap-x-16 md:gap-y-20 lg:grid-cols-3 lg:gap-x-16">
        {/* {posts[0].recommendations.slice(1, 20).map( */}
        {posts[0].recommendations.map(
          (item, i) =>
       
            count <= 10 && (
              <div
                key={item._id}
                className="h-90 m-auto w-60 cursor-pointer overflow-hidden rounded-lg shadow-lg md:w-80"
              >
                <div className="relative">
                  <Link
                    as={`/posts/${item.post.slug.current}`}
                    href={`/posts/${item.post.slug.current}`}
                    aria-label={item.title}
                    className="block h-full w-full"
                  >
                    <p className="absolute z-10 m-2 rounded-xl bg-white px-2 text-xl font-medium text-black md:text-xl">
                      {count++}
                    </p>
                    <Image
                      width={1240}
                      height={770}
                      // blurDataURL={urlForImage(
                      //   item?.post?.coverImage?.asset?._ref
                      // )
                      //   .width(1240)
                      //   .height(744)
                      //   .quality(1)
                      //   .format('webp')
                      //   .url()}
                      // placeholder="blur"
                      alt={`Cover Image for ${item.title}`}
                      className=" block object-cover object-center  "
                      src={urlForImage(item.post.coverImage.asset._ref)
                        .width(1240)
                        .height(744)
                        .format('webp')
                        .url()}
                    />
                    <div className="w-full bg-white   p-4">
                      <p className="mb-2  truncate text-xl font-medium text-gray-800">
                        {item.post.title}
                      </p>
                      <p className="text-md  truncate font-light text-gray-500">
                        {item.post.location}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )
        )}
      </div>
    </section>
  )
}
