import {
  getFoodReviewBySlug,
  getGuideBySlug,
  getHotelReviewBySlug,
} from 'lib/sanity.client'
import { GetServerSideProps } from 'next'

// This page now serves as a redirect layer for legacy /posts/* URLs
// It determines the content type and redirects to the appropriate new route

// This component should never render since we always redirect
export default function LegacyPostRedirect() {
  return (
    <div>
      <h1>Redirecting...</h1>
      <p>You should be automatically redirected to the correct page.</p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string

  if (!slug) {
    return {
      notFound: true,
    }
  }

  // Try to find the content in each schema and redirect accordingly
  try {
    // Check if it's a hotel review
    const hotelReview = await getHotelReviewBySlug(slug)
    if (hotelReview) {
      return {
        redirect: {
          destination: `/hotel/${slug}`,
          permanent: true, // 301 redirect for SEO
        },
      }
    }

    // Check if it's a food review
    const foodReview = await getFoodReviewBySlug(slug)
    if (foodReview) {
      return {
        redirect: {
          destination: `/food/${slug}`,
          permanent: true,
        },
      }
    }

    // Check if it's a guide/story
    const guide = await getGuideBySlug(slug)
    if (guide) {
      return {
        redirect: {
          destination: `/guide/${slug}`,
          permanent: true,
        },
      }
    }

    // If not found in any schema, return 404
    return {
      notFound: true,
    }
  } catch (error) {
    console.error('Error looking up legacy post:', error)
    return {
      notFound: true,
    }
  }
}
