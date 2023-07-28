import cn from 'classnames'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

import PostBody from './PostBody'
import PostDate from './PostDate'

interface CoverImageProps {
  title: string
  slug?: string
  date?: any
  location?: string
  image: any
  priority?: boolean
  excerpt2?: any
}

export default function CoverImage(props: CoverImageProps) {
  const {
    title,
    date,
    slug,
    location,
    excerpt2,
    image: source,
    priority,
  } = props
  const image = source?.asset?._ref ? (
    <div
      className={cn('	', {
        ' ': slug,
      })}
    >
      <Image
        className={cn('', {
          '	mx-auto rounded-xl': slug,
        })}
        width={740}
        height={770}
        blurDataURL={urlForImage(source)
          .width(740)
          .height(744)
          .quality(1)
          .format('webp')
          .url()}
        placeholder="blur"
        alt={`Cover Image for ${title}`}
        src={urlForImage(source).width(1240).height(801).format('webp').url()}
        sizes="100vw"
        priority={priority}
      />
    </div>
  ) : (
    <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
  )

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
          <p className="z-20 mb-2 break-words pt-4 text-center text-xl font-semibold leading-tight tracking-tighter  text-pink-500 hover:underline  md:mx-0 md:text-3xl">
            {title}
          </p>
          <div className="text-center text-lg text-gray-500">{location}</div>

          <div className="text-center text-lg  text-gray-500">
            <PostDate dateString={date} />
          </div>
          {/* <PostBody content={excerpt2} /> */}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

// <Link
// as={`/${slugType}/${slug}`}
// href={`/${slugType}/[slug]`}
// className='hover:underline break-words'>

// </Link>
// </p>
