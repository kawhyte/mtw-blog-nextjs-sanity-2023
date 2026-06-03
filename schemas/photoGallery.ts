// schemas/objects/photoGallery.js
import { ImageIcon } from '@sanity/icons' // Optional: for a nice icon
import { defineField, defineType } from 'sanity'
import { AltTextGeneratorInput } from '../plugins/AltTextGeneratorInput'

const ARENA_CATEGORY_LABELS: Record<string, string> = {
  court: 'Seating & Game Floor',
  concessions: 'Concessions & Food',
  exterior: 'Exterior',
  lobby: 'Entrances & Lobby',
  other: 'Additional Photos',
}

const ARENA_CATEGORY_LIST = [
  { title: 'Seating & Game Floor', value: 'court' },
  { title: 'Concessions & Food', value: 'concessions' },
  { title: 'Exterior', value: 'exterior' },
  { title: 'Entrances & Lobby', value: 'lobby' },
  { title: 'Additional Photos', value: 'other' },
]

const ARENA_CATEGORY_DESCRIPTION =
  "Choose a category — Seating & Game Floor: court, baskets, view from your seat. Concessions & Food: food stalls, menu boards, food shots. Exterior: outside the building, signage, plaza. Entrances & Lobby: inside entrance, hallways, common areas. Additional Photos: anything that doesn't fit above."

export default defineType({
  name: 'photoGallery',
  title: 'Photo Gallery Section',
  type: 'object',
  icon: ImageIcon, // Optional icon
  fields: [
    defineField({
      name: 'mainImage',
      title: 'Main Gallery Image',
      type: 'image',
      description:
        'The primary, large image for the gallery display. Recommended size: 732x480 pixels.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description:
            'REQUIRED: Describe the image for accessibility and SEO.',
          // validation: (Rule) => Rule.required().error('Alt text is required.'),
          components: { input: AltTextGeneratorInput },
        }),
        defineField({
          name: 'category',
          title: 'Photo Category',
          type: 'string',
          description: ARENA_CATEGORY_DESCRIPTION,
          options: { list: ARENA_CATEGORY_LIST },
        }),
      ],
    }),
    defineField({
      name: 'otherImages',
      title: 'Other Gallery Images (Exactly 4)',
      type: 'array',
      description:
        'REQUIRED: The four smaller images for the gallery display. Add exactly four. Recommended size for each: 362x236 pixels.',
      of: [
        {
          type: 'image',
          title: 'Gallery Image',
          description: 'Recommended size: 362x236 pixels.',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description:
                'REQUIRED: Describe the image for accessibility and SEO.',
              // validation: (Rule) => Rule.required().error('Alt text is required for each image.'),
              components: { input: AltTextGeneratorInput },
            }),
            defineField({
              name: 'category',
              title: 'Photo Category',
              type: 'string',
              description: ARENA_CATEGORY_DESCRIPTION,
              options: { list: ARENA_CATEGORY_LIST },
            }),
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
                  ? `✓  ${ARENA_CATEGORY_LABELS[category] ?? category}`
                  : '⚠  No category set',
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(4)
          .max(4)
          .error('You must provide exactly four additional images.'),
    }),
  ],
})
