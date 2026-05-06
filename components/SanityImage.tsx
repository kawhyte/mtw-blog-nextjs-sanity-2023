import { urlForImage } from 'lib/sanity.image'
import Image, { ImageProps } from 'next/image'

interface SanityImageAsset {
  _ref?: string
  _id?: string
  metadata?: {
    lqip?: string
    dimensions?: { width: number; height: number }
  }
}

export interface SanityImageObject {
  asset?: SanityImageAsset
  alt?: string
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

interface SanityImageProps extends Omit<
  ImageProps,
  'src' | 'blurDataURL' | 'placeholder'
> {
  image: SanityImageObject
  width?: number
  height?: number
  quality?: number
}

export default function SanityImage({
  image,
  width,
  height,
  quality = 85,
  alt,
  ...props
}: SanityImageProps) {
  if (!image?.asset?._ref && !image?.asset?._id) return null

  const lqip = image.asset?.metadata?.lqip
  const dims = image.asset?.metadata?.dimensions

  let builder = urlForImage(image).quality(quality)
  if (width) builder = builder.width(width)
  if (height) builder = builder.height(height)

  const src = builder.url()
  const intrinsicW = width ?? dims?.width ?? 800
  const intrinsicH = height ?? dims?.height ?? 600

  return (
    <Image
      src={src}
      width={intrinsicW}
      height={intrinsicH}
      blurDataURL={lqip}
      placeholder={lqip ? 'blur' : 'empty'}
      alt={alt ?? image.alt ?? ''}
      {...props}
    />
  )
}
