// components/ArenaPage.tsx

import { GameDayBox, GameDayRow } from 'components/arena/ArenaGameDay'
import ArenaGames from 'components/arena/ArenaGames'
import ArenaVideo from 'components/arena/ArenaVideo'
import Layout from 'components/BlogLayout'
import PostPageHead from 'components/PostPageHead'
import { usePhotoGallery } from 'hooks/usePhotoGallery'
import type { ArenaGameDay } from 'lib/arenaGameDay'
import calculateAverageRating from 'lib/calculateArenaRating'
import { computeTimelineEntries, getEffectiveRating } from 'lib/mergeRatings'
import { Arena, ArenaFoodReviewCard, Settings } from 'lib/sanity.queries'
import {
  Car,
  ChevronRight,
  Footprints,
  Pizza,
  Sofa,
  Ticket,
  Users,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { locationToSlug } from 'utils/locationSlug'

const ImageGallery = dynamic(() => import('./ImageGallery'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
  ),
})

import Footer from 'components/Footer'

import { FAQSection } from '@/components/ui/faq-section'

import ArenaFoodItems from './ArenaFoodItems'
import ArenaFoodReviews from './ArenaFoodReviews'
import ArenaHotelStay from './ArenaHotelStay'
import ArenaStructuredData from './ArenaStructuredData'
import ArenaViewFromSeat from './ArenaViewFromSeat'
import BlogHeader from './BlogHeader'
import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import FAQStructuredData from './FAQStructuredData'
import HeroPhotoGallery from './HeroPhotoGallery'
import ProConList from './ProConList'
import { ReviewActionBar } from './review/ReviewActions'
import ReviewSummaryPanel, {
  type ReviewChip,
} from './review/ReviewSummaryPanel'
import ReviewRating from './ReviewRating'
import RevisitTimeline from './RevisitTimeline'

interface ArenaPageProps {
  arena: Arena
  settings: Settings
  preview?: boolean
  loading?: boolean
  rank?: number | null
  totalVisited?: number
  isTied?: boolean
  foodReviews?: ArenaFoodReviewCard[]
  /** The city page to link to (Paradise, NV → "Las Vegas, NV") */
  cityLocation?: string | null
  /** Hotels and food we've reviewed in the arena's city */
  gameDay?: ArenaGameDay | null
}

const ratingIcons: Record<string, React.ReactElement> = {
  food: <Pizza className="h-5 w-5 mr-2" />,
  seatComfort: <Sofa className="h-5 w-5 mr-2" />,
  transportation: <Car className="h-5 w-5 mr-2" />,
  vibes: <Users className="h-5 w-5 mr-2" />,
  view: <Ticket className="h-5 w-5 mr-2" />,
  walkability: <Footprints className="h-5 w-5 mr-2" />,
}

const ARENA_RATING_LABELS: Record<string, string> = {
  transportation: 'Transportation',
  walkability: 'Walkability',
  seatComfort: 'Seat Comfort',
  food: 'Food & Concessions',
  view: 'Sightlines & View',
  vibes: 'Atmosphere & Vibes',
}

const monthYear = (date?: string) =>
  date
    ? new Date(
        date.length === 10 ? `${date}T12:00:00` : date,
      ).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null

