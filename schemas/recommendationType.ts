// ./schema/recommendation/recommendationType.ts

import { HeartIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const recommendationType = defineType({
  name: 'recommendation',
  title: 'Recommendation',
  type: 'object',
  fields: [
    defineField({
      name: 'post',
      type: 'reference',
      to: [{ type: 'post' }],
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'post.title',
      // author: 'post.author',
      // year: 'post.year',
      featured: 'featured',
    },
    prepare: ({ title, featured }) => ({
      title: [featured ? '⭐️ ' : '', `${title ?? `No book selected`}`].join(
        ` `,
      ),
      // subtitle: author && year ? `${author} (${year})` : undefined,
      media: HeartIcon,
    }),
  },
})
