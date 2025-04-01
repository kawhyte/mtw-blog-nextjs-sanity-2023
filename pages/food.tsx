import { PreviewSuspense } from '@sanity/preview-kit'
import FoodReviewsPage from 'components/FoodReviewsPage' // Component to display food reviews
// --- Updated Imports from sanity.client ---
import {
  getSettings,
  getAllFoodPosts,       // Renamed function to get all food posts
  getPaginatedFoodPosts,  // Function to get paginated food posts
  getFoodPostsTotalCount // Function to get total count of food posts
} from 'lib/sanity.client'
// Use the generic Post type, Settings type
import { Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from "next/head"; // Keep if used
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

// Define how many items to show per page
const ITEMS_PER_PAGE = 12; // Or your desired number for food reviews

// --- Updated PageProps ---
interface PageProps {
  initialPosts: Post[]      // Use generic Post type, holds only the first page
  totalPostsCount: number   // Total count for pagination
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
    // --- Updated Destructuring ---
    const {
      initialPosts,
      totalPostsCount,
      settings,
      preview,
      token
     } = props

    if (preview) {
      return (
        <PreviewSuspense
          fallback={
            // Ensure FoodReviewsPage was updated previously
            <FoodReviewsPage
              loading
              preview
              initialPosts={initialPosts} // Pass initial posts (all if preview)
              totalPostsCount={totalPostsCount} // Pass total count
              itemsPerPage={ITEMS_PER_PAGE} // Pass items per page
              settings={settings}
            />
          }
        >
          {/* PreviewIndexPage likely uses token to fetch live data */}
          <PreviewIndexPage token={token} />
        </PreviewSuspense>
      )
    }

    // --- Render the standard page ---
    // Pass pagination props down to FoodReviewsPage
    return (
      <FoodReviewsPage
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

  let postsPromise: Promise<Post[]>;
  let totalCountPromise: Promise<number>;

  if (preview) {
    // For preview mode, fetch all food posts for the fallback/initial render.
   
    postsPromise = getAllFoodPosts(); // Use the renamed function to fetch all
    totalCountPromise = getFoodPostsTotalCount(); // Get count for consistency
  } else {
    // For non-preview mode, fetch only the first page and the total count
    totalCountPromise = getFoodPostsTotalCount(); // Use the count function
    postsPromise = getPaginatedFoodPosts(0, ITEMS_PER_PAGE); // Use the pagination function
  }

  // Resolve all promises
  const [settings, initialPosts = [], totalPostsCount = 0] = await Promise.all([
    settingsPromise,
    postsPromise,
    totalCountPromise,
  ]);

  return {
    props: {
      initialPosts,     // Pass the first page (or all in preview)
      totalPostsCount,  // Pass the total count
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60, // Adjust revalidation time as needed (e.g., 60 seconds)
  }
}