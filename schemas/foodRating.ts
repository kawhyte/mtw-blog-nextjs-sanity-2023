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
    { title: "1 star", value: 1 },
    { title: ".5 stars", value: 0.5 }, 
  ],
  layout: "radio",
};

export default defineType({
  type: "object",
  name: "foodRating",
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
      title: "Restaurant Location",
      name: "Restaurant_Location",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for Restaurant Location
    },
    {
      title: "Food Flavor & Taste",
      name: "Flavor_and_Taste",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for Food Flavor & Taste
    },
    {
      title: "Food Presentation",
      name: "Presentation_on_Plate",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for Food Presentation
    },
    {
      title: "Restaurant Service/Staff",
      name: "Restaurant_Service",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for Restaurant Service/Staff
    },
    {
      title: "Restaurant Cleanliness",
      name: "Restaurant_Cleanliness",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for Restaurant Cleanliness
    },
    {
      title: "Would we return to this Restaurant?",
      name: "Memorability",
      type: "number",
      options: {
        ...ratingOptions, // Spread the existing options
        list: [
          { title: "5 stars - Fo sho! we would travel for this food 👍🏽", value: 5 },
          { title: "4.5 stars - Yes, but only if we were in the area 😉", value: 4.5 },
          { title: "4 stars", value: 4 },
          { title: "3.5 stars", value: 3.5 },
          { title: "3 stars - Maybe", value: 3 },
          { title: "2.5 stars", value: 2.5 },
          { title: "2 stars - ", value: 2 },
          { title: "1.5 stars - Only if we were starving", value: 1.5 },
          { title: "1 star - Nah 👎🏽", value: 1 },
          { title: ".5 star - F*ck No! 🤬", value: 0.5 }, 
        ],
      },
      initialValue: 3, // Default value for Memorability
    },
    {
      title: "Food Value",
      name: "Food_Value",
      type: "number",
      options: ratingOptions,
      initialValue: 3, // Default value for Food Value
    },
  ],
});