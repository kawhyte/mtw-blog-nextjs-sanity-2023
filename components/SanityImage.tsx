import { urlForImage } from 'lib/sanity.image'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

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
  /** Max width for this slot — the loader serves smaller srcset widths per `sizes`. */
  width?: number
  /** With `width`, crops to width:height (respecting the Studio hotspot). */
  height?: number
  quality?: number
}

export default function SanityImage({
  image,
  width,
  height,
  quality = 85,
  alt,
  className,
  ...props
}: SanityImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  if (!image?.asset?._ref && !image?.asset?._id) return null

  const lqip = image.asset?.metadata?.lqip
  const dims = image.asset?.metadata?.dimensions

  let builder = urlForImage(image).quality(quality)
  if (width) builder = builder.width(width)
  if (height) builder = builder.height(height)
  // Both dimensions = a fixed-shape slot: crop to fill it instead of fitting
  // inside the box (fit=max), which left landscape photos too short and blurry
  // once object-cover stretched them.
  if (width && height) builder = builder.fit('crop')

  const src = builder.url()
  const intrinsicW = width ?? dims?.width ?? 800
  const intrinsicH =
    height ??
    (width && dims ? Math.round((width * dims.height) / dims.width) : undefined) ??
    dims?.height ??
    600

  return (
    <Image
      src={src}
      width={intrinsicW}
      height={intrinsicH}
      blurDataURL={lqip}
      placeholder={lqip ? 'blur' : 'empty'}
      alt={alt ?? image.alt ?? ''}
      onLoad={() => setIsLoaded(true)}
      className={`transition-all duration-700 ease-in-out ${isLoaded ? 'blur-0 scale-100' : 'blur-xl scale-105'} ${className ?? ''}`}
      {...props}
    />
  )
}
