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
import ReviewRating from './ReviewRating';
import ReviewBlurb from './ReviewBlurb'

export interface HotelReviewPageProps {
  preview?: boolean
  loading?: boolean
  hotelReview: HotelReview
  settings: Settings
}

import { usePhotoGallery } from 'hooks/usePhotoGallery';

const hotelRatingIcons = {
  Value: <Star className="h-5 w-5 mr-2 " />,
  Gym: <Dumbbell className="h-5 w-5 mr-2 " />,
  Internet_Speed: <Wifi className="h-5 w-5 mr-2 " />,
  Service: <Handshake className="h-5 w-5 mr-2 " />,
  Room_Cleanliness: <BrushCleaning className="h-5 w-5 mr-2 " />,
  Bed_Comfort: <Bed className="h-5 w-5 mr-2 " />,
  Room_Amenities: <Bath className="h-5 w-5 mr-2 " />,
  Pool: <WavesLadder className="h-5 w-5 mr-2 " />,
  Location: <MapPin className="h-5 w-5 mr-2 " />,
};

function HotelReviewPageContent(props: HotelReviewPageProps) {
  const { preview, loading, hotelReview, settings } = props
  const { title = demo.title } = settings || {}

  const {
    galleryImages,
    selectedImageIndex,
    openModal,
    closeModal,
    nextImage,
    prevImage,
  } = usePhotoGallery(hotelReview.coverImage, hotelReview.gallery);


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
                <div className="flex items-center text-base text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {hotelReview.location}
                </div>
              )}
              {hotelReview.category && (
                <div className="flex items-center text-base text-muted-foreground capitalize">
                  <Hotel className="mr-2 h-4 w-4" />
                  {hotelReview.category}
                </div>
              )}
              {hotelReview.room && (
                <div className="flex items-center text-base text-muted-foreground">
                  <BedDouble className="mr-2 h-4 w-4" />
                  {hotelReview.room}
                </div>
              )}
              {hotelReview.date && (
                <div className="flex items-center text-base text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {new Date(hotelReview.date).toLocaleDateString()}
                </div>
              )}
            </div>
          </header>

          {hotelReview.excerpt2 && (
            <ReviewBlurb
              content={hotelReview.excerpt2}
              source={hotelReview.blurbSource}
              url={hotelReview.blurbUrl}
            />
          )}

          <div className="space-y-12 md:space-y-16">
            {hotelReview.hotelRating && (
              <ReviewRating ratings={hotelReview.hotelRating} ratingIcons={hotelRatingIcons} title="Hotel Rating" />
            )}


            {/* Hotel-specific content sections */}
            <ProConList
              positives={hotelReview.positives}
              negatives={hotelReview.negatives}
              verdict2={hotelReview.verdict}
              />

{hotelReview.tip && <HelpfulTip tip={hotelReview.tip} />}
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