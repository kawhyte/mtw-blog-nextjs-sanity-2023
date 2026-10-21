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
import { withInternetRating } from 'lib/mbpsToRating'
import { computeTimelineEntries, getEffectiveRating } from 'lib/mergeRatings'
import { HOTEL_WEIGHTS } from 'lib/ratingWeights'
import type { HotelReview, Settings } from 'lib/sanity.queries'
import {
  Bath,
  Bed,
  BrushCleaning,
  ChevronRight,
  Dumbbell,
  Handshake,
  MapPin,
  Star,
  Tag,
  WavesLadder,
  Wifi,
} from 'lucide-react'
import Link from 'next/link'

import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import HelpfulTip from './HelpfulTip'
import HeroPhotoGallery from './HeroPhotoGallery'
import NearestArenaLink from './NearestArenaLink'
import ResortFeeCard from './ResortFeeCard'
import { ReviewActionBar } from './review/ReviewActions'
import ReviewSummaryPanel, {
  type ReviewChip,
} from './review/ReviewSummaryPanel'
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
  /** Arenas in the same city, for the "Going to a game?" box */
  arenasInCity?: { name: string; slug: string; location: string }[]
}

import { usePhotoGallery } from 'hooks/usePhotoGallery'
import { urlForImage } from 'lib/sanity.image'
import { locationToSlug } from 'utils/locationSlug'

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
  if_prices_drop: {
    label: 'Would Return If Cheaper',
    className: 'text-amber-500',
  },
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
  const { preview, loading, hotelReview, settings, arenasInCity = [] } = props
  const { title = demo.title } = settings || {}

  // Enrich the base rating: auto-compute Internet_Speed from the Mbps value when present.
  // Falls back to the stored Internet_Speed for docs that have no Mbps field (backward compat).
  const baseRatingWithInternet = hotelReview.hotelRating
    ? withInternetRating(
        hotelReview.hotelRating as Record<string, number | undefined>,
        hotelReview.internetSpeed,
      )
    : undefined

  // Compute effective rating by accumulating all revisit updates
  const effectiveHotelRating = baseRatingWithInternet
    ? getEffectiveRating(
        baseRatingWithInternet,
        (hotelReview.revisits ?? []).map((r) => ({
          visitDate: r.visitDate,
          ratingUpdates: r.ratingUpdates as Record<string, number | undefined>,
        })),
      )
    : hotelReview.hotelRating

  // Compute original rating for the timeline baseline
  const originalRatingResult = baseRatingWithInternet
    ? calculateRating(
        baseRatingWithInternet as Record<string, number>,
        HOTEL_WEIGHTS,
      )
    : null

  // Compute timeline entries with per-revisit deltas
  const timelineEntries =
    hotelReview.revisits?.length && baseRatingWithInternet
      ? computeTimelineEntries(
          baseRatingWithInternet,
          (hotelReview.revisits ?? []).map((r) => ({
            visitDate: r.visitDate,
            notes: r.notes,
            ratingUpdates: r.ratingUpdates as Record<
              string,
              number | undefined
            >,
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

  const { heroImages, galleryImages, isOpen, openModal, closeModal } =
    usePhotoGallery(hotelReview.heroPhotos, [
      hotelReview.coverImage,
      ...(hotelReview.gallery || []),
    ])

  // Summary panel: overall score, the place's name (for Directions/Share)
  // and the key facts as chips
  const overall = effectiveHotelRating
    ? calculateRating(
        effectiveHotelRating as Record<string, number>,
        HOTEL_WEIGHTS,
      )
    : null
  const reviewTitle = hotelReview.title || 'Hotel Review'
  const placeName = reviewTitle.replace(/\s+(hotel\s+)?review$/i, '').trim()
  const chips: ReviewChip[] = [
    hotelReview.category && {
      label: hotelReview.category.replace(/\b\w/g, (c) => c.toUpperCase()),
      tone: 'dark' as const,
    },
    hotelReview.room && { label: hotelReview.room, tone: 'indigo' as const },
    hotelReview.date && { label: `Stayed ${formatDate(hotelReview.date)}` },
    hotelReview.wouldReturn && {
      label: WOULD_RETURN_CONFIG[hotelReview.wouldReturn].label,
      tone:
        hotelReview.wouldReturn === 'yes' ? ('success' as const) : undefined,
    },
    hotelReview.priceTier && {
      label: PRICE_TIER_LABELS[hotelReview.priceTier] ?? hotelReview.priceTier,
    },
    hotelReview.lounge &&
      hotelReview.lounge.toLowerCase() !== 'no' && {
        label: hotelReview.lounge.toLowerCase().includes('free')
          ? 'Lounge: Free Access'
          : 'Lounge: Member/Paid',
      },
  ].filter(Boolean) as ReviewChip[]
  const verdictText = hotelReview.verdictHeadline || hotelReview.seoExcerpt

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

        <article className="container mx-auto max-w-7xl px-4 pb-28 pt-6 md:px-6 md:pt-10 xl:pb-12">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link
              href="/hotels"
              className="hover:text-foreground transition-colors"
            >
              Hotel Reviews
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground line-clamp-1">
              {hotelReview.title}
            </span>
          </nav>

          {/* Photos and the rest of the review on the right; the summary
              panel sticks in the left column on large screens. On phones
              the DOM order is photos → panel → review. */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-10">
            {galleryImages.length > 0 && (
              <div className="min-w-0 xl:col-start-2 xl:row-start-1">
                <HeroPhotoGallery
                  images={heroImages}
                  onShowAllPhotos={openModal}
                  bare
                />
              </div>
            )}

            <aside className="self-start xl:sticky xl:top-24 xl:col-start-1 xl:row-span-2 xl:row-start-1">
              <ReviewSummaryPanel
                title={reviewTitle}
                placeName={placeName}
                location={hotelReview.location}
                score={
                  overall
                    ? {
                        displayRating: overall.displayRating,
                        textRating: overall.textRating,
                      }
                    : undefined
                }
                chips={chips}
                footnote={
                  hotelReview.bestFor && hotelReview.bestFor.length > 0 ? (
                    <>
                      <span className="font-semibold">Best for: </span>
                      {hotelReview.bestFor
                        .map((type) => BEST_FOR_LABELS[type] ?? type)
                        .join(' · ')}
                    </>
                  ) : undefined
                }
                arenasInCity={arenasInCity}
                cityGuideHref={
                  arenasInCity[0]?.location
                    ? `/city/${locationToSlug(arenasInCity[0].location)}`
                    : undefined
                }
              />
            </aside>

            <div className="min-w-0 xl:col-start-2 xl:row-start-2">
              {/* Hotel Summary hidden — excerpt2 not rendered to avoid duplicate content SEO issues */}
              {verdictText && (
                <section className="mb-8 flex flex-col gap-3">
                  <span className="text-xs font-bold tracking-[0.14em] text-primary">
                    OUR TAKE
                  </span>
                  <p
                    className={`font-heading-family font-extrabold leading-tight text-foreground ${
                      hotelReview.verdictHeadline
                        ? 'text-3xl md:text-4xl'
                        : 'text-xl md:text-2xl'
                    }`}
                  >
                    {verdictText}
                  </p>
                </section>
              )}

              {effectiveHotelRating && (
                <ReviewRating
                  ratings={effectiveHotelRating}
                  ratingIcons={hotelRatingIcons}
                  title="Ratings at a glance"
                  reviewType="hotel"
                  variant="glance"
                />
              )}

              {timelineEntries.length > 0 &&
                originalRatingResult &&
                hotelReview.date && (
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

              <ProConList
                positives={hotelReview.positives}
                negatives={hotelReview.negatives}
                verdict2={hotelReview.verdict}
                layout="verdictFirst"
              />

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

              {/* RoomTech has its own vertical margins — no extra wrapper */}
              <RoomTech
                techAvailable={hotelReview.techRating}
                speed={hotelReview.internetSpeed}
                roomAmenitiesAvailiable={hotelReview.roomAmenities}
                parking={hotelReview.parking}
                breakfast={hotelReview.breakfast}
              />

              {/* Skip the article block when there's no write-up, so it
                  doesn't leave an empty gap */}
              {hotelReview.content && hotelReview.content.length > 0 && (
                <Section spacing="tight" as="div">
                  <PostBody content={hotelReview.content} />
                </Section>
              )}

              {hotelReview.tags && hotelReview.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2 border-t-2 border-border pt-5">
                  <span className="mr-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Tagged
                  </span>
                  {/* Each tag opens search results for it (search matches tags) */}
                  {hotelReview.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="inline-flex min-h-9 items-center rounded-full border-2 border-border bg-card px-3 text-sm font-medium capitalize text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              <NearestArenaLink arena={hotelReview.nearestArena} flush />

              {hotelReview.youtube && (
                <Section spacing="tight" as="div">
                  <VideoPlayer
                    url={hotelReview.youtube}
                    documentDate={hotelReview.date}
                    videoDescription={
                      hotelReview.seoExcerpt ||
                      `Our review of ${hotelReview.title} in ${hotelReview.location}.`
                    }
                  />
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
            </div>
          </div>
        </article>
        <ReviewActionBar
          placeName={placeName}
          location={hotelReview.location}
        />
        <Footer />
      </Layout>
    </div>
  )
}

export default function HotelReviewPage(props: HotelReviewPageProps) {
  const { preview, loading, hotelReview } = props

  if (!hotelReview) {
    return preview ? (
      <Layout preview={preview} loading={loading}>
        <PostTitle>Loading…</PostTitle>
      </Layout>
    ) : null
  }

  return <HotelReviewPageContent {...props} />
}
