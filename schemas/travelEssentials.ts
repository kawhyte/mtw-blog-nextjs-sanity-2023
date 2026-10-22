import { HeartFilledIcon } from '@sanity/icons'
// import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

import { GEAR_SECTIONS } from '../lib/gearSections'
import { getPortableTextLength } from './utils'

export default defineType({
  name: 'essential',
  title: 'Travel Essential Picks',
  icon: HeartFilledIcon,
  type: 'document',

  fields: [
    // defineField({
    //   title:
    //     'Select the Category Name of the item. ( ex. Comfortable shoe, Backpack, socks etc. )',
    //   description: '',
    //   name: 'categoryName',
    //   type: 'string',
    //   initialValue: 'random',
    //   validation: (Rule) => Rule.required(),
    //   options: {
    //     list: [
    //       { title: 'Shoes', value: 'shoes' },
    //       { title: 'Organizer', value: 'organizer' },
    //       //   { title: 'Packing', value: 'packing' },
    //       { title: 'Security/Protection', value: 'security' },
    //       { title: 'Miscellaneous Item', value: 'miscellaneous' },
    //     ],
    //     layout: 'radio',
    //   },
    // }),

    // {
    //   title: 'Category Set',
    //   name: 'categorySet',
    //   type: 'array',
    //   of: [{type: 'string'}],
    //   options: {
    //     list: [
    //       {title: 'Building', value: 'building'},
    //       {title: 'Master plan', value: 'masterPlan'},
    //       {title: 'Infrastructure', value: 'infrastructure'},
    //       {title: 'Private Home', value: 'privateHome'}
    //     ]
    //   }
    // },

    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description:
        'The name of product ( ex. Presto, Jordan 1, Rei Backpack etc. )',
    }),

    defineField({
      name: 'section',
      title: 'Section',
      type: 'string',
      description:
        'Which group this item shows under on the Travel Gear page. Aim for 3 to 6 items per section (4 fills one row on a laptop).',
      options: {
        list: GEAR_SECTIONS.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
    }),

    defineField({
      name: 'tripType',
      // Not used on the site any more (empty on every item); kept so no data is lost
      hidden: true,
      title: 'Trip Type',
      description: 'Which trips do you pack this for? (Select all that apply)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'All Trips', value: 'all' },
          { title: 'NBA Games', value: 'nba' },
          { title: 'Cruises', value: 'cruise' },
          { title: 'Day Trips', value: 'daytrip' },
          { title: 'International', value: 'international' },
        ],
        layout: 'grid',
      },
    }),

    defineField({
      name: 'whyWePack',
      // Not used on the site any more (empty on every item); kept so no data is lost
      hidden: true,
      title: 'Why We Pack This',
      type: 'string',
      description:
        'First-person blurb — max 150 chars. e.g. "Never leave for an NBA game without this."',
      validation: (Rule) =>
        Rule.max(150).warning(`Keep it short — 150 characters max.`),
    }),

    defineField({
      name: 'featured',
      // Not used on the site any more (empty on every item); kept so no data is lost
      hidden: true,
      title: 'Featured Pick',
      type: 'boolean',
      description: 'Feature this item at the top of the page.',
      initialValue: false,
    }),

    defineField({
      name: 'link',
      type: 'url',
      title: 'Link',
      validation: (Rule) => Rule.required(),
      //hidden: ({ parent, value }) => parent?.linkType != 'favorite',
      description: 'External URL - where this item can be found.',
    }),

    defineField({
      name: 'date',
      title: 'Date Added',
      type: 'datetime',
      description: 'This date will be used for sorting',

      initialValue: () => new Date().toISOString(),
    }),
    // defineField({
    //   name: 'background',
    //   title: 'Background Color',
    //   type: 'string',
    //   description: 'Background color for the image',

    //   //validation: (rule) => rule.required(),
    // }),

    defineField({
      title: 'Purchase price',
      name: 'price',
      type: 'number',
    }),

    defineField({
      name: 'description',
      title: 'Production description and rating ',
      description:
        '(Optional) Add a short summary — aim for 120 characters max. (Use Heading 5 formatting)',
      validation: (Rule) =>
        Rule.custom((portableTextValue) => {
          const textLength = getPortableTextLength(portableTextValue as any[])
          const limit = 120
          if (textLength > limit) {
            return `Description exceeds ${limit} characters (${textLength}/${limit})`
          }
          return true
        }).warning(),

      type: 'array',
      of: [
        {
          type: 'block',

          // Only allow these block styles
          styles: [{ title: 'H5', value: 'h5' }],
        },
      ],
    }),

    // defineField({
    //   name: 'textRating',
    //   title: 'Production rating',
    //   description: 'Add a short review. (use Heading 5 formatting)',
    //   validation: (Rule) =>
    //     Rule.max(120).warning(
    //       `The production rating shouldn't be more than 120 characters.`
    //     ),

    //   type: 'array',
    //   of: [
    //     {
    //       type: 'block',

    //       // Only allow these block styles
    //       styles: [{ title: 'H5', value: 'h5' }],
    //     },
    //   ],
    // }),
    defineField({
      title: 'Would you recommend this product?',
      name: 'recommend',
      type: 'boolean',
      description: 'Set to true if you like the item',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'productImage',
      title: 'Product Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      description:
        'Product image — displayed in a square card. Upload at 800 × 800 px (square). PNG with transparent background preferred; WebP 80% or JPEG 85% otherwise.',
      options: {
        hotspot: true,
      },
    }),

    // defineField({
    //   title:
    //     'Select the Background color for the image. ( ex. red, blue , green etc. )',
    //   description: 'Background color for the image',
    //   name: 'background',
    //   type: 'string',

    //   validation: (Rule) => Rule.required(),
    //   options: {
    //     list: [
    //       { title: 'Blue Gradient Background 🔵', value: 'bg-linear-to-r from-blue-200 via-pink-50 to-green-50' },
    //       { title: 'Green Gradient Background 🟢', value: 'bg-linear-to-r from-green-200 via-indigo-200 to-pink-50' },
    //       { title: 'Indigo Gradient Background 🟣', value: 'bg-linear-to-r from-indigo-200 via-pink-200 to-yellow-50' },
    //       //{ title: 'Pink 👛 (#fce7f3)', value: 'bg-pink-50' },
    //       //{ title: 'Gray 🩶  (#dbeafe)', value: 'bg-gray-100' },
    //       // { title: 'Orange 🟠 (#ffedd5)', value: 'bg-orange-50' },
    //       // { title: 'Teal 🍏 (#e6fffa)', value: 'bg-teal-100' },
    //     ],
    //     layout: 'radio',
    //   },
    // }),
  ],
})
