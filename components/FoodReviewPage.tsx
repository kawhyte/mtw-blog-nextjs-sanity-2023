import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import FoodRatings from 'components/IndividualFoodRating'
import PostBody from 'components/PostBody'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import Footer from 'components/Footer'
import ProConList from 'components/ProConList'
import HelpfulTip from './HelpfulTip'
import VideoPlayer from 'components/Youtube'
import ImageGallery from 'components/ImageGallery'
import HeroPhotoGallery from 'components/HeroPhotoGallery'
import ReviewBlurb from './ReviewBlurb'
import { useState, useCallback, useEffect } from 'react'

import * as demo from 'lib/demo.data'
import type { FoodReview, Settings } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'

export interface FoodReviewPageProps {
  preview?: boolean
  loading?: boolean
  foodReview: FoodReview
  settings: Settings
}

import { usePhotoGallery } from 'hooks/usePhotoGallery'
import { BedDouble, CalendarDays, MapPin, Utensils, Star, Smile, Presentation, SprayCan, Handshake } from 'lucide-react'
import ReviewRating from './ReviewRating';

const foodRatingIcons = {
  Flavor_and_Taste: <Utensils className="h-5 w-5 mr-2 " />,
  Food_Value: <Star className="h-5 w-5 mr-2 " />,
  Memorability: <Smile className="h-5 w-5 mr-2 " />,
  Presentation_on_Plate: <Presentation className="h-5 w-5 mr-2 " />,
  Restaurant_Cleanliness: <SprayCan className="h-5 w-5 mr-2 " />,
  Restaurant_Location: <MapPin className="h-5 w-5 mr-2 " />,
  Restaurant_Service: <Handshake className="h-5 w-5 mr-2 " />,
};

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

  console.log('foodReview', foodReview)
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

  // Determine which rating to show based on dining type
  const currentRating =
    foodReview.diningType === 'takeout'
      ? foodReview.takeoutRating
      : foodReview.foodRating

  return (
    <div>
      <PostPageHead settings={settings} post={foodReview} />

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

          {foodReview.excerpt2 && (
            <ReviewBlurb
              content={foodReview.excerpt2}
            />
          )}

          {currentRating && (
            <ReviewRating ratings={currentRating} ratingIcons={foodRatingIcons} title="Food Rating" />
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
