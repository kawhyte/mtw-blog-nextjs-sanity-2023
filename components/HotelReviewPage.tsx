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

import HelpfulTip from './HelpfulTip'
import HeroPhotoGallery from './HeroPhotoGallery'
import HotelRating from './HotelRating'
import SectionTitle from './SectionTitle'

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

  const galleryImages = [
    hotelReview.coverImage,
    ...(hotelReview.gallery || []),
  ].filter(Boolean)


  console.log("hotel Review", hotelReview)
  return (
    <div>
      <PostPageHead settings={settings} post={hotelReview} />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />

        {galleryImages.length > 0 && (
          <HeroPhotoGallery images={galleryImages} />
        )}

        <article className="container mx-auto px-4 py-6 md:px-6 lg:px- lg:py-4 xl:py-">
          {/* Hotel Review Header - will create dedicated component later */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{hotelReview.title}</h1>
            <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 mb-4">
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
