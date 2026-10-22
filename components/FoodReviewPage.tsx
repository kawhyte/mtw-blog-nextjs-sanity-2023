import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import Footer from 'components/Footer'
import HeroPhotoGallery from 'components/HeroPhotoGallery'
import ImageGallery from 'components/ImageGallery'
import SwipeRow from 'components/listing/SwipeRow'
import PostBody from 'components/PostBody'
import { formatDate } from 'components/PostDate'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import ProConList from 'components/ProConList'
import SectionTitle from 'components/SectionTitle'
import VideoPlayer from 'components/Youtube'
import { usePhotoGallery } from 'hooks/usePhotoGallery'
import { calculateRating } from 'lib/calculateRating'
import * as demo from 'lib/demo.data'
import { computeTimelineEntries, getEffectiveRating } from 'lib/mergeRatings'
import { FOOD_WEIGHTS, TAKEOUT_WEIGHTS } from 'lib/ratingWeights'
import { urlForImage } from 'lib/sanity.image'
import type { FoodReview, Settings } from 'lib/sanity.queries'
import {
  CheckCircle,
  ChevronRight,
  Handshake,
  MapPin,
  Package,
  Presentation,
  Smile,
  SprayCan,
  Star,
  Tag,
  Utensils,
} from 'lucide-react'
import Link from 'next/link'
import { locationToSlug } from 'utils/locationSlug'

import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import HelpfulTip from './HelpfulTip'
import NearestArenaLink from './NearestArenaLink'
import DishCard, { dishPrice, type FoodReviewDish } from './review/DishCard'
import { ReviewActionBar } from './review/ReviewActions'
import ReviewSummaryPanel, {
  type ReviewChip,
} from './review/ReviewSummaryPanel'
import ReviewRating from './ReviewRating'
import ReviewStructuredData from './ReviewStructuredData'
import RevisitTimeline from './RevisitTimeline'
import { Section } from './ui/Section'

export interface FoodReviewPageProps {
  preview?: boolean
  loading?: boolean
  foodReview: FoodReview
  settings: Settings
  /** Arenas in the same city, for the "Going to a game?" box */
  arenasInCity?: { name: string; slug: string; location: string }[]
}

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

