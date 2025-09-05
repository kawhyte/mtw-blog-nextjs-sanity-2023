import AuthorAvatar from 'components/AuthorAvatar'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

import CoverImage from './CoverImage'

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
  >,
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

  // console.log("PROPs", props)
  // console.log("PROPs date ", date)
  return (
    <section className="mt-10  max-w-full  ">
      <div className=" container mx-auto mb-10 flex w-full flex-wrap">
        <div className="mx-4 mb-6 w-full lg:mb-0 lg:w-1/2 ">
          <h1 className="font-fancy  title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
            Latest Articles
          </h1>
          <div className="h-1 w-20 rounded bg-pink-500"></div>
        </div>
      </div>

      <div className=" ">
        <div className="">
          {/* <MtwAward address={location} date={date} /> */}

          <div className="   mx-8 flex flex-col items-center justify-start py-6 align-middle">
            <CoverImage
              slug={slug}
              image={coverImage}
              title={title}
              date={date}
              location={location}
              excerpt2={excerpt2}
              rating={undefined}
              linkType={''}
              diningType={undefined} // url={coverImage}
              showRating={false} // linkType={linkType}
            />
          </div>
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