export default function ArenaPage({
  arena,
  settings,
  preview,
  loading,
  rank,
  totalVisited,
  isTied,
  foodReviews = [],
  cityLocation,
  gameDay,
}: ArenaPageProps) {
  const { title = 'Arena Review' } = settings || {}

  // --- Gallery setup ---
  const photoGalleryImages = arena.photoGallerySection
    ? [
        arena.photoGallerySection.mainImage,
        ...(arena.photoGallerySection.otherImages || []),
      ].filter(Boolean)
    : []

  const imageGalleryImages = arena.imageGallery || []
  const hasHeroPhotos = (arena.heroPhotos?.length ?? 0) > 0
  // heroPhotos replaces the legacy photoGallerySection; without it, keep the old
  // layout. `arena.gallery` is team logos, so it's never used as photos.
  const allGalleryImages = hasHeroPhotos
    ? imageGalleryImages
    : [...photoGalleryImages, ...imageGalleryImages]
  const rawGalleryImages =
    allGalleryImages.length > 0 || hasHeroPhotos
      ? allGalleryImages
      : [arena.arenaImage].filter(Boolean)

  const { heroImages, galleryImages, isOpen, openModal, closeModal } =
    usePhotoGallery(arena.heroPhotos, rawGalleryImages)

  // --- Rating calculations ---
  // Accumulate all revisit updates on top of the base rating
  const effectiveArenaReview = arena.arenaReview
    ? getEffectiveRating(
        arena.arenaReview as Record<string, number | undefined>,
        (arena.revisits ?? []).map((r) => ({
          visitDate: r.visitDate,
          ratingUpdates: r.ratingUpdates as Record<string, number | undefined>,
        })),
      )
    : arena.arenaReview

  const overall =
    arena.visited && effectiveArenaReview
      ? calculateAverageRating(effectiveArenaReview as any)
      : null

  // Ratings at a glance: the 6 arena scores, best first
  const glanceRatings: Record<string, number> | null = effectiveArenaReview
    ? (Object.fromEntries(
        Object.entries(effectiveArenaReview)
          .filter(
            ([key, value]) =>
              key in ARENA_RATING_LABELS && typeof value === 'number',
          )
          .sort((a, b) => (b[1] as number) - (a[1] as number)),
      ) as Record<string, number>)
    : null

  // --- Revisit timeline ---
  const originalRatingResult = arena.arenaReview
    ? calculateAverageRating(arena.arenaReview as any)
    : null

  const timelineEntries =
    arena.revisits?.length && arena.arenaReview
      ? computeTimelineEntries(
          arena.arenaReview as Record<string, number | undefined>,
          (arena.revisits ?? []).map((r) => ({
            visitDate: r.visitDate,
            notes: r.notes,
            ratingUpdates: r.ratingUpdates as Record<
              string,
              number | undefined
            >,
          })),
          ARENA_RATING_LABELS,
        ).map((entry) => {
          const result = calculateAverageRating(entry.accumulatedState as any)
          return {
            visitDate: entry.visitDate,
            notes: entry.notes,
            deltas: entry.deltas,
            displayRating: result.average,
            textRating: result.textRating,
            color: result.color,
          }
        })
      : []

  // --- Facts for the side panel ---
  const teamsGallery = (arena.gallery ?? []) as any[]
  const attendedTeams = teamsGallery.filter((t) => t.played && t.name)
  const homeTeams = attendedTeams.length > 0 ? attendedTeams : teamsGallery
  const visitCount = 1 + (arena.revisits?.length ?? 0)
  // Prefer attendedGames.length when games are entered; fall back to timesAttended
  const totalGamesAttended = attendedTeams.reduce(
    (sum: number, t: any) =>
      sum +
      (t.attendedGames?.length > 0
        ? t.attendedGames.length
        : (t.timesAttended ?? 1)),
    0,
  )
  const firstGame = attendedTeams
    .flatMap((t: any) => (t.attendedGames ?? []).map((g: any) => g.gameDate))
    .filter(Boolean)
    .sort()[0]
  const since = monthYear(firstGame || arena.date)

  const chips: ReviewChip[] = [
    !arena.visited && { label: 'On our bucket list', tone: 'dark' as const },
    ...homeTeams
      .filter((t: any) => t.name)
      .slice(0, 3)
      .map((t: any) => ({
        label: t.teamType
          ? `${String(t.teamType).toUpperCase()} · ${t.name}`
          : t.name,
        tone: 'indigo' as const,
      })),
    rank != null &&
      totalVisited != null &&
      totalVisited > 0 && {
        label: `🏆 Ranked #${rank} of ${totalVisited}${isTied ? ' (tied)' : ''}`,
        tone: 'amber' as const,
      },
    arena.buildDate && { label: `Built ${arena.buildDate.slice(0, 4)}` },
    arena.capacity && { label: `${arena.capacity.toLocaleString()} seats` },
    totalGamesAttended > 0 && {
      label: `${totalGamesAttended} game${totalGamesAttended === 1 ? '' : 's'}${since ? ` · since ${since}` : ''}`,
    },
    visitCount > 1 && { label: `${visitCount} visits` },
  ].filter(Boolean) as ReviewChip[]

  const cityHref = arena.location
    ? `/city/${locationToSlug(cityLocation || arena.location)}?from=${arena.slug}`
    : undefined
  const cityName = (cityLocation || arena.location || '').split(',')[0].trim()

  const hasBottomLine =
    arena.prosConsVerdict &&
    (arena.prosConsVerdict.positives?.length ||
      arena.prosConsVerdict.negatives?.length ||
      arena.prosConsVerdict.verdict)

  return (
    <div>
      <PostPageHead
        settings={settings}
        post={
          { ...arena, title: arena.name, coverImage: arena.arenaImage } as any
        }
        contentType="arena"
      />
      <ArenaStructuredData arena={arena} />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Arenas', url: '/arenas' },
          { name: arena.name ?? 'Arena', url: `/arena/${arena.slug ?? ''}` },
        ]}
      />
      {(arena.faqs?.length ?? 0) > 0 && (
        <FAQStructuredData faqs={arena.faqs!} />
      )}

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
              href="/arenas"
              className="hover:text-foreground transition-colors"
            >
              Arenas
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground line-clamp-1">{arena.name}</span>
          </nav>

          {/* Same layout as the hotel review page: photos and the review on
              the right, the summary panel sticky on the left on large
              screens. Phones: photos → panel → review. */}
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
                title={arena.name ?? 'Arena'}
                placeName={arena.name ?? 'Arena'}
                location={arena.location}
                score={
                  overall
                    ? {
                        displayRating: overall.average,
                        textRating: overall.textRating,
                      }
                    : undefined
                }
                chips={chips}
                footnote={
                  arena.venueNote ? (
                    <span className="italic">{arena.venueNote}</span>
                  ) : undefined
                }
                arenasInCity={[]}
              >
                {gameDay ? (
                  <GameDayBox gameDay={gameDay} />
                ) : (
                  cityHref && (
                    <Link
                      href={cityHref}
                      className="flex min-h-11 items-center rounded-2xl border-2 border-secondary/30 bg-secondary-soft-background px-4 text-sm font-bold text-primary hover:underline"
                    >
                      {cityName} game-day guide →
                    </Link>
                  )
                )}
              </ReviewSummaryPanel>
            </aside>

            <div className="flex min-w-0 flex-col gap-10 xl:col-start-2 xl:row-start-2 md:gap-12 [&_.container]:px-0 [&>section]:my-0">
              {arena.verdictHeadline && (
                <section className="flex flex-col gap-3">
                  <span className="text-xs font-bold tracking-[0.14em] text-primary">
                    OUR TAKE
                  </span>
                  <p className="font-heading-family text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
                    {arena.verdictHeadline}
                  </p>
                </section>
              )}

              {overall && glanceRatings && (
                <ReviewRating
                  ratings={glanceRatings}
                  ratingIcons={ratingIcons}
                  labels={ARENA_RATING_LABELS}
                  title="Ratings at a glance"
                  variant="glance"
                />
              )}

              <ArenaGames teams={teamsGallery} />

              {timelineEntries.length > 0 &&
                originalRatingResult &&
                arena.date && (
                  <RevisitTimeline
                    originalDate={arena.date}
                    originalDisplayRating={originalRatingResult.average}
                    originalTextRating={originalRatingResult.textRating}
                    originalColor={originalRatingResult.color}
                    entries={timelineEntries}
                  />
                )}

              {(arena.hotelStays?.length ?? 0) > 0 && (
                <ArenaHotelStay
                  hotelStays={arena.hotelStays!}
                  arenaDate={arena.date}
                />
              )}

              {(arena.arenaFoodItems?.length ?? 0) > 0 && (
                <ArenaFoodItems food={arena.arenaFoodItems!} />
              )}

              {hasBottomLine && (
                <ProConList
                  positives={arena.prosConsVerdict!.positives}
                  negatives={arena.prosConsVerdict!.negatives}
                  verdict2={arena.prosConsVerdict!.verdict}
                  layout="verdictFirst"
                />
              )}

              {(arena.viewFromSeat?.length ?? 0) > 0 && (
                <ArenaViewFromSeat
                  viewFromSeat={arena.viewFromSeat!}
                  viewScore={effectiveArenaReview?.view as number | undefined}
                />
              )}

              {(arena.faqs?.length ?? 0) > 0 && (
                <FAQSection
                  title={`${arena.name}: your questions`}
                  items={arena.faqs!}
                />
              )}

              {arena.videoUrl && (
                <ArenaVideo
                  url={arena.videoUrl}
                  poster={arena.heroPhotos?.[0] ?? arena.arenaImage}
                  arenaName={arena.name ?? 'the arena'}
                  description={
                    arena.excerpt ||
                    `Our experience visiting ${arena.name}: tips, food, seating and atmosphere.`
                  }
                  date={arena.date}
                />
              )}

              {gameDay ? (
                <GameDayRow gameDay={gameDay} />
              ) : (
                foodReviews.length > 0 && (
                  <ArenaFoodReviews foodReviews={foodReviews} />
                )
              )}
            </div>
          </div>
        </article>

        {galleryImages.length > 0 && (
          <ImageGallery
            images={galleryImages}
            isOpen={isOpen}
            openModal={openModal}
            closeModal={closeModal}
            showInlineGrid={false}
          />
        )}
        <ReviewActionBar
          placeName={arena.name ?? 'Arena'}
          location={arena.location}
        />
        <Footer />
      </Layout>
    </div>
  )
}
