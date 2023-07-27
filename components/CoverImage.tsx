import cn from 'classnames'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

import PostBody from './PostBody';
import PostDate from "./PostDate";

interface CoverImageProps {
  title: string
  slug?: string
  date?: any
  location?:string
  image: any
  priority?: boolean
  excerpt2?:any
}

export default function CoverImage(props: CoverImageProps) {
  const { title, date, slug,location,excerpt2, image: source, priority } = props
  const image = source?.asset?._ref ? (
    <div
      className={cn('', {
        ' ': slug,
      })}
    >
      <Image
        className={cn('', {
          '	rounded-2xl': slug,
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
    
        src={urlForImage(source)
          .width(1240)
          .height(801)
          .format('webp')
          .url()}
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
          <p className="z-20 mb-2 break-words text-pink-500    pt-4 text-lg font-semibold leading-tight  tracking-tighter hover:underline sm:text-xl md:mx-0 md:text-4xl">
            {title}
          </p>
          <div >{location} </div>
         
          {/* <span>
            <PostDate dateString={date} />
       
   
          </span> */}
          <PostBody content={excerpt2} />
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
