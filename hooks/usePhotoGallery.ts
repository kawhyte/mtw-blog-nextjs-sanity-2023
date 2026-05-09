import { useState, useCallback, useEffect } from 'react'
import type { GalleryImage } from 'components/ImageGallery'

export function usePhotoGallery(
  coverImage?: GalleryImage,
  gallery?: GalleryImage[],
) {
  const [isOpen, setIsOpen] = useState(false)

  const galleryImages = [coverImage, ...(gallery || [])].filter(
    Boolean,
  ) as GalleryImage[]

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
    galleryImages,
    isOpen,
    openModal,
    closeModal,
  }
}
