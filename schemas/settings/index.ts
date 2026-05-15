import { CogIcon } from '@sanity/icons'
import * as demo from 'lib/demo.data'
import { defineArrayMember, defineField, defineType } from 'sanity'

import OpenGraphInput from './OpenGraphInput'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  preview: { select: { title: 'title', subtitle: 'description' } },
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your blog.',
      title: 'Title',
      type: 'string',
      initialValue: demo.title,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description:
        'Used both for the <meta> description tag for SEO, and the blog subheader.',
      title: 'Description',
      type: 'array',
      initialValue: demo.description,
      of: [
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: 'object',
                name: 'link',
                fields: [
                  {
                    type: 'string',
                    name: 'href',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
      validation: (rule) => rule.max(155).required(),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      description:
        'Used for social media previews when linking to the index page.',
      type: 'object',
      components: {
        input: OpenGraphInput as any,
      },
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: demo.ogImageTitle,
        }),
      ],
    }),
    defineField({
      name: 'featuredVideo',
      title: 'Featured Video (Homepage Hero)',
      description:
        'Pin one video as the hero in the Featured Videos section. Paste any YouTube video URL.',
      type: 'object',
      fields: [
        defineField({
          name: 'url',
          title: 'YouTube URL',
          type: 'url',
          description:
            'e.g. https://youtu.be/xxxxx or https://www.youtube.com/watch?v=xxxxx',
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true
              const isYoutube =
                /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/.test(
                  value as string,
                )
              return isYoutube || 'Must be a valid YouTube URL'
            }),
        }),
        defineField({
          name: 'title',
          title: 'Title Override (optional)',
          type: 'string',
          description:
            'Overrides the video title. Leave blank to use the YouTube title.',
        }),
        defineField({
          name: 'category',
          title: 'Category Badge (optional)',
          type: 'string',
          description: 'e.g. Walking Tour, Arena Visit, Hotel Review',
          options: {
            list: [
              { title: 'Walking Tour', value: 'Walking Tour' },
              { title: 'Arena Visit', value: 'Arena Visit' },
              { title: 'Hotel Review', value: 'Hotel Review' },
              { title: 'Food Review', value: 'Food Review' },
              { title: 'Travel Guide', value: 'Travel Guide' },
              { title: 'Cruise', value: 'Cruise' },
            ],
          },
        }),
        defineField({
          name: 'description',
          title: 'Description Override (optional)',
          type: 'text',
          rows: 2,
          description:
            'Short teaser shown below the hero video. Leave blank to use the YouTube description.',
        }),
      ],
    }),
  ],
})
