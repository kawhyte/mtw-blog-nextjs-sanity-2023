import { PreviewSuspense } from '@sanity/preview-kit';
import ArenaPageHeader from 'components/ArenaPageHeader';
import BlogHeader from 'components/BlogHeader';
import Layout from 'components/BlogLayout';
import Footer from 'components/Footer';
import MoreStories from 'components/MoreStories'; // Assuming this is used elsewhere or can be removed if not
import NBAArenaCard from 'components/NBAArenaCard'; // Assume this component handles the 'rank' prop visually
import calculateAverageRating from 'lib/calculateArenaRating';
// --- Other imports ---
import {
  getArenaPosts,
  getSettings,
} from 'lib/sanity.client';
import { Arena, Settings } from 'lib/sanity.queries';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
// --- React hooks ---
import { lazy, useEffect,useMemo, useState } from 'react';

import { CMS_NAME } from '../lib/constants';

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'));

interface PageProps {
  arenaPosts: Arena[];
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

type SortCriteriaType =
  | 'latest'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'highest'
  | 'lowest';

type FilterCriteriaType = 'all' | 'visited' | 'notVisited';

export default function Page(props: PageProps) {
  const { arenaPosts, settings, preview, token } = props;

  const [sortCriteria, setSortCriteria] = useState<SortCriteriaType>('highest');
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteriaType>('all');

  // --- Calculate stable rating ranks for all visited arenas ---
  const ratingRankMap = useMemo(() => {
    const ranks = new Map<string, number>(); // Map to store Arena ID -> Rank

    // 1. Filter for visited arenas only, as only they get ranked by rating
    const visitedArenas = arenaPosts.filter(arena => arena.visited);

    // 2. Sort these visited arenas strictly by rating (highest first)
    //    Tie-breaking with name alphabetically ensures a stable order.
    const sortedForRanking = [...visitedArenas].sort((a, b) => {
      const nameA = a.name ?? '';
      const nameB = b.name ?? '';
      const { average: scoreA } = calculateAverageRating(a.arenaReview || {});
      const { average: scoreB } = calculateAverageRating(b.arenaReview || {});
      // Handle potential non-numeric scores gracefully, treating them as 0
      const numScoreA = parseFloat(scoreA) || 0;
      const numScoreB = parseFloat(scoreB) || 0;

      // Primary sort: Higher score first
      if (numScoreB !== numScoreA) {
        return numScoreB - numScoreA;
      }
      // Tie-breaker: Alphabetical name (A-Z)
      return nameA.localeCompare(nameB);
    });

    // 3. Assign ranks based on this rating-sorted order
    sortedForRanking.forEach((arena, index) => {
      // Add rank (index + 1) to the map, keyed by arena ID
      ranks.set(arena._id, index + 1);
    });

    return ranks;
  }, [arenaPosts]); // This calculation only depends on the initial arena data


  // --- Calculate the list of arenas to DISPLAY based on current filters and sorting ---
  const arenasToDisplay = useMemo(() => {
    // 1. Filter first based on the selected filterCriteria
    const filtered = arenaPosts.filter((arena) => {
      if (filterCriteria === 'visited') return arena.visited;
      if (filterCriteria === 'notVisited') return !arena.visited;
      return true; // 'all'
    });

    // 2. Then sort the filtered list based on the selected sortCriteria FOR DISPLAY
    const sortedForDisplay = [...filtered].sort((a, b) => {
        const nameA = a.name ?? '';
        const nameB = b.name ?? '';

        // Handle 'notVisited' sorting separately (only name sorting allowed)
        if (filterCriteria === 'notVisited') {
            if (sortCriteria === 'name_asc') {
            return nameA.localeCompare(nameB);
            } else if (sortCriteria === 'name_desc') {
            return nameB.localeCompare(nameA);
            }
            // Default for 'notVisited' if sort is somehow invalid
            return nameA.localeCompare(nameB);
        }

        // Sorting logic for 'visited' or 'all' filters
        switch (sortCriteria) {
          case 'latest': {
            const dateA = a.date ? new Date(a.date).getTime() : 0; // Get timestamp or 0
            const dateB = b.date ? new Date(b.date).getTime() : 0; // Get timestamp or 0

            // --- This is the key part for your requirement ---
            // 1. If B is visited and A is not, B comes first (return -1)
            if (b.visited && !a.visited) return -1;
            // 2. If A is visited and B is not, A comes first (means B goes later, return 1)
            if (!b.visited && a.visited) return 1;
            // --- End key part ---

            // 3. If BOTH are NOT visited, sort them alphabetically by name
            if (!b.visited && !a.visited) return nameA.localeCompare(nameB);

            // 4. If BOTH ARE visited, sort by date (descending - latest first)
            // Handle cases where a visited item might unexpectedly lack a date
            if (dateB && !dateA) return 1; // B has date, A doesn't -> B is later
            if (!dateB && dateA) return -1;// A has date, B doesn't -> A is later
            // Both have dates, compare them (higher timestamp = later date)
            return dateB - dateA;
        }
            case 'oldest': {
            const dateA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
            const dateB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
            // Prioritize visited arenas if mixing
            if (a.visited && !b.visited) return -1;
            if (!a.visited && b.visited) return 1;
            if (!a.visited && !b.visited) return nameA.localeCompare(nameB); // Sort unvisited by name
            // Sort visited by date (oldest first)
            if (dateA && !dateB) return -1;
            if (!dateA && dateB) return 1;
            return dateA - dateB;
            }
            case 'name_asc':
            return nameA.localeCompare(nameB);
            case 'name_desc':
            return nameB.localeCompare(nameA);
            case 'highest': {
            // Non-visited arenas always go last when sorting by rating
            if (!a.visited && b.visited) return 1;
            if (a.visited && !b.visited) return -1;
            if (!a.visited && !b.visited) return nameA.localeCompare(nameB); // Sort unvisited by name

            // Both are visited, compare ratings
            const { average: scoreA } = calculateAverageRating(a.arenaReview || {});
            const { average: scoreB } = calculateAverageRating(b.arenaReview || {});
            const numScoreA = parseFloat(scoreA) || 0;
            const numScoreB = parseFloat(scoreB) || 0;
            if (numScoreB !== numScoreA) {
                return numScoreB - numScoreA; // Higher score first
            } else {
                return nameA.localeCompare(nameB); // Tie-breaker: alphabetical
            }
            }
            case 'lowest': {
            // Non-visited arenas always go last when sorting by rating
            if (!a.visited && b.visited) return 1;
            if (a.visited && !b.visited) return -1;
            if (!a.visited && !b.visited) return nameA.localeCompare(nameB); // Sort unvisited by name

            // Both are visited, compare ratings
            const { average: scoreA } = calculateAverageRating(a.arenaReview || {});
            const { average: scoreB } = calculateAverageRating(b.arenaReview || {});
            const numScoreA = parseFloat(scoreA) || 0;
            const numScoreB = parseFloat(scoreB) || 0;
            if (numScoreA !== numScoreB) {
                return numScoreA - numScoreB; // Lower score first
            } else {
                return nameA.localeCompare(nameB); // Tie-breaker: alphabetical
            }
            }
            default:
            return 0;
        }
        });


    return sortedForDisplay;
  }, [arenaPosts, filterCriteria, sortCriteria]); // Depends on posts, filter, and sort

  // Effect to adjust sort criteria if filter changes to 'notVisited'
  useEffect(() => {
    if (filterCriteria === 'notVisited') {
      // Only allow name sorting for 'notVisited'
      if (sortCriteria !== 'name_asc' && sortCriteria !== 'name_desc') {
        setSortCriteria('name_asc'); // Default to A-Z for not visited
      }
    }
    // No need for an 'else' block unless you want to force a specific sort
    // when switching *away* from 'notVisited'.
  }, [filterCriteria, sortCriteria]);


  const handleSort = (criteria: SortCriteriaType) => {
    setSortCriteria(criteria);
  };

  const handleFilter = (criteria: FilterCriteriaType) => {
    setFilterCriteria(criteria);
  };

  // --- Preview Mode Rendering ---
  if (preview) {
     return (
      <PreviewSuspense fallback={<div>Loading preview...</div>}>
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
        </Head>

        {/* Header components */}
        <BlogHeader
          title={'Visiting and Ranking Every NBA/WNBA Arena'}
          description={[]}
          level={1}
        />
        <ArenaPageHeader
          title={'Visiting and Ranking Every NBA/WNBA Arena'}
          arenas={arenaPosts}
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
              // Disable sort dropdown only when showing 'notVisited' AND the allowed sorts aren't selected
              // Simpler: just disable if filter is 'notVisited' as sorting is forced then.
              disabled={filterCriteria === 'notVisited'}
            >
              {/* Show all sort options, but the dropdown itself is disabled if needed */}
              <option value="highest">Ranked: High to Low</option>
              <option value="lowest">Ranked: Low to High</option>
              <option value="oldest">Date Visited: Most Recent</option>
              {/* <option value="latest">Last Visited</option> */}
              <option value="name_asc">Arena Name (A-Z)</option>
              <option value="name_desc">Arena Name (Z-A)</option>
            </select>
          </div>

          {/* Filter By Buttons */}
           <div className="flex w-full items-center justify-center space-x-2 md:w-auto md:justify-end">
            <span className="mr-2 hidden text-sm font-medium text-gray-700 sm:inline">
              Filter:
            </span>
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


        {/* Arena Cards Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4
                     md:grid-cols-3 md:gap-x-6 md:gap-y-10 md:px-6
                     lg:grid-cols-4 lg:gap-x-8 mx-auto container">
          {arenasToDisplay.length > 0 ? (
             // ***** MODIFICATION START *****
             arenasToDisplay.map((item) => { // Loop through the list sorted for display
                // Calculate display rating info
                const { average, textRating, color } = calculateAverageRating(
                   item.arenaReview || {}
                );

                // --- Get the STABLE rating rank from the pre-calculated map ---
                // Rank is only applicable and looked up for visited arenas.
                const rankNumber = item.visited ? ratingRankMap.get(item._id) ?? null : null;

                // Check slug for linking
                if (!item.slug) {
                   console.warn(`Arena "${item.name || item._id}" is missing a slug. Skipping link.`);
                   return null; // Skip rendering this item if it cannot be linked
                }

                // Render Card wrapped in Link
                return (
                   <Link
                      key={item._id} // Key on the outermost element
                      href={`/arena/${item.slug}`}
                      passHref
                      className={`group ${ // Add group for hover effects on children
                        item.visited
                          ? 'cursor-pointer'
                          : 'pointer-events-none cursor-default opacity-70'
                      }`}
                      aria-disabled={!item.visited}
                      tabIndex={!item.visited ? -1 : undefined}
                      prefetch={item.visited ? undefined : false}
                       >
                         <NBAArenaCard
                            // Pass all necessary props
                            arenaImageSrc={item.arenaImage}
                            location={item.location}
                            constructionDate={item.buildDate}
                            capacity={item.capacity}
                            alt={`${item.name ?? 'Arena'} exterior`}
                            arenaReview={item.arenaReview || {}}
                            arenaName={item.name}
                            gallery={item.gallery}
                            visited={item.visited}
                            dateVisited={item.date}
                            id={item._id}
                            averageRating={average} // Display rating
                            textRating={textRating} // Display rating text
                            ratingColor={color}     // Display rating color
                            rank={rankNumber}       // Pass the STABLE rating rank
                         />
                   </Link>
                );
             })
             // ***** MODIFICATION END *****
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

// --- getStaticProps remains unchanged ---
export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, arenaPosts = []] = await Promise.all([
    getSettings(),
    getArenaPosts(), // Ensure this fetches the 'slug' and '_id' fields
  ]);

  // Basic validation (optional but good practice)
  if (!Array.isArray(arenaPosts)) {
      console.error("getArenaPosts did not return an array.");
      // Handle error appropriately, maybe return empty props or throw
  }

  return {
    props: {
      arenaPosts: arenaPosts || [],
      settings: settings || {},
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}