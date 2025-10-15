import cn from 'classnames'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

interface CoverImageProps {
  title: string
  slug?: string
  image: any
  gallery: any
}

const ImageBorder = {
  0: 'rounded-none',
  1: 'rounded-tr-xl',
  2: 'rounded-none',
  3: 'rounded-br-xl',
}

export default function CoverImage(props: CoverImageProps) {
  const { title, slug, image: source, gallery } = props
 

  const image = source?.asset?._ref ? (
    <>
      <div className=" mt-10 flex  flex-row gap-2">
        <div className="relative ">
          <Image
            className={`h-auto w-full max-w-full md:rounded-l-xl`}
            src={urlForImage(source)
              .width(560)
              .height(610)
              .format('webp')
              .fit('crop')
              .auto('format')
              .url()}
            alt={source.alt || `${title} - NBA Arena Travel Review`}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
            width={560}
            height={438}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {gallery?.length > 3 ? (
          <div className="max-w-5x hidden grid-cols-2 gap-2  md:grid ">
            {gallery.slice(0, 4).map((item, i) => (
              <div key={item._key} className="relative">
                <Image
                  className={twMerge(`h-auto max-w-full  `, ImageBorder[i])}
                  src={urlForImage(item)
                    ?.height(300)
                    ?.width(300)
                    ?.format('webp')
                    .fit('crop')
                    .auto('format')
                    ?.url()}
                  alt=""
                  width={300}
                  height={300}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgYGBg+P//P1t9fT0TiM0we3ZjxZxZjQ9XLpwwe9nCHkOGGZOyanraY9aumN2wbsn0hmQA/MEWfj4ocjcAAAAASUVORK5CYII="
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  ) : (
    <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
  )

  return (
    <div className="">
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
