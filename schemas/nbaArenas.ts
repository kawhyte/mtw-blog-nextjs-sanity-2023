import { StarIcon } from '@sanity/icons'
// import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'arenas',
  title: 'NBA/(W)NBA Arenas',
  icon: StarIcon,
  type: 'document',
  initialValue: {
    visited: false,
  },

  fields: [
    defineField({
      name: 'name',
      title: 'Arena Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The name of Arena/Stadium ( ex. Crypto )',
    }),

    defineField({
      name: 'slug',
      title: 'slug',
      type: 'slug',
      options: {
        source: 'name', // Automatically generate from the 'name' field
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'Arena slug (ex. crypto)',
    }),

    defineField({
      name: 'arenaImage',
      title: 'Arena Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      description:
        'For best results: Image size should be 350 x 205, webp quality 50%, 50% image resize.',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'gallery',
      title: 'Team Logo(s)',
      description:
        'For best results: Image size should be 96 x 96, webp quality 50%, 50% image resize.',
      type: 'array',
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
              title: 'Team Name',
              validation: (Rule) => Rule.required(),
            },
            {
              title: 'Did we see this team play?',
              name: 'played',
              type: 'boolean',
            },
            {
              title: 'Team type',
              description: '',
              name: 'teamType',
              type: 'string',
              // validation: (Rule) => Rule.required(),
              options: {
                list: [
                  { title: 'NBA', value: 'nba' },
                  { title: 'WNBA', value: 'wnba' },
            
                ],
                layout: 'radio',
              },
            },


            {
              name: 'link',
              type: 'string',
              title: 'Link to arena page',
              description: 'Link is optional',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'location',
      title: 'Arena Location',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'capacity',
      title: 'Arena Capacity',
      type: 'number',
      // validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'buildDate',
      title: 'Arena build date',
      type: 'date',
      // validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Did we visit this Arena?',
      name: 'visited',
      type: 'boolean',
    }),

    defineField({
      name: 'date',
      title: 'Date Visited',
      type: 'datetime',
      description: 'This is the date we visited the Arena',
      initialValue: () => new Date().toISOString(),
    }),





    defineField({
      name: 'arenaReview',
      title: 'Arena Review Breakdown',
      type: 'arenaReview',
      validation: (Rule) => Rule.custom((value, context) => {
        if (context.document.visited && !value) {  // Access visited field from the document
          return 'Arena review is required if you have visited the arena.';
        }
        return true;
      }),
    }),

    
  ],
})
