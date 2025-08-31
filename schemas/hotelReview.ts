import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

/**
 * This is the schema definition for a hotel review.
 * Independent from the complex post document type.
 */

export default defineType({
  name: 'hotelReview',
  title: 'Hotel Review',
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
          { title: 'Yes, paid or member only access', value: 'yes, paid or member only access' },
          { title: 'Yes, free access', value: 'Yes, free access' },
          { title: 'No', value: 'No' },
        ],
        layout: 'radio'
      },
      initialValue: 'No',
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
      name: 'excerpt2',
      title: 'Hotel Summary',
      type: 'array',
      description: 'Add a short summary of your hotel experience',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required(),
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
      validation: (Rule) => Rule.min(1).error('Please add at least one positive point'),
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
      description: 'Add relevant tags for better searchability (e.g., business travel, family friendly, etc.)',
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
