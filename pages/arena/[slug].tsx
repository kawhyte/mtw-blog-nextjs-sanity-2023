// pages/arena/[slug].tsx

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PortableText } from '@portabletext/react';

// --- Sanity Client & Data Fetching ---
import {
  getAllArenaSlugs,
  getArenaBySlug,
  getSettings,
} from 'lib/sanity.client'; // Adjust path
import { Arena, Settings } from 'lib/sanity.queries'; // Adjust path
import { urlForImage } from 'lib/sanity.image'; // Adjust path

// --- Layout & Components ---
import Layout from 'components/BlogLayout'; // Adjust path
import Footer from 'components/Footer'; // Adjust path
import AreanaRating from 'components/AreanaRating'; // Adjust path
import BlogHeader from 'components/BlogHeader'; // Adjust path
import HeroPhotoGallery from 'components/HeroPhotoGallery'; // Adjust path
import ImageGallery from 'components/ImageGallery'; // Adjust path
import ProConList from 'components/ProConList'; // Adjust path

// --- Utilities & Constants ---
import { CMS_NAME } from 'lib/constants';
import calculateAverageRating from 'lib/calculateArenaRating'; // Adjust path
import {
  Binoculars, CalendarCheck, Car, Eye, EyeOff, Footprints, MapPin, Music, Pizza, Sofa, Users, Wrench,
} from 'lucide-react';

// --- Props Interface & Query ---
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const arena = await getArenaBySlug(slug);
  const settings = await getSettings();

  if (!arena) {
    return { notFound: true };
  }

  return {
    props: {
      arena,
      settings,
      preview: false,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};


export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = await getAllArenaSlugs();
    return {
        paths: slugs?.map((slug) => ({ params: { slug } })) || [],
        fallback: 'blocking',
    };
};





