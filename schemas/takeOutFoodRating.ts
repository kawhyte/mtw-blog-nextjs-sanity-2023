import { UserIcon } from '@sanity/icons'
import { defineType } from 'sanity'

const ratingOptions = {
  list: [
    { title: "5 stars", value: 5 },
    { title: "4.5 stars", value: 4.5 },
    { title: "4 stars", value: 4 },
    { title: "3.5 stars", value: 3.5 },
    { title: "3 stars", value: 3 },
    { title: "2.5 stars", value: 2.5 },
    { title: "2 stars", value: 2 },
    { title: "1.5 stars", value: 1.5 },
    { title: "1 stars", value: 1 },
    { title: ".5 stars", value: .5 },
  ],
  layout: "radio",
};

export default defineType({
  type: "object",
  name: "takeOutFoodRating",
  description: "Rating for Food",
  title: "foodRating",
  fieldsets: [{ name: "social", title: "Give a rating 1-5 for each item" }],
  options: {
    collapsible: true,
    collapsed: false,
    columns: 3,
  },

  fields: [
    {
      title: "Food Packaging",
      description:"Quality, eco-friendliness, temperature retention",
      name: "packaging",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for packaging
    },
    {
      title: "Food Flavor & Taste",
      description:"Boldness, balance, freshness, authenticity",
      name: "tasteAndFlavor",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for tasteAndFlavor
    },
    {
      title: "Food Presentation",
      description:'Visual appeal, neatness, care in packaging',
      name: "presentation",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for presentation
    },
    {
      title: "Accuracy",
      description:'Order correctness, missing items',
      name: "accuracy",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for accuracy
    },
    // {
    //   title: "Portion Size, Affordability, value for money",
    //   name: "price",
    //   description:'Value for money, appropriateness',
    //   type: "number",
    //   options: ratingOptions,
    //   initialValue: 3, // Default value for Price
    // },
    {
      title: "Would we order from this Restaurant again?",
      name: "overallSatisfaction",
      description:'Overall Satisfaction: Likelihood to reorder, overall experience',
      type: "number",
      options: {
        ...ratingOptions, // Spread the existing options
        list: [
          { title: "5 stars - Fo sho! Amazing food 👍🏽", value: 5 },
          { title: "4.5 stars - Yes, it was good 😉", value: 4.5 },
          { title: "4 stars", value: 4 },
          { title: "3.5 stars", value: 3.5 },
          { title: "3 stars - Maybe", value: 3 },
          { title: "2.5 stars", value: 2.5 },
          { title: "2 stars - ", value: 2 },
          { title: "1.5 stars - Only if we were starving  ", value: 1.5 },
          { title: "1 star - Nah 👎🏽", value: 1 },
          { title: ".5 star - F*ck No! 🤬", value: .5 },
        ],
      },
      initialValue: 3, // Default value for overallSatisfaction
    },
    {
      title: "Food Value",
      name: "foodValue",
      description:'Price: Affordability, value for money',
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for Food_Value
    },
  ],
});