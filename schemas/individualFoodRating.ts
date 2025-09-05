import { defineField, defineType } from 'sanity'

export default defineType({
  type: 'object',
  name: 'individualFoodType',
  description: 'Give a rating 1-5 for each Dish/Drink',
  title: 'IndividualfoodRating',
  // fieldsets: [{ name: "social", title: "Give a rating 1-5 for each item" }],
  // options: {
  // 	collapsible: true, // Makes the whole fieldset collapsible
  // 	collapsed: false, // Defines if the fieldset should be collapsed by default or not
  // 	columns: 3, // Defines a grid for the fields and how many columns it should have
  // },
  initialValue: {
    Dish: 1,
  },

  fields: [
    {
      title: 'Dish/Drink Rating',
      name: 'Dish',
      type: 'number',

      options: {
        list: [
          { title: '5 stars ❤️', value: 5 },
          { title: '4.5 stars', value: 4.5 },
          { title: '4 stars', value: 4 },
          { title: '3.5 stars', value: 3.5 },
          { title: '3 stars', value: 3 },
          { title: '2.5 stars', value: 2.5 },
          { title: '2 stars', value: 2 },
          { title: '1.5 stars', value: 1.5 },
          { title: '1 star', value: 1 },
          { title: '.5 star 🤮', value: 0.5 },
        ],
        layout: 'radio',
      },
    },
  ],
})
