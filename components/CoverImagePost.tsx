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
    <section className="body-font text-gray-600">
      <div className="container mx-auto flex flex-wrap py-2">
        <div className="flex flex-wrap ">
          <div className="flex w-full flex-wrap pt-2 md:w-1/2">
            <div
              className={cn('w-full', {
                '': slug,
              })}
            >
              <Image
                className="block object-cover object-center  md:rounded-l-2xl"
                width={1240}
                height={744}
                alt={`Cover Image for ${title}`}
                src={urlForImage(source).height(1000).width(2000).url()}
                sizes="100vw"
                priority={priority}
              />
            </div>
          </div>

          {/* <div className=" hidden flex-wrap md:flex md:w-1/2 "> */}
          <div className=" hidden flex-wrap md:flex md:w-1/2 ">
            <div className=" pb-1 pl-2 pt-2 md:w-1/2  ">
              <Image
                width={1240}
                height={744}
                alt={`Cover Image for ${title}`}
                src={urlForImage(source).height(1000).width(2000).url()}
                sizes="100vw"
                priority={priority}
              />
            </div>
            <div className="w-1/2  pb-1 pl-2 pt-2">
              <Image
                width={1240}
                height={744}
                className="  block rounded-tr-2xl"
                alt={`Cover Image for ${title}`}
                src={urlForImage(source).height(1000).width(2000).url()}
                sizes="100vw"
                priority={priority}
              />
            </div>
            <div className=" w-1/2  pb-1 pl-2 pt-1">
              <Image
                width={1240}
                height={744}
                alt={`Cover Image for ${title}`}
                src={urlForImage(source).height(1000).width(2000).url()}
                sizes="100vw"
                priority={priority}
              />
            </div>
            <div className="  w-1/2  pb-1 pl-2 pt-1">
              {/*<span className='  px-3 ml-6  md:mx-3 my-4 z-20  text-base rounded-lg flex   bg-white border-black border-2 shadow-lg absolute bottom-0 right-0  mb-6 mr-6 '>
              <a href="gallery" className='text-black font-medium text-xs md:text-sm p-1  '>
              View all photos
                
              </a>
              </span>*/}
              <Image
                width={400}
                height={400}
                alt={`Cover Image for ${title}`}
                src={urlForImage(source).height(1000).width(2000).url()}
                className="  block rounded-br-2xl"
                priority={priority}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
  )

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

