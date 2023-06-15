// ./schema/readingListType.ts

import {defineField, defineType, isKeyedObject,Reference} from 'sanity'

type Recommendation = {
  _key?: string
  book?: Reference
  featured?: boolean
}

export const recommendationListType = defineType({
  name: 'recommendationList',
  title: 'Recommendation Lists',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'recommendations',
      type: 'array',
      of: [{type: 'recommendation'}],
      validation: (rule) =>
        rule.custom((items?: Recommendation[]) => {
          const featuredItems = items ? items.filter((item) => item.featured) : []

          if (featuredItems.length > 1) {
            return {
              paths: featuredItems.filter(isKeyedObject).map((item) => [{_key: item._key}]),
              message: 'Only one book can be featured',
            }
          }

          return true
        }),
    }),
  ],
})