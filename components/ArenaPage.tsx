// components/ArenaPage.tsx

import Layout from 'components/BlogLayout'
import { formatDate } from 'components/PostDate'
import PostPageHead from 'components/PostPageHead'
import calculateAverageRating from 'lib/calculateArenaRating'
import { usePhotoGallery } from 'hooks/usePhotoGallery'
import { computeTimelineEntries, getEffectiveRating } from 'lib/mergeRatings'
import { urlForImage } from 'lib/sanity.image'
import { Arena, Settings } from 'lib/sanity.queries'
import {
  Award,
  Building2,
  Calendar,
  Car,
  Footprints,
  MapPin,
  Pizza,
  Sofa,
  Ticket,
  TrendingDown,
  Trophy,
  Users,
  Users2,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const ImageGallery = dynamic(() => import('./ImageGallery'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
  ),
})

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import BlogHeader from './BlogHeader'
import BreadcrumbStructuredData from './BreadcrumbStructuredData'
import HeroPhotoGallery from './HeroPhotoGallery'
import ProConList from './ProConList'
import RevisitTimeline from './RevisitTimeline'
import SectionTitle from './SectionTitle'
import VideoPlayer from './Youtube'

interface ArenaPageProps {
  arena: Arena
  settings: Settings
  preview?: boolean
  loading?: boolean
}

const ratingIcons: Record<string, React.ReactElement> = {
  food: <Pizza className="h-5 w-5 text-muted-foreground" />,
  seatComfort: <Sofa className="h-5 w-5 text-muted-foreground" />,
  transportation: <Car className="h-5 w-5 text-muted-foreground" />,
  vibes: <Users className="h-5 w-5 text-muted-foreground" />,
  view: <Ticket className="h-5 w-5 text-muted-foreground" />,
  walkability: <Footprints className="h-5 w-5 text-muted-foreground" />,
}

const ARENA_RATING_LABELS: Record<string, string> = {
  transportation: 'Transportation',
  walkability: 'Walkability',
  seatComfort: 'Seat Comfort',
  food: 'Food & Concessions',
  view: 'Sightlines & View',
  vibes: 'Atmosphere & Vibes',
}

