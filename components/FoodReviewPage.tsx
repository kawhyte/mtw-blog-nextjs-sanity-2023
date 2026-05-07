import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import HeroPhotoGallery from 'components/HeroPhotoGallery'
import ImageGallery from 'components/ImageGallery'
import FoodRatings from 'components/IndividualFoodRating'
import PostBody from 'components/PostBody'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import ProConList from 'components/ProConList'
import VideoPlayer from 'components/Youtube'
import * as demo from 'lib/demo.data'
import { calculateRating } from 'lib/calculateRating'
import { computeTimelineEntries, getEffectiveRating } from 'lib/mergeRatings'
import { FOOD_WEIGHTS, TAKEOUT_WEIGHTS } from 'lib/ratingWeights'
import type { FoodReview, Settings } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import HelpfulTip from './HelpfulTip'
import RevisitTimeline from './RevisitTimeline'
import ReviewBlurb from './ReviewBlurb'
import ReviewStructuredData from './ReviewStructuredData'

export interface FoodReviewPageProps {
  preview?: boolean
  loading?: boolean
  foodReview: FoodReview
  settings: Settings
}

import { usePhotoGallery } from 'hooks/usePhotoGallery'
import { urlForImage } from 'lib/sanity.image'
import {
  BedDouble,
  CalendarDays,
  CheckCircle,
  Handshake,
  MapPin,
  Package,
  Presentation,
  ShoppingBag,
  Smile,
  SprayCan,
  Star,
  Utensils,
} from 'lucide-react'

import ReviewRating from './ReviewRating'

const FOOD_RATING_LABELS: Record<string, string> = {
  Flavor_and_Taste: 'Flavor & Taste',
  Food_Value: 'Food Value',
  Restaurant_Service: 'Service',
  Memorability: 'Memorability',
  Presentation_on_Plate: 'Presentation',
  Restaurant_Cleanliness: 'Cleanliness',
  Restaurant_Location: 'Location',
}

const TAKEOUT_RATING_LABELS: Record<string, string> = {
  tasteAndFlavor: 'Taste & Flavor',
  foodValue: 'Food Value',
  overallSatisfaction: 'Satisfaction',
  presentation: 'Presentation',
  packaging: 'Packaging',
  accuracy: 'Accuracy',
}

const foodRatingIcons = {
  Flavor_and_Taste: <Utensils className="h-5 w-5 mr-2 " />,
  Food_Value: <Star className="h-5 w-5 mr-2 " />,
  Memorability: <Smile className="h-5 w-5 mr-2 " />,
  Presentation_on_Plate: <Presentation className="h-5 w-5 mr-2 " />,
  Restaurant_Cleanliness: <SprayCan className="h-5 w-5 mr-2 " />,
  Restaurant_Location: <MapPin className="h-5 w-5 mr-2 " />,
  Restaurant_Service: <Handshake className="h-5 w-5 mr-2 " />,
}

const takeoutRatingIcons = {
  tasteAndFlavor: <Utensils className="h-5 w-5 mr-2 " />,
  foodValue: <Star className="h-5 w-5 mr-2 " />,
  overallSatisfaction: <Smile className="h-5 w-5 mr-2 " />,
  presentation: <Presentation className="h-5 w-5 mr-2 " />,
  packaging: <Package className="h-5 w-5 mr-2 " />,
  accuracy: <CheckCircle className="h-5 w-5 mr-2 " />,
}

