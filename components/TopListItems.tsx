import PostPreview from 'components/PostPreview'
import { urlForImage } from 'lib/sanity.image'
import type { Recommendation } from 'lib/sanity.queries'
import Image from 'next/image'
import Link from 'next/link'

let count = 2
export default function TopListItems({ posts }: { posts: Recommendation[] }, {color}) {
console.log("color", color)
  return (
    <section className={`mt-16 bg-green-50 py-10 px-10 rounded-2xl`}>
      <div className=" container mx-auto mb-10 flex w-full flex-wrap">
        <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
          <h1 className="font-fancy  title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
            {posts[0].title}
          </h1>
          <div className="h-1 w-20 rounded bg-pink-500"></div>
        </div>
      </div>

      <div className="mb-12 flex justify-center md:p-6    ">
        <div className="rounded-xl border-8 border-yellow-300 px-6 bg-white py-4">
          <Link
            href={`/posts/${posts[0].recommendations[0].post.slug.current}`}
            className="block w-full"
          >
            <p className="absolute   z-10 m-2 rounded-lg  bg-yellow-300 px-2  text-xl font-medium text-black md:text-2xl ">
              1
            </p>
            <Image
              width={440}
              height={470}
              blurDataURL={urlForImage(
                posts[0]?.recommendations[0]?.post?.coverImage?.asset?._ref
              )
                .width(1240)
                .height(744)
                .quality(1)
                .format('webp')
                .url()}
              placeholder="blur"
              alt={`Cover Image for ${posts[0].recommendations[0].title}`}
              className=" relative block object-cover  object-center md:rounded-xl  "
              src={urlForImage(
                posts[0].recommendations[0].post.coverImage.asset._ref
              )
                .width(1240)
                .height(744)
                .format('webp')
                .url()}
            />
          </Link>
          <div className="  w-full cursor-pointer px-2 text-left">
            <Link
              as={`/posts/${posts[0].recommendations[0].post.coverImage.asset._ref}`}
              href={`/posts/${posts[0].recommendations[0].post.coverImage.asset._ref}`}
              aria-label={posts[0].recommendations[0].title}
              className="block h-full w-full"
            >
              <h1 className="title-font my-4 text-lg font-medium text-gray-900 sm:text-2xl">
                {posts[0].recommendations[0].post.title}
              </h1>
              <p className="text-md  truncate font-light text-gray-500">
                {posts[0].recommendations[0].post.location}
              </p>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-32 grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-2 md:gap-x-16 md:gap-y-20 lg:grid-cols-3 lg:gap-x-16">
        {/* {posts[0].recommendations.map( */}

        {posts[0].recommendations.slice(1, 20).map(
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
                      {i + 2}
                    </p>
                    <Image
                      width={1240}
                      height={770}
                      blurDataURL={urlForImage(
                        item?.post?.coverImage?.asset?._ref
                      )
                        .width(1240)
                        .height(744)
                        .quality(1)
                        .format('webp')
                        .url()}
                      placeholder="blur"
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
