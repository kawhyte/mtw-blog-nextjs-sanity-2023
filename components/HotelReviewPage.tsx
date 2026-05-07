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
import { calculateRating } from 'lib/calculateRating'
import { computeTimelineEntries, getEffectiveRating } from 'lib/mergeRatings'
import { HOTEL_WEIGHTS } from 'lib/ratingWeights'
import type { HotelReview, Settings } from 'lib/sanity.queries'
import {
  Bath,
  Bed,
  BedDouble,
  BrushCleaning,
  CalendarDays,
  Dumbbell,
  Handshake,
  Hotel,
  MapPin,
  Star,
  WavesLadder,
  Wifi,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import HelpfulTip from './HelpfulTip'
import HeroPhotoGallery from './HeroPhotoGallery'
import RevisitTimeline from './RevisitTimeline'
import ReviewBlurb from './ReviewBlurb'
import ReviewRating from './ReviewRating'
import ReviewStructuredData from './ReviewStructuredData'

export interface HotelReviewPageProps {
  preview?: boolean
  loading?: boolean
  hotelReview: HotelReview
  settings: Settings
}

import { usePhotoGallery } from 'hooks/usePhotoGallery'
import { urlForImage } from 'lib/sanity.image'

const HOTEL_RATING_LABELS: Record<string, string> = {
  Location: 'Location',
  Bed_Comfort: 'Bed Comfort',
  Service: 'Service',
  Value: 'Value',
  Room_Cleanliness: 'Cleanliness',
  Room_Amenities: 'Room Amenities',
  Internet_Speed: 'Internet Speed',
  Gym: 'Gym',
  Pool: 'Pool',
}

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
}

function HotelReviewPageContent(props: HotelReviewPageProps) {
  const { preview, loading, hotelReview, settings } = props
  const { title = demo.title } = settings || {}

  // Compute effective rating by accumulating all revisit updates
  const effectiveHotelRating = hotelReview.hotelRating
    ? getEffectiveRating(
        hotelReview.hotelRating as Record<string, number | undefined>,
        (hotelReview.revisits ?? []).map((r) => ({
          visitDate: r.visitDate,
          ratingUpdates: r.ratingUpdates as Record<string, number | undefined>,
        })),
      )
    : hotelReview.hotelRating

  // Compute original rating for the timeline baseline
  const originalRatingResult =
    hotelReview.hotelRating
      ? calculateRating(
          hotelReview.hotelRating as Record<string, number>,
          HOTEL_WEIGHTS,
        )
      : null

  // Compute timeline entries with per-revisit deltas
  const timelineEntries =
    hotelReview.revisits?.length && hotelReview.hotelRating
      ? computeTimelineEntries(
          hotelReview.hotelRating as Record<string, number | undefined>,
          (hotelReview.revisits ?? []).map((r) => ({
            visitDate: r.visitDate,
            notes: r.notes,
            ratingUpdates: r.ratingUpdates as Record<string, number | undefined>,
          })),
          HOTEL_RATING_LABELS,
        ).map((entry) => {
          const result = calculateRating(
            entry.accumulatedState as Record<string, number>,
            HOTEL_WEIGHTS,
          )
          return {
            visitDate: entry.visitDate,
            notes: entry.notes,
            deltas: entry.deltas,
            displayRating: result.displayRating,
            textRating: result.textRating,
            color: result.color ?? '#6B7280',
          }
        })
      : []

  const {
    galleryImages,
    selectedImageIndex,
    openModal,
    closeModal,
    nextImage,
    prevImage,
  } = usePhotoGallery(hotelReview.coverImage, hotelReview.gallery)

  return (
    <div>
      <PostPageHead
        settings={settings}
        post={hotelReview}
        contentType="hotel"
      />

      <ReviewStructuredData
        review={hotelReview}
        reviewType="hotel"
        pageUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/hotel/${typeof hotelReview.slug === 'string' ? hotelReview.slug : (hotelReview.slug as any)?.current || ''}`}
        imageUrl={
          hotelReview.coverImage
            ? urlForImage(hotelReview.coverImage).width(1200).height(630).url()
            : `${process.env.NEXT_PUBLIC_SITE_URL}/MeettheWhytes.jpg`
        }
      />

      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Hotel Reviews', url: '/hotels' },
          {
            name: hotelReview.title || 'Hotel Review',
            url: `/hotel/${typeof hotelReview.slug === 'string' ? hotelReview.slug : (hotelReview.slug as any)?.current || ''}`,
          },
        ]}
      />

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
            {effectiveHotelRating && (
              <ReviewRating
                ratings={effectiveHotelRating}
                ratingIcons={hotelRatingIcons}
                title="Hotel Rating"
                reviewType="hotel"
              />
            )}

            {timelineEntries.length > 0 && originalRatingResult && hotelReview.date && (
              <RevisitTimeline
                originalDate={hotelReview.date}
                originalDisplayRating={originalRatingResult.displayRating}
                originalTextRating={originalRatingResult.textRating}
                originalColor={originalRatingResult.color ?? '#6B7280'}
                entries={timelineEntries}
              />
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
