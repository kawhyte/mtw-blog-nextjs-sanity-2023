import { BoltIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

/**
 * This is the schema definition for a travel guide.
 * Independent from the complex post document type.
 */

export default defineType({
  name: 'guide',
  title: 'Travel Guide',
  icon: BoltIcon,
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
      description:
        'When this story/guide was written or when the trip occurred',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'coverImage',
      title: 'Main Image',
      type: 'image',
      description:
        'For best results: Image size should be 850 x 405, webp quality 80%, 60% image resize.',
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
      description: 'Optional category for better organization',
    }),

    defineField({
      name: 'summary',
      title: 'Summary / Meta Description',
      type: 'text',
      rows: 3,
      description:
        'Short summary shown on listing cards and used as the SEO meta description (max 160 chars).',
      validation: (rule) => rule.max(160),
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
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text (important for SEO)',
            },
          ],
        },
        {
          type: 'object',
          name: 'imageGroup',
          title: 'Image Grid (2–4 side-by-side)',
          fields: [
            {
              name: 'layout',
              type: 'string',
              title: 'Grid Layout',
              options: {
                list: [
                  { title: '2 Columns', value: '2-col' },
                  { title: '3 Columns', value: '3-col' },
                  { title: '4 Columns', value: '4-col' },
                ],
                layout: 'radio',
              },
              initialValue: '2-col',
              validation: (rule) => rule.required(),
            },
            {
              name: 'images',
              type: 'array',
              title: 'Images',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alt Text (required for SEO)',
                      validation: (rule) => rule.required(),
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                    },
                  ],
                },
              ],
              validation: (rule) => rule.min(2).max(4),
            },
          ],
        },
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed (YouTube)',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'YouTube URL',
              validation: (rule) => rule.required(),
            },
            {
              name: 'title',
              type: 'string',
              title: 'Video Title (used for SEO structured data)',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption (shown below the video)',
            },
          ],
        },
        {
          type: 'object',
          name: 'mediaWithText',
          title: 'Image + Text Side by Side',
          fields: [
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text (required for SEO)',
                  validation: (rule) => rule.required(),
                },
              ],
            },
            {
              name: 'text',
              type: 'array',
              title: 'Text Content',
              of: [{ type: 'block' }],
            },
            {
              name: 'imagePosition',
              type: 'string',
              title: 'Image Position',
              options: {
                list: [
                  { title: 'Image on Left', value: 'left' },
                  { title: 'Image on Right', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            },
          ],
        },
        {
          type: 'object',
          name: 'callout',
          title: 'Callout Box (Tip / Warning / Info)',
          fields: [
            {
              name: 'type',
              type: 'string',
              title: 'Box Type',
              options: {
                list: [
                  { title: 'Tip', value: 'tip' },
                  { title: 'Warning', value: 'warning' },
                  { title: 'Info', value: 'info' },
                  { title: 'Highlight', value: 'highlight' },
                ],
                layout: 'radio',
              },
              initialValue: 'tip',
            },
            {
              name: 'text',
              type: 'array',
              title: 'Content',
              of: [{ type: 'block' }],
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
      description:
        'For best results: Image size should be 566 x 525, webp quality 80%, 80% image resize.',
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
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Add relevant tags for better searchability',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Publish Date / Scheduled Time',
      description:
        'Complete all required fields to enable scheduling. Set a future date to schedule, or leave blank to publish immediately.',
      type: 'datetime',
      readOnly: ({ document }) => {
        const doc = document as any
        return !(
          doc?.title?.trim() &&
          doc?.slug?.current &&
          doc?.date &&
          (doc?.content as unknown[])?.length > 0
        )
      },
      validation: (rule) =>
        rule
          .custom((value) => {
            if (!value) return true
            if (new Date(value as string) > new Date()) {
              return `Scheduled — this post will not appear publicly until ${new Date(value as string).toLocaleDateString('en-US', { dateStyle: 'long' })}.`
            }
            return true
          })
          .warning(),
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
