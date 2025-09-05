import { HeartFilledIcon } from '@sanity/icons'
// import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

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
      description: '(Optional) Add a short summary. (use Heading 5 formatting)',
      //validation: (Rule) => Rule.required(),
      validation: (Rule) =>
        Rule.max(120).warning(
          `The description/rating shouldn't be more than 120 characters.`,
        ),

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
        'For best results: Transparent background, Image size should be 850 x 405, webp quality 80%, 60% image resize.',
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
