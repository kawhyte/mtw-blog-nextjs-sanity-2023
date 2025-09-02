import { PreviewSuspense } from '@sanity/preview-kit'
import HotelReviewsPage from 'components/HotelReviewsPage' // The component that will eventually display posts + pagination logic
// --- Import the actual functions from your updated sanity client ---
import {
  getAllHotelPosts,       // Now exists (renamed from getHotelPosts)
  getHotelPostsTotalCount, // Now exists
  getPaginatedHotelPosts,  // Now exists
  getSettings,
} from 'lib/sanity.client'
// Import Hotel type alongside Post if needed, or ensure Hotel extends Post
import { /* Post, */ Hotel, Settings } from 'lib/sanity.queries' // Adjust imports as needed
import { GetStaticProps } from 'next'
import Head from "next/head";
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

// Define how many items to show per page
const ITEMS_PER_PAGE = 12; // Or your desired number

// --- Updated PageProps ---
// Use Hotel[] if the client functions return Hotel[]
interface PageProps {
  initialPosts: Hotel[]     // Use Hotel type to match fetch functions
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
  let postsPromise: Promise<Hotel[]>;
  let totalCountPromise: Promise<number>;

  if (preview) {
    // Preview mode: fetch all hotel posts
    postsPromise = getAllHotelPosts(); // Use the actual function
    totalCountPromise = getHotelPostsTotalCount(); // Use the actual function
  } else {
    // Production mode: fetch first page and total count
    totalCountPromise = getHotelPostsTotalCount(); // Use the actual function
    postsPromise = getPaginatedHotelPosts(0, ITEMS_PER_PAGE); // Use the actual function
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