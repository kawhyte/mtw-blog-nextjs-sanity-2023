// components/HeroPhotoGallery.tsx

import { urlForImage } from 'lib/sanity.image'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface HeroPhotoGalleryProps {
  images: any[]
  onShowAllPhotos: () => void
  /** Drop the outer container padding, for layouts that already provide it
      (e.g. the hotel review column, so the photos line up with the panel) */
  bare?: boolean
}

const FadeImage = ({
  image,
  className,
  src,
  alt,
  ...props
}: {
  image: any
  className?: string
  src: string
  alt: string
  [key: string]: any
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const lqip = image?.asset?.metadata?.lqip

  return (
    <Image
      src={src}
      alt={alt}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      onLoad={() => setIsLoaded(true)}
      className={`transition-all duration-700 ease-in-out ${isLoaded ? 'blur-0 scale-100' : 'blur-xl scale-105'} ${className ?? ''}`}
      {...props}
    />
  )
}

/**
 * Shape of each small tile in the right half (550px tall), by how many there are:
 * 1 → one tall tile · 2 → two wide rows · 3 → wide top + two below · 4 → 2×2.
 */
const smallTileSpec = (count: number, index: number) => {
  if (count === 1)
    return { className: '', width: 2000, height: 1500, sizes: '50vw' }
  const wide = count === 2 || (count === 3 && index === 0)
  return wide
    ? {
        className: count === 3 ? 'col-span-2' : '',
        width: 1600,
        height: 730,
        sizes: '50vw',
      }
    : { className: '', width: 1200, height: 900, sizes: '25vw' }
}

export default function HeroPhotoGallery({
  images,
  onShowAllPhotos,
  bare = false,
}: HeroPhotoGalleryProps) {
  if (!images || images.length === 0) {
    return null
  }

  const mainImage = images[0]
  const otherImages = images.slice(1, 5)

  return (
    <div className={bare ? 'relative' : 'container mx-auto px-4 py-8 relative'}>
      {/* Mobile: Main image only */}
      <div className="relative h-96 md:hidden">
        <FadeImage
          image={mainImage}
          src={
            urlForImage(mainImage)
              ?.width(1600)
              .height(1200)
              .quality(75)
              .fit('crop')
              .url() || ''
          }
          alt={mainImage.alt || 'Main photo'}
          fill
          sizes="100vw"
          className="rounded-xl object-cover"
          priority={true}
        />
      </div>

      {/* Desktop: 1 large photo + up to 4 small tiles; layout adapts to how many there are */}
      <div
        className={`hidden md:grid h-[550px] gap-2 overflow-hidden rounded-xl ${otherImages.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        <div className="relative">
          <FadeImage
            image={mainImage}
            src={
              urlForImage(mainImage)
                ?.width(otherImages.length > 0 ? 2000 : 2400)
                .height(otherImages.length > 0 ? 1500 : 1100)
                .quality(75)
                .fit('crop')
                .url() || ''
            }
            alt={mainImage.alt || 'Main photo'}
            fill
            sizes={otherImages.length > 0 ? '50vw' : '100vw'}
            className="object-cover"
            priority={true}
          />
        </div>

        {otherImages.length > 0 && (
          <div
            className={`grid gap-2 ${otherImages.length >= 3 ? 'grid-cols-2' : 'grid-cols-1'} ${otherImages.length >= 2 ? 'grid-rows-2' : ''}`}
          >
            {otherImages.map((image, index) => {
              const tile = smallTileSpec(otherImages.length, index)
              return (
                <div
                  key={image._key ?? index}
                  className={`relative ${tile.className}`}
                >
                  <FadeImage
                    image={image}
                    src={
                      urlForImage(image)
                        ?.width(tile.width)
                        .height(tile.height)
                        .quality(75)
                        .fit('crop')
                        .url() || ''
                    }
                    alt={image.alt || `Photo ${index + 2}`}
                    fill
                    sizes={tile.sizes}
                    className="object-cover"
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Show all photos button */}
      <button
        onClick={onShowAllPhotos}
        className="absolute bottom-12 right-8 bg-background text-foreground border border-border font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-muted transition-colors duration-200"
      >
        <Camera className="h-5 w-5" />
        <span>Show all photos</span>
      </button>
    </div>
  )
}
