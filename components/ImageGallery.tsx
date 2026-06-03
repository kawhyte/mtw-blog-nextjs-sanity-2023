// components/ImageGallery.tsx

import { urlForImage } from 'lib/sanity.image'
import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useRef } from 'react'

import SanityImage from './SanityImage'
import SectionTitle from './SectionTitle'

// --- Interfaces ---
export interface GalleryImage {
  _key?: string
  alt?: string
  caption?: string
  category?: string
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

// --- Category label map (value → display name) ---
const CATEGORY_LABELS: Record<string, string> = {
  // Hotels
  bedroom: 'Bedroom',
  bathroom: 'Bathroom',
  'living-area': 'Living Area',
  'kitchen-coffee': 'Kitchen / Coffee Station',
  view: 'View from the Room',
  'pool-fitness': 'Pool & Fitness',
  // Food
  'food-drinks': 'Food & Drinks',
  interior: 'Interior & Atmosphere',
  exterior: 'Exterior',
  menu: 'Menu',
  // Arenas
  court: 'Seating & Game Floor',
  concessions: 'Concessions & Food',
  lobby: 'Entrances & Lobby',
  // Shared
  other: 'Additional Photos',
}

function getCategoryLabel(value: string): string {
  return CATEGORY_LABELS[value] ?? value
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

  // Determine if any images have a category set
  const hasCategories = hasImages && images.some((img) => !!img.category)

  // Build ordered category sections when Photo Tour mode is active
  const categorySections = React.useMemo(() => {
    if (!hasCategories || !images) return []

    // Collect categories in the order they first appear
    const seen = new Set<string>()
    const order: string[] = []
    images.forEach((img) => {
      const cat = img.category || 'other'
      if (!seen.has(cat)) {
        seen.add(cat)
        order.push(cat)
      }
    })
    // Always put 'other' / uncategorised last
    if (seen.has('other')) {
      const idx = order.indexOf('other')
      order.splice(idx, 1)
      order.push('other')
    }
    // Check for uncategorised images and add an 'other' bucket if needed
    const hasUncategorised = images.some((img) => !img.category)
    if (hasUncategorised && !seen.has('other')) {
      order.push('other')
    }

    return order.map((cat) => ({
      key: cat,
      label: getCategoryLabel(cat),
      photos: images.filter((img) => (img.category || 'other') === cat),
    }))
  }, [hasCategories, images])

  // Refs for each category section so we can scroll to them
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  function scrollToSection(key: string) {
    const el = sectionRefs.current[key]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

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
                const imageUrl = urlForImage(item)
                  .width(800)
                  .auto('format')
                  .url()
                const imageAlt = item.alt || `Gallery image ${i + 1}`
                const blurData = item.asset.metadata?.lqip
                const hasCaption =
                  item.caption && item.caption.trim().length > 0

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

      {/* --- Full-Screen Gallery Modal --- */}
      {isOpen && hasImages && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          {/* Sticky header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
            <div className="flex items-center justify-between p-4">
              <span className="font-semibold text-foreground">
                {hasCategories ? 'Photo Tour' : `All photos (${images.length})`}
              </span>
              <button
                onClick={closeModal}
                className="rounded-full p-2 transition-colors hover:bg-muted"
                aria-label="Close gallery"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Category tabs — only shown when categories are present */}
            {hasCategories && (
              <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
                {categorySections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => scrollToSection(section.key)}
                    className="flex-shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:border-foreground/30 whitespace-nowrap"
                  >
                    {section.label}
                    <span className="ml-1.5 text-muted-foreground text-xs">
                      ({section.photos.length})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scrollable content */}
          <div className="mx-auto max-w-6xl p-4 md:p-8 space-y-10">
            {hasCategories ? (
              // Photo Tour mode — sections with headings
              categorySections.map((section) => (
                <div
                  key={section.key}
                  ref={(el) => { sectionRefs.current[section.key] = el }}
                  className="scroll-mt-32"
                >
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    {section.label}
                  </h2>
                  <div className="columns-1 md:columns-2 space-y-4">
                    {section.photos.map((item, i) => {
                      if (!item?.asset) return null
                      const imageAlt = item.alt || `${section.label} photo ${i + 1}`
                      const hasCaption = item.caption && item.caption.trim().length > 0

                      return (
                        <div
                          key={item._key || `${section.key}-${i}`}
                          className="break-inside-avoid flex flex-col gap-2"
                        >
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
              ))
            ) : (
              // Flat mode — existing behaviour
              <div className="columns-1 md:columns-2 space-y-4">
                {images.map((item, i) => {
                  if (!item?.asset) return null
                  const imageAlt = item.alt || `Gallery image ${i + 1}`
                  const hasCaption = item.caption && item.caption.trim().length > 0

                  return (
                    <div
                      key={item._key || `modal-${i}`}
                      className="break-inside-avoid flex flex-col gap-2"
                    >
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
            )}
          </div>
        </div>
      )}
    </section>
  )
}
