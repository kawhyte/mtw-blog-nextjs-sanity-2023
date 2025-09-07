import { BillIcon, BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

import { description } from './../lib/demo.data'

/**
 * This file is the schema definition for a post.
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */

export default defineType({
  name: 'post',
  title: 'Post (Legacy - RENE, DONT USE)',
  icon: BookIcon,
  type: 'document',

  fields: [
    defineField({
      title: 'Legacy Post Type',
      description:
        'This schema is deprecated. Use specific document types instead.',
      name: 'linkType',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [{ title: 'Things we like', value: 'favorite' }],
        layout: 'radio',
      },
      initialValue: 'favorite',
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      //validation: (rule) => rule.required(),
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
      title: 'Visited Date',
      type: 'datetime',

      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      hidden: ({ parent, value }) => parent?.linkType == 'favorite',

      //validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'link',
      type: 'url',
      title: 'Link',
      hidden: ({ parent, value }) => parent?.linkType != 'favorite',
      description: 'URL - where this item can be found.',
    }),

    defineField({
      name: 'cost',
      type: 'number',
      title: 'Item cost',
      hidden: ({ parent, value }) => parent?.linkType != 'favorite',
      description: 'Cost.',
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
      name: 'excerpt',
      title: 'Post Blurb',
      type: 'string',
      hidden: true,
    }),

    defineField({
      name: 'excerpt2',
      title: 'Post Blurb',
      description: 'Add a short summary',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ parent, value }) => parent?.linkType == 'favorite',
    }),

    defineField({
      name: 'tip',
      title: 'Quick Tip',

      description: 'Add a helpful tip (optional)',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ parent, value }) => parent?.linkType == 'favorite',
    }),

    // defineField({
    //   title: 'Gallery2223',
    //   name: 'gallery2',

    //   description: 'Add multiple Photos',
    //   //validation: (Rule) => Rule.required(),
    //   type: 'array',
    //   of: [{ type: 'image' }],
    // }),
    // {
    // 	name: "amenities",
    // 	title: "Additional rating",
    // 	description: "Add additional rating ctaegory.",
    // 	type: "array",
    // 	of: [{ type: "amenities" }],
    // },

    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      // type: 'gallery',
      description:
        'For best results: Image size should be 566 x 525, webp quality 80%, 80% image resize.',
      type: 'array',
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

    // defineField({
    //   name: 'gallery2',
    //   title: 'Photo Gallery222',
    //   type: 'gallery',
    //   description: 'For best results: Image size should be 566 x 525, webp quality 80%, 80% image resize.',

    // }),

    defineField({
      name: 'youtube',
      title: 'Youtube URL (optional)',
      type: 'string',
      description: 'Youtube link is Optional',
      hidden: ({ parent, value }) => parent?.linkType == 'favorite',
      //validation: (rule) => rule.required(),
    }),

    // {
    //   name: 'foodRating',
    //   title: 'Rating for Food',
    //   description: 'Add a rating for each Food section.',
    //   type: 'foodRating',
    //   hidden: ({ parent }) => parent?.linkType !== 'food',
    // },

    // {
    //   title: "Hotel Resort Fees",
    //   type: "array",
    //   name: "example",
    //   description: 'Hotel Resort Fees breakdown',
    //   hidden: ({ parent }) => parent?.linkType !== 'hotel',
    //   of: [
    //     {
    //       type: "object",
    //       name: "inline",
    //       icon: BillIcon,
    //       fields: [
    //         { type: "string", name: "title" },
    //         { type: "number", name: "amount" }
    //       ]
    //     }
    //   ],
    //   options: {
    //     list: [
    //       { _type: "inline", title: "Enhanced WIFI", amount: 100 },
    //       { _type: "inline", title: "Local/Domestic calls", amount: 1 },
    //       { _type: "inline", title: "Daily Newspaper", amount: 1 },
    //       { _type: "inline", title: "Water/food credit", amount: 1 },
    //       { _type: "inline", title: "Discount area attractions", amount: 1 },
    //       { _type: "inline", title: "Retail Discount", amount: 1 },
    //       { _type: "inline", title: "Access to the fitness center", amount: 1 },
    //       { _type: "inline", title: "Self-parking", amount: 1 },
    //       { _type: "inline", title: "Other", amount: 1 },
    //     ]
    //   }
    // },

    defineField({
      title: 'Positives',
      name: 'positives',
      description: 'Add multiple positive points',
      hidden: ({ parent, value }) => parent?.linkType == 'favorite',
      //validation: (Rule) => Rule.required(),
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      title: 'Negatives',
      name: 'negatives',
      description: 'Add multiple negative points',
      hidden: ({ parent, value }) => parent?.linkType == 'favorite',
      //validation: (Rule) => Rule.required(),
      type: 'array',
      of: [{ type: 'text' }],
    }),

    defineField({
      name: 'verdict',
      title: 'Verdict',
      description: 'Add your overall verdict',
      hidden: ({ parent, value }) => parent?.linkType == 'favorite',
      //validation: (Rule) => Rule.required(),
      type: 'array',
      of: [{ type: 'block' }],
      //hidden: true,
    }),

    defineField({
      name: 'content',
      title: 'Content',
      description: 'Optional content area!!!',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true }, // Allow image cropping
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Image Caption',
              description: 'This Text will be displayed below the image',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility',
            },
          ],
        },
        {
          type: 'object',
          name: 'imageGroup',
          title: 'Image Grid',
          fields: [
            {
              name: 'images',
              type: 'array',
              title: 'Images',
              of: [{ type: 'image' }],
              validation: (Rule) => Rule.min(2).max(6), // Enforce at least 2 images for a grid
            },
          ],
        },
      ],
    }),
    // {
    //   title: 'Tags',
    //   name: 'tags',
    //   type: 'array',
    //   of: [{type: 'string'}],
    //   options: {
    //     layout: 'tags'
    //   }
    // },

    // defineField({
    //   title: 'Would you recommend?',
    //   name: 'recommend',
    //   type: 'boolean',
    //   hidden: ({ parent, value }) =>
    //   parent?.linkType == 'favorite',
    // }),

    // defineField({
    //   name: 'author',
    //   title: 'Author',
    //   type: 'reference',
    //   to: [{ type: authorType.name }],
    // }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      date: 'date',
      media: 'coverImage',
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
      ].filter(Boolean)

      return { title, media, subtitle: subtitles.join(' ') }
    },
  },
})
