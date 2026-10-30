import { defineField } from 'sanity'

import { AltTextGeneratorInput } from '../plugins/AltTextGeneratorInput'
import { CaptionGeneratorInput } from '../plugins/CaptionGeneratorInput'
import { VerdictGeneratorInput } from '../plugins/VerdictGeneratorInput'
import { getPortableTextLength } from './utils'

/** e.g. 'hotel' | 'restaurant', used only in editor-facing descriptions */
type Subject = string

export const positivesField = (subject: Subject) =>
  defineField({
    title: 'Positives',
    name: 'positives',
    description: `Add multiple positive points about this ${subject}. Aim for 1 to 2 short sentences per point (under 150 chars each).`,
    type: 'array',
    of: [{ type: 'text' }],
    validation: (Rule) =>
      Rule.min(1).error('Please add at least one positive point'),
  })

export const negativesField = (subject: Subject) =>
  defineField({
    title: 'Negatives',
    name: 'negatives',
    description: `Add multiple negative points about this ${subject}. Aim for 1 to 2 short sentences per point (under 150 chars each).`,
    type: 'array',
    of: [{ type: 'text' }],
  })

export const verdictField = (subject: Subject, limit: number) =>
  defineField({
    name: 'verdict',
    title: 'Verdict',
    description: `Your overall verdict on this ${subject}, aim for ${limit} characters or fewer. Basic formatting allowed.`,
    type: 'array',
    of: [{ type: 'block' }],
    validation: (Rule) => [
      Rule.custom((portableTextValue) =>
        !portableTextValue || (portableTextValue as any[]).length === 0
          ? 'Verdict is required'
          : true,
      ).error(),
      // Only a warning: older verdicts predate the limit and must stay publishable
      Rule.custom((portableTextValue) => {
        const textLength = getPortableTextLength(
          (portableTextValue as any[]) || [],
        )
        return textLength > limit
          ? `Verdict is over ${limit} characters (${textLength}/${limit})`
          : true
      }).warning(),
    ],
    components: { input: VerdictGeneratorInput },
  })

export interface GalleryCategoryOption {
  title: string
  value: string
}

/** One gallery photo: image + alt, caption and category. Shared by heroPhotos and gallery. */
export const galleryImageItem = (
  categoryDescription: string,
  categories: GalleryCategoryOption[],
  previewLabels: Record<string, string>,
) => ({
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      components: { input: AltTextGeneratorInput },
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description:
        'Optional: add a brief caption shown below the photo in the gallery.',
      components: { input: CaptionGeneratorInput },
    },
    {
      name: 'category',
      type: 'string',
      title: 'Photo Category',
      description: categoryDescription,
      options: {
        list: categories,
      },
    },
  ],
  preview: {
    select: {
      media: 'asset',
      title: 'alt',
      category: 'category',
    },
    prepare({
      media,
      title,
      category,
    }: {
      media: any
      title?: string
      category?: string
    }) {
      return {
        media,
        title: title || 'No alt text',
        subtitle: category
          ? `✓  ${previewLabels[category] ?? category}`
          : '⚠  No category set',
      }
    },
  },
})

export const HERO_PHOTOS_MAX = 5

/**
 * The 1 large + 4 small photo block at the top of review/arena pages.
 * Drag to reorder, photo #1 is the large one and the card/share image fallback.
 */
export const heroPhotosField = (
  categoryDescription: string,
  categories: GalleryCategoryOption[],
  previewLabels: Record<string, string>,
) =>
  defineField({
    name: 'heroPhotos',
    title: 'Hero Photos (up to 5)',
    type: 'array',
    description:
      'The photo block at the top of the page. Drag to reorder. The FIRST photo is the large one (and the only one shown on phones); the rest fill the tiles beside it. Photo #1 is also used for cards and share previews unless a Card & Share Image is set. Upload all at 2400 × 1600 px (3:2 landscape), WebP 85% or JPEG 88%. Up to 5; fewer is fine, the layout adapts.',
    options: { layout: 'grid' },
    of: [galleryImageItem(categoryDescription, categories, previewLabels)],
    validation: (Rule) => [
      Rule.max(HERO_PHOTOS_MAX).error(
        `Hero shows at most ${HERO_PHOTOS_MAX} photos. Move extras to the Photo Gallery.`,
      ),
      Rule.custom((photos) =>
        !photos || (photos as any[]).length === 0
          ? 'Add at least one hero photo (the first one is shown large).'
          : (photos as any[]).length < HERO_PHOTOS_MAX
            ? `${(photos as any[]).length} of ${HERO_PHOTOS_MAX} hero photos. The layout adapts, but 5 looks best.`
            : true,
      ).warning(),
    ],
  })

export const galleryField = (
  categoryDescription: string,
  categories: GalleryCategoryOption[],
  previewLabels: Record<string, string>,
) =>
  defineField({
    name: 'gallery',
    title: 'Photo Gallery',
    type: 'array',
    description:
      'All other photos, shown in "Show all photos" after the hero photos. Natural crop, max 1600 px on the longest edge, WebP 85% or JPEG 88%. Any aspect ratio is fine.',
    of: [galleryImageItem(categoryDescription, categories, previewLabels)],
  })
