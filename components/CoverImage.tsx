import cn from 'classnames'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

interface CoverImageProps {
  title: string
  slug?: string
  image: any
  priority?: boolean
}

export default function CoverImage(props: CoverImageProps) {
  const { title, slug, image: source, priority } = props
  const image = source?.asset?._ref ? (
    <div
      className={cn('shadow-small', {
        'transition-shadow duration-200 hover:shadow-medium bor': slug,
      })}
    >
      <Image
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200 	rounded-2xl': slug,
      })}
        width={1040}
        height={540}
        alt={`Cover Image for ${title}`}
        src={urlForImage(source).height(540).width(1240).url()}
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
          <p className='mb-2 pt-4 hover:underline break-words z-20 md:mb-6 text-lg sm:text-xl md:text-4xl font-bold tracking-tighter leading-tight bg-white px-3 py-2 mx-3 md:mx-0 rounded-lg'>
          {title}
          </p>
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