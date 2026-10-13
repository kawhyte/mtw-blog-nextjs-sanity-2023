import { useState, useCallback, useEffect } from 'react'
import type { GalleryImage } from 'components/ImageGallery'

const HERO_MAX = 5

const assetId = (img: any): string | undefined =>
  img?.asset?._id ?? img?.asset?._ref

/** Drop empties and repeat photos (same Sanity asset), keeping first occurrence. */
const dedupeImages = (images: (GalleryImage | undefined | null)[]) => {
  const seen = new Set<string>()
  return images.filter((img): img is GalleryImage => {
    if (!img?.asset) return false
    const id = assetId(img)
    if (!id) return true
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

/**
 * @param heroPhotos  Editor-chosen hero photos (first = large). When set, the
 *                    hero shows exactly these.
 * @param images      Everything else for "Show all photos". Without heroPhotos,
 *                    the hero falls back to the first 5 of these (legacy layout).
 */
export function usePhotoGallery(
  heroPhotos: GalleryImage[] | undefined,
  images: (GalleryImage | undefined | null)[] | undefined,
) {
  const [isOpen, setIsOpen] = useState(false)

  const hero = dedupeImages(heroPhotos || [])
  const galleryImages = dedupeImages([...hero, ...(images || [])])
  const heroImages =
    hero.length > 0 ? hero.slice(0, HERO_MAX) : galleryImages.slice(0, HERO_MAX)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeModal])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen)
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  return {
    heroImages,
    galleryImages,
    isOpen,
    openModal,
    closeModal,
  }
}
