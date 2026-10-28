/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { GlobeAltIcon } from '@heroicons/react/outline'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, previewSecretId, projectId } from 'lib/sanity.api'
import { previewDocumentNode } from 'plugins/previewPane'
import { productionUrl } from 'plugins/productionUrl'
import { ScheduledBadge } from 'plugins/scheduledBadge'
import { settingsPlugin, settingsStructure } from 'plugins/settings'
import { StudioLogo } from 'plugins/StudioLogo'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { media } from 'sanity-plugin-media'
import arenaReviewType from 'schemas/arenaReview'
// import amenitiesType from 'schemas/amenities'
//  import authorType from 'schemas/author'
// import {bookType} from 'schemas/bookType'
import cruiseRatingType from 'schemas/cruiseRating'
import cruiseReviewType from 'schemas/cruiseReview'
import foodType from 'schemas/foodRating'
import foodReviewType from 'schemas/foodReview'
import galleryType from 'schemas/gallery'
import galleryType2 from 'schemas/gallery2'
import guideType from 'schemas/guide'
import hotelType from 'schemas/hotelRating'
import hotelReviewType from 'schemas/hotelReview'
import individualFoodType from 'schemas/individualFoodRating'
import areanasType from 'schemas/nbaArenas'
import photoGallery from 'schemas/photoGallery'
// import {recommendationListType} from 'schemas/recommendationListType'
// import {recommendationType} from 'schemas/recommendationType'
import roomAmenitiesType from 'schemas/roomAmenities'
import roomTechType from 'schemas/roomTechRatings'
import settingsType from 'schemas/settings'
import takeOutFoodRatingType from 'schemas/takeOutFoodRating'
import travelEssentialType from 'schemas/travelEssentials'

// Set in code so the Studio shows the brand everywhere, whatever the old
// NEXT_PUBLIC_SANITY_PROJECT_TITLE env var says
const title = 'Meet the Whytes'

const SCHEDULED_SCHEMA_TYPES = ['guide', 'hotelReview', 'foodReview', 'cruiseReview']

export default defineConfig({
  basePath: '/studio',
  projectId: projectId ?? '',
  dataset: dataset ?? '',

  icon: StudioLogo,
  title,

  document: {
    badges: (prev, { schemaType }) => {
      if (SCHEDULED_SCHEMA_TYPES.includes(schemaType)) {
        return [...prev, ScheduledBadge]
      }
      return prev
    },
  },
  schema: {
    // If you want more content types, you can add them to this array
    types: [
      galleryType,
      roomTechType,
      roomAmenitiesType,
      hotelType,
      foodType,
      takeOutFoodRatingType,
      individualFoodType,
      hotelReviewType,
      foodReviewType,
      cruiseRatingType,
      cruiseReviewType,
      guideType,
      areanasType,
      photoGallery,
      arenaReviewType,
      travelEssentialType,
      galleryType2,
      settingsType,
    ],
  },
  plugins: [
    deskTool({
      structure: settingsStructure(settingsType),
      // `defaultDocumentNode` is responsible for adding a "Preview" tab to the document pane
      defaultDocumentNode: previewDocumentNode({ apiVersion, previewSecretId }),
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    settingsPlugin({ type: settingsType.name }),
    // Add the "Open preview" action
    productionUrl({
      apiVersion,
      previewSecretId,
      types: [
        guideType.name,
        hotelReviewType.name,
        foodReviewType.name,
        cruiseReviewType.name,
        settingsType.name,
        areanasType.name,
      ],
    }),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Enhanced Media Management - Browse, manage and refine your Sanity assets
    // Provides both a standalone media browser and enhanced asset selection
    media(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
