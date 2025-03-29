// lib/sanity.server.js
import createImageUrlBuilder from '@sanity/image-url'
import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-03-25', // or the latest API version
  useCdn: process.env.NODE_ENV === 'production',
});

export const urlFor = (source) => createImageUrlBuilder(sanityClient).image(source);