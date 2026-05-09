// components/ImageGallery.tsx

import { urlForImage } from 'lib/sanity.image'
import { X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import SanityImage from './SanityImage'
import SectionTitle from './SectionTitle'

// --- Interfaces ---
export interface GalleryImage {
  _key?: string
  alt?: string
  caption?: string
  asset?: {
    _ref: string
    _type: 'reference'
    metadata?: {
      dimensions?: {
        width: number
        height: number
      }
      lqip?: string
    }
  }
}

export interface ImageGalleryProps {
  images?: GalleryImage[]
  title?: string
  className?: string
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  showInlineGrid?: boolean
}

// --- Main Exported Component ---
export default function ImageGallery({
  images,
  title,
  className,
  isOpen,
  openModal,
  closeModal,
  showInlineGrid = true,
}: ImageGalleryProps) {
  const hasImages = images && images.length > 0

  return (
    <section className={`w-full my-6 ${className || ''}`}>
      {showInlineGrid && (
      <div className="container mx-auto px-4">
        {title && (
          <div className="pb-2">
            <SectionTitle header={title} />
          </div>
        )}

        {hasImages ? (
          <div className="columns-1 gap-4 space-y-4 sm:columns-2 md:columns-3 lg:columns-4">
            {images.map((item, i) => {
              if (!item?.asset) return null
              const imageUrl = urlForImage(item).width(800).auto('format').url()
              const imageAlt = item.alt || `Gallery image ${i + 1}`
              const blurData = item.asset.metadata?.lqip
              const hasCaption = item.caption && item.caption.trim().length > 0

              return (
                <div
                  key={item._key || `gallery-${i}`}
                  className="break-inside-avoid group relative cursor-pointer"
                  onClick={openModal}
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
                  {hasCaption && (
                    <div className="absolute inset-0 flex items-end rounded-lg bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            The gallery is currently empty.
          </p>
        )}
      </div>
      )}

      {/* --- Airbnb-style Full-Screen Gallery Modal --- */}
      {isOpen && hasImages && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 p-4 backdrop-blur">
            <span className="font-semibold text-foreground">
              All photos ({images.length})
            </span>
            <button
              onClick={closeModal}
              className="rounded-full p-2 transition-colors hover:bg-muted"
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable image grid */}
          <div className="mx-auto max-w-6xl columns-1 space-y-4 p-4 md:columns-2 md:p-8">
            {images.map((item, i) => {
              if (!item?.asset) return null
              const imageAlt = item.alt || `Gallery image ${i + 1}`
              const hasCaption = item.caption && item.caption.trim().length > 0

              return (
                <div key={item._key || `modal-${i}`} className="break-inside-avoid flex flex-col gap-2">
                  <SanityImage
                    image={item as any}
                    width={1200}
                    className="h-auto w-full rounded-lg object-cover"
                    alt={imageAlt}
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                  {hasCaption && (
                    <p className="px-1 text-sm text-muted-foreground">
                      {item.caption}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
