import { PreviewSuspense } from '@sanity/preview-kit'
import HotelReviewsPage from 'components/HotelReviewsPage' // The component that will eventually display posts + pagination logic
// --- Import the actual functions from your updated sanity client ---
import {
  getAllHotelReviews,        // Independent hotel review function
  getHotelReviewsTotalCount, // Independent hotel review count function
  getPaginatedHotelReviews,  // Independent hotel review pagination function
  getSettings,
} from 'lib/sanity.client'
// Import HotelReview type for independent schema
import { HotelReview, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from "next/head";
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

// Define how many items to show per page
const ITEMS_PER_PAGE = 12; // Or your desired number

// --- Updated PageProps ---
// Use HotelReview[] for independent schema
interface PageProps {
  initialPosts: HotelReview[]     // Use HotelReview type for independent schema
  totalPostsCount: number
  settings: Settings
  preview: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}


export default function Page(props: PageProps) {
    const {
      initialPosts,
      totalPostsCount,
      settings,
      preview,
      token,
     } = props

    if (preview) {
      return (
        <PreviewSuspense
          fallback={
            <HotelReviewsPage
              loading
              preview
              // Pass props down - Ensure HotelReviewsPage accepts Hotel[]
              initialPosts={initialPosts}
              totalPostsCount={totalPostsCount}
              itemsPerPage={ITEMS_PER_PAGE}
              settings={settings}
            />
          }
        >
          <PreviewIndexPage token={token} />
        </PreviewSuspense>
      )
    }

    // --- Render the standard page ---
    // Pass props down - Ensure HotelReviewsPage accepts Hotel[]
    return (
      <HotelReviewsPage
          initialPosts={initialPosts}
          totalPostsCount={totalPostsCount}
          itemsPerPage={ITEMS_PER_PAGE}
          settings={settings}
       />
    )
  }

// --- Updated getStaticProps ---
export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  // Fetch settings concurrently
  const settingsPromise = getSettings();

  // Update type hint to match return type of fetch functions
  let postsPromise: Promise<HotelReview[]>;
  let totalCountPromise: Promise<number>;

  if (preview) {
    // Preview mode: fetch all hotel reviews
    postsPromise = getAllHotelReviews(); // Use independent function
    totalCountPromise = getHotelReviewsTotalCount(); // Use independent function
  } else {
    // Production mode: fetch first page and total count
    totalCountPromise = getHotelReviewsTotalCount(); // Use independent function
    postsPromise = getPaginatedHotelReviews(0, ITEMS_PER_PAGE); // Use independent function
  }

  // Resolve all promises
  // Add type assertion or ensure compatibility if needed, default values handle null/undefined fetch results
  const [settings, initialPosts = [], totalPostsCount = 0] = await Promise.all([
    settingsPromise,
    postsPromise,
    totalCountPromise,
  ]);


  // console.log("initial Hotel", initialPosts)
  return {
    props: {
      initialPosts,     // Pass the first page (or all in preview)
      totalPostsCount,  // Pass the total count
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60, // Or your desired revalidation time
  }
}