import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import ImageGallery from 'components/ImageGallery'
import PostBody from 'components/PostBody'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import ProConList from 'components/ProConList'
import RoomTech from 'components/RoomTech'
import VideoPlayer from 'components/Youtube'
import * as demo from 'lib/demo.data'
import type { HotelReview, Settings } from 'lib/sanity.queries'
import { BedDouble, CalendarDays, Hotel, MapPin } from 'lucide-react'
import { notFound } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import HelpfulTip from './HelpfulTip'
import HeroPhotoGallery from './HeroPhotoGallery'
import HotelRating from './HotelRating'

export interface HotelReviewPageProps {
  preview?: boolean
  loading?: boolean
  hotelReview: HotelReview
  settings: Settings
}

function HotelReviewPageContent(props: HotelReviewPageProps) {
  const { preview, loading, hotelReview, settings } = props
  const { title = demo.title } = settings || {}

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  )

  const galleryImages = [
    hotelReview.coverImage,
    ...(hotelReview.gallery || []),
  ].filter(Boolean)

  const openModal = (index: number) => setSelectedImageIndex(index)

  const closeModal = useCallback(() => setSelectedImageIndex(null), [])

  const nextImage = useCallback(() => {
    if (!galleryImages || galleryImages.length === 0) return
    setSelectedImageIndex((prevIndex) =>
      prevIndex === null ? null : (prevIndex + 1) % galleryImages.length,
    )
  }, [galleryImages])

  const prevImage = useCallback(() => {
    if (!galleryImages || galleryImages.length === 0) return
    setSelectedImageIndex((prevIndex) =>
      prevIndex === null
        ? null
        : (prevIndex - 1 + galleryImages.length) % galleryImages.length,
    )
  }, [galleryImages])

  // Keyboard navigation for the modal
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

  return (
    <div>
      <PostPageHead settings={settings} post={hotelReview} />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />

        {galleryImages.length > 0 && (
          <HeroPhotoGallery
            images={galleryImages}
            onShowAllPhotos={() => openModal(0)}
          />
        )}

        <article className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          {/* Hotel Review Header - will create dedicated component later */}
          <header className="mb-12">
            <h1 className="mb-4 text-4xl font-bold">{hotelReview.title}</h1>
            <div className="mb-4 flex flex-wrap items-center justify-start gap-x-6 gap-y-2">
              {hotelReview.location && (
                <div className="flex items-center text-lg text-muted-foreground">
                  <MapPin className="mr-2 h-5 w-5" />
                  {hotelReview.location}
                </div>
              )}
              {hotelReview.category && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Hotel className="mr-2 h-4 w-4" />
                  {hotelReview.category}
                </div>
              )}
              {hotelReview.room && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <BedDouble className="mr-2 h-4 w-4" />
                  {hotelReview.room}
                </div>
              )}
              {hotelReview.date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {new Date(hotelReview.date).toLocaleDateString()}
                </div>
              )}
            </div>
          </header>

          <div className="space-y-12 md:space-y-16">
            {hotelReview.hotelRating && (
              <HotelRating hotelRating={hotelReview.hotelRating} />
            )}

            {hotelReview.tip && <HelpfulTip tip={hotelReview.tip} />}

            {/* Hotel-specific content sections */}
            <ProConList
              positives={hotelReview.positives}
              negatives={hotelReview.negatives}
              verdict2={hotelReview.verdict}
            />

            <RoomTech
              techAvailable={hotelReview.techRating}
              speed={hotelReview.internetSpeed}
              roomAmenitiesAvailiable={hotelReview.roomAmenities}
            />

            {/* <div className="container mx-auto"> */}
            <PostBody content={hotelReview.content} />
            {/* </div> */}

            {hotelReview.youtube && <VideoPlayer url={hotelReview.youtube} />}

            {hotelReview.gallery?.length > 0 && (
              <ImageGallery
                title="Photo Gallery"
                images={hotelReview.gallery}
                selectedImageIndex={selectedImageIndex}
                openModal={openModal}
                closeModal={closeModal}
                nextImage={nextImage}
                prevImage={prevImage}
              />
            )}
          </div>
        </article>
        <Footer />
      </Layout>
    </div>
  )
}

export default function HotelReviewPage(props: HotelReviewPageProps) {
  const { preview, loading, hotelReview } = props

  if (!hotelReview?.slug && !preview) {
    notFound()
  }

  // Early return if hotel review is not found
  if (!hotelReview) {
    return preview ? (
      <Layout preview={preview} loading={loading}>
        <PostTitle>Loading…</PostTitle>
      </Layout>
    ) : (
      notFound()
    )
  }

  return <HotelReviewPageContent {...props} />
}