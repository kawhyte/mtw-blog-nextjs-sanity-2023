import { defineField, defineType } from 'sanity'

export default defineType({
  type: 'object',
  name: 'foodRating',
  description: 'Rating for Food (0–10 scale)',
  title: 'foodRating',
  fieldsets: [{ name: 'social', title: 'Give a rating 0–10 for each item' }],
  options: {
    collapsible: true,
    collapsed: false,
    columns: 3,
  },
  fields: [
    defineField({
      title: 'Restaurant Location',
      name: 'Restaurant_Location',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Food Flavor & Taste',
      name: 'Flavor_and_Taste',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Food Presentation',
      name: 'Presentation_on_Plate',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Restaurant Service/Staff',
      name: 'Restaurant_Service',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Restaurant Cleanliness',
      name: 'Restaurant_Cleanliness',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Would we return to this Restaurant?',
      description: '10 = Absolutely / 0 = Never again',
      name: 'Memorability',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Food Value',
      name: 'Food_Value',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
  ],
})
