import cn from 'classnames'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

interface CoverImageProps {
  title: string
  slug?: string
  image: any
  priority?: boolean
  gallery: any
}

export default function CoverImage(props: CoverImageProps) {
  const { title, slug, image: source, priority, gallery } = props

  const image1 = gallery.images[0]
    ? urlForImage(gallery.images[0]).height(770).width(1240).url()
    : '/hero.webp'
  const image2 = gallery.images[1]
    ? urlForImage(gallery.images[1]).height(770).width(1240).url()
    : '/hero.webp'
  const image3 = gallery.images[2]
    ? urlForImage(gallery.images[2]).height(770).width(1240).url()
    : '/hero.webp'
  const image4 = gallery.images[3]
    ? urlForImage(gallery.images[3]).height(770).width(1240).url()
    : '/hero.webp'
  // console.log("Source ", source)
  console.log('Gallery .images[i] ', gallery.images[0])

  const image = source?.asset?._ref ? (
    <section className="body-font text-gray-600 mt-6">
      <div className="container  mx-auto grid grid-cols-4 justify-items-center ">
        <div className=" col-span-4 row-span-2 lg:col-span-2">
          <div className=" w-full   ">
            <Image
              width={1240}
              height={770}
              blurDataURL={urlForImage(source)
                .width(1240)
                .height(744)
                .quality(1)
                .format('webp')
                .url()}
              placeholder="blur"
              alt={`Cover Image for ${title}`}
              className="h-full w-full  lg:rounded-l-2xl"
              src={urlForImage(source)
                .width(1240)
                .height(744)
                .format('webp')
                .url()}
            />
          </div>
        </div>
        <div className="col-span-2 row-span-2 ml-2  hidden lg:block ">
          <div className="grig-row-2 grid grid-cols-2 justify-items-end gap-2 ">
            <div className="    ">
              <Image
                width={360}
                height={740}
                blurDataURL={image1}
                placeholder="blur"
                alt={`Cover Image for ${title}`}
                className="  "
                src={image1}
              />
            </div>
            <div className="  ">
              <Image
                width={360}
                height={740}
                blurDataURL={image2}
                placeholder="blur"
                alt={`Cover Image for ${title}`}
                className="  block rounded-tr-2xl"
                src={image2}
              />
            </div>
            <div className="">
              <Image
                width={360}
                height={740}
                blurDataURL={image3}
                placeholder="blur"
                alt={`Cover Image for ${title}`}
                className=" block "
                src={image3}
              />
            </div>
            <div className=" ">
              {/*<span className='  px-3 ml-6  md:mx-3 my-4 z-20  text-base rounded-lg flex   bg-white border-black border-2 shadow-lg absolute bottom-0 right-0  mb-6 mr-6 '>
							<a href="gallery" className='text-black font-medium text-xs md:text-sm p-1  '>
							View all photos
								
							</a>
							</span>*/}
              <Image
                width={360}
                height={740}
                blurDataURL={image4}
                placeholder="blur"
                alt={`Cover Image for ${title}`}
                className=" rounded-br-2xl"
                src={image4}
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
