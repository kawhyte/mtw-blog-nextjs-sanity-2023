import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

/**
 * This is the schema definition for a food/restaurant review.
 * Independent from the complex post document type.
 * Includes dedicated dine-in/takeout logic and individual food ratings.
 */

export default defineType({
  name: 'foodReview',
  title: 'Food Review',
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
      title: 'Visited Date',
      type: 'datetime',
      description: 'When you visited this restaurant',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Restaurant location (address, city, state)',
      validation: (rule) => rule.required(),
    }),

    defineField({
      title: 'Dining Type',
      name: 'diningType',
      type: 'string',
      description: 'How did you experience this restaurant?',
      options: {
        list: [
          { title: 'Dine-in', value: 'dinein' },
          { title: 'Takeout', value: 'takeout' },
        ],
        layout: 'radio',
      },
      initialValue: 'dinein',
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
      name: 'excerpt2',
      title: 'Restaurant Summary',
      type: 'array',
      description: 'Add a short summary of your dining experience',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'tip',
      title: 'Restaurant Quick Tip',
      type: 'array',
      description: 'Add a helpful tip for this restaurant (optional)',
      of: [{ type: 'block' }],
    }),

    defineField({
      name: 'individualFoodRating',
      title: 'Individual Food Rating',
      type: 'array',
      description:
        'Rate individual dishes/drinks. For best results: Image size webp quality 40%, 40% image resize.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Dish/Drink name',
              description: 'The name should be 40 characters or less',
              validation: (Rule) =>
                Rule.max(40)
                  .warning(`The name shouldn't be more than 40 characters.`)
                  .required(),
            },
            {
              name: 'rating',
              type: 'individualFoodType',
              title: 'Rating',
            },
            {
              name: 'review',
              type: 'string',
              title:
                'Short "Twitter style" (120 characters or less) Review or additional info (optional)',
              validation: (Rule) =>
                Rule.max(120).warning(`shouldn't be more than 120 characters.`),
            },
          ],
        },
      ],
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
      name: 'youtube',
      title: 'Youtube URL (optional)',
      type: 'string',
      description: 'Youtube link is optional',
    }),

    // DINE-IN SPECIFIC RATING SYSTEM
    defineField({
      name: 'foodRating',
      title: 'Rating for Dine-in',
      description:
        'Add a rating for each dine-in section (only for dine-in experiences)',
      type: 'foodRating',
      hidden: ({ parent }) => parent?.diningType !== 'dinein',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.diningType === 'dinein' && !value) {
            return 'Dine-in rating is required for dine-in experiences'
          }
          return true
        }),
    }),

    // TAKEOUT SPECIFIC RATING SYSTEM
    defineField({
      name: 'takeoutRating',
      title: 'Rating for Takeout',
      description:
        'Add a rating for each takeout section (only for takeout experiences)',
      type: 'takeOutFoodRating',
      hidden: ({ parent }) => parent?.diningType !== 'takeout',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.diningType === 'takeout' && !value) {
            return 'Takeout rating is required for takeout experiences'
          }
          return true
        }),
    }),

    defineField({
      title: 'Positives',
      name: 'positives',
      description: 'Add multiple positive points about this restaurant',
      type: 'array',
      of: [{ type: 'text' }],
      validation: (Rule) =>
        Rule.min(1).error('Please add at least one positive point'),
    }),

    defineField({
      title: 'Negatives',
      name: 'negatives',
      description: 'Add multiple negative points about this restaurant',
      type: 'array',
      of: [{ type: 'text' }],
    }),

    defineField({
      name: 'verdict',
      title: 'Verdict',
      description: 'Add your overall verdict about this restaurant',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'content',
      title: 'Content',
      description: 'Main article content about your dining experience',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Image Caption',
              description: 'This text will be displayed below the image',
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
              validation: (Rule) => Rule.min(2).max(6),
            },
          ],
        },
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description:
        'Add relevant tags for better searchability (e.g., family friendly, date night, casual dining, etc.)',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'coverImage',
      location: 'location',
      diningType: 'diningType',
    },
    prepare({ title, media, date, location, diningType }) {
      const subtitles = [
        location && `📍 ${location}`,
        diningType && `🍽️ ${diningType === 'dinein' ? 'Dine-in' : 'Takeout'}`,
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
    {
      title: 'Dining Type',
      name: 'diningTypeAsc',
      by: [{ field: 'diningType', direction: 'asc' }],
    },
  ],
})
