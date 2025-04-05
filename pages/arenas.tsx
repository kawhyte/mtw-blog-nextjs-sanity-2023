import { PreviewSuspense } from '@sanity/preview-kit';
import BlogHeader from 'components/BlogHeader';
import Layout from 'components/BlogLayout';
import Footer from 'components/Footer';
import NBAArenaCard from 'components/NBAArenaCard';
import ArenaPageHeader from 'components/ArenaPageHeader';
// --- Other imports ---
import {
  getArenaPosts,
  getSettings,
  // getTravelEssentialPosts, // Uncomment if needed elsewhere
} from 'lib/sanity.client';
import { Arena, Settings } from 'lib/sanity.queries'; // Ensure Arena type includes 'slug'
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link'; // <--- IMPORT LINK
// --- React hooks ---
import { lazy, useState, useMemo, useEffect } from 'react';

import { CMS_NAME } from '../lib/constants';
import calculateAverageRating from 'lib/calculateArenaRating';

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'));

interface PageProps {
  arenaPosts: Arena[]; // Make sure Arena type in sanity.queries.ts includes slug?: string
  settings: Settings;
  preview: boolean;
  token: string | null;
}

interface Query {
  [key: string]: string;
}

interface PreviewData {
  token?: string;
}

// Define a type for the sort criteria values for better type safety
type SortCriteriaType =
  | 'latest'
  | 'oldest'
  | 'name_asc' // Changed from 'name'
  | 'name_desc' // Added for Z-A
  | 'highest'
  | 'lowest';

// Define a type for the filter criteria values
type FilterCriteriaType = 'all' | 'visited' | 'notVisited';

