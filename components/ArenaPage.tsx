// components/ArenaPage.tsx

import Layout from 'components/BlogLayout'
import { formatDate } from 'components/PostDate'
import PostPageHead from 'components/PostPageHead'
import { usePhotoGallery } from 'hooks/usePhotoGallery'
import calculateAverageRating from 'lib/calculateArenaRating'
import { computeTimelineEntries, getEffectiveRating } from 'lib/mergeRatings'
import { urlForImage } from 'lib/sanity.image'
import { Arena, Settings } from 'lib/sanity.queries'
import {
  Award,
  Building2,
  CalendarDays,
  Car,
  ChevronRight,
  Footprints,
  MapPin,
  Pizza,
  RefreshCw,
  Sofa,
  Ticket,
  Trophy,
  Users,
  Users2,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

const ImageGallery = dynamic(() => import('./ImageGallery'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
  ),
})

import { Badge } from '@/components/ui/badge'

import ArenaFoodItems from './ArenaFoodItems'
import ArenaHotelStay from './ArenaHotelStay'
import ArenaRatingCard from './ArenaRatingCard'
import ArenaViewFromSeat from './ArenaViewFromSeat'
import ArenaStructuredData from './ArenaStructuredData'
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
  rank?: number | null
  totalVisited?: number
  isTied?: boolean
}

