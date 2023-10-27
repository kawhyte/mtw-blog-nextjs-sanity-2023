import { BillIcon,BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

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
  title: 'Post (Hotel/Restaurant/Guides)',
  icon: BookIcon,
  type: 'document',

  fields: [
    defineField({
      title: 'Select the type of review (Hotel, Food, Story, Things we like)',
      description: '',
      name: 'linkType',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Hotel', value: 'hotel' },
          { title: 'Food', value: 'food' },
          { title: 'Story/Guide', value: 'story' },
          // { title: 'Things we like', value: 'favorite' },
        ],
        layout: 'radio',
      },
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
      title: 'Visited/Story Date',
      type: 'datetime',

      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      hidden: ({ parent, value }) =>
        parent?.linkType == 'story' || parent?.linkType == 'favorite',

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
      name: 'room',
      title: 'Room Type',
      type: 'string',
      description: 'eg. 1 King Bed Lagoon Access (optional)',
      hidden: ({ parent }) => parent?.linkType !== 'hotel',
      //validation: (rule) => rule.required(),
    }),


    defineField({
      title: 'Hotel Category',
      name: 'category',
      type: 'string',
      description: '(optional)',
      hidden: ({ parent }) => parent?.linkType !== 'hotel', // &lt;-- defaults to 'dropdown'
      options: {
        list: [
          { title: 'Luxury', value: 'luxury' },
          { title: 'Mid-Scale', value: 'mid-scale' },
          { title: 'Economy', value: 'economy' },
        ], // &lt;-- predefined values
        layout: 'radio',
      },
    }),



    defineField({
      title: 'Lounge Access availiable at this hotel?',
      name: 'lounge',
      type: 'string',
      description: '(optional)',
      hidden: ({ parent }) => parent?.linkType !== 'hotel',
      options: {
        list: [
          { title: 'Yes, paid or member only access', value: 'yes, paid or member only access' },
          { title: 'Yes, free access', value: 'Yes, free access' },
          { title: 'No', value: 'No' },
      
      ],
      layout:'radio'
      },
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
      hidden: ({ parent, value }) =>
        parent?.linkType == 'story' || parent?.linkType == 'favorite',
    }),

    defineField({
      name: 'tip',
      title: 'Hotel/Restaurant Quick Tip',
      
      description: 'Add a Tip for this hotel or restaurant (optional)',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ parent, value }) =>
        parent?.linkType == 'story' || parent?.linkType == 'favorite',
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
      name: 'individualFoodRating',
      title: 'Individual Food Rating',
      // type: 'gallery',
      description:
        'For best results: Image size webp quality 40%, 40% image resize.',
      type: 'array',
      hidden: ({ parent }) => parent?.linkType !== 'food',
      //validation: Rule => Rule.required(),

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
             
              validation: Rule => Rule.max(40).warning(`The name shouldn't be more than 40 characters.`).required(),
              // validation: Rule => Rule.max(120).warning(`A title shouldn't be more than 120 characters.`),

            },
            {
              name: 'rating',
              type: 'individualFoodType',
              title: 'Rating',
            },
            {
              name: 'review',
              type: 'string',
              title: 'Short "Twitter style" Review or additional info (optional)',
              validation: Rule => Rule.max(120).warning(`A title shouldn't be more than 120 characters.`),

            },
          ],
        },
      ],
    }),

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
      hidden: ({ parent, value }) =>
        parent?.linkType == 'story' || parent?.linkType == 'favorite',
      //validation: (rule) => rule.required(),
    }),

    {
      name: 'hotelRating',
      title: 'Rating for Hotels',
      description: 'Add a rating for each Hotel section.',
      type: 'hotelRating',
      hidden: ({ parent }) => parent?.linkType !== 'hotel',
    },
    {
      name: 'foodRating',
      title: 'Rating for Food',
      description: 'Add a rating for each Food section.',
      type: 'foodRating',
      hidden: ({ parent }) => parent?.linkType !== 'food',
    },

    defineField({
      name: 'internetSpeed',
      title: 'Internet Speed',
      type: 'number',
      description: 'Must be a number ',
      hidden: ({ parent }) => parent?.linkType !== 'hotel',
      //validation: (rule) => rule.required(),
    }),
    {
      name: 'roomAmenities',
      title: 'A breakdown of the Amenities in the room',
      description: 'Say if the item was in the room',
      type: 'roomAmenities',
      hidden: ({ parent }) => parent?.linkType !== 'hotel',
    },

    {
      name: 'techRating',
      title: 'Was the item present in the Hotel room?',
      description: 'Say if the item was in the room',
      type: 'techRating',
      hidden: ({ parent }) => parent?.linkType !== 'hotel',
    },

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

      description: 'Add multiple Positive points',
      hidden: ({ parent, value }) =>
        parent?.linkType == 'story' || parent?.linkType == 'favorite',
      //validation: (Rule) => Rule.required(),
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      title: 'Negatives',
      name: 'negatives',
      description: 'Add multiple Negative points',
      hidden: ({ parent, value }) =>
        parent?.linkType == 'story' || parent?.linkType == 'favorite',
      //validation: (Rule) => Rule.required(),
      type: 'array',
      of: [{ type: 'text' }],
    }),

    defineField({
      name: 'verdict',
      title: 'Verdict',
      description: 'Add your Verdict',
      hidden: ({ parent, value }) =>
        parent?.linkType == 'story' || parent?.linkType == 'favorite',
      //validation: (Rule) => Rule.required(),
      type: 'array',
      of: [{ type: 'block' }],
      //hidden: true,
    }),

    defineField({
      name: 'content',
      title: 'Content',
      description: 'Optional content area',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
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
    //   parent?.linkType == 'story' || parent?.linkType == 'favorite',
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
