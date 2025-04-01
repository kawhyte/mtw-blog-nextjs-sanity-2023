import { PreviewSuspense } from '@sanity/preview-kit';
import AllReviewsPage from 'components/AllReviewsPage';
import BlogHeader from 'components/BlogHeader';
import Layout from 'components/BlogLayout';
import Footer from 'components/Footer';
import NBAArenaCard from 'components/NBAArenaCard';
import ReviewHeader from 'components/ReviewHeader';
// ... other imports
import {
  // getAllPosts,
  getArenaPosts,
  getSettings,
  getTravelEssentialPosts,
} from 'lib/sanity.client';
import { Arena, Settings } from 'lib/sanity.queries';
import { GetStaticProps } from 'next';
import Head from 'next/head';
// Import useEffect
import { lazy, useState, useMemo, useEffect } from 'react';

import { CMS_NAME } from '../lib/constants';
import calculateAverageRating from 'lib/calculateArenaRating';

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
    console.log(
      `Recalculating display list. Filter: ${filterCriteria}, Sort: ${sortCriteria}`
    );

    // 1. Filter first
    const filtered = arenaPosts.filter((arena) => {
      if (filterCriteria === 'visited') return arena.visited;
      if (filterCriteria === 'notVisited') return !arena.visited;
      return true; // 'all'
    });

    // 2. Then sort the filtered list
    const sorted = [...filtered].sort((a, b) => {
       // --- Handle sorting for 'notVisited' where only name sorting is relevant ---
      // Although filtering happens first, this logic ensures correct sorting behavior
      if (filterCriteria === 'notVisited') {
        if (sortCriteria === 'name_asc') {
          return a.name.localeCompare(b.name);
        } else if (sortCriteria === 'name_desc') {
          return b.name.localeCompare(a.name);
        }
        // If somehow an invalid sort criteria is set for 'notVisited', default to name_asc
        return a.name.localeCompare(b.name);
      }

      // --- Standard Sorting Logic (for 'all' and 'visited') ---
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
        return a.name.localeCompare(b.name);
      } else if (sortCriteria === 'name_desc') {
        return b.name.localeCompare(a.name);
      } else if (sortCriteria === 'highest') {
        // Non-visited items should ideally not be sorted by score, but let's handle it gracefully
        // If only one is visited, the visited one comes first when sorting highest
        if (!a.visited && b.visited) return 1;
        if (a.visited && !b.visited) return -1;
        // If both not visited, sort by name as a fallback
        if (!a.visited && !b.visited) return a.name.localeCompare(b.name);

        const { average: scoreA } = calculateAverageRating(a.arenaReview || {});
        const { average: scoreB } = calculateAverageRating(b.arenaReview || {});
        const numScoreA = parseFloat(scoreA) || 0;
        const numScoreB = parseFloat(scoreB) || 0;
        // Sort highest score first, then alphabetically by name if scores are equal
        if (numScoreB !== numScoreA) {
             return numScoreB - numScoreA;
        } else {
             return a.name.localeCompare(b.name);
        }
      } else if (sortCriteria === 'lowest') {
         // If only one is visited, the visited one comes first when sorting lowest (among visited)
        if (!a.visited && b.visited) return 1;
        if (a.visited && !b.visited) return -1;
        // If both not visited, sort by name as a fallback
        if (!a.visited && !b.visited) return a.name.localeCompare(b.name);

        const { average: scoreA } = calculateAverageRating(a.arenaReview || {});
        const { average: scoreB } = calculateAverageRating(b.arenaReview || {});
        const numScoreA = parseFloat(scoreA) || 0;
        const numScoreB = parseFloat(scoreB) || 0;
        // Sort lowest score first, then alphabetically by name if scores are equal
         if (numScoreA !== numScoreB) {
            return numScoreA - numScoreB;
        } else {
            return a.name.localeCompare(b.name);
        }
      }
      return 0; // Default case
    });

    console.log('Arenas to display:', sorted);
    return sorted;
  }, [arenaPosts, filterCriteria, sortCriteria]); // Dependencies for useMemo

  // --- Effect to reset sort criteria if it becomes invalid for 'notVisited' ---
  useEffect(() => {
    // Check if the filter is 'notVisited'
    if (filterCriteria === 'notVisited') {
      // Check if the current sort criteria is *not* one of the allowed name sorts
      if (sortCriteria !== 'name_asc' && sortCriteria !== 'name_desc') {
        console.log(
          `Filter is 'notVisited', but sort is '${sortCriteria}'. Resetting sort to 'name_asc'.`
        );
        // Reset to a default valid sort for 'notVisited'
        setSortCriteria('name_asc');
      }
    }
    // No 'else' needed: if filtering away from 'notVisited', the current sort criteria
    // might become valid again, or the user can choose a different one.
  }, [filterCriteria, sortCriteria]); // Rerun when filter or sort changes


  // Handlers now ONLY update the criteria state
  const handleSort = (criteria: SortCriteriaType) => {
    console.log('Setting Sort Criteria:', criteria);
    setSortCriteria(criteria);
  };

  const handleFilter = (criteria: FilterCriteriaType) => {
    console.log('Setting Filter Criteria:', criteria);
    setFilterCriteria(criteria);
    // Note: The useEffect above will handle resetting the sort if needed *after* this state updates
  };


  if (preview) {
     return (
      <PreviewSuspense
        fallback={
          <div>Loading preview...</div>
        }
      >
        <PreviewIndexPage token={token} />
      </PreviewSuspense>
    );
  }

  return (
    <>
      <Layout preview={preview} loading={false}>
         <Head>
          <title>{`NBA/WNBA Arena Reviews - ${CMS_NAME}`}</title>
          <meta
            name="description"
            content="We're on a journey to visit and rank every NBA and WNBA arena! Explore our reviews, photos, and experiences from arenas across the US and Canada."
          />
        </Head>

        <BlogHeader
          title={'Visiting and Ranking Every NBA/WNBA Arena'}
          description={[]}
          level={1}
        />
        <ReviewHeader
          title={'Visiting and Ranking Every NBA/WNBA Arena'}
          arenas={arenaPosts}
          summary={`We are traveling near and far to every state/country to visit and rank all the NBA and WNBA arenas (${arenaPosts.length}) across the US and Canada. Follow us on this journey.`}
          animation={'/basketball.svg'}
        />


        {/* Sorting and Filtering Section */}
        <div className="container mx-auto mb-6 mt-6 flex flex-col items-center justify-between gap-y-4 rounded-lg bg-gray-50 px-4 py-4 shadow-sm md:flex-row md:gap-y-0 md:px-6 max-w-4xl">
          {/* Sort By Dropdown */}
          <div className="flex items-center w-full md:w-auto">
            <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700 whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortCriteria}
              onChange={(e) => handleSort(e.target.value as SortCriteriaType)}
              // Disable the dropdown if 'notVisited' only has one effective sort option (or handle via option rendering)
              // disabled={filterCriteria === 'notVisited'} // Example if needed, but conditional rendering is better
              className="flex-grow appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 md:flex-grow-0"
              style={{}}
            >
              {/* ---- Conditional Options Rendering ---- */}
              {filterCriteria === 'notVisited' ? (
                <>
                  <option value="name_asc">Arena Name (A-Z)</option>
                  <option value="name_desc">Arena Name (Z-A)</option>
                </>
              ) : (
                <>
                  {/* Options for 'all' and 'visited' filters */}
                  <option value="name_asc">Arena Name (A-Z)</option>
                  <option value="name_desc">Arena Name (Z-A)</option>
                  <option value="latest">Last Visited</option>
                  <option value="oldest">First Visited</option>
                  <option value="highest">Highest Review Score</option>
                  <option value="lowest">Lowest Review Score</option>
                </>
              )}
              {/* ---- End Conditional Options Rendering ---- */}
            </select>
          </div>

          {/* Filter By Buttons */}
           <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-end">
            <span className="mr-2 text-sm font-medium text-gray-700 hidden sm:inline">
              Filter:
            </span>
            <button
              onClick={() => handleFilter('all')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                filterCriteria === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilter('visited')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                filterCriteria === 'visited'
                   ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Visited
            </button>
            <button
              onClick={() => handleFilter('notVisited')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                filterCriteria === 'notVisited'
                   ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Not Visited
            </button>
          </div>
        </div>


        {/* Arena Cards - Render the calculated list */}
        <div className="container mx-auto mt-8 grid grid-cols-1 place-content-center place-items-center gap-x-6 gap-y-10 px-3 sm:grid-cols-1 md:grid-cols-2 md:gap-10 md:gap-x-5 md:px-6 lg:grid-cols-3 xl:grid-cols-3">
          {arenasToDisplay.length > 0 ? (
             arenasToDisplay.map((item) => {
                const { average, textRating, color } = calculateAverageRating(
                   item.arenaReview || {}
                )
                return (
                   <NBAArenaCard
                      key={item._id} // <-- Use unique ID for the key
                      arenaImageSrc={item.arenaImage}
                      location={item.location}
                      constructionDate={item.buildDate}
                      capacity={item.capacity}
                      alt={`${item.name} arena`}
                      arenaReview={item?.arenaReview}
                      arenaName={item.name}
                      gallery={item.gallery}
                      visited={item.visited}
                      dateVisited={item.date}
                      id={item._id}
                      averageRating={average}
                      textRating={textRating}
                      ratingColor={color}
                   />
                )
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

// ... getStaticProps remains the same
export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, arenaPosts = []] = await Promise.all([
    getSettings(),
    getArenaPosts(),
  ])

  return {
    props: {
      arenaPosts: arenaPosts || [], // Ensure arenaPosts is always an array
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 10, // Or your preferred revalidation time
  }
}