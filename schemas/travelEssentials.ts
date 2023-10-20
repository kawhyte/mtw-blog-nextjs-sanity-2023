import { HeartFilledIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

import { description } from './../lib/demo.data'

export default defineType({
  name: 'essential',
  title: 'Travel Essential Picks',
  icon: HeartFilledIcon,
  type: 'document',

  fields: [
    defineField({
      title:
        'Select the Category Name of the item. ( ex. Comfortable shoe, Backpack, socks etc. )',
      description: '',
      name: 'categoryName',
      type: 'string',
      initialValue: 'random',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Shoes', value: 'shoes' },
          { title: 'Organizer', value: 'organizer' },
          //   { title: 'Packing', value: 'packing' },
          { title: 'Security/Protection', value: 'security' },
          { title: 'Miscellaneous Item', value: 'miscellaneous' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description:
        'The name of product ( ex. Presto, Jordan 1, Rei Backpack etc. )',

      //validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'link',
      type: 'url',
      title: 'Link',
      validation: (Rule) => Rule.required(),
      //hidden: ({ parent, value }) => parent?.linkType != 'favorite',
      description: 'External URL - where this item can be found.',
    }),

    // defineField({
    //   name: 'background',
    //   title: 'Background Color',
    //   type: 'string',
    //   description: 'Background color for the image',

    //   //validation: (rule) => rule.required(),
    // }),

   
    defineField({
      name: 'description',
      title: 'Production description blurb',
      description: 'Add a short summary',
      validation: (Rule) => Rule.required(),
      type: 'array',
      of: [{ type: 'block' }],
    }),

    defineField({
      name: 'productImage',
      title: 'Product Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      description:
        'For best results: Transparent background, Image size should be 850 x 405, webp quality 80%, 60% image resize.',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      title:
        'Select the Background color for the image. ( ex. red, blue , green etc. )',
      description: 'Background color for the image',
      name: 'background',
      type: 'string',

      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Yellow 🟡 (#fef9c3)', value: 'bg-yellow-100' },
          { title: 'Green 🟢 (#dcfce7)', value: 'bg-green-100' },
          { title: 'Indigo 🟣 (#e0e7ff)', value: 'bg-indigo-100' },
          { title: 'Pink 👛 (#fce7f3)', value: 'bg-pink-200' },
          { title: 'Blue 🔵 (#dbeafe)', value: 'bg-blue-100' },
          { title: 'Orange 🟠 (#ffedd5)', value: 'bg-orange-100' },
          { title: 'Teal 🍏 (#e6fffa)', value: 'bg-teal-100' },
        ],
        layout: 'radio',
      },
    }),

  ],
})
