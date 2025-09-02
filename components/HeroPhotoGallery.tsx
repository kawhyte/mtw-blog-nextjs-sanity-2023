// components/HeroPhotoGallery.tsx

import { urlForImage } from 'lib/sanity.image';
import { Camera } from 'lucide-react';
import Image from 'next/image';

interface HeroPhotoGalleryProps {
  images: any[];
  onShowAllPhotos: () => void;
}

export default function HeroPhotoGallery({ images, onShowAllPhotos }: HeroPhotoGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  const mainImage = images[0];
  const otherImages = images.slice(1, 5);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Mobile: Main image only */}
      <div className="relative h-96 md:hidden">
        <Image
          src={urlForImage(mainImage)?.width(800).height(600).fit('crop').url() || ''}
          alt={mainImage.alt || 'Main hotel image'}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-2 gap-2">
        {/* Main Image */}
        <div className="relative h-[550px]">
          <Image
            src={urlForImage(mainImage)?.width(1200).height(800).fit('crop').url() || ''}
            alt={mainImage.alt || 'Main hotel image'}
            layout="fill"
            objectFit="cover"
            className="rounded-l-xl"
          />
        </div>

        {/* Other Images */}
        <div className="grid grid-cols-2 gap-2">
          {otherImages.map((image, index) => (
            <div key={index} className="relative h-[273px]">
              <Image
                src={urlForImage(image)?.width(600).height(400).fit('crop').url() || ''}
                alt={image.alt || `Hotel image ${index + 2}`}
                layout="fill"
                objectFit="cover"
                className={`${index === 1 ? 'rounded-tr-xl' : ''} ${index === 3 ? 'rounded-br-xl' : ''}`}
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
  );
}