// pages/arena/[slug].tsx

import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image'; // Use Next.js Image for optimization
import { useRouter } from 'next/router';
import { PortableText } from '@portabletext/react'; // Import if using Portable Text for reviews/descriptions

// --- Sanity Client & Data Fetching ---
import { getAllArenaSlugs, getArenaBySlug, getSettings } from 'lib/sanity.client';
import { Arena, Settings } from 'lib/sanity.queries'; // Import your types
import { urlForImage } from 'lib/sanity.image'; // Your image URL builder

// --- Layout & Components ---
import Layout from 'components/BlogLayout'; // Adjust path as needed
import Footer from 'components/Footer';   // Adjust path as needed
// import ArenaDetailHeader from 'components/ArenaDetailHeader'; // Example detail component
// import ArenaReviewSection from 'components/ArenaReviewSection'; // Example detail component
// import ImageGallery from 'components/ImageGallery'; // Example detail component

// --- Utilities & Constants ---
import { CMS_NAME } from 'lib/constants';
import calculateAverageRating from 'lib/calculateArenaRating'; // Your rating calculator

// --- Props Interface ---
// InferGetStaticPropsType handles this automatically, but defining explicitly can sometimes help clarity
// interface ArenaPageProps {
//   arena: Arena;
//   settings: Settings;
//   preview?: boolean; // Include if handling preview mode
// }

// Define Params type for GetStaticProps context
interface Query {
  [key: string]: string;
}

// ============================================
// 4. getStaticPaths Implementation
// ============================================
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all defined arena slugs from Sanity
  const slugs = await getAllArenaSlugs(); // Uses the function from sanity.client.ts

  return {
    // Map the string slugs to the required Next.js params format
    paths: slugs?.map((slug) => ({ params: { slug } })) || [],
    // fallback: 'blocking' - Server-renders pages not generated at build time, then caches. Good for SEO.
    // fallback: true - Shows fallback UI, fetches data client-side. Less initial SEO.
    // fallback: false - Returns 404 for paths not generated at build time.
    fallback: 'blocking',
  };
};

// ============================================
// 5. getStaticProps Implementation
// ============================================
export const getStaticProps: GetStaticProps<{ arena: Arena, settings: Settings, preview?: boolean }, Query> = async (ctx) => {
  const { params = {}, preview = false } = ctx;

  // Ensure slug exists
  const slug = params?.slug;
  if (!slug) {
    console.error('No slug found in params for arena page');
    return { notFound: true }; // Or handle differently
  }

  // Fetch settings and the specific arena data concurrently
  // getArenaBySlug returns Arena | null
  const [settings, arena] = await Promise.all([
    getSettings(),
    getArenaBySlug(slug), // Use the function from sanity.client.ts
  ]);

  // If no arena data is found for the slug, return 404
  if (!arena) {
    console.log(`Arena with slug "${slug}" not found.`);
    return {
      notFound: true,
    };
  }

  // Return the fetched data as props
  return {
    props: {
      arena,
      settings: settings || {}, // Provide default empty object for settings
      preview,
      // token: previewData.token ?? null, // Add if implementing preview mode
    },
    // Revalidate the page content periodically (e.g., every 5 minutes)
    // Adjust the time (in seconds) as needed for your content update frequency
    revalidate: 60 * 5, // 300 seconds = 5 minutes
  };
};


