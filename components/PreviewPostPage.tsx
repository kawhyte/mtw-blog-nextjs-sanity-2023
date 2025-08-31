import PostPage, { PostPageProps } from 'components/PostPage'
import { usePreview } from 'lib/sanity.preview'
import { 
  type Post, 
  type Guide, 
  type HotelReview, 
  type FoodReview,
  postAndMoreStoriesQuery,
  guideBySlugPreviewQuery,
  hotelReviewBySlugPreviewQuery,
  foodReviewBySlugPreviewQuery
} from 'lib/sanity.queries'

// Union type for all possible content types
type ContentItem = Post | Guide | HotelReview | FoodReview;

interface PreviewPostPageProps {
  token: null | string;
  post: ContentItem;
  settings: any;
  contentType?: 'post' | 'guide' | 'hotelReview' | 'foodReview';
}

export default function PreviewPostPage({
  token,
  post,
  settings,
  contentType,
}: PreviewPostPageProps) {
  // Determine which query to use based on content type
  let query: string;
  let queryParams: { slug: string };
  
  if (contentType === 'guide') {
    query = guideBySlugPreviewQuery;
  } else if (contentType === 'hotelReview') {
    query = hotelReviewBySlugPreviewQuery;
  } else if (contentType === 'foodReview') {
    query = foodReviewBySlugPreviewQuery;
  } else {
    // Default to post query for legacy posts
    query = postAndMoreStoriesQuery;
  }
  
  queryParams = { slug: post.slug?.current || post.slug || '' };

  // Use the appropriate preview query
  const previewData = usePreview(token, query, queryParams) || { post: null, morePosts: [] };
  
  // Extract the post data (the structure might be different for different queries)
  const postPreview = previewData.post || previewData;
  const morePosts = previewData.morePosts || [];

  return (
    <PostPage
      preview
      post={postPreview}
      morePosts={morePosts}
      settings={settings}
    />
  )
}
