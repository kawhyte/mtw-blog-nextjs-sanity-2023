import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import ImageGallery from 'components/ImageGallery'
import PostBody from 'components/PostBody'
import { formatDate } from 'components/PostDate'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import ProConList from 'components/ProConList'
import RoomTech from 'components/RoomTech'
import VideoPlayer from 'components/Youtube'
import { calculateRating } from 'lib/calculateRating'
import * as demo from 'lib/demo.data'
import { computeTimelineEntries, getEffectiveRating } from 'lib/mergeRatings'
import { HOTEL_WEIGHTS } from 'lib/ratingWeights'
import type { HotelReview, Settings } from 'lib/sanity.queries'
import {
  Armchair,
  Banknote,
  Bath,
  Bed,
  BedDouble,
  BrushCleaning,
  CalendarDays,
  Dumbbell,
  Handshake,
  Hotel,
  MapPin,
  RefreshCw,
  Star,
  Tag,
  Users,
  WavesLadder,
  Wifi,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import HelpfulTip from './HelpfulTip'
import HeroPhotoGallery from './HeroPhotoGallery'
import ResortFeeCard from './ResortFeeCard'
import ReviewBlurb from './ReviewBlurb'
import ReviewRating from './ReviewRating'
import ReviewStructuredData from './ReviewStructuredData'
import RevisitTimeline from './RevisitTimeline'
import { Section } from './ui/Section'

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

const WOULD_RETURN_CONFIG = {
  yes: { label: 'Would Return', className: 'text-green-600' },
  if_prices_drop: { label: 'Would Return If Cheaper', className: 'text-amber-500' },
  maybe: { label: 'Maybe Return', className: 'text-amber-500' },
  no: { label: "Wouldn't Return", className: 'text-destructive' },
} as const

const PRICE_TIER_LABELS: Record<string, string> = {
  under_100: 'Under $100/night',
  '100_200': '$100–$200/night',
  '200_350': '$200–$350/night',
  '350_500': '$350–$500/night',
  '500_plus': '$500+/night',
}

const BEST_FOR_LABELS: Record<string, string> = {
  business: 'Business Travel',
  couples: 'Couples',
  families: 'Families',
  solo: 'Solo Travel',
  leisure: 'Leisure',
  points: 'Points Redemption',
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
    isOpen,
    openModal,
    closeModal,
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
            onShowAllPhotos={openModal}
          />
        )}

        <article className="container mx-auto px-4 md:px-6">
          <Section spacing="tight" as="div">
            <header>
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
                    {formatDate(hotelReview.date)}
                  </div>
                )}
                {hotelReview.lounge && hotelReview.lounge.toLowerCase() !== 'no' && (
                  <div className="flex items-center text-base text-muted-foreground">
                    <Armchair className="mr-2 h-4 w-4" />
                    {hotelReview.lounge.toLowerCase().includes('free')
                      ? 'Lounge: Free Access'
                      : 'Lounge: Member/Paid'}
                  </div>
                )}
                {hotelReview.wouldReturn && (
                  <div className={`flex items-center text-base font-medium ${WOULD_RETURN_CONFIG[hotelReview.wouldReturn].className}`}>
                    <RefreshCw className="mr-2 h-4 w-4 shrink-0" />
                    {WOULD_RETURN_CONFIG[hotelReview.wouldReturn].label}
                  </div>
                )}
                {hotelReview.priceTier && (
                  <div className="flex items-center text-base text-muted-foreground">
                    <Banknote className="mr-2 h-4 w-4 shrink-0" />
                    {PRICE_TIER_LABELS[hotelReview.priceTier] ?? hotelReview.priceTier}
                  </div>
                )}
              </div>

              {hotelReview.bestFor && hotelReview.bestFor.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1.5 h-4 w-4 shrink-0" />
                    <span className="font-medium">Best for:</span>
                  </div>
                  {hotelReview.bestFor.map((type) => (
                    <span
                      key={type}
                      className="rounded-full border border-border bg-muted px-3 py-0.5 text-sm text-muted-foreground"
                    >
                      {BEST_FOR_LABELS[type] ?? type}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {hotelReview.excerpt2 && (
              <ReviewBlurb
                content={hotelReview.excerpt2}
                source={hotelReview.blurbSource}
                url={hotelReview.blurbUrl}
              />
            )}
          </Section>

          {effectiveHotelRating && (
            <Section spacing="tight" as="div">
              <ReviewRating
                ratings={effectiveHotelRating}
                ratingIcons={hotelRatingIcons}
                title="Hotel Rating"
                reviewType="hotel"
              />
            </Section>
          )}

          {timelineEntries.length > 0 && originalRatingResult && hotelReview.date && (
            <Section spacing="tight" as="div">
              <RevisitTimeline
                originalDate={hotelReview.date}
                originalDisplayRating={originalRatingResult.displayRating}
                originalTextRating={originalRatingResult.textRating}
                originalColor={originalRatingResult.color ?? '#6B7280'}
                entries={timelineEntries}
              />
            </Section>
          )}

          <Section spacing="tight" as="div">
            <ProConList
              positives={hotelReview.positives}
              negatives={hotelReview.negatives}
              verdict2={hotelReview.verdict}
            />
          </Section>

          {hotelReview.resortFee && (
            <Section spacing="tight" as="div">
              <ResortFeeCard data={hotelReview.resortFee} />
            </Section>
          )}

          {hotelReview.tip && (
            <Section spacing="tight" as="div">
              <HelpfulTip tip={hotelReview.tip} />
            </Section>
          )}

          <Section spacing="tight" as="div">
            <RoomTech
              techAvailable={hotelReview.techRating}
              speed={hotelReview.internetSpeed}
              roomAmenitiesAvailiable={hotelReview.roomAmenities}
              parking={hotelReview.parking}
              breakfast={hotelReview.breakfast}
            />
          </Section>

          <Section spacing="tight" as="div">
            <PostBody content={hotelReview.content} />
          </Section>

          {hotelReview.tags && hotelReview.tags.length > 0 && (
            <Section spacing="tight" as="div">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                {hotelReview.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {hotelReview.youtube && (
            <Section spacing="tight" as="div">
              <VideoPlayer url={hotelReview.youtube} />
            </Section>
          )}

          {galleryImages.length > 0 && (
            <ImageGallery
              images={galleryImages}
              isOpen={isOpen}
              openModal={openModal}
              closeModal={closeModal}
              showInlineGrid={false}
            />
          )}
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
