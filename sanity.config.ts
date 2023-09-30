
/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, previewSecretId, projectId } from 'lib/sanity.api'
import { previewDocumentNode } from 'plugins/previewPane'
import { productionUrl } from 'plugins/productionUrl'
import { settingsPlugin, settingsStructure } from 'plugins/settings'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
// import amenitiesType from 'schemas/amenities'
 import authorType from 'schemas/author'
// import {bookType} from 'schemas/bookType'
import foodType from 'schemas/foodRating'
import galleryType from 'schemas/gallery'
import galleryType2 from 'schemas/gallery2'
import hotelType from 'schemas/hotelRating'
import postType from 'schemas/post'
import {recommendationListType} from 'schemas/recommendationListType'
import {recommendationType} from 'schemas/recommendationType'
import roomTechType from 'schemas/roomTechRatings'
import roomAmenitiesType from 'schemas/roomAmenities'
import settingsType from 'schemas/settings'


const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Meet the Whytes Blog'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title,
  schema: {
    // If you want more content types, you can add them to this array
    types: [galleryType,roomTechType,roomAmenitiesType,hotelType,foodType, postType, authorType, galleryType2, settingsType, recommendationListType,recommendationType],
  },
  plugins: [
    deskTool({
      structure: settingsStructure(settingsType),
      // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
      defaultDocumentNode: previewDocumentNode({ apiVersion, previewSecretId }),
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    settingsPlugin({ type: settingsType.name }),
    // Add the "Open preview" action
    productionUrl({
      apiVersion,
      previewSecretId,
      types: [postType.name, settingsType.name],
    }),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