const ratingIcons: Record<string, React.ReactElement> = {
  food: <Pizza className="h-5 w-5 mr-2 text-muted-foreground" />,
  seatComfort: <Sofa className="h-5 w-5 mr-2 text-muted-foreground" />,
  transportation: <Car className="h-5 w-5 mr-2 text-muted-foreground" />,
  vibes: <Users className="h-5 w-5 mr-2 text-muted-foreground" />,
  view: <Ticket className="h-5 w-5 mr-2 text-muted-foreground" />,
  walkability: <Footprints className="h-5 w-5 mr-2 text-muted-foreground" />,
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
  rank,
  totalVisited,
  isTied,
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
  // Prefer attendedGames.length when games are entered; fall back to timesAttended
  const totalGamesAttended = attendedTeams.reduce(
    (sum: number, t: any) =>
      sum +
      (t.attendedGames?.length > 0 ? t.attendedGames.length : (t.timesAttended ?? 1)),
    0,
  )

  return (
    <div>
      <PostPageHead
        settings={settings}
        post={{ ...arena, title: arena.name, coverImage: arena.arenaImage } as any}
        contentType="arena"
      />
      <ArenaStructuredData arena={arena} />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Arenas', url: '/arenas' },
          { name: arena.name, url: `/arena/${arena.slug ?? ''}` },
        ]}
      />

      <Layout preview={preview} loading={loading}>
        <BlogHeader title={title} level={2} />

        <article className="container mx-auto px-4 py-8 md:px-6 md:py-12">
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
              NBA Arenas
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground line-clamp-1">{arena.name}</span>
          </nav>

          {/* 2. ARENA IDENTITY */}
          <div className="py-8 md:py-12">
            {!arena.visited && (
              <div className="mb-4">
                <Badge variant="outline" className="text-muted-foreground">
                  On Our Bucket List
                </Badge>
              </div>
            )}

            <h1 className="mb-4 text-4xl font-bold">{arena.name}</h1>

            {/* Hotel-style inline meta row */}
            <div className="mb-4 flex flex-wrap items-center justify-start gap-x-6 gap-y-2">
              {arena.location && (
                <div className="flex items-center text-base text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4 shrink-0" />
                  {arena.location}
                </div>
              )}
              {arena.buildDate && (
                <div className="flex items-center text-base text-muted-foreground">
                  <Building2 className="mr-2 h-4 w-4 shrink-0" />
                  Built {formatDate(arena.buildDate)}
                </div>
              )}
              {arena.capacity && (
                <div className="flex items-center text-base text-muted-foreground">
                  <Users2 className="mr-2 h-4 w-4 shrink-0" />
                  {arena.capacity.toLocaleString()} seats
                </div>
              )}
              {arena.visited && arena.date && (
                <div className="flex items-center text-base text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
                  Visited {formatDate(arena.date)}
                </div>
              )}
              {visitCount > 1 && (
                <div className="flex items-center text-base text-muted-foreground">
                  <RefreshCw className="mr-2 h-4 w-4 shrink-0" />
                  {visitCount} visits
                </div>
              )}
              {totalGamesAttended > 0 && (
                <div className="flex items-center text-base text-muted-foreground">
                  <Award className="mr-2 h-4 w-4 shrink-0" />
                  {totalGamesAttended} game{totalGamesAttended !== 1 ? 's' : ''}{' '}
                  attended
                </div>
              )}
              {rank != null && totalVisited != null && totalVisited > 0 && (
                <div className="flex items-center text-base text-muted-foreground">
                  <Trophy className="mr-2 h-4 w-4 shrink-0" />
                  Ranked{' '}
                  <span className="mx-1 font-bold text-foreground">
                    #{rank}
                  </span>{' '}
                  of {totalVisited} arenas
                  {isTied && (
                    <span className="ml-1.5 text-sm">(tied)</span>
                  )}
                </div>
              )}
            </div>

            {/* League / sport type badges */}
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
          </div>

          {/* 1. HERO PHOTO GALLERY */}
          {galleryImages.length > 0 && (
            <HeroPhotoGallery
              images={galleryImages}
              onShowAllPhotos={openModal}
            />
          )}

          {/* 3. ARENA RATING CARD — score left, breakdown right */}
          {effectiveArenaReview && (
            <ArenaRatingCard
              effectiveArenaReview={
                effectiveArenaReview as Record<string, number | undefined>
              }
              ratingIcons={ratingIcons}
              ratingLabels={ARENA_RATING_LABELS}
            />
          )}

        </article>

        {/* 5. TEAMS AT THIS ARENA */}
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {attendedTeams.map((team: any, i: number) => {
                      const games: any[] = team.attendedGames ?? []
                      const gameCount =
                        games.length > 0 ? games.length : (team.timesAttended ?? 1)
                      const cardClasses =
                        'rounded-xl border-2 border-primary ring-2 ring-primary/20 hover:ring-primary hover:shadow-brutalist-sm transition-all duration-200 bg-card overflow-hidden'

                      const inner = (
                        <>
                          {/* Team identity row */}
                          <div className="flex items-center gap-3 p-4">
                            {team.asset && (
                              <Image
                                src={urlForImage(team.asset)
                                  .width(48)
                                  .height(48)
                                  .fit('crop')
                                  .auto('format')
                                  .url()}
                                alt={`${team.name} logo`}
                                width={48}
                                height={48}
                                className="rounded-full shrink-0"
                                loading="lazy"
                                sizes="48px"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold leading-tight truncate">
                                {team.name}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                {team.teamType && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs uppercase"
                                  >
                                    {team.teamType}
                                  </Badge>
                                )}
                                <Badge
                                  variant="outline"
                                  className="text-xs text-primary border-primary font-bold"
                                >
                                  {gameCount} {gameCount === 1 ? 'game' : 'games'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Game rows */}
                          {games.length > 0 && (
                            <div className="border-t border-border">
                              {games.map((game: any, gi: number) => {
                                const trackedScore = game.isHomeGame
                                  ? game.homeScore
                                  : game.awayScore
                                const opponentScore = game.isHomeGame
                                  ? game.awayScore
                                  : game.homeScore
                                const hasScore =
                                  trackedScore != null && opponentScore != null
                                const isWin = hasScore && trackedScore > opponentScore
                                const isLoss = hasScore && trackedScore < opponentScore

                                return (
                                  <div
                                    key={gi}
                                    className={`px-4 py-3${gi > 0 ? ' border-t border-border' : ''}`}
                                  >
                                    {/* Date + labels */}
                                    <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                                      {game.gameDate && (
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(
                                            game.gameDate + 'T12:00:00',
                                          ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                          })}
                                        </span>
                                      )}
                                      {game.seasonType &&
                                        game.seasonType !== 'Regular Season' && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {game.seasonType}
                                          </Badge>
                                        )}
                                      {game.overtimePeriods > 0 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs text-amber-600 border-amber-600/50"
                                        >
                                          {game.overtimePeriods === 1
                                            ? 'OT'
                                            : `${game.overtimePeriods}OT`}
                                        </Badge>
                                      )}
                                      {hasScore && (
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ml-auto font-bold ${
                                            isWin
                                              ? 'text-green-600 border-green-500/40'
                                              : isLoss
                                                ? 'text-red-600 border-red-500/40'
                                                : 'text-muted-foreground'
                                          }`}
                                        >
                                          {isWin ? 'W' : isLoss ? 'L' : 'T'}
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Score line */}
                                    {hasScore && (
                                      <p className="text-sm font-semibold">
                                        {team.name} {trackedScore} –{' '}
                                        {opponentScore} {game.opponent}
                                      </p>
                                    )}

                                    {/* Player of game */}
                                    {game.playerOfGame?.playerName && (
                                      <div className="flex items-center gap-2 mt-2">
                                        {game.playerOfGame.nbaPlayerId && (
                                          // eslint-disable-next-line @next/next/no-img-element
                                          <img
                                            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${game.playerOfGame.nbaPlayerId}.png`}
                                            alt={game.playerOfGame.playerName}
                                            width={28}
                                            height={28}
                                            className="rounded-full object-cover bg-muted shrink-0"
                                            onError={(e) => {
                                              ;(
                                                e.target as HTMLImageElement
                                              ).style.display = 'none'
                                            }}
                                          />
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                          ⭐{' '}
                                          <span className="font-medium text-foreground">
                                            {game.playerOfGame.playerName}
                                          </span>
                                          {game.playerOfGame.points != null && (
                                            <span className="ml-1">
                                              {game.playerOfGame.points} pts
                                              {game.playerOfGame.rebounds !=
                                                null &&
                                                ` / ${game.playerOfGame.rebounds} reb`}
                                              {game.playerOfGame.assists !=
                                                null &&
                                                ` / ${game.playerOfGame.assists} ast`}
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
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

        {/* 7. WHERE WE STAYED (optional) */}
        {arena.hotelStay &&
          (arena.hotelStay.hotel || arena.hotelStay.hotelName) && (
            <ArenaHotelStay hotelStay={arena.hotelStay} />
          )}

        {/* 8. FOOD & DRINKS WE TRIED (optional) */}
        {(arena.arenaFoodItems?.length ?? 0) > 0 && (
          <ArenaFoodItems food={arena.arenaFoodItems!} />
        )}

        {/* 9. THE BOTTOM LINE */}
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

        {/* 10. VIEW FROM MY SEAT */}
        {(arena.viewFromSeat?.length ?? 0) > 0 && (
          <ArenaViewFromSeat
            viewFromSeat={arena.viewFromSeat!}
            viewScore={effectiveArenaReview?.view as number | undefined}
          />
        )}

        {/* 11. OUR EXPERIENCE (Video) */}
        {arena.videoUrl && (
          <VideoPlayer url={arena.videoUrl} title="Our Experience" />
        )}

        {/* 12. GALLERY MODAL */}
        {galleryImages.length > 0 && (
          <ImageGallery
            images={galleryImages}
            isOpen={isOpen}
            openModal={openModal}
            closeModal={closeModal}
            showInlineGrid={false}
          />
        )}
      </Layout>
    </div>
  )
}
