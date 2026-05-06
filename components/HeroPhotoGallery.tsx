// components/HeroPhotoGallery.tsx

import { urlForImage } from 'lib/sanity.image'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface HeroPhotoGalleryProps {
  images: any[]
  onShowAllPhotos: () => void
}

const FadeImage = ({ image, className, ...props }: { image: any; className?: string; [key: string]: any }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const lqip = image?.asset?.metadata?.lqip

  return (
    <Image
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      onLoad={() => setIsLoaded(true)}
      className={`transition-all duration-700 ease-in-out ${isLoaded ? 'blur-0 scale-100' : 'blur-xl scale-105'} ${className ?? ''}`}
      {...props}
    />
  )
}

export default function HeroPhotoGallery({
  images,
  onShowAllPhotos,
}: HeroPhotoGalleryProps) {
  if (!images || images.length === 0) {
    return null
  }

  const mainImage = images[0]
  const otherImages = images.slice(1, 5)

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Mobile: Main image only */}
      <div className="relative h-96 md:hidden">
        <FadeImage
          image={mainImage}
          src={urlForImage(mainImage)?.width(800).height(600).fit('crop').url() || ''}
          alt={mainImage.alt || 'Main hotel image'}
          fill
          sizes="100vw"
          className="rounded-xl object-cover"
          priority={true}
        />
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-2 gap-2">
        {/* Main Image */}
        <div className="relative h-[550px]">
          <FadeImage
            image={mainImage}
            src={urlForImage(mainImage)?.width(1200).height(800).fit('crop').url() || ''}
            alt={mainImage.alt || 'Main hotel image'}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="rounded-l-xl object-cover"
            priority={true}
          />
        </div>

        {/* Other Images */}
        <div className="grid grid-cols-2 gap-2">
          {otherImages.map((image, index) => (
            <div key={index} className="relative h-[273px]">
              <FadeImage
                image={image}
                src={urlForImage(image)?.width(600).height(400).fit('crop').url() || ''}
                alt={image.alt || `Hotel image ${index + 2}`}
                fill
                sizes="(min-width: 768px) 25vw, 100vw"
                className={`${index === 1 ? 'rounded-tr-xl' : ''} ${index === 3 ? 'rounded-br-xl' : ''} object-cover`}
              />
            </div>
          ))}
        </div>
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
