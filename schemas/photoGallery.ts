// schemas/objects/photoGallery.js
import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons' // Optional: for a nice icon

export default defineType({
  name: 'photoGallery',
  title: 'Photo Gallery Section',
  type: 'object',
  icon: ImageIcon, // Optional icon
  fields: [
    defineField({
      name: 'mainImage',
      title: 'Main Gallery Image',
      type: 'image',
      description: 'The primary, large image for the gallery display. Recommended size: 732x480 pixels.', // <-- Updated Description
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'REQUIRED: Describe the image for accessibility and SEO.',
          validation: (Rule) => Rule.required().error('Alt text is required.'),
          // options: {
          //   isHighlighted: true,
          // },
        }),
      ],
      // validation: Rule => Rule.required().error('The main gallery image is required.') // Keep if main image is mandatory for the section
    }),
    defineField({
      name: 'otherImages',
      title: 'Other Gallery Images (Exactly 4)',
      type: 'array',
      description: 'REQUIRED: The four smaller images for the gallery display. Add exactly four. Recommended size for each: 362x236 pixels.', // <-- Updated Description
      of: [
        {
          type: 'image',
          title: 'Gallery Image', // Added title for clarity when adding array items
           description: 'Recommended size: 362x236 pixels.', // <-- Added Description here too
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'REQUIRED: Describe the image for accessibility and SEO.',
              validation: (Rule) => Rule.required().error('Alt text is required for each image.'),
              // options: {
              //   isHighlighted: true,
              // },
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(4).max(4).error('You must provide exactly four additional images.'),
    }),
  ],
})