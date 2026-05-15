import { HomeIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

/**
 * This is the schema definition for a hotel review.
 * Independent from the complex post document type.
 */

export default defineType({
  name: 'hotelReview',
  title: 'Hotel Review',
  icon: HomeIcon,
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
      description: 'When you visited this hotel',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'City, State/Country where the hotel is located',
      validation: (rule) => rule.required(),
    }),

    defineField({
      title: 'Hotel Category',
      name: 'category',
      type: 'string',
      description: 'What type of hotel is this?',
      options: {
        list: [
          { title: 'Luxury', value: 'luxury' },
          { title: 'Mid-Scale', value: 'mid-scale' },
          { title: 'Economy', value: 'economy' },
        ],
        layout: 'radio',
      },
      initialValue: 'mid-scale',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'room',
      title: 'Room Type',
      type: 'string',
      description: 'eg. 1 King Bed Lagoon Access (optional)',
      validation: (Rule) => Rule.max(45), // Limit to 45 characters
    }),

    defineField({
      title: 'Lounge Access available at this hotel?',
      name: 'lounge',
      type: 'string',
      description: '(optional)',
      options: {
        list: [
          {
            title: 'Yes, paid or member only access',
            value: 'yes, paid or member only access',
          },
          { title: 'Yes, free access', value: 'Yes, free access' },
          { title: 'No', value: 'No' },
        ],
        layout: 'radio',
      },
      initialValue: 'No',
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
      title: 'Hotel Summary',
      type: 'array',
      description: 'Add a short summary of your hotel experience',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'blurbSource',
      title: 'Blurb Source',
      type: 'string',
      description:
        'The source of the blurb (e.g., Hyatt Regency Boston Harbor).',
    }),

    defineField({
      name: 'blurbUrl',
      title: 'Blurb Source URL',
      type: 'url',
      description: 'The URL to the source of the blurb.',
    }),

    defineField({
      name: 'tip',
      title: 'Hotel Quick Tip',
      type: 'array',
      description: 'Add a helpful tip for this hotel (optional)',
      of: [{ type: 'block' }],
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

    // Hotel-specific rating system
    defineField({
      name: 'hotelRating',
      title: 'Hotel Ratings',
      description: 'Add a rating for each hotel section.',
      type: 'hotelRating',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'internetSpeed',
      title: 'Internet Speed',
      type: 'number',
      description: 'Internet speed in Mbps (must be a number)',
    }),

    defineField({
      name: 'roomAmenities',
      title: 'Room Amenities',
      description: 'A breakdown of the amenities in the room',
      type: 'roomAmenities',
    }),

    defineField({
      name: 'techRating',
      title: 'Technology in Hotel Room',
      description: 'What technology items were present in the hotel room?',
      type: 'techRating',
    }),

    defineField({
      title: 'Positives',
      name: 'positives',
      description: 'Add multiple positive points about this hotel',
      type: 'array',
      of: [{ type: 'text' }],
      validation: (Rule) =>
        Rule.min(1).error('Please add at least one positive point'),
    }),

    defineField({
      title: 'Negatives',
      name: 'negatives',
      description: 'Add multiple negative points about this hotel',
      type: 'array',
      of: [{ type: 'text' }],
    }),

    defineField({
      name: 'verdict',
      title: 'Verdict',
      description: 'Add your overall verdict about this hotel',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'content',
      title: 'Content',
      description: 'Main article content about your hotel experience',
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
              // validation: (Rule) => Rule.min(2).max(6),
            },
          ],
        },
      ],
      // validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'wouldReturn',
      title: 'Would You Return?',
      type: 'string',
      description: 'Your honest verdict on returning (optional)',
      options: {
        list: [
          { title: 'Yes, absolutely', value: 'yes' },
          { title: 'Yes, if prices drop', value: 'if_prices_drop' },
          { title: 'Maybe', value: 'maybe' },
          { title: 'No', value: 'no' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'priceTier',
      title: 'Approximate Nightly Rate (at time of visit)',
      type: 'string',
      description:
        'Approximate cash rate per night — not points value (optional)',
      options: {
        list: [
          { title: 'Under $100/night', value: 'under_100' },
          { title: '$100–$200/night', value: '100_200' },
          { title: '$200–$350/night', value: '200_350' },
          { title: '$350–$500/night', value: '350_500' },
          { title: '$500+/night', value: '500_plus' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'bestFor',
      title: 'Best For (traveler type)',
      type: 'array',
      description: 'Select all traveler types this hotel suits (optional)',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Business Travel', value: 'business' },
          { title: 'Couples / Romance', value: 'couples' },
          { title: 'Families', value: 'families' },
          { title: 'Solo Travel', value: 'solo' },
          { title: 'Leisure / Vacation', value: 'leisure' },
          { title: 'Points Redemption', value: 'points' },
        ],
        layout: 'grid',
      },
    }),

    defineField({
      name: 'resortFee',
      title: 'Resort Fee',
      description: 'Daily resort fee details (optional)',
      type: 'object',
      options: { collapsible: true, collapsed: false, columns: 2 },
      fields: [
        defineField({
          name: 'amount',
          title: 'Daily Fee ($)',
          type: 'number',
          description: 'Daily resort fee in USD (e.g. 45)',
        }),
        defineField({
          name: 'worthIt',
          title: 'Is the resort fee worth it?',
          type: 'string',
          options: {
            list: [
              { title: 'Yes', value: 'yes' },
              { title: 'Partially', value: 'partially' },
              { title: 'No', value: 'no' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'covers',
          title: 'What does it cover?',
          type: 'array',
          description:
            'Add each item the fee covers (e.g. WiFi, Parking, Beach Chairs)',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
      ],
    }),

    defineField({
      name: 'parking',
      title: 'Parking',
      description: 'Parking options at this hotel (optional)',
      type: 'object',
      options: { collapsible: true, collapsed: false, columns: 2 },
      fields: [
        defineField({
          name: 'parkingType',
          title: 'Parking Type',
          type: 'string',
          options: {
            list: [
              { title: 'Valet', value: 'valet' },
              { title: 'Self-park', value: 'self_park' },
              { title: 'Street', value: 'street' },
              { title: 'None / No parking', value: 'none' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'dailyCost',
          title: 'Daily Parking Cost ($)',
          type: 'number',
          description: 'Daily parking cost in USD (leave blank if free or N/A)',
        }),
      ],
    }),

    defineField({
      name: 'breakfast',
      title: 'Breakfast',
      type: 'string',
      description: 'Breakfast availability at this hotel (optional)',
      options: {
        list: [
          { title: 'Included with stay', value: 'included' },
          { title: 'Available for purchase', value: 'paid' },
          { title: 'Not available on-site', value: 'none' },
        ],
        layout: 'radio',
      },
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
        'Add relevant tags for better searchability (e.g., business travel, family friendly, etc.)',
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
          doc?.location?.trim() &&
          doc?.category &&
          (doc?.excerpt2 as unknown[])?.length > 0 &&
          doc?.hotelRating &&
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
              name: 'ratingUpdates',
              title: 'Changed Ratings Only',
              description:
                'Leave blank for any category that did NOT change. Enter 0 to explicitly downgrade to 0.',
              type: 'object',
              options: { collapsible: true, collapsed: true, columns: 3 },
              fields: [
                {
                  name: 'Location',
                  title: 'Location',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Bed_Comfort',
                  title: 'Bed Comfort',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Service',
                  title: 'Service',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Value',
                  title: 'Value',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Room_Cleanliness',
                  title: 'Cleanliness',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Room_Amenities',
                  title: 'Room Amenities',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Internet_Speed',
                  title: 'Internet Speed',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Gym',
                  title: 'Gym',
                  type: 'number',
                  validation: (rule) => rule.min(0).max(10),
                },
                {
                  name: 'Pool',
                  title: 'Pool',
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
      category: 'category',
    },
    prepare({ title, media, date, location, category }) {
      const subtitles = [
        location && `📍 ${location}`,
        category && `🏨 ${category}`,
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
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
})
