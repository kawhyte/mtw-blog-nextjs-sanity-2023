import { inter } from 'app/fonts'
import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

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
  return (
    <div>
      <div className="mb-5 ">
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
        className={`${inter.variable} title-font mt-3 font-secondary font-light text-gray-700 hover:underline`}
      >
        <div className="-mt-6">
          <h2 className=" title-font my-2 truncate text-sm font-semibold  text-pink-500">
            {title}
          </h2>
          {/* <p className='text-base leading-relaxed mt-2'>{item.excerpt}</p> */}
          <div className="block   text-sm my-1 text-gray-500">
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
  )
}
