import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import FoodRatings from 'components/IndividualFoodRating'
import PostBody from 'components/PostBody'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import Footer from 'components/Footer'
import ProConList from 'components/ProConList'
import VideoPlayer from 'components/Youtube'
import ImageGallery from 'components/ImageGallery'

import * as demo from 'lib/demo.data'
import type { FoodReview, Settings } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'

export interface FoodReviewPageProps {
  preview?: boolean
  loading?: boolean
  foodReview: FoodReview
  settings: Settings
}

export default function FoodReviewPage(props: FoodReviewPageProps) {
  const { preview, loading, foodReview, settings } = props
  const { title = demo.title } = settings || {}

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

  // Determine which rating to show based on dining type
  const currentRating = foodReview.diningType === 'takeout' 
    ? foodReview.takeoutRating 
    : foodReview.foodRating

  return (
    <div>
      <PostPageHead settings={settings} post={foodReview} />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />
        
        <article className="container mx-auto px-4 py-12 md:px-6 lg:px-36 lg:py-20 xl:py-36">
          {/* Food Review Header - will create dedicated component later */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{foodReview.title}</h1>
            {foodReview.location && (
              <p className="text-lg text-gray-600 mb-2">📍 {foodReview.location}</p>
            )}
            {foodReview.diningType && (
              <p className="text-sm text-gray-500 mb-2">
                🍽️ {foodReview.diningType === 'dinein' ? 'Dine-in' : 'Takeout'}
              </p>
            )}
            {foodReview.date && (
              <p className="text-sm text-gray-500">
                📅 {new Date(foodReview.date).toLocaleDateString()}
              </p>
            )}
          </header>

          {/* Individual Food Ratings */}
          {foodReview.individualFoodRating?.length > 0 && (
            <FoodRatings food={foodReview.individualFoodRating} />
          )}

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

        {foodReview.gallery?.length > 0 && (
          <ImageGallery title="Photo Gallery" images={foodReview.gallery} />
        )}

        <Footer />
      </Layout>
    </div>
  )
}

