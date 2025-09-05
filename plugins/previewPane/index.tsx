// This plugin is responsible for adding a “Preview” tab to the document pane
// You can add any React component to `S.view.component` and it will be rendered in the pane
// and have access to content in the form in real-time.
// It's part of the Studio's “Structure Builder API” and is documented here:
// https://www.sanity.io/docs/structure-builder-reference

import { DefaultDocumentNodeResolver } from 'sanity/desk'
import authorType from 'schemas/author'
import guideType from 'schemas/guide'
import hotelReviewType from 'schemas/hotelReview'
import foodReviewType from 'schemas/foodReview'
import areanasType from 'schemas/nbaArenas'
import postType from 'schemas/post'

import ArenaPreviewPane from './ArenaPreviewPane'
import AuthorAvatarPreviewPane from './AuthorAvatarPreviewPane'
import GuidePreviewPane from './GuidePreviewPane'
import HotelReviewPreviewPane from './HotelReviewPreviewPane'
import FoodReviewPreviewPane from './FoodReviewPreviewPane'
import PostPreviewPane from './PostPreviewPane'

export const previewDocumentNode = ({
  apiVersion,
  previewSecretId,
}: {
  apiVersion: string
  previewSecretId: `${string}.${string}`
}): DefaultDocumentNodeResolver => {
  return (S, { schemaType }) => {
    switch (schemaType) {
      case authorType.name:
        return S.document().views([
          S.view.form(),
          S.view
            .component(({ document }) => (
              <AuthorAvatarPreviewPane
                name={document.displayed.name as any}
                picture={document.displayed.picture as any}
              />
            ))
            .title('Preview'),
        ])

      case postType.name:
        return S.document().views([
          S.view.form(),
          S.view
            .component(({ document }) => (
              <PostPreviewPane
                slug={document.displayed.slug?.current}
                apiVersion={apiVersion}
                previewSecretId={previewSecretId}
              />
            ))
            .title('Preview'),
        ])

      case guideType.name:
        return S.document().views([
          S.view.form(),
          S.view
            .component(({ document }) => (
              <GuidePreviewPane
                slug={document.displayed.slug?.current}
                apiVersion={apiVersion}
                previewSecretId={previewSecretId}
              />
            ))
            .title('Preview'),
        ])

      case hotelReviewType.name:
        return S.document().views([
          S.view.form(),
          S.view
            .component(({ document }) => (
              <HotelReviewPreviewPane
                slug={document.displayed.slug?.current}
                apiVersion={apiVersion}
                previewSecretId={previewSecretId}
              />
            ))
            .title('Preview'),
        ])

      case foodReviewType.name:
        return S.document().views([
          S.view.form(),
          S.view
            .component(({ document }) => (
              <FoodReviewPreviewPane
                slug={document.displayed.slug?.current}
                apiVersion={apiVersion}
                previewSecretId={previewSecretId}
              />
            ))
            .title('Preview'),
        ])

      case areanasType.name: // Add case for NBA Arenas
        return S.document().views([
          S.view.form(),
          S.view
            .component(({ document }) => (
              <ArenaPreviewPane // Reuse PostPreviewPane if applicable
                slug={document.displayed.slug?.current}
                apiVersion={apiVersion}
                previewSecretId={previewSecretId}
              />
            ))
            .title('Preview'),
        ])

      default:
        return null
    }
  }
}