export default function FoodReviewPage(props: FoodReviewPageProps) {
  const { preview, loading, foodReview, settings } = props
  const { title = demo.title } = settings || {}

  const {
    galleryImages,
    selectedImageIndex,
    openModal,
    closeModal,
    nextImage,
    prevImage,
  } = usePhotoGallery(foodReview.coverImage, foodReview.gallery)

  if (!foodReview?.slug && !preview) {
    notFound()
  }

  // Early return if food review is not found
  if (!foodReview) {
    return preview ? (
      <Layout preview={preview} loading={loading}>
        <PostTitle>Loading…</PostTitle>
      </Layout>
    ) : (
      notFound()
    )
  }

  const isTakeout = foodReview.diningType === 'takeout'
  const weights = isTakeout ? TAKEOUT_WEIGHTS : FOOD_WEIGHTS
  const labelMap = isTakeout ? TAKEOUT_RATING_LABELS : FOOD_RATING_LABELS

  const baseRating = isTakeout ? foodReview.takeoutRating : foodReview.foodRating

  // Build revisit updates using the appropriate rating field
  const revisitsForMerge = (foodReview.revisits ?? []).map((r) => ({
    visitDate: r.visitDate,
    notes: r.notes,
    ratingUpdates: (isTakeout ? r.takeoutRatingUpdates : r.foodRatingUpdates) as
      | Record<string, number | undefined>
      | undefined,
  }))

  // Compute effective rating by accumulating all revisit updates
  const effectiveRating = baseRating
    ? getEffectiveRating(
        baseRating as Record<string, number | undefined>,
        revisitsForMerge,
      )
    : baseRating

  const currentRatingIcons =
    isTakeout ? takeoutRatingIcons : foodRatingIcons

  // Compute original rating for the timeline baseline
  const originalRatingResult = baseRating
    ? calculateRating(baseRating as Record<string, number>, weights)
    : null

  // Compute timeline entries with per-revisit deltas
  const timelineEntries =
    foodReview.revisits?.length && baseRating
      ? computeTimelineEntries(
          baseRating as Record<string, number | undefined>,
          revisitsForMerge,
          labelMap,
        ).map((entry) => {
          const result = calculateRating(
            entry.accumulatedState as Record<string, number>,
            weights,
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

  return (
    <div>
      <PostPageHead settings={settings} post={foodReview} contentType="food" />

      <ReviewStructuredData
        review={foodReview}
        reviewType="food"
        pageUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/food/${typeof foodReview.slug === 'string' ? foodReview.slug : (foodReview.slug as any)?.current || ''}`}
        imageUrl={
          foodReview.coverImage
            ? urlForImage(foodReview.coverImage).width(1200).height(630).url()
            : `${process.env.NEXT_PUBLIC_SITE_URL}/MeettheWhytes.jpg`
        }
      />

      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Food Reviews', url: '/food' },
          {
            name: foodReview.title || 'Food Review',
            url: `/food/${typeof foodReview.slug === 'string' ? foodReview.slug : (foodReview.slug as any)?.current || ''}`,
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
          {/* Food Review Header - will create dedicated component later */}
          <header className="mb-12">
            <h1 className="mb-4 text-4xl font-bold">{foodReview.title}</h1>
            <div className="mb-4 flex flex-wrap items-center justify-start gap-x-6 gap-y-2">
              {foodReview.location && (
                <div className="flex items-center text-base text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {foodReview.location}
                </div>
              )}
              {foodReview.diningType && (
                <div className="flex items-center text-base text-muted-foreground">
                  <BedDouble className="mr-2 h-4 w-4" />
                  {foodReview.diningType === 'dinein' ? 'Dine-in' : 'Takeout'}
                </div>
              )}
              {foodReview.date && (
                <div className="flex items-center text-base text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {new Date(foodReview.date).toLocaleDateString()}
                </div>
              )}
            </div>
          </header>

          {foodReview.excerpt2 && <ReviewBlurb content={foodReview.excerpt2} />}

          {effectiveRating && (
            <ReviewRating
              ratings={effectiveRating}
              ratingIcons={currentRatingIcons}
              title="Food Rating"
              reviewType="food"
            />
          )}

          {timelineEntries.length > 0 && originalRatingResult && foodReview.date && (
            <RevisitTimeline
              originalDate={foodReview.date}
              originalDisplayRating={originalRatingResult.displayRating}
              originalTextRating={originalRatingResult.textRating}
              originalColor={originalRatingResult.color ?? '#6B7280'}
              entries={timelineEntries}
            />
          )}

          {/* Individual Food Ratings */}
          {foodReview.individualFoodRating?.length > 0 && (
            <FoodRatings food={foodReview.individualFoodRating} />
          )}

          {foodReview.tip && <HelpfulTip tip={foodReview.tip} />}
          {/* Pros/Cons/Verdict */}
          <ProConList
            positives={foodReview.positives}
            negatives={foodReview.negatives}
            verdict2={foodReview.verdict}
          />
        </article>

        <div className="container mx-auto">
          <PostBody content={foodReview.content} />
        </div>

        <VideoPlayer url={foodReview.youtube} />

        {galleryImages.length > 0 && (
          <ImageGallery
            title="Photo Gallery"
            images={galleryImages}
            selectedImageIndex={selectedImageIndex}
            openModal={openModal}
            closeModal={closeModal}
            nextImage={nextImage}
            prevImage={prevImage}
          />
        )}

        <Footer />
      </Layout>
    </div>
  )
}
