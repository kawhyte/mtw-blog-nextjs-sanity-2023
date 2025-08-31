import { toPlainText } from '@portabletext/react';
import BlogMeta from 'components/BlogMeta';
import * as demo from 'lib/demo.data';
import { urlForImage } from 'lib/sanity.image';
import { Post, Guide, HotelReview, FoodReview, Settings } from 'lib/sanity.queries';
import Head from 'next/head';

// Common fields that all content types should have for SEO
interface SEOContent {
  title?: string;
  slug?: string;
  excerpt2?: any;
  coverImage?: any;
  date?: string;
  author?: any;
}

export interface PostPageHeadProps {
  settings: Settings
  post: Post | Guide | HotelReview | FoodReview | SEOContent
  contentType?: 'post' | 'guide' | 'hotel' | 'food' // Explicit content type for URL generation
}
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export default function PostPageHead({ settings, post, contentType }: PostPageHeadProps) {
  const siteTitle = settings?.title || demo.title;
  const pageTitle = post?.title ? `${post.title} | ${siteTitle}` : siteTitle;

// --- Generate Description (Ensure it's always a string) ---
let pageDescription: string; // Explicitly type as string

if (post?.excerpt2 && Array.isArray(post.excerpt2) && post.excerpt2.length > 0) {
  // 1. Use post excerpt if available and looks like Portable Text
  pageDescription = toPlainText(post.excerpt2);
} else if (settings?.description && Array.isArray(settings.description) && settings.description.length > 0) {
  // 2. Fallback to site description if available and looks like Portable Text
  pageDescription = toPlainText(settings.description);
} else if (post?.title) {
   // 3. Fallback to the post title itself (already a string)
   pageDescription = post.title;
} else {
  // 4. Final fallback to demo string or empty
  pageDescription = Array.isArray(demo.description) ? toPlainText(demo.description) : demo.description || '';
}
// Ensure description isn't excessively long for meta tags
if (pageDescription.length > 160) {
    pageDescription = pageDescription.substring(0, 157) + '...';
}


// --- Generate OG Image URL ---
// Use the actual default image name from BlogLayout.tsx
let ogImageUrl = `${SITE_URL}/MeettheWhytes.png`;
if (post?.coverImage?.asset?._ref) {
  ogImageUrl = urlForImage(post.coverImage)
    .width(1200)
    .height(630)
    .fit('crop') // Use 'crop' or 'cover' based on preference
    .url();
}

// Ensure the generated URL is absolute
if (ogImageUrl && !ogImageUrl.startsWith('http')) {
   ogImageUrl = `${SITE_URL}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`;
}

// --- Generate Page URL (Use contentType or infer from post data) ---
let pathPrefix = '/posts'; // Default prefix

if (contentType) {
  // Use explicit contentType if provided
  switch (contentType) {
    case 'hotel':
      pathPrefix = '/hotel';
      break;
    case 'food':
      pathPrefix = '/food';
      break;
    case 'guide':
      pathPrefix = '/guide';
      break;
    case 'post':
    default:
      pathPrefix = '/posts';
      break;
  }
} else if ('linkType' in post && post.linkType) {
  // Fallback to linkType for legacy posts
  if (post.linkType === 'hotel') pathPrefix = '/hotel';
  else if (post.linkType === 'food') pathPrefix = '/food';
  else if (post.linkType === 'story') pathPrefix = '/guide';
}

const pageUrl = post?.slug ? `${SITE_URL}${pathPrefix}/${post.slug}` : SITE_URL;

  return (


    <Head>
      {/* --- Page Specific Head Tags --- */}
      <title>{pageTitle}</title>
      <BlogMeta />
      {/* Use the guaranteed string description */}
      <meta key="description" name="description" content={pageDescription} />

      {/* --- Open Graph Overrides --- */}
      <meta property="og:type" content="article" /> {/* Specific type for posts */}
      <meta property="og:title" content={pageTitle} />
      {/* Use the guaranteed string description */}
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {/* Optional: Add author, published time etc. if available in 'post' */}
      {post?.date && <meta property="article:published_time" content={post.date} />}
      {/* {post?.author?.name && <meta property="article:author" content={post.author.name} />} */}

      {/* --- Twitter Card Overrides --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {/* Use the guaranteed string description */}
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:url" content={pageUrl} />
      {/* Optional: Add Twitter creator handle if available */}
      {/* {post?.author?.twitterHandle && <meta name="twitter:creator" content={`@${post.author.twitterHandle}`} />} */}
    </Head>



    // <Head>
 
    //   <BlogMeta />
    //   {post.coverImage?.asset?._ref && (
    //     <meta
    //       property="og:image"
    //       content={urlForImage(post.coverImage)
    //         .width(1200)
    //         .height(627)
    //         .fit('crop')
    //         .url()}
    //     />
    //   )}
    // </Head>
  )
}
