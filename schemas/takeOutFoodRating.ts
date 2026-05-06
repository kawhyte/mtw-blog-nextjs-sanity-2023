import { defineField, defineType } from 'sanity'

export default defineType({
  type: 'object',
  name: 'takeOutFoodRating',
  description: 'Rating for Takeout Food (0–10 scale)',
  title: 'foodRating',
  fieldsets: [{ name: 'social', title: 'Give a rating 0–10 for each item' }],
  options: {
    collapsible: true,
    collapsed: false,
    columns: 3,
  },
  fields: [
    defineField({
      title: 'Food Packaging',
      description: 'Quality, eco-friendliness, temperature retention',
      name: 'packaging',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Food Flavor & Taste',
      description: 'Boldness, balance, freshness, authenticity',
      name: 'tasteAndFlavor',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Food Presentation',
      description: 'Visual appeal, neatness, care in packaging',
      name: 'presentation',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Accuracy',
      description: 'Order correctness, missing items',
      name: 'accuracy',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Would we order from this Restaurant again?',
      description:
        'Overall Satisfaction: Likelihood to reorder, overall experience (10 = Absolutely / 0 = Never)',
      name: 'overallSatisfaction',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
    defineField({
      title: 'Food Value',
      description: 'Price: Affordability, value for money',
      name: 'foodValue',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
      initialValue: 6,
    }),
  ],
})
