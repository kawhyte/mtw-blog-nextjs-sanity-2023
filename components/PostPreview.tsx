import { inter } from 'app/fonts'
import Avatar from 'components/AuthorAvatar'
import Date from 'components/PostDate'
import { categoryRating } from 'lib/getHotelCategory'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

import CoverImage from './CoverImage'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt2,
  category,
  author,
  slug,
  location,
}: Omit<Post, '_id'>) {
  const categoryType = categoryRating(category)
  const colorVariants = {
    blue: 'shadow-offsetBlue',
    yellow: 'shadow-offsetYellow',
    green: 'shadow-offsetGreen',
    red: 'shadow-offsetRed',
  }



  return (
    <>
      <div
        className={
          `mx-auto mb-12 max-w-[18rem]  flex-[1_0_0] rounded-lg border-4 border-black bg-white  hover:scale-105 hover:duration-200 md:max-w-[32rem]  lg:mb-0 lg:mr-20 ` +
          ` ${colorVariants[categoryType.color]}`
        }
      >
        <div className="mb-5">
          <CoverImage
            slug={slug}
            title={''}
            image={coverImage}
            priority={false}
            category={category}
          />
        </div>
        <Link
          href={`/posts/${slug}`}
          className={`${inter.variable} title-font  font-secondary mt-3 font-light text-gray-700 `}
        >
          <div className="mx-3 -mt-6 ">
            <h2 className=" title-font my-2 truncate text-md font-extrabold text-pink-500  md:w-80">
              {title}
            </h2>
            {/* <p className='text-base leading-relaxed mt-2'>{item.excerpt}</p> */}
            <div className="my-1   block text-sm text-gray-500">
              {location ? location : ''}
            </div>

            {/* <h3 className="mb-3 text-3xl leading-snug">{title}</h3> */}
            <div className="mb-4 text-sm text-gray-500">
              <Date dateString={date} />
            </div>
            {/* {excerpt && <p className="mb-4 text-lg leading-relaxed">{excerpt}</p>}
      {author && <Avatar name={author.name} picture={author.picture} />} */}
          </div>
        </Link>
      </div>
    </>
  )
}

{
  /* <li class="mx-auto mb-12 max-w-[32rem] flex-[1_0_0] rounded-lg border-4 border-black bg-white px-6 py-8 shadow-[18px_18px_0_-4px_#79DFFF,_18px_18px_0_0_#1f1f1f] lg:mb-0 lg:mr-20 lg:last:mr-6">
<h3 class="text-t5 lg:text-t6 font-polysans font-semibold leading-tight tracking-tight">
  🚀 Analytics
</h3>
<p class="font-shopifysans text-sm font-normal md:text-base">
  See key performance metrics to learn about your sales and customers.
</p>
</li> */
}
