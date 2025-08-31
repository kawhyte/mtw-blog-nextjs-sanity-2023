import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import PostBody from 'components/PostBody'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import Footer from 'components/Footer'
import ProConList from 'components/ProConList'
import RoomTech from 'components/RoomTech'
import VideoPlayer from 'components/Youtube'
import ImageGallery from 'components/ImageGallery'

import * as demo from 'lib/demo.data'
import type { HotelReview, Settings } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'

export interface HotelReviewPageProps {
  preview?: boolean
  loading?: boolean
  hotelReview: HotelReview
  settings: Settings
}

export default function HotelReviewPage(props: HotelReviewPageProps) {
  const { preview, loading, hotelReview, settings } = props
  const { title = demo.title } = settings || {}

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

  return (
    <div>
      <PostPageHead settings={settings} post={hotelReview} />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />
        
        <article className="container mx-auto px-4 py-12 md:px-6 lg:px-36 lg:py-20 xl:py-36">
          {/* Hotel Review Header - will create dedicated component later */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{hotelReview.title}</h1>
            {hotelReview.location && (
              <p className="text-lg text-gray-600 mb-2">📍 {hotelReview.location}</p>
            )}
            {hotelReview.category && (
              <p className="text-sm text-gray-500 mb-2">🏨 {hotelReview.category}</p>
            )}
            {hotelReview.room && (
              <p className="text-sm text-gray-500 mb-4">🛏️ {hotelReview.room}</p>
            )}
            {hotelReview.date && (
              <p className="text-sm text-gray-500">
                📅 {new Date(hotelReview.date).toLocaleDateString()}
              </p>
            )}
          </header>

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
        </article>

        <div className="container mx-auto">
          <PostBody content={hotelReview.content} />
        </div>

        <VideoPlayer url={hotelReview.youtube} />

        {hotelReview.gallery?.length > 0 && (
          <ImageGallery title="Photo Gallery" images={hotelReview.gallery} />
        )}

        <Footer />
      </Layout>
    </div>
  )
}

