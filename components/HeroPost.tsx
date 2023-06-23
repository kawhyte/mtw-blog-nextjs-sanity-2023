import AuthorAvatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

import MtwAward from './MtwAward'

export default function HeroPost(
  props: Pick<
    Post,
    | 'title'
    | 'coverImage'
    | 'date'
    | 'excerpt2'
    | 'author'
    | 'slug'
    | 'hotelRating'
    | 'location'
  >
) {
  const {
    title,
    coverImage,
    date,
    excerpt2,
    author,
    slug,
    hotelRating,
    location,
  } = props
  return (
    <section className="mt-20  ">
      <div className=" container mx-auto mb-10 flex w-full flex-wrap">
        <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
          <h1 className="font-fancy  title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
            Latest Article
          </h1>
          <div className="h-1 w-20 rounded bg-pink-500"></div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start ">
        <div className=" relative ">
          <MtwAward address={location} date={date} />

          <div className="absolute bottom-0 right-0  -my-8 mx-6 flex flex-col items-start justify-start align-middle ">
            {/* <p className='mb-2 z-20 md:mb-6 text-lg sm:text-xl md:text-4xl font-bold tracking-tighter leading-tight bg-white px-3 py-2 mx-3 md:mx-0 rounded-lg'>
          
            <Link
                              as={`/${slugType}/${slug}`}
                              href={`/${slugType}/[slug]`}
                              className='hover:underline break-words'>

                              {title}

                          </Link>
         </p>  */}
          </div>
          <CoverImage
            slug={slug}
            image={coverImage}
            title={title}
            // url={coverImage}
            // linkType={linkType}
          />
        </div>
        {/* <div className='md:grid md:grid-cols-2 md:col-gap-16 lg:col-gap-8 mb-16 md:mb-12 '>
        <div>
          <p className='text-lg leading-relaxed mb-2'>{excerpt}</p>
        </div>
      </div> */}
      </div>
    </section>
  )
}
