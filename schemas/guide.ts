import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

/**
 * This is the schema definition for a travel guide.
 * Independent from the complex post document type.
 */

export default defineType({
  name: 'guide',
  title: 'Travel Guide',
  icon: BookIcon,
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'date',
      title: 'Story/Guide Date',
      type: 'datetime',
      description: 'When this story/guide was written or when the trip occurred',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'excerpt2',
      title: 'Guide Summary',
      type: 'array',
      description: 'Add a short summary of the travel guide',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'coverImage',
      title: 'Main Image',
      type: 'image',
      description: 'For best results: Image size should be 850 x 405, webp quality 80%, 60% image resize.',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'City Guide', value: 'city' },
          { title: 'Travel Tips', value: 'tips' },
          { title: 'Transportation', value: 'transport' },
          { title: 'Culture & History', value: 'culture' },
          { title: 'Adventure', value: 'adventure' },
          { title: 'Family Travel', value: 'family' },
          { title: 'Budget Travel', value: 'budget' },
          { title: 'Luxury Travel', value: 'luxury' },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      description: 'For best results: Image size should be 566 x 525, webp quality 80%, 80% image resize.',
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
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'tip',
      title: 'Travel Guide Quick Tip',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Add a helpful tip for this travel guide (optional)',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Add relevant tags for better searchability',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'coverImage',
      category: 'category',
    },
    prepare({ title, media, date, category }) {
      const subtitles = [
        category && `Category: ${category}`,
        date && `📅 ${format(parseISO(date), 'LLL d, yyyy')}`,
      ].filter(Boolean)

      return { title, media, subtitle: subtitles.join(' • ') }
    },
  },

  orderings: [
    {
      title: 'Date, New',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date, Old',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
