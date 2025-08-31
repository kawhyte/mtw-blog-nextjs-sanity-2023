// pages/arena/[slug].tsx


import AreanaRating from 'components/AreanaRating' // Adjust path
import BlogHeader from 'components/BlogHeader' // Adjust path
// --- Layout & Components ---
import Layout from 'components/BlogLayout' // Adjust path
import Footer from 'components/Footer' // Adjust path
import HeroPhotoGallery from 'components/HeroPhotoGallery' // Adjust path
import ImageGallery from 'components/ImageGallery' // Adjust path
import ProConList from 'components/ProConList' // Adjust path
import PageHeader from 'components/SlugPageTitleWithIconHeager'
import StarDisplay from 'components/StarDisplay'
import VideoPlayer from 'components/Youtube'
import calculateAverageRating from 'lib/calculateArenaRating' // Adjust path
// --- Utilities & Constants ---
import { CMS_NAME } from 'lib/constants'
// --- Sanity Client & Data Fetching ---
import {
  getAllArenaSlugs,
  getArenaBySlug,
  getSettings,
} from 'lib/sanity.client' // Adjust path
import { urlForImage } from 'lib/sanity.image' // Adjust path
import { Arena, Settings } from 'lib/sanity.queries' // Adjust path
import {
  Binoculars,
  CalendarCheck,
  Car,
  Eye,
  EyeOff,
  Footprints,
  MapPin,
  Music,
  Pizza,
  Sofa,
  Users,
  Wrench,
} from 'lucide-react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

