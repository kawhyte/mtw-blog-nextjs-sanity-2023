import { defineField, defineType } from 'sanity'

export default defineType({
  type: 'object',
  name: 'individualFoodType',
  description: 'Give a rating 0–10 for each Dish/Drink',
  title: 'IndividualfoodRating',
  initialValue: {
    Dish: 8,
  },

  fields: [
    {
      title: 'Dish/Drink Rating (0–10)',
      name: 'Dish',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(10),
    },
  ],
})