function FoodReviewPageContent(props: FoodReviewPageProps) {
  const { preview, loading, foodReview, settings, arenasInCity = [] } = props
  const { title = demo.title } = settings || {}

  const { heroImages, galleryImages, isOpen, openModal, closeModal } =
    usePhotoGallery(foodReview.heroPhotos, [
      foodReview.coverImage,
      ...(foodReview.gallery || []),
    ])

  const isTakeout = foodReview.diningType === 'takeout'
  const weights = isTakeout ? TAKEOUT_WEIGHTS : FOOD_WEIGHTS
  const labelMap = isTakeout ? TAKEOUT_RATING_LABELS : FOOD_RATING_LABELS

  const baseRating = isTakeout
    ? foodReview.takeoutRating
    : foodReview.foodRating

  // Build revisit updates using the appropriate rating field
  const revisitsForMerge = (foodReview.revisits ?? []).map((r) => ({
    visitDate: r.visitDate,
    notes: r.notes,
    ratingUpdates: (isTakeout
      ? r.takeoutRatingUpdates
      : r.foodRatingUpdates) as Record<string, number | undefined> | undefined,
  }))

  // Compute effective rating by accumulating all revisit updates
  const effectiveRating = baseRating
    ? getEffectiveRating(
        baseRating as Record<string, number | undefined>,
        revisitsForMerge,
      )
    : baseRating

  const currentRatingIcons = isTakeout ? takeoutRatingIcons : foodRatingIcons

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

  const dishes = (foodReview.individualFoodRating ?? []).filter(
    (dish): dish is FoodReviewDish => Boolean(dish?.name),
  )
  // The best-rated dish (first one wins a tie) is the "Must order"
  const bestDish = dishes.length
    ? dishes.reduce((top, dish) =>
        (dish.rating?.Dish ?? 0) > (top.rating?.Dish ?? 0) ? dish : top,
      )
    : null

  // Summary panel: overall score, the place's name (for Directions/Share)
  // and the key facts as chips
  const overall = effectiveRating
    ? calculateRating(effectiveRating as Record<string, number>, weights)
    : null
  const reviewTitle = foodReview.title || 'Food Review'
  const placeName = reviewTitle
    .replace(/\s+((restaurant|food)\s+)?review\s*$/i, '')
    .trim()
  const chips: ReviewChip[] = [
    foodReview.diningType && {
      label: isTakeout ? 'Takeout' : 'Dine-in',
      tone: 'dark' as const,
    },
    foodReview.priceTier && {
      label: foodReview.priceTier,
      tone: 'indigo' as const,
    },
    foodReview.date && { label: `Visited ${formatDate(foodReview.date)}` },
  ].filter(Boolean) as ReviewChip[]
  const verdictText = foodReview.verdictHeadline || foodReview.seoExcerpt
  const slug =
    typeof foodReview.slug === 'string'
      ? foodReview.slug
      : (foodReview.slug as any)?.current || ''

  return (
    <div>
      <PostPageHead settings={settings} post={foodReview} contentType="food" />

      <ReviewStructuredData
        review={foodReview}
        reviewType="food"
        pageUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/food/${slug}`}
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
            url: `/food/${slug}`,
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
              href="/food"
              className="hover:text-foreground transition-colors"
            >
              Food Reviews
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground line-clamp-1">
              {foodReview.title}
            </span>
          </nav>

          {/* Same layout as the hotel review: photos and the review on the
              right; the summary panel sticks in the left column on large
              screens. On phones the DOM order is photos → panel → review. */}
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
                location={foodReview.location}
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
                  bestDish ? (
                    <>
                      <span className="font-bold text-primary">
                        Must order:{' '}
                      </span>
                      {bestDish.name!.trim()}
                      {dishPrice(bestDish) ? ` · ${dishPrice(bestDish)}` : ''}
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
              {/* Restaurant Summary hidden — excerpt2 not rendered to avoid duplicate content SEO issues */}
              {verdictText && (
                <section className="mb-8 flex flex-col gap-3">
                  <span className="text-xs font-bold tracking-[0.14em] text-primary">
                    OUR TAKE
                  </span>
                  <p
                    className={`font-heading-family font-extrabold leading-tight text-foreground ${
                      foodReview.verdictHeadline
                        ? 'text-3xl md:text-4xl'
                        : 'text-xl md:text-2xl'
                    }`}
                  >
                    {verdictText}
                  </p>
                </section>
              )}

              {effectiveRating && (
                <ReviewRating
                  ratings={effectiveRating}
                  ratingIcons={currentRatingIcons}
                  labels={labelMap}
                  title="Ratings at a glance"
                  reviewType="food"
                  variant="glance"
                />
              )}

              {timelineEntries.length > 0 &&
                originalRatingResult &&
                foodReview.date && (
                  <Section spacing="tight" as="div">
                    <RevisitTimeline
                      originalDate={foodReview.date}
                      originalDisplayRating={originalRatingResult.displayRating}
                      originalTextRating={originalRatingResult.textRating}
                      originalColor={originalRatingResult.color ?? '#6B7280'}
                      entries={timelineEntries}
                    />
                  </Section>
                )}

              <ProConList
                positives={foodReview.positives}
                negatives={foodReview.negatives}
                verdict2={foodReview.verdict}
                layout="verdictFirst"
              />

              {/* The tip card has its own margin (same 40px gap as the
                  sections around it) — no extra wrapper */}
              <HelpfulTip tip={foodReview.tip} />

              {dishes.length > 0 && (
                <section className="my-10">
                  <SectionTitle header="What we ordered" flush />
                  <SwipeRow
                    title={`${dishes.length} ${
                      dishes.length === 1 ? 'dish' : 'dishes'
                    } & drinks`}
                  >
                    {dishes.map((dish, i) => (
                      <DishCard key={dish._key ?? i} dish={dish} />
                    ))}
                  </SwipeRow>
                </section>
              )}

              {/* Skip the article block when there's no write-up, so it
                  doesn't leave an empty gap */}
              {foodReview.content && foodReview.content.length > 0 && (
                <Section spacing="tight" as="div">
                  <PostBody content={foodReview.content} />
                </Section>
              )}

              {foodReview.tags && foodReview.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2 border-t-2 border-border pt-5">
                  <span className="mr-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Tagged
                  </span>
                  {/* Each tag opens search results for it (search matches tags) */}
                  {foodReview.tags.map((tag) => (
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

              <NearestArenaLink arena={foodReview.nearestArena} flush />

              {foodReview.youtube && (
                <Section spacing="tight" as="div">
                  <VideoPlayer
                    url={foodReview.youtube}
                    documentDate={foodReview.date}
                    videoDescription={
                      foodReview.seoExcerpt ||
                      `Our review of ${foodReview.title} in ${foodReview.location}.`
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
        <ReviewActionBar placeName={placeName} location={foodReview.location} />
        <Footer />
      </Layout>
    </div>
  )
}

export default function FoodReviewPage(props: FoodReviewPageProps) {
  const { preview, loading, foodReview } = props

  if (!foodReview) {
    return preview ? (
      <Layout preview={preview} loading={loading}>
        <PostTitle>Loading…</PostTitle>
      </Layout>
    ) : null
  }

  return <FoodReviewPageContent {...props} />
}
