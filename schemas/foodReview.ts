import { IceCreamIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { IceCream } from 'lucide-react'
import { defineField, defineType } from 'sanity'
import { AltTextGeneratorInput } from '../plugins/AltTextGeneratorInput'
import { SeoExcerptGeneratorInput } from '../plugins/SeoExcerptGeneratorInput'
import { VerdictGeneratorInput } from '../plugins/VerdictGeneratorInput'
import { getPortableTextLength } from './utils'

/**
 * This is the schema definition for a food/restaurant review.
 * Independent from the complex post document type.
 * Includes dedicated dine-in/takeout logic and individual food ratings.
 */

export default defineType({
  name: 'foodReview',
  title: 'Food Review',
  icon: IceCreamIcon,
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
        'Main image — used on listing cards and the hero gallery. Upload at 1200 × 800 px (3:2 landscape). WebP 80% or JPEG 85% quality.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the image for SEO and accessibility.',
          components: { input: AltTextGeneratorInput },
        }),
      ],
    }),

    defineField({
      name: 'excerpt2',
      title: 'Restaurant Summary',
      type: 'array',
      description: 'Add a short summary of your dining experience',
      of: [{ type: 'block' }],
      hidden: true,
    }),

    defineField({
      name: 'seoExcerpt',
      title: 'SEO Excerpt / Meta Description',
      type: 'string',
      description:
        'Plain text shown in Google search results and social shares. 120–155 characters ideal. If left blank, Google will show the site\'s generic description — always fill this in.',
      validation: (Rule) => [
        Rule.max(155).warning('Keep under 155 characters for Google search results'),
        Rule.min(120).warning('At least 120 characters recommended for Google search results'),
      ],
      components: { input: SeoExcerptGeneratorInput },
    }),

    defineField({
      name: 'tip',
      title: 'Restaurant Quick Tip',
      type: 'array',
      description:
        'Add a helpful tip for this restaurant — aim for 1–2 sentences (under 200 characters is ideal). Optional.',
      of: [{ type: 'block' }],
    }),

    defineField({
      name: 'individualFoodRating',
      title: 'Individual Food Rating',
      type: 'array',
      description:
        'Rate individual dishes/drinks. Photo for each dish: 900 × 600 px (3:2 landscape). WebP 75% or JPEG 80% quality.',
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
              name: 'price',
              type: 'number',
              title: 'Price (USD)',
              description:
                'Optional: What did this specific dish cost? (Numbers only, e.g., 15.50)',
            },
            {
              name: 'review',
              type: 'string',
              title:
                'Short "Twitter style" (120 characters or less) Review or additional info (optional)',
              validation: (Rule) =>
                Rule.max(120).warning(`shouldn't be more than 120 characters.`),
            },
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Describe the dish/drink for accessibility and SEO.',
              components: { input: AltTextGeneratorInput },
            }),
          ],
        },
      ],
    }),

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
              description: 'Optional: add a brief caption shown below the photo in the gallery.',
            },
            {
              name: 'category',
              type: 'string',
              title: 'Photo Category',
              description:
                'Choose a category — Food & Drinks: dishes, cocktails, desserts. Interior & Atmosphere: dining room, tables, décor. Exterior: outside the building, signage, patio. Menu: printed or digital menu shots. Additional Photos: anything that doesn\'t fit above.',
              options: {
                list: [
                  { title: 'Food & Drinks', value: 'food-drinks' },
                  { title: 'Interior & Atmosphere', value: 'interior' },
                  { title: 'Exterior', value: 'exterior' },
                  { title: 'Menu', value: 'menu' },
                  { title: 'Additional Photos', value: 'other' },
                ],
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
              const labels: Record<string, string> = {
                'food-drinks': 'Food & Drinks',
                interior: 'Interior & Atmosphere',
                exterior: 'Exterior',
                'bar-area': 'Bar Area',
                menu: 'Menu',
                other: 'Additional Photos',
              }
              return {
                media,
                title: title || 'No alt text',
                subtitle: category ? `✓  ${labels[category] ?? category}` : '⚠  No category set',
              }
            },
          },
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
      description:
        'Add multiple positive points about this restaurant. Aim for 1–2 short sentences per point (under 150 chars each).',
      type: 'array',
      of: [{ type: 'text' }],
      validation: (Rule) =>
        Rule.min(1).error('Please add at least one positive point'),
    }),

    defineField({
      title: 'Negatives',
      name: 'negatives',
      description:
        'Add multiple negative points about this restaurant. Aim for 1–2 short sentences per point (under 150 chars each).',
      type: 'array',
      of: [{ type: 'text' }],
    }),

    defineField({
      name: 'verdict',
      title: 'Verdict',
      description:
        'Your overall verdict on this restaurant — max 600 characters. Basic formatting allowed.',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) =>
        Rule.custom((portableTextValue) => {
          if (!portableTextValue || (portableTextValue as any[]).length === 0) {
            return 'Verdict is required'
          }
          const textLength = getPortableTextLength(portableTextValue as any[])
          const limit = 600
          if (textLength > limit) {
            return `Verdict exceeds ${limit} characters (${textLength}/${limit})`
          }
          return true
        }).error(),
      components: { input: VerdictGeneratorInput },
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
              components: { input: AltTextGeneratorInput },
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
      // validation: (rule) => rule.required(),
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

    defineField({
      name: 'nearestArena',
      title: 'Nearest NBA Arena',
      type: 'reference',
      to: [{ type: 'arenas' }],
      description:
        'Optional: Link to the nearest NBA/WNBA arena for internal SEO linking.',
    }),

    defineField({
      name: 'priceTier',
      title: 'Price Tier',
      type: 'string',
      description: 'Approximate price range per person (optional)',
      options: {
        list: [
          { title: '$ (Under $15)', value: '$ (Under $15)' },
          { title: '$$ ($15–$30)', value: '$$ ($15–$30)' },
          { title: '$$$ ($30–$60)', value: '$$$ ($30–$60)' },
          { title: '$$$$ ($60+)', value: '$$$$ ($60+)' },
        ],
      },
    }),

    defineField({
      name: 'publishedAt',
      title: 'Publish Date / Scheduled Time',
      description:
        'Complete all required fields to enable scheduling. Set a future date to schedule, or leave blank to publish immediately.',
      type: 'datetime',
      readOnly: ({ document }) => {
        const doc = document as any
        const hasRequiredRating =
          doc?.diningType === 'dinein'
            ? !!doc?.foodRating
            : doc?.diningType === 'takeout'
              ? !!doc?.takeoutRating
              : false
        return !(
          doc?.title?.trim() &&
          doc?.slug?.current &&
          doc?.date &&
          doc?.location?.trim() &&
          doc?.diningType &&
          hasRequiredRating &&
          (doc?.positives as unknown[])?.length > 0 &&
          (doc?.verdict as unknown[])?.length > 0
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

    defineField({
      name: 'revisits',
      title: 'Revisit History',
      description:
        'Log subsequent visits. Only fill in the rating categories that actually changed.',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Revisit',
          options: { collapsible: true, collapsed: false },
          fields: [
            defineField({
              name: 'visitDate',
              title: 'Visit Date',
              type: 'datetime',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'notes',
              title: 'What Changed?',
              description:
                'Describe what improved or declined since the original visit.',
              type: 'array',
              of: [{ type: 'block' }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'foodRatingUpdates',
              title: 'Changed Dine-in Ratings Only',
              description:
                'Leave blank for unchanged categories. Only visible for dine-in reviews.',
              type: 'object',
              hidden: ({ document }) => document?.diningType !== 'dinein',
              options: { collapsible: true, collapsed: true, columns: 3 },
              fields: [
                {
                  name: 'Flavor_and_Taste',
                  title: 'Flavor & Taste',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Food_Value',
                  title: 'Food Value',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Restaurant_Service',
                  title: 'Service',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Memorability',
                  title: 'Memorability',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Presentation_on_Plate',
                  title: 'Presentation',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Restaurant_Cleanliness',
                  title: 'Cleanliness',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Restaurant_Location',
                  title: 'Location',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
              ],
            }),
            defineField({
              name: 'takeoutRatingUpdates',
              title: 'Changed Takeout Ratings Only',
              description:
                'Leave blank for unchanged categories. Only visible for takeout reviews.',
              type: 'object',
              hidden: ({ document }) => document?.diningType !== 'takeout',
              options: { collapsible: true, collapsed: true, columns: 3 },
              fields: [
                {
                  name: 'tasteAndFlavor',
                  title: 'Taste & Flavor',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'foodValue',
                  title: 'Food Value',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'overallSatisfaction',
                  title: 'Overall Satisfaction',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'presentation',
                  title: 'Presentation',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'packaging',
                  title: 'Packaging',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'accuracy',
                  title: 'Accuracy',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
              ],
            }),
          ],
          preview: {
            select: { date: 'visitDate' },
            prepare({ date }) {
              return {
                title: date
                  ? `Revisit: ${new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' })}`
                  : 'Revisit: No date set',
              }
            },
          },
        },
      ],
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