// ============================================
// Page Component Implementation
// ============================================
export default function ArenaPage({ arena, settings, preview }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  // Optional: Loading state for fallback: true (not needed for fallback: 'blocking')
  if (router.isFallback) {
    return <div>Loading arena details...</div>;
  }

  // Calculate rating details (ensure arenaReview exists)
  const { average, textRating, color } = calculateAverageRating(arena.arenaReview || {});

  // --- Render the Page ---
  return (
    <Layout preview={preview} loading={false}>
      {/* --- SEO Head --- */}
      <Head>
        <title>{`${arena.name ?? 'Arena'} Review - ${settings.title ?? CMS_NAME}`}</title>
        {arena.location && <meta name="description" content={`Details, review, and photos for ${arena.name} located in ${arena.location}.`} />}
        {/* Add Open Graph meta tags here */}
        {arena.arenaImage && <meta property="og:image" content={urlForImage(arena.arenaImage).width(1200).height(630).url()} />}
      </Head>

      {/* --- Arena Detail Display --- */}
      <article className="container mx-auto px-4 py-8 md:px-6 lg:py-12 lg:px-8">

        {/* Example Header Section */}
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl mb-2">
            {arena.name ?? 'Unnamed Arena'}
          </h1>
          <p className="text-lg text-gray-600">{arena.location ?? 'Location unknown'}</p>
          {/* Maybe add team name if you store it */}
          {/* <p className="text-sm text-gray-500">Home of the {arena.teamName}</p> */}
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">

          {/* --- Left Column (Image, Basic Info, Rating Summary) --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Arena Image */}
            {arena.arenaImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={urlForImage(arena.arenaImage).width(800).height(450).fit('crop').url()}
                  alt={`Exterior view of ${arena.name ?? 'the arena'}`}
                  layout="fill"
                  objectFit="cover"
                  priority // Prioritize loading the main image
                  sizes="(max-width: 1024px) 100vw, 33vw" // Example sizes attribute
                />
              </div>
            )}

            {/* Info Box */}
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold text-gray-800">Arena Info</h2>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {arena.buildDate && <li><strong>Built:</strong> {new Date(arena.buildDate).getFullYear()}</li>}
                {arena.capacity && <li><strong>Capacity:</strong> {arena.capacity.toLocaleString()}</li>}
                <li><strong>Visited:</strong> {arena.visited ? 'Yes' : 'No'}</li>
                {arena.visited && arena.date && (
                  <li><strong>Date Visited:</strong> {new Date(arena.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</li>
                )}
              </ul>
            </div>

            {/* Rating Summary Box (Only if visited and reviewed) */}
            {arena.visited && arena.arenaReview && (
              <div className={`rounded-md border border-${color}-300 bg-${color}-50 p-4 shadow-sm`}>
                 <h2 className="mb-2 text-xl font-semibold text-gray-800">Overall Rating</h2>
                 <div className="flex items-baseline space-x-2">
                    <span className={`text-4xl font-bold text-${color}-700`}>{average}</span>
                    <span className={`text-lg font-medium text-${color}-600`}>({textRating})</span>
                 </div>
                 <p className="mt-1 text-sm text-gray-600">Based on detailed review scores.</p>
               </div>
            )}
          </div>

          {/* --- Right Column (Detailed Review, Gallery, etc.) --- */}
          <div className="lg:col-span-2 space-y-10">

            {/* Detailed Review Section (if visited and reviewed) */}
            {arena.visited && arena.arenaReview && (
              <section className="rounded-md border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">Detailed Review Scores</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                  {/* Render your specific review fields here - Customize based on your arenaReview object */}
                  {Object.entries(arena.arenaReview).map(([key, value]) => {
                      // Simple display: Capitalize key, show value. Needs refinement for better labels.
                      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '); // Basic formatting
                      if (value !== null && value !== undefined) { // Only display if score exists
                         return (
                           <div key={key} className="text-sm">
                             <span className="font-medium text-gray-700">{label}:</span>{' '}
                             <span className="text-gray-900 font-semibold">{String(value)} / 10</span>
                           </div>
                         );
                      }
                      return null;
                  })}
                </div>
                {/* If you have a Portable Text field for review notes: */}
                {/* {arena.reviewNotes && (
                  <div className="mt-6 prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Review Notes:</h3>
                    <PortableText value={arena.reviewNotes} />
                  </div>
                )} */}
              </section>
            )}

             {/* If you have a Portable Text description field for the arena itself */}
             {/* {arena.description && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">About {arena.name}</h2>
                 <div className="prose lg:prose-lg max-w-none">
                  <PortableText value={arena.description} />
                 </div>
              </section>
            )} */}


            {/* Photo Gallery (if visited and gallery exists) */}
            {arena.visited && arena.gallery && arena.gallery.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">Photo Gallery</h2>
                {/* Use a dedicated gallery component or map images here */}
                {/* <ImageGallery images={arena.gallery} /> */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {arena.gallery.map((image, index) => (
                    <div key={image._key || index} className="relative aspect-square w-full overflow-hidden rounded-md shadow-md transition-transform hover:scale-105">
                       {/* Consider adding a Lightbox component link here */}
                       <a>
                           <Image
                            src={urlForImage(image).width(400).height(400).fit('crop').url()}
                            alt={`${arena.name ?? 'Arena'} gallery image ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            // Lazy loading is default in Next.js >= 10
                          />
                       </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

             {/* Add other sections as needed: History, Notable Events, Location Map etc. */}

          </div>
        </div>

      </article>

      <Footer /> {/* Reuse your footer */}
    </Layout>
  );
}