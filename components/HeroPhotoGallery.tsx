// components/HeroPhotoGallery.tsx

import { urlForImage } from 'lib/sanity.image';
import Image from 'next/image';

interface HeroPhotoGalleryProps {
  images: any[];
}

export default function HeroPhotoGallery({ images }: HeroPhotoGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  const mainImage = images[0];
  const otherImages = images.slice(1, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Main Image */}
        <div className="relative h-96 md:h-[550px]">
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
            <div key={index} className="relative h-48 md:h-[273px]">
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
    </div>
  );
}