import { oswald } from 'app/fonts'
import PostPreview from 'components/PostPreview'
import { urlForImage } from 'lib/sanity.image'
import type { Recommendation } from 'lib/sanity.queries'
import Image from 'next/image'
import Link from 'next/link'

let count = 2
export default function TopListItems(
  { posts }: { posts: Recommendation[] },
  { color = 'bg-red-200' }
) {
  //console.log('color', color)
  return (
    <section className={`my-16    rounded-2xl`}>
      <div className=" container  mx-auto mb-10 flex w-full flex-wrap">
        <div className="mx-4 my-6 w-full lg:mb-0 lg:w-1/2 ">
          <h1
            className={`${oswald.variable} title-font mb-2 font-heading text-3xl font-medium text-gray-900 sm:text-5xl`}
          >
            {posts[0].title}
          </h1>
          <div className="h-1 w-20 rounded bg-pink-500"></div>
        </div>
      </div>

      <div className="mb-12 p-6  flex justify-center md:mb-20 md:p-6    ">
        <span className=" -mr-8  md:-mr-7 flex flex-col   font-serif text-[9.25rem]  font-bold leading-[0.88] tracking-[-0.03em] text-pink-500 drop-shadow-xl sm:text-[25rem]">
          1
        </span>
        <div className="md:z-30 rounded-xl  bg-pink-100 px-6 py-4">
          <Link
            href={`/posts/${posts[0].recommendations[0].post.slug.current}`}
            className="block w-full"
          >
            {/* <p
              className={`${oswald.variable} title-font absolute z-30 md:-mb-8  px-2 text-2xl    text-white  md:text-9xl `}
              style={{
                textShadow:
                  '0 0 1px #FFD700, -1px -1px 0 #FFD700 ,  1px -1px 0 #FFD700 ,-1px 1px 0 #FFD700 ,1px 1px 0 #FFD700 ',
              }}
            >
              1
            </p> */}
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

      <div className="xs:grid-cols-3  mb-32 grid grid-cols-2 md:gap-6 pb-20 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto">
        {/* {posts[0].recommendations.map( */}

        {posts[0].recommendations.slice(1, 20).map(
          (item, i) =>
            count <= 10 && (
              <div
                key={item._id}
                className="h-90 m-auto flex   w-56 cursor-pointer flex-col  rounded-lg  sm:w-72 lg:w-80 "
              >
                <span className="-mb-2 -mr-2 flex  flex-col font-serif text-[5.25rem]  font-bold leading-[0.88] tracking-[-0.03em] drop-shadow-xl sm:text-[5rem]">
                  {i + 2}
                </span>

                <div key={item._id} className="flex flex-col ">
                  <Link
                    as={`/posts/${item.post.slug.current}`}
                    href={`/posts/${item.post.slug.current}`}
                    aria-label={item.title}
                    className="block h-full w-full"
                  >
                    {/* <p
                      className=" absolute z-30 md:-mb-8 rounded-xl stroke-cyan-500 px-2 text-2xl   font-medium text-white md:text-9xl"
                      style={{
                        textShadow:
                          '0 0 1px #b5bc67, -1px -1px 0 #b5bc67,  1px -1px 0 #b5bc67,-1px 1px 0 #b5bc67,1px 1px 0 #b5bc67',
                      }}
                    >
                      {i + 2}
                    </p> */}

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
