import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

import authorType from './author'
import galleryType from './gallery'

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
  title: 'Post',
  icon: BookIcon,
  type: 'document',
  fields: [
    defineField({
      title: 'Select the type of review (Hotel or Food)',
      description: '',
      name: 'linkType',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Hotel', value: 'hotel' },
          { title: 'Food', value: 'food' },
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
      title: 'Visited Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      //validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'room',
      title: 'Room Type',
      type: 'string',
      description: 'eg. 1 King Bed Lagoon Access (optional)',
      //validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'coverImage',
      title: 'Main Image',
      type: 'image',
      description: 'For best results: Image size should be 1240 x 540, webp quality 80%, 60% image resize.',
      options: {
        hotspot: true,
      }
    }),

    defineField({
      name: 'excerpt',
      title: 'Post Blurb',
      type: 'string',
    }),

 

    // defineField({
    //   title: 'Gallery',
    //   name: 'gallery',

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
      type: 'gallery',
      description: 'For best results: Image size should be 566 x 525, webp quality 80%, 80% image resize.',

    }),

    defineField({
      name: 'youtube',
      title: 'Youtube URL',
      type: 'string',
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
      //validation: (rule) => rule.required(),
    }),

    {
      name: 'techRating',
      title: 'Was the item present in the Hotel room?',
      description: 'Say if the item was in the room',
      type: 'techRating',
      hidden: ({ parent }) => parent?.linkType !== 'hotel',
    },

    defineField({
      title: 'Positives',
      name: 'positives',

      description: 'Add multiple Positive points',
      //validation: (Rule) => Rule.required(),
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      title: 'Negatives',
      name: 'negatives',
      description: 'Add multiple Negative points',
      //validation: (Rule) => Rule.required(),
      type: 'array',
      of: [{ type: 'text' }],
    }),

    defineField({
      name: 'verdict',
      title: 'Verdict',
      description: 'Add your Verdict',
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
      of: [{ type: 'block' }],
    }),

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