export default function ArenaPage({
  arena,
  settings,
  preview,
  loading,
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
  const allGalleryImages = [...photoGalleryImages, ...imageGalleryImages]
  const rawGalleryImages =
    allGalleryImages.length > 0
      ? allGalleryImages
      : arena.arenaImage
        ? [arena.arenaImage, ...(arena.gallery || [])].filter(Boolean)
        : []

  const { galleryImages, isOpen, openModal, closeModal } = usePhotoGallery(
    rawGalleryImages[0],
    rawGalleryImages.slice(1),
  )

  // --- Rating calculations ---
  const effectiveArenaReview = arena.arenaReview
    ? getEffectiveRating(
        arena.arenaReview as Record<string, number | undefined>,
        (arena.revisits ?? []).map((r) => ({
          visitDate: r.visitDate,
          ratingUpdates: r.ratingUpdates as Record<string, number | undefined>,
        })),
      )
    : arena.arenaReview

  const ratingResult = effectiveArenaReview
    ? calculateAverageRating(effectiveArenaReview as any)
    : null

  const overallRating = ratingResult ? ratingResult.average : null

  // --- Scouting data (best & worst on 0–5 scale) ---
  const scoutingData = effectiveArenaReview
    ? Object.entries(effectiveArenaReview)
        .filter(([, v]) => typeof v === 'number')
        .map(([k, v]) => ({
          key: k,
          label: ARENA_RATING_LABELS[k] ?? k,
          score: v as number,
        }))
    : []
  const bestFeature = scoutingData.length
    ? scoutingData.reduce((a, b) => (a.score > b.score ? a : b))
    : null
  const weakestLink = scoutingData.length
    ? scoutingData.reduce((a, b) => (a.score < b.score ? a : b))
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
            ratingUpdates: r.ratingUpdates as Record<string, number | undefined>,
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

  // --- Teams split: attended vs others ---
  const teamsGallery = (arena.gallery ?? []) as any[]
  const attendedTeams = teamsGallery.filter((t) => t.played && t.name)
  const otherTeams = teamsGallery.filter((t) => !t.played && t.name)
  const leagueTypes = [
    ...new Set(
      teamsGallery.filter((t) => t.teamType).map((t) => t.teamType as string),
    ),
  ]

  const visitCount = 1 + (arena.revisits?.length ?? 0)

  return (
    <div>
      <PostPageHead settings={settings} post={arena as any} />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Arenas', url: '/arenas' },
          { name: arena.name, url: `/arena/${arena.slug ?? ''}` },
        ]}
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />

        {/* 1. HERO PHOTO GALLERY */}
        {galleryImages.length > 0 && (
          <HeroPhotoGallery images={galleryImages} onShowAllPhotos={openModal} />
        )}

        {/* 2+3. ARENA IDENTITY + SCORECARD — one section */}
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          {!arena.visited && (
            <div className="mb-4">
              <Badge variant="outline" className="text-muted-foreground">
                On Our Bucket List
              </Badge>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
            {arena.name}
          </h1>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-5 w-5 shrink-0" />
            <span className="text-lg">{arena.location}</span>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-5">
            {arena.buildDate && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Built {formatDate(arena.buildDate)}</span>
              </div>
            )}
            {arena.capacity && (
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                <span>{arena.capacity.toLocaleString()} seat capacity</span>
              </div>
            )}
          </div>

          {leagueTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {leagueTypes.map((league) => (
                <Badge
                  key={league}
                  variant="secondary"
                  className="uppercase text-xs tracking-wide"
                >
                  {league}
                </Badge>
              ))}
            </div>
          )}
          {/* 3. SCORECARD — nested inside the identity section */}
          {ratingResult && overallRating && (
            <div className="mt-8">
            <div className="rounded-2xl border-2 border-foreground shadow-brutalist bg-secondary/10 p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-6">
                The Scorecard
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {/* Overall rating */}
                <div className="flex flex-col items-start">
                  <div className="flex items-end gap-1 mb-1">
                    <span
                      className="text-7xl font-bold text-secondary leading-none"
                      aria-label={`Overall rating: ${overallRating} out of 5`}
                    >
                      {overallRating}
                    </span>
                    <span className="text-2xl text-muted-foreground mb-1">/5</span>
                  </div>
                  <span
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: ratingResult.color }}
                  >
                    {ratingResult.textRating}
                  </span>
                </div>

                {/* Best feature */}
                {bestFeature && (
                  <div className="flex items-start gap-3">
                    <Trophy className="h-7 w-7 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                        Best Feature
                      </p>
                      <p className="font-bold text-base">{bestFeature.label}</p>
                      <p className="text-sm font-semibold text-secondary">
                        {(bestFeature.score / 2).toFixed(1)} / 5
                      </p>
                    </div>
                  </div>
                )}

                {/* Weakest link */}
                {weakestLink && (
                  <div className="flex items-start gap-3">
                    <TrendingDown className="h-7 w-7 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                        Lowest Score
                      </p>
                      <p className="font-bold text-base">{weakestLink.label}</p>
                      <p className="text-sm font-semibold text-destructive">
                        {(weakestLink.score / 2).toFixed(1)} / 5
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>{/* end identity + scorecard section */}

        <article>
          {/* 4. TEAMS AT THIS ARENA */}
          {teamsGallery.length > 0 && (
            <div className="py-8 md:py-12">
              <SectionTitle header="Teams at This Arena" />
              <div className="container mx-auto px-4 md:px-6 space-y-8">
                {attendedTeams.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold uppercase tracking-widest text-primary">
                        Games We Attended
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {attendedTeams.map((team: any, i: number) => {
                        const cardClasses =
                          'flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-primary ring-2 ring-primary/20 hover:ring-primary hover:shadow-brutalist-sm transition-all duration-200 bg-card'
                        const inner = (
                          <>
                            {team.asset && (
                              <Image
                                src={urlForImage(team.asset)
                                  .width(56)
                                  .height(56)
                                  .fit('crop')
                                  .auto('format')
                                  .url()}
                                alt={`${team.name} logo`}
                                width={56}
                                height={56}
                                className="rounded-full"
                                loading="lazy"
                                sizes="56px"
                              />
                            )}
                            <span className="text-xs font-semibold text-center leading-tight max-w-[80px]">
                              {team.name}
                            </span>
                            {team.teamType && (
                              <Badge variant="secondary" className="text-xs uppercase">
                                {team.teamType}
                              </Badge>
                            )}
                          </>
                        )
                        return team.link ? (
                          <a
                            key={team.name || i}
                            href={team.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cardClasses}
                          >
                            {inner}
                          </a>
                        ) : (
                          <div key={team.name || i} className={cardClasses}>
                            {inner}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {otherTeams.length > 0 && (
                  <div>
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 block">
                      Also at This Arena
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {otherTeams.map((team: any, i: number) => (
                        <div
                          key={team.name || i}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/40"
                        >
                          {team.asset && (
                            <Image
                              src={urlForImage(team.asset)
                                .width(32)
                                .height(32)
                                .fit('crop')
                                .auto('format')
                                .url()}
                              alt={`${team.name} logo`}
                              width={32}
                              height={32}
                              className="rounded-full grayscale opacity-60"
                              loading="lazy"
                              sizes="32px"
                            />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {team.name}
                          </span>
                          {team.teamType && (
                            <span className="text-xs text-muted-foreground/60">
                              · {team.teamType}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. RATING BREAKDOWN + VISIT DETAILS */}
          <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left: Rating Breakdown */}
              <div className="lg:col-span-2">
                {effectiveArenaReview && (
                  <Card className="border-2 border-border shadow-brutalist-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Arena Rating Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Object.entries(effectiveArenaReview).map(
                        ([category, score]) =>
                          typeof score === 'number' && (
                            <div key={category}>
                              <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {ratingIcons[category]}
                                  <span
                                    className="font-medium"
                                    id={`rating-label-${category}`}
                                  >
                                    {ARENA_RATING_LABELS[category] ?? category}
                                  </span>
                                </div>
                                <span
                                  className="font-semibold tabular-nums"
                                  aria-labelledby={`rating-label-${category}`}
                                >
                                  {(score / 2).toFixed(1)}
                                  <span className="text-xs text-muted-foreground font-normal">
                                    /5
                                  </span>
                                </span>
                              </div>
                              <Progress
                                value={(score / 10) * 100}
                                className="h-2"
                                aria-label={`${ARENA_RATING_LABELS[category] ?? category}: ${(score / 2).toFixed(1)} out of 5`}
                              />
                            </div>
                          ),
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right: Visit Details */}
              {arena.visited && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-base">
                        <Calendar className="h-5 w-5" />
                        <span>Our Visit</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      {arena.date && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                            First Visited
                          </p>
                          <p className="font-semibold">{formatDate(arena.date)}</p>
                        </div>
                      )}
                      {visitCount > 1 && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                            Total Visits
                          </p>
                          <Badge variant="secondary" className="text-xs font-semibold">
                            {visitCount} visits
                          </Badge>
                        </div>
                      )}
                      {attendedTeams.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                            Games Attended
                          </p>
                          <p className="font-semibold">
                            {attendedTeams.length} team
                            {attendedTeams.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* 6. REVISIT TIMELINE */}
          {timelineEntries.length > 0 && originalRatingResult && arena.date && (
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
              <RevisitTimeline
                originalDate={arena.date}
                originalDisplayRating={originalRatingResult.average}
                originalTextRating={originalRatingResult.textRating}
                originalColor={originalRatingResult.color}
                entries={timelineEntries}
              />
            </div>
          )}

          {/* 7. THE BOTTOM LINE (ProConList) */}
          {arena.prosConsVerdict &&
            (arena.prosConsVerdict.positives?.length ||
              arena.prosConsVerdict.negatives?.length ||
              arena.prosConsVerdict.verdict) && (
              <ProConList
                positives={arena.prosConsVerdict.positives}
                negatives={arena.prosConsVerdict.negatives}
                verdict2={arena.prosConsVerdict.verdict}
              />
            )}

          {/* 8. VIDEO (fixed: uses arena.videoUrl + VideoPlayer) */}
          {arena.videoUrl && (
            <VideoPlayer url={arena.videoUrl} title="Our Experience" />
          )}

          {/* 9. GALLERY MODAL — modal-only, no bottom grid (matches hotel page pattern) */}
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
      </Layout>
    </div>
  )
}
