import { oswald } from 'app/fonts'
import PostPreview from 'components/PostPreview'
import { urlForImage } from 'lib/sanity.image'
import type { Recommendation } from 'lib/sanity.queries'
import Image from 'next/image'
import Link from 'next/link'

import PostHeader from './PostHeader'
import PostTitle, { CardTitle } from './PostTitle'
import SectionTitle from './SectionTitle'

let count = 2
export default function TopListItems(
  { posts }: { posts: Recommendation[] },
  { color = 'bg-red-200' }
) {
  //console.log('color', color)
  return (
    <section className={`container    mx-auto my-16  rounded-2xl   `}>
      {/* <div className="mb-12 flex  justify-center p-6 md:mb-20 md:p-6    ">
        <span className=" -mr-8  flex flex-col font-serif   text-[9.25rem] font-bold  leading-[0.88] tracking-[-0.03em] text-pink-500 drop-shadow-xl sm:text-[25rem] md:-mr-7">
          1
        </span>
        <div className="rounded-xl bg-pink-100  px-6 py-4 md:z-30">
          <Link
            href={`/posts/${posts[0].recommendations[0].post.slug.current}`}
            className="block w-full"
          >
      
            <Image
              width={440}
              height={264}
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
              placeholder="blur"
              alt={`Cover Image for ${posts[0].recommendations[0].title}`}
              className=" relative block object-cover  object-center md:rounded-xl  "
              src={urlForImage(
                posts[0].recommendations[0].post.coverImage.asset._ref
              )
                .width(440)
                .height(264)
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
      </div> */}

      <div className="  mb-10 flex w-full flex-wrap ">
        <div className="mx-4 my-6 w-full lg:mb-0 lg:w-1/2 ">
          {/* <h1
            className={`${oswald.variable} title-font mb-2 font-heading text-3xl font-medium text-gray-900 sm:text-5xl`}
          >
            {posts[0].title}
          </h1>
          <div className="h-1 w-20 rounded bg-pink-500"></div> */}

          <SectionTitle> {posts[0].title} We&apos;ve Visited</SectionTitle>
        </div>
      </div>

      <div className="container mx-auto  mt-14 grid grid-cols-1 place-content-center place-items-center gap-x-5 gap-y-10 px-3 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:px-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {/* {posts[0].recommendations.map( */}

        {posts[0].recommendations.slice(0, 11).map(
          (item, i) =>
            count <= 10 && (
              <div
                key={item._id}
                className="h-90 group   m-auto flex items-baseline     cursor-pointer rounded-lg   xl:w-96   "
              >
                <span className=" -mr-4 flex  w-20 flex-col font-san   text-[9.25rem] font-bold  leading-[0.88] tracking-[-2rem] text-pink-500 drop-shadow-lg   md:text-[12rem] md:mr-2">
                  {i + 1}
                </span>

                <PostPreview
                  key={item.post._id}
                  title={item.post.title}
                  coverImage={item.post.coverImage}
                  date={item.post.date}
                  author={item.post.author}
                  slug={item.post.slug.current}
                  excerpt2={item.post.excerpt2}
                  location={item.post.location}
                  category={item.post.category}
                />

                {/* <div key={item._id} className="z-10 flex flex-col w-full max-w-md  rounded-3xl border-4 border-black bg-white shadow-offsetIndigo  ">
                  <Link
                    as={`/posts/${item.post.slug.current}`}
                    href={`/posts/${item.post.slug.current}`}
                    aria-label={item.title}
                    className="block h-full w-full"
                  >
            
                    <div>
                      <Image
                        width={300}
                        height={200}
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
                        placeholder="blur"
                        alt={`Cover Image for ${item.title}`}
                        className=" block object-cover object-center  "
                        src={urlForImage(item.post.coverImage.asset._ref)
                          .width(300)
                          .height(200)
                          .format('webp')
                          .url()}
                      />
                    </div>
                    <div className="  mt-2 w-72">
                      <p className="clam font-small  mb-2 line-clamp-1 text-base text-gray-800">
                        {item.post.title}
                      </p>
                      <p className="text-sm font-light text-gray-500">
                        {item.post.location}
                      </p>
                    </div>
                  </Link>
                </div> */}
              </div>
            )
        )}
      </div>
    </section>
  )
}