// ============================================
// Page Component Implementation
// ============================================
export default function ArenaPage({
  arena,
  settings,
  preview,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading arena details...</div>;
  }

  // Calculate rating details safely
  const { average, textRating, color } = calculateAverageRating(
    arena?.arenaReview || {} // Pass empty object if review is missing
  );

  // Check if there's data for the Pros/Cons/Verdict section
  const hasProsConsData = arena?.prosConsVerdict &&
                         ( (arena.prosConsVerdict.positives && arena.prosConsVerdict.positives.length > 0) ||
                           (arena.prosConsVerdict.negatives && arena.prosConsVerdict.negatives.length > 0) ||
                           (arena.prosConsVerdict.verdict && arena.prosConsVerdict.verdict.length > 0) );

  // Check if there are gallery images for the ImageGallery component
  const hasImageGallery = arena?.gallery && arena.gallery.length > 0; // Assuming 'gallery' holds images for ImageGallery

  if (!arena) {
    return <div>Arena not found.</div>; // Or a proper 404 component
  }

  return (
    <Layout preview={preview} loading={false}>
      {/* --- SEO Head --- */}
      <Head>
        <title>{`${arena.name ?? 'Arena'} Review - ${settings?.title ?? CMS_NAME}`}</title>
        {arena.location && (
          <meta name="description" content={`Details, review, and photos for ${arena.name} located in ${arena.location}.`} />
        )}
        {arena.arenaImage?.asset && ( // Check if asset exists
          <meta property="og:image" content={urlForImage(arena.arenaImage).width(1200).height(630).url()} />
        )}
      </Head>

      {/* Optional: A consistent header across blog posts/pages */}
      {/* <BlogHeader level={1} /> */}

      {/* --- Main Article Content --- */}
      {/* Increased vertical padding (py) for more breathing room, especially on larger screens */}
      <article className="container mx-auto px-4 py-12 md:px-6 lg:px-8 lg:py-16 xl:py-20">

        {/* --- Arena Header Section --- */}
        {/* Increased bottom margin (mb) for more separation */}
        <header className="mb-12 lg:mb-16">
          {/* Increased bottom margin for heading */}
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            {arena.name ?? 'Unnamed Arena'}
          </h1>

          {/* Arena Quick Info List - Using flex for better control */}
          {/* Added more vertical gap (gap-y) and horizontal gap (gap-x) */}
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 md:text-base">
            {/* Using list items for semantic structure */}
            {arena.location && (
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                {arena.location}
              </li>
            )}
            {arena.buildDate && (
              <li className="flex items-center">
                <Wrench className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                <span className="hidden font-medium md:inline mr-1">Built:</span>
                {new Date(arena.buildDate).getFullYear()}
              </li>
            )}
            {arena.capacity && (
              <li className="flex items-center">
                <Users className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                 <span className="hidden font-medium md:inline mr-1">Capacity:</span>
                {arena.capacity.toLocaleString()}
              </li>
            )}
            {arena.visited && arena.date && (
              <li className="flex items-center">
                <CalendarCheck className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                <span className="hidden font-medium md:inline mr-1">Visited:</span>
                {new Date(arena.date).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </li>
            )}
          </ul>
        </header>

        {/* --- Hero Photo Gallery --- */}
        {/* Add vertical margin if needed, depending on HeroPhotoGallery's internal spacing */}
        {arena.photoGallerySection && (
            <div className="mb-12 lg:mb-16"> {/* Added margin below gallery */}
                <HeroPhotoGallery photos={arena.photoGallerySection} />
            </div>
        )}

        {/* --- Main Content Sections Wrapper --- */}
        {/* Using space-y-* for consistent vertical spacing between direct children sections */}
        <div className="space-y-12 lg:space-y-16">

            {/* --- Info Boxes Section (Ratings & Teams) --- */}
            {/* This section renders only if visited or if teams exist */}
            {(arena.visited || (arena.gallery && arena.gallery.length > 0)) && (
              <section className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                {/* Rating Summary Box */}
                {arena.visited && arena.arenaReview && (
                  <div className={`flex-1 rounded-lg border border-${color}-300 bg-${color}-50 p-5 shadow-sm`}> {/* Slightly more padding */}
                    <h2 className="mb-2 text-lg font-semibold text-gray-800 md:text-xl">
                      Overall Rating
                    </h2>
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-3xl font-bold text-${color}-700 md:text-4xl`}>
                        {average}
                      </span>
                      <span className={`text-base font-medium text-${color}-600 md:text-lg`}>
                        ({textRating})
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-600 md:text-sm">
                      Based on detailed review scores.
                    </p>
                  </div>
                )}

                {/* Teams Viewed Box */}
                {arena.gallery && arena.gallery.length > 0 && ( // Use 'teams' if renamed
                  <div className="flex-1 rounded-lg border border-gray-200 p-5 shadow-sm"> {/* Consistent padding */}
                    <h2 className="mb-3 text-lg font-semibold text-gray-800 md:text-xl">
                      Teams Viewed
                    </h2>
                    {/* Use flex for logos */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      {arena.gallery?.map((team) => ( // Use 'teams' if renamed
                        <div key={team._key || team.name} className="flex items-center gap-2">
                          {team?.asset && (
                             <img
                               src={urlForImage(team).height(32).width(32).fit('crop').url()}
                               className="h-6 w-6 rounded-full bg-gray-200 p-px" // Consistent size
                               height={32} width={32} loading="lazy" alt={`${team.name} logo`}
                             />
                          )}
                          <span className="text-sm text-gray-700">{team.name}</span>
                          {team.played === true ? (
                             <Eye aria-label="Watched" className="h-4 w-4 text-green-500" />
                          ) : (
                             <EyeOff aria-label="Not Watched" className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}


            {/* --- Arena Rating Breakdown Section --- */}
            {arena.visited && arena.arenaReview && (
              <section>
                {/* Added consistent heading margin */}
                <h2 className="mb-6 text-2xl font-bold lg:text-3xl">
                  Arena Rating Breakdown
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                  {/* Render AreanaRating components - ensure they have internal padding */}
                  <AreanaRating rating={arena.arenaReview?.transportation} text={'Transit to Arena'} icon={<Car className="text-pink-500" />} />
                  <AreanaRating rating={arena.arenaReview?.walkability} text={'Arena Accessibility'} icon={<Footprints className="text-pink-500" />} />
                  <AreanaRating rating={arena.arenaReview?.vibes} text={'Arena Vibes'} icon={<Music className="text-pink-500" />} />
                  <AreanaRating rating={arena.arenaReview?.food} text={'Food Options'} icon={<Pizza className="text-pink-500" />} />
                  <AreanaRating rating={arena.arenaReview?.view} text={'View from our Seat'} icon={<Binoculars className="text-pink-500" />} />
                  <AreanaRating rating={arena.arenaReview?.seatComfort} text={'Seat Comfort'} icon={<Sofa className="text-pink-500" />} />
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


            {/* --- Image Gallery Section --- */}
            {hasImageGallery && (
              <section>
                  <ImageGallery
                    // Use 'gallery' field if that holds the images for this component
                    images={arena.gallery}
                    title="Image Gallery" // Pass title prop
                  />
              </section>
            )}

            {/* Add other sections as needed within the main space-y container */}

        </div> {/* End Main Content Sections Wrapper */}
      </article> {/* End Article */}

      <Footer />
    </Layout>
  );
}