// --- Props Interface & Query ---
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const arena = await getArenaBySlug(slug)
  const settings = await getSettings()

  if (!arena) {
    return { notFound: true }
  }

  return {
    props: {
      arena,
      settings,
      preview: false,
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllArenaSlugs()
  return {
    paths: slugs?.map((slug) => ({ params: { slug } })) || [],
    fallback: 'blocking',
  }
}

// ============================================
// Page Component Implementation
// ============================================
export default function ArenaPage({
  arena,
  settings,
  preview,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading arena details...</div>
  }

  // Calculate rating details safely
  const { average, textRating, color } = calculateAverageRating(
    arena?.arenaReview || {} // Pass empty object if review is missing
  )

  // Check if there's data for the Pros/Cons/Verdict section
  const hasProsConsData =
    arena?.prosConsVerdict &&
    ((arena.prosConsVerdict.positives &&
      arena.prosConsVerdict.positives.length > 0) ||
      (arena.prosConsVerdict.negatives &&
        arena.prosConsVerdict.negatives.length > 0) ||
      (arena.prosConsVerdict.verdict &&
        arena.prosConsVerdict.verdict.length > 0))

  // Check if there are gallery images for the ImageGallery component
  const hasImageGallery = arena?.gallery && arena.gallery.length > 0 // Assuming 'gallery' holds images for ImageGallery

  if (!arena) {
    return <div>Arena not found.</div> // Or a proper 404 component
  }



  const headerItems = [];
  const iconClasses = 'mr-2 h-4 w-4 shrink-0 text-purple-500'; // Define common icon style

  if (arena.location) {
    headerItems.push({
      icon: <MapPin className={iconClasses} />,
      text: arena.location,
    });
  }
  if (arena.buildDate) {
    headerItems.push({
      icon: <Wrench className={iconClasses} />,
      label: 'Built',
      text: new Date(arena.buildDate).getFullYear(),
    });
  }
  if (arena.capacity) {
    headerItems.push({
      icon: <Users className={iconClasses} />,
      label: 'Capacity',
      text: arena.capacity.toLocaleString(),
    });
  }
  if (arena.visited && arena.date) {
    headerItems.push({
      icon: <CalendarCheck className={iconClasses} />,
      label: 'Visited',
      text: new Date(arena.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
  }




  return (
    <Layout preview={preview} loading={false}>
      {/* --- SEO Head --- */}
      <Head>
        <title>{`${arena.name ?? 'Arena'} Review - ${
          settings?.title ?? CMS_NAME
        }`}</title>
        {arena.location && (
          <meta
            name="description"
            content={`Details, review, and photos for ${arena.name} located in ${arena.location}.`}
          />
        )}
        {arena.arenaImage?.asset && ( // Check if asset exists
          <meta
            property="og:image"
            content={urlForImage(arena.arenaImage)
              .width(1200)
              .height(630)
              .url()}
          />
        )}
      </Head>
 
      <BlogHeader level={1} />
      {/* --- Main Article Content --- */}
  
      <article className="container mx-auto px-4 py-12 md:px-6 lg:px-36 lg:py-10 xl:py-36">

        <PageHeader title={arena.name ?? 'Unnamed Arena'} items={headerItems} />
        {arena.photoGallerySection && (
          <div className="mb-12 lg:mb-16">
            {' '}
            {/* Added margin below gallery */}
            <HeroPhotoGallery photos={arena.photoGallerySection} />
          </div>
        )}
  
        <div className="space-y-12 lg:space-y-16">
          {/* --- Info Boxes Section (Ratings & Teams) --- */}
          {/* This section renders only if visited or if teams exist */}

          {
            (arena.visited && arena.arenaReview) ||
            (arena.gallery && arena.gallery.length > 0) ? (
              // Section uses flex for layout, stacking vertically on mobile, row from 'sm' up.
              // w-full ensures it takes available width. Gap controls space between items.
              <section className="flex w-full flex-col gap-6 sm:flex-row sm:gap-10 lg:gap-16">
                {/* Rating Summary Box - Renders only if visited and review exists */}
                {arena.visited && arena.arenaReview && (
                  <div className="mb-8 flex items-end">
                    {/* Main Rating Box */}
                    <div
                      className="z-30 flex h-32 w-36 flex-col items-center justify-center rounded-2xl border-2 bg-gray-50 p-2 shadow-md" // Added shadow
                      style={{ borderColor: color, opacity: 0.95 }} // Slightly adjusted opacity
                    >
                      {/* Numerical Rating */}
                      <div className="text-gray-900">
                        <span className="ml-1 mr-1 font-montserrat text-5xl font-black leading-tight tracking-tighter  md:text-left  md:leading-none lg:text-5xl">
                          {Number(average).toFixed(2)}
                        </span>
                      </div>
                      {/* Separator */}
                      <hr className="z-50 my-2 h-0.5 w-[85%] border-0 bg-gray-200 " />{' '}
                      {/* Adjusted width and color */}
                      {/* Star Rendering Area */}
                      <div className="mt-1 flex items-center">
                        <StarDisplay ratingValue={Number(average)} />

                        {/* {renderStars(numericalRating)} */}
                      </div>
                    </div>
                    {/* Text Rating Beside Box */}

                    <div className="ml-6 flex flex-col ">
                      <p
                        className={` font-heading font-montserrat text-6xl font-bold  text-gray-900`}
                      >
                        {' '}
                        {/* Added font styles */}
                        {textRating}
                      </p>
                      <p className="text-xs">
                        Based on weighted review scores.
                      </p>
                    </div>
                  </div>
                )}

                {arena.gallery && arena.gallery.length > 0 && (
                  <div
                    // Consistent styling with the rating box (flex-1, rounding, border, padding, shadow, hover).
                    className="flex h-32 w-[18.2rem] flex-col rounded-lg border border-gray-200 bg-white px-6  pt-6 shadow-sm transition duration-300 ease-in-out hover:shadow-md"
                  >
                    <h2 className="title-font mb-4 text-base font-medium uppercase tracking-widest text-gray-700">
                      Arena Team(s)
                    </h2>

                    <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-3">
                      {arena.gallery?.map((team) => (
                        <div
                          key={team._key || team.name}
                          className="flex items-start gap-2"
                        >
                          {/* Team Logo Image */}
                          {team?.asset && (
                            <img
                              src={urlForImage(team)
                                .height(32) // Keep size small for logos
                                .width(32)
                                .fit('crop')
                                .auto('format')
                                .url()}
                              className="h-6 w-6 shrink-0 rounded-full bg-gray-200 object-cover p-px" // Added object-cover
                              height={24}
                              width={24}
                              loading="lazy"
                              alt={`${team.name ?? 'Team'} logo`}
                            />
                          )}
                          {/* Team Name */}
                          <span className="text-sm text-gray-700">
                            {team.name}
                          </span>
                          {/* Watched Status Icon */}
                          {team.played === true ? (
                            <Eye
                              aria-label="Watched"
                              className="h-4 w-4 shrink-0 text-green-500"
                            />
                          ) : (
                            <EyeOff
                              aria-label="Not Watched"
                              className="h-4 w-4 shrink-0 text-gray-400"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ) : null /* Render nothing if neither box has content */
          }

          {/* --- Arena Rating Breakdown Section --- */}
          {arena.visited && arena.arenaReview && (
            <section>
              <h2 className="title-font my-3 mb-4 mt-2 text-base font-medium uppercase tracking-widest text-gray-700">
                Arena Rating Breakdown
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                <AreanaRating
                  rating={arena.arenaReview?.transportation}
                  text={'Transit to Arena'}
                  icon={<Car className="text-gray-500" />}
                />
                <AreanaRating
                  rating={arena.arenaReview?.walkability}
                  text={'Arena Accessibility'}
                  icon={<Footprints className="text-gray-500" />}
                />
                <AreanaRating
                  rating={arena.arenaReview?.vibes}
                  text={'Arena Vibes'}
                  icon={<Music className="text-gray-500" />}
                />
                <AreanaRating
                  rating={arena.arenaReview?.food}
                  text={'Food Options'}
                  icon={<Pizza className="text-gray-500" />}
                />
                <AreanaRating
                  rating={arena.arenaReview?.view}
                  text={'View from our Seat'}
                  icon={<Binoculars className="text-gray-500" />}
                />
                <AreanaRating
                  rating={arena.arenaReview?.seatComfort}
                  text={'Seat Comfort'}
                  icon={<Sofa className="text-gray-500" />}
                />
              </div>
            </section>
          )}

          {/* --- Pros/Cons/Verdict Section --- */}
          {/* ProConList component likely has its own title ("Bottom Line"), so no extra heading needed here */}
          {hasProsConsData && (
            <ProConList
              positives={arena.prosConsVerdict.positives}
              negatives={arena.prosConsVerdict.negatives}
              verdict2={arena.prosConsVerdict.verdict}
            />
          )}
          {arena.videoUrl && <VideoPlayer url={arena.videoUrl} />}
          {/* --- Image Gallery Section --- */}

          {hasImageGallery && (
            <ImageGallery
              // Use 'gallery' field if that holds the images for this component
              images={arena?.imageGallery}
              title="Image Gallery" // Pass title prop
            />
          )}

          {/* Add other sections as needed within the main space-y container */}
        </div>{' '}
        {/* End Main Content Sections Wrapper */}
      </article>{' '}
      {/* End Article */}
      <Footer />
    </Layout>
  )
}