export default function Page(props: PageProps) {
  const { arenaPosts, settings, preview, token } = props;

  // State for sorting and filtering criteria ONLY
  const [sortCriteria, setSortCriteria] = useState<SortCriteriaType>('name_asc');
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteriaType>('all');

  // --- Calculate the arenas to display based on current criteria ---
  const arenasToDisplay = useMemo(() => {
    // 1. Filter first
    const filtered = arenaPosts.filter((arena) => {
      if (filterCriteria === 'visited') return arena.visited;
      if (filterCriteria === 'notVisited') return !arena.visited;
      return true; // 'all'
    });

    // 2. Then sort the filtered list
    // Ensure localeCompare handles potential undefined names gracefully if needed
    const sorted = [...filtered].sort((a, b) => {
      const nameA = a.name ?? '';
      const nameB = b.name ?? '';

      if (filterCriteria === 'notVisited') {
        if (sortCriteria === 'name_asc') {
          return nameA.localeCompare(nameB);
        } else if (sortCriteria === 'name_desc') {
          return nameB.localeCompare(nameA);
        }
        return nameA.localeCompare(nameB);
      }

      if (sortCriteria === 'latest') {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        if (dateB && !dateA) return 1;
        if (!dateB && dateA) return -1;
        return dateB - dateA;
      } else if (sortCriteria === 'oldest') {
        const dateA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
        if (dateA && !dateB) return -1;
        if (!dateA && dateB) return 1;
        return dateA - dateB;
      } else if (sortCriteria === 'name_asc') {
        return nameA.localeCompare(nameB);
      } else if (sortCriteria === 'name_desc') {
        return nameB.localeCompare(nameA);
      } else if (sortCriteria === 'highest') {
        if (!a.visited && b.visited) return 1;
        if (a.visited && !b.visited) return -1;
        if (!a.visited && !b.visited) return nameA.localeCompare(nameB);

        const { average: scoreA } = calculateAverageRating(a.arenaReview || {});
        const { average: scoreB } = calculateAverageRating(b.arenaReview || {});
        const numScoreA = parseFloat(scoreA) || 0;
        const numScoreB = parseFloat(scoreB) || 0;
        if (numScoreB !== numScoreA) {
             return numScoreB - numScoreA;
        } else {
             return nameA.localeCompare(nameB);
        }
      } else if (sortCriteria === 'lowest') {
        if (!a.visited && b.visited) return 1;
        if (a.visited && !b.visited) return -1;
        if (!a.visited && !b.visited) return nameA.localeCompare(nameB);

        const { average: scoreA } = calculateAverageRating(a.arenaReview || {});
        const { average: scoreB } = calculateAverageRating(b.arenaReview || {});
        const numScoreA = parseFloat(scoreA) || 0;
        const numScoreB = parseFloat(scoreB) || 0;
         if (numScoreA !== numScoreB) {
            return numScoreA - numScoreB;
        } else {
            return nameA.localeCompare(nameB);
        }
      }
      return 0; // Default case
    });

    return sorted;
  }, [arenaPosts, filterCriteria, sortCriteria]); // Dependencies for useMemo

  // --- Effect to reset sort criteria if it becomes invalid for 'notVisited' ---
  useEffect(() => {
    if (filterCriteria === 'notVisited') {
      if (sortCriteria !== 'name_asc' && sortCriteria !== 'name_desc') {
        setSortCriteria('name_asc');
      }
    }
  }, [filterCriteria, sortCriteria]); // Rerun when filter or sort changes


  // --- Handlers for sort/filter ---
  const handleSort = (criteria: SortCriteriaType) => {
    setSortCriteria(criteria);
  };

  const handleFilter = (criteria: FilterCriteriaType) => {
    setFilterCriteria(criteria);
  };


  // --- Preview Mode Rendering ---
  if (preview) {
     return (
      <PreviewSuspense
        fallback={
          <div>Loading preview...</div>
        }
      >
        {/* Ensure PreviewIndexPage handles arena data or adjust as needed */}
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    );
  }

  // --- Standard Page Rendering ---
  return (
    <>
      <Layout preview={preview} loading={false}>
         <Head>
          <title>{`NBA/WNBA Arena Reviews - ${settings.title ?? CMS_NAME}`}</title>
          <meta
            name="description"
            content="We're on a journey to visit and rank every NBA and WNBA arena! Explore our reviews, photos, and experiences from arenas across the US and Canada."
          />
          {/* Add other meta tags if needed */}
        </Head>

        {/* Header components */}
        <BlogHeader
          title={'Visiting and Ranking Every NBA/WNBA Arena'}
          description={[]}
          level={1}
        />
        <ArenaPageHeader
          title={'Visiting and Ranking Every NBA/WNBA Arena'}
          arenas={arenaPosts} // Pass original posts if needed by header
          summary={`We are traveling near and far to every state/country to visit and rank all the NBA and WNBA arenas (${arenaPosts.length}) across the US and Canada. Follow us on this journey.`}
          animation={'/basketball.svg'}
        />


        {/* Sorting and Filtering Section */}
        <div className="container mx-auto mb-6 mt-6 flex max-w-4xl flex-col items-center justify-between gap-y-4 rounded-lg bg-gray-50 px-4 py-4 shadow-sm md:flex-row md:gap-y-0 md:px-6">
          {/* Sort By Dropdown */}
          <div className="flex w-full items-center md:w-auto">
            <label htmlFor="sort" className="mr-2 whitespace-nowrap text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortCriteria}
              onChange={(e) => handleSort(e.target.value as SortCriteriaType)}
              className="flex-grow appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 md:flex-grow-0"
            >
              {filterCriteria === 'notVisited' ? (
                <>
                  <option value="name_asc">Arena Name (A-Z)</option>
                  <option value="name_desc">Arena Name (Z-A)</option>
                </>
              ) : (
                <>
                  <option value="name_asc">Arena Name (A-Z)</option>
                  <option value="name_desc">Arena Name (Z-A)</option>
                  <option value="latest">Last Visited</option>
                  <option value="oldest">First Visited</option>
                  <option value="highest">Highest Review Score</option>
                  <option value="lowest">Lowest Review Score</option>
                </>
              )}
            </select>
          </div>

          {/* Filter By Buttons */}
           <div className="flex w-full items-center justify-center space-x-2 md:w-auto md:justify-end">
            <span className="mr-2 hidden text-sm font-medium text-gray-700 sm:inline">
              Filter:
            </span>
            {/* Filter Buttons */}
            {(['all', 'visited', 'notVisited'] as FilterCriteriaType[]).map((criteria) => (
                 <button
                    key={criteria}
                    onClick={() => handleFilter(criteria)}
                    className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors duration-150 ${
                      filterCriteria === criteria
                        ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {criteria === 'notVisited' ? 'Not Visited' : criteria}
                  </button>
            ))}
          </div>
        </div>


        {/* Arena Cards Grid - UPDATED with Link */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4
                     md:grid-cols-3 md:gap-x-6 md:gap-y-10 md:px-6
                     lg:grid-cols-4 lg:gap-x-8">
          {arenasToDisplay.length > 0 ? (
             arenasToDisplay.map((item) => {
                // Calculate rating (ensure item.arenaReview exists)
                const { average, textRating, color } = calculateAverageRating(
                   item.arenaReview || {}
                );

                // --- Check if slug exists before rendering Link ---
                if (!item.slug) {
                   console.warn(`Arena "${item.name || item._id}" is missing a slug. Cannot create link.`);
                   // Optionally render the card without a link, or skip entirely
                   // return <NBAArenaCard key={item._id} ... />; // Card without link
                   return null; // Skip rendering this item
                }

                // --- Render Card wrapped in Link ---
                return (
                   <Link
                      key={item._id} // Key MUST be on the outermost element of the map
                      href={`/arena/${item.slug}`} // Dynamic route using the slug
                      passHref // Pass href to the underlying <a> tag
                   
                       >
                      {/* Use an <a> tag for semantics and passHref compatibility */}
                      {/* <a className="block rounded-lg transition duration-150 ease-in-out hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"> */}
                         <NBAArenaCard
                            // key prop is removed from here
                            arenaImageSrc={item.arenaImage}
                            location={item.location}
                            constructionDate={item.buildDate}
                            capacity={item.capacity}
                            alt={`${item.name ?? 'Arena'} exterior`} // Use nullish coalescing for name
                            arenaReview={item.arenaReview || {}} // Pass review object
                            arenaName={item.name}
                            gallery={item.gallery} // Pass gallery if needed by card display
                            visited={item.visited}
                            dateVisited={item.date}
                            id={item._id} // Keep id if needed internally by card
                            averageRating={average}
                            textRating={textRating}
                            ratingColor={color}
                         />
                      {/* </a> */}
                   </Link>
                );
             })
          ) : (
             <p className="col-span-full text-center text-gray-500">
               No arenas match the current filter and sort criteria.
             </p>
          )}
        </div>
        <Footer />
      </Layout>
    </>
  );
}

// --- getStaticProps remains the same ---
// Ensure getArenaPosts fetches the 'slug' field
export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  // Make sure getArenaPosts fetches the slug field!
  // Example GROQ in sanity.queries.ts:
  // const arenaFields = groq` ... "slug": slug.current, ... `
  // export const arenaQuery = fetchDocuments('arenas', arenaFields, { order: 'name asc' })
  const [settings, arenaPosts = []] = await Promise.all([
    getSettings(),
    getArenaPosts(), // This MUST fetch the 'slug' for each arena
  ]);

  // Defensive check: Log if any posts are missing slugs (optional)
  // const postsWithoutSlugs = arenaPosts.filter(p => !p.slug);
  // if (postsWithoutSlugs.length > 0) {
  //    console.warn(`Warning: ${postsWithoutSlugs.length} arena posts are missing slugs.`);
  // }

  return {
    props: {
      arenaPosts: arenaPosts || [], // Ensure arenaPosts is always an array
      settings: settings || {}, // Ensure settings is an object
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60, // 1 minute revalidation
  };
}