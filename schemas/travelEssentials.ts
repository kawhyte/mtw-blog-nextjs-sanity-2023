import { HeartFilledIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { GEAR_SECTIONS, GEAR_TRIPS } from '../lib/gearSections'
import { PackItForInput } from '../plugins/PackItForInput'
import { getPortableTextLength } from './utils'

const sectionTitle = (value?: string) =>
  GEAR_SECTIONS.find((s) => s.value === value)?.title
const tripTitle = (value: string) =>
  GEAR_TRIPS.find((t) => t.value === value)?.title

export default defineType({
  name: 'essential',
  title: 'Travel Essential Picks',
  icon: HeartFilledIcon,
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Product name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description:
        'Short and real: "Anker 100W charger", not the full Amazon title.',
    }),

    defineField({
      name: 'productImage',
      title: 'Product photo',
      type: 'image',
      validation: (Rule) => Rule.required(),
      description:
        'Square or close to square looks best, but any shape is fine: the page always shows the whole photo. A white or see-through background blends into the card.',
    }),

    defineField({
      name: 'tripType',
      title: 'Pack it for',
      description:
        'Tick every trip this comes on. "Every trip" items show on every list.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: GEAR_TRIPS.map(({ title, value }) => ({ title, value })),
        layout: 'grid',
      },
      components: { input: PackItForInput },
      validation: (Rule) =>
        Rule.min(1).warning('Tick at least one trip so it shows on a list.'),
    }),

    defineField({
      name: 'section',
      title: 'Category',
      type: 'string',
      description: 'Which group it sits in on the page.',
      options: {
        list: GEAR_SECTIONS.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
    }),

    defineField({
      // Stored as "featured" so no data moves; shown as Must pack
      name: 'featured',
      title: 'Must pack?',
      type: 'boolean',
      description: 'Gets the pink "Must pack" tag and goes first in its group.',
      initialValue: false,
    }),

    defineField({
      name: 'whyWePack',
      title: 'Why we pack it',
      type: 'string',
      description:
        'One sentence in our voice, 120 characters max. Shows under the name on the card.',
      validation: (Rule) =>
        Rule.max(120).warning('Keep it short, 120 characters max.'),
    }),

    defineField({
      name: 'description',
      title: 'Old description',
      description:
        'Being replaced by "Why we pack it". Still shows on the card until "Why we pack it" is filled in.',
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
      of: [{ type: 'block', styles: [{ title: 'H5', value: 'h5' }] }],
    }),

    defineField({
      name: 'link',
      type: 'url',
      title: 'Where to buy',
      validation: (Rule) => Rule.required(),
      description:
        'Paste the clean product link. The store name on the button is picked up from it.',
    }),

    defineField({
      name: 'affiliate',
      title: 'Affiliate link?',
      type: 'boolean',
      description:
        'Turn on if we earn from this link; the page adds a short disclosure line.',
      initialValue: false,
    }),

    defineField({
      title: 'Price we paid',
      name: 'price',
      type: 'number',
    }),

    defineField({
      // The old "Skip it" switch: no longer used. Items already set to off
      // stay off the site; kept so no data is lost
      name: 'recommend',
      hidden: true,
      title: 'Would you recommend this product?',
      type: 'boolean',
      initialValue: true,
    }),

    defineField({
      name: 'date',
      title: 'Date added',
      type: 'datetime',
      description: 'Newest first inside each group.',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: 'name',
      section: 'section',
      trips: 'tripType',
      must: 'featured',
      media: 'productImage',
    },
    prepare({ title, section, trips, must, media }) {
      const tripNames = ((trips as string[] | undefined) ?? [])
        .map(tripTitle)
        .filter(Boolean)
      const subtitle = [
        must ? 'Must pack' : null,
        sectionTitle(section),
        tripNames.length ? tripNames.join(', ') : 'No trip yet',
      ]
        .filter(Boolean)
        .join(' · ')
      return { title, subtitle, media }
    },
  },
})
