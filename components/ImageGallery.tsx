// components/ImageGallery.tsx

import { urlForImage } from 'lib/sanity.image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import SectionTitle from './SectionTitle';

// --- Interfaces ---
export interface GalleryImage {
  _key?: string;
  alt?: string;
  asset?: {
    _ref: string;
    _type: 'reference';
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
      lqip?: string;
    };
  };
}

export interface ImageGalleryProps {
  images?: GalleryImage[];
  title?: string;
  className?: string;
  selectedImageIndex: number | null;
  openModal: (index: number) => void;
  closeModal: () => void;
  nextImage: () => void;
  prevImage: () => void;
}

// --- Main Exported Component ---
export default function ImageGallery({
  images,
  title,
  className,
  selectedImageIndex,
  openModal,
  closeModal,
  nextImage,
  prevImage,
}: ImageGalleryProps) {
  const hasImages = images && images.length > 0;

  return (
    <section className={`w-full my-6 ${className || ''}`}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="pb-2">
            <SectionTitle header={title} />
          </div>
        )}

        {hasImages ? (
          <div className="columns-1 gap-4 space-y-4 sm:columns-2 md:columns-3 lg:columns-4">
            {images.map((item, i) => {
              if (!item?.asset) return null;
              const imageUrl = urlForImage(item).width(800).auto('format').url();
              const imageAlt = item.alt || `Gallery image ${i + 1}`;
              const blurData = item.asset.metadata?.lqip;

              return (
                <div
                  key={item._key || `gallery-${i}`}
                  className="break-inside-avoid group relative cursor-pointer"
                  onClick={() => openModal(i)}
                >
                  <Image
                    className="h-auto w-full rounded-lg object-cover shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105"
                    src={imageUrl}
                    alt={imageAlt}
                    width={item.asset.metadata?.dimensions?.width || 800}
                    height={item.asset.metadata?.dimensions?.height || 600}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    placeholder={blurData ? 'blur' : 'empty'}
                    blurDataURL={blurData}
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 rounded-lg" />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            The gallery is currently empty.
          </p>
        )}
      </div>

      {/* --- Lightbox Modal --- */}
      {selectedImageIndex !== null && hasImages && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          {/* Main Modal Content */}
          <div
            className="relative flex h-full max-h-[90vh] w-full max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking on the image/buttons
          >
            {/* Image Display */}
            <Image
              src={urlForImage(images[selectedImageIndex])
                .width(1920)
                .auto('format')
                .url()}
              alt={images[selectedImageIndex].alt || 'Full screen image'}
              width={
                images[selectedImageIndex].asset.metadata?.dimensions?.width ||
                1920
              }
              height={
                images[selectedImageIndex].asset.metadata?.dimensions?.height ||
                1080
              }
              className="object-contain w-auto h-auto max-w-full max-h-full rounded-lg shadow-2xl"
              placeholder={
                images[selectedImageIndex].asset.metadata?.lqip
                  ? 'blur'
                  : 'empty'
              }
              blurDataURL={images[selectedImageIndex].asset.metadata?.lqip}
            />

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 lg:top-0 lg:right-0 m-4 p-2 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors"
              aria-label="Close image view"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Previous Button */}
            <button
              onClick={prevImage}
              className="absolute left-0 m-4 p-2 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-0 m-4 p-2 rounded-full bg-card border border-border text-foreground hover:bg-muted transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}