import { toPlainText } from '@portabletext/react'
import BlogMeta from 'components/BlogMeta'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'; 
import { Settings } from 'lib/sanity.queries'
import Head from 'next/head'

export interface IndexPageHeadProps {
  settings: Settings
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export default function IndexPageHead({ settings }: IndexPageHeadProps) {
  const {
    title = demo.title,
    description = demo.description,
    ogImage,
  } = settings
  const ogImageTitle = ogImage?.title || demo.ogImageTitle

 // --- Generate OG Image URL ---
 let ogImageUrl = `${SITE_URL}/MeettheWhytes.png`; // Fallback
 if (ogImage?.asset?._ref) {
   // If an image is set in Sanity settings, use it
   ogImageUrl = urlForImage(ogImage)
     .width(1200)
     .height(630)
     .fit('crop') // or 'cover'
     .url();
 } else {
   // --- Alternative: Keep Vercel OG Image API if preferred ---
   // Ensure the title passed to the API is reasonable
   // const ogApiTitle = ogImage?.title || title || demo.ogImageTitle;
   // ogImageUrl = `${SITE_URL}/api/og?${new URLSearchParams({ title: ogApiTitle })}`;
   // Note: Ensure your /api/og route generates a valid image and handles errors.
   // Using a direct image from Sanity is often simpler and more reliable.
 }

 // Ensure the generated URL is absolute (urlForImage might already do this depending on config)
 // If urlForImage provides a relative path, prepend SITE_URL
 if (ogImageUrl && !ogImageUrl.startsWith('http')) {
    ogImageUrl = `${SITE_URL}${ogImageUrl.startsWith('/') ? '' : '/'}${ogImageUrl}`;
 }


 const pageTitle = title || demo.title; // Use site title for homepage
 const pageDescription = description ? toPlainText(description) : demo.description;
 const pageUrl = SITE_URL + '/'; // URL of the homepage



  return (
    <Head>
      
      {/* <title>{title}</title> */}
      <BlogMeta />
      <meta
        key="description"
        name="description"
        content={toPlainText(description)}
      />
      <meta
        property="og:image"
        // Because OG images must have a absolute URL, we use the
        // `VERCEL_URL` environment variable to get the deployment’s URL.
        // More info:
        // https://vercel.com/docs/concepts/projects/environment-variables
        content={`${
          process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
        }/api/og?${new URLSearchParams({ title: ogImageTitle })}`}
      />
    </Head>
  )
}
