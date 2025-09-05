import { useState, useCallback, useEffect } from 'react'
import type { GalleryImage } from 'components/ImageGallery'

export function usePhotoGallery(
  coverImage?: GalleryImage,
  gallery?: GalleryImage[],
) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  )

  const galleryImages = [coverImage, ...(gallery || [])].filter(
    Boolean,
  ) as GalleryImage[]

  const openModal = (index: number) => setSelectedImageIndex(index)

  const closeModal = useCallback(() => setSelectedImageIndex(null), [])

  const nextImage = useCallback(() => {
    if (!galleryImages || galleryImages.length === 0) return
    setSelectedImageIndex((prevIndex) =>
      prevIndex === null ? null : (prevIndex + 1) % galleryImages.length,
    )
  }, [galleryImages, selectedImageIndex])

  const prevImage = useCallback(() => {
    if (!galleryImages || galleryImages.length === 0) return
    setSelectedImageIndex((prevIndex) =>
      prevIndex === null
        ? null
        : (prevIndex - 1 + galleryImages.length) % galleryImages.length,
    )
  }, [galleryImages, selectedImageIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, nextImage, prevImage, closeModal])

  return {
    galleryImages,
    selectedImageIndex,
    openModal,
    closeModal,
    nextImage,
    prevImage,
  }
}
