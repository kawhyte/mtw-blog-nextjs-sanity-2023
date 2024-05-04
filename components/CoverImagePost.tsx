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
  //console.log('COVER IMage Post ', props)

  // const image1 = gallery
  //   ? urlForImage(gallery[0])?.height(813)?.width(1240)?.url()
  //   : '/holder.jpg'
  // const image2 = gallery
  //   ? urlForImage(gallery[1])?.height(813)?.width(1240)?.url()
  //   : '/holder.jpg'
  // const image3 = gallery
  //   ? urlForImage(gallery[2])?.height(813)?.width(1240)?.url()
  //   : '/holder.jpg'
  // const image4 = gallery
  //   ? urlForImage(gallery[3])?.height(813)?.width(1240)?.url()
  //   : '/holder.jpg'
  // console.log("Source ", source)
  // console.log('Gallery .images[i] ', gallery?.images[0])

  const image = source?.asset?._ref ? (
    <>
      <div className=" flex flex-row  gap-2 mt-10">
        <div>
          <img
            className="h-auto max-w-full md:rounded-lg"
            src={urlForImage(source)
              .width(560)
              .height(560)
              .format('webp')
              .url()}
            alt=""
          />

 {/* <div>

<button type="button" className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
<svg className="w-3 h-3 text-white me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
<path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
<path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
</svg>
Extra small
</button></div>  */}
        </div>
        
     {gallery?.length > 3 ?    <div className="hidden md:grid grid-cols-2 gap-2  max-w-5xl ">



          {gallery.slice(0, 4).map((item, i) => (
            <div key={item._key} >
              <img
                className="h-auto max-w-full  rounded-lg"
                src={urlForImage(item)?.height(276)?.width(330)?.url()}
                alt=""
              />
            </div>
          ))}
        </div> : <></>}
      </div>

      {/* <section className=" mt-8 max-w-7xl text-gray-600 ">
        <div className="   mx-auto grid justify-items-center md:grid-cols-2 ">
          <div className=" ">
            <div className="    ">
              <Image
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
                className="   lg:rounded-l-2xl"
                src={urlForImage(source)
                  .width(1227)
                  .height(801)
                  .format('webp')
                  .url()}
              />
            </div>
          </div>
          <div className=" ml-2  hidden md:block   ">
            <div className="grid-row-2 grid grid-cols-2  gap-2  ">
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
      </section> */}
    </>
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
