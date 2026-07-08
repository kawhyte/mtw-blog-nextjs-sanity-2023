import { defineField } from 'sanity'
import { AltTextGeneratorInput } from '../plugins/AltTextGeneratorInput'
import { CaptionGeneratorInput } from '../plugins/CaptionGeneratorInput'
import { VerdictGeneratorInput } from '../plugins/VerdictGeneratorInput'
import { getPortableTextLength } from './utils'

/** e.g. 'hotel' | 'restaurant' — used only in editor-facing descriptions */
type Subject = string

export const positivesField = (subject: Subject) =>
  defineField({
    title: 'Positives',
    name: 'positives',
    description: `Add multiple positive points about this ${subject}. Aim for 1–2 short sentences per point (under 150 chars each).`,
    type: 'array',
    of: [{ type: 'text' }],
    validation: (Rule) =>
      Rule.min(1).error('Please add at least one positive point'),
  })

export const negativesField = (subject: Subject) =>
  defineField({
    title: 'Negatives',
    name: 'negatives',
    description: `Add multiple negative points about this ${subject}. Aim for 1–2 short sentences per point (under 150 chars each).`,
    type: 'array',
    of: [{ type: 'text' }],
  })

export const verdictField = (subject: Subject, limit: number) =>
  defineField({
    name: 'verdict',
    title: 'Verdict',
    description: `Your overall verdict on this ${subject} — max 600 characters. Basic formatting allowed.`,
    type: 'array',
    of: [{ type: 'block' }],
    validation: (Rule) =>
      Rule.custom((portableTextValue) => {
        if (!portableTextValue || (portableTextValue as any[]).length === 0) {
          return 'Verdict is required'
        }
        const textLength = getPortableTextLength(portableTextValue as any[])
        if (textLength > limit) {
          return `Verdict exceeds ${limit} characters (${textLength}/${limit})`
        }
        return true
      }).error(),
    components: { input: VerdictGeneratorInput },
  })

export interface GalleryCategoryOption {
  title: string
  value: string
}

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
      'Photo gallery — upload each photo at its natural crop, max 1600 px on the longest edge. WebP 80% or JPEG 85% quality. Any aspect ratio is fine.',
    of: [
      {
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
          prepare({ media, title, category }: { media: any; title?: string; category?: string }) {
            return {
              media,
              title: title || 'No alt text',
              subtitle: category
                ? `✓  ${previewLabels[category] ?? category}`
                : '⚠  No category set',
            }
          },
        },
      },
    ],
  })
