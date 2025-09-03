import { PreviewSuspense } from '@sanity/preview-kit'
import StoryReviewsPage from 'components/StoryReviewsPage' // Component to display stories
import {
  getSettings,
  getPaginatedGuides,
  getGuidesTotalCount,
} from 'lib/sanity.client'
import { Guide, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from "next/head"; // Keep Head if needed within StoryReviewsPage or here
import { lazy } from 'react'

const PreviewIndexPage = lazy(() => import('components/PreviewIndexPage'))

// Define how many items to show per page
const ITEMS_PER_PAGE = 12;

interface PageProps {
  initialPosts: Guide[]
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
      token
     } = props

    if (preview) {
      return (
        <PreviewSuspense
          fallback={
            <StoryReviewsPage
              loading
              preview
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

    return (
      <StoryReviewsPage
          initialPosts={initialPosts}
          totalPostsCount={totalPostsCount}
          itemsPerPage={ITEMS_PER_PAGE}
          settings={settings}
       />
    )
  }

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  // Fetch settings and total count concurrently
  const [settings, totalPostsCount] = await Promise.all([
    getSettings(),
    getGuidesTotalCount(),
  ]);

  // Fetch first page of posts
  const initialPosts = await getPaginatedGuides(0, ITEMS_PER_PAGE);

  console.log('Guides Found:', initialPosts?.length || 0);
  console.log('Total Guides:', totalPostsCount);
  console.log('Sample Guide:', initialPosts?.[0] || 'None');

  return {
    props: {
      initialPosts: initialPosts, // No longer need to cast
      totalPostsCount,
      settings,
      preview,
      token: previewData.token ?? null,
    },
    revalidate: 60,
  }
}