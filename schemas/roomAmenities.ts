import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  type: 'object',
  name: 'roomAmenities',
  description: 'Amenities available in the room',
  title: 'roomAmenities',

  fieldsets: [{ name: 'social', title: 'Yes or NO  for tech items in room' }],
  options: {
    collapsible: true, // Makes the whole fieldset collapsible
    collapsed: false, // Defines if the fieldset should be collapsed by default or not
    columns: 3, // Defines a grid for the fields and how many columns it should have
  },

  fields: [
    {
      title: 'Coffee machine type',
      name: 'Coffee',
      type: 'string',
      options: {
        list: [
          { title: 'Nespresso', value: 'Nespresso' },
          { title: 'Keurig K-Cafe', value: 'Keurig' },
          { title: 'Mr Coffee', value: 'Mr_Coffee' },
          { title: 'illy coffee', value: 'illy' },
          { title: 'French Press', value: 'French_Press' },
          { title: 'Generic Coffee', value: 'Generic Coffee' },
          { title: 'No Coffee Machine in room', value: 'None' },
        ],
        layout: 'radio',
      },
      initialValue: 'None', // Default value for Coffee
    },

    {
      title: 'Soap',
      name: 'Soap',
      type: 'string',
      options: {
        list: [
          { title: 'Individual Bar Soap', value: 'Bar Soap' },
          { title: 'Wall Mounted Soap', value: 'Wall Mounted' },
        ],
        layout: 'radio',
      },
      initialValue: 'Bar Soap', // Default value for Soap
    },
    {
      title: 'Toothpaste/Toothbrush/Mouthwash available',
      name: 'Toothpaste',
      type: 'string',
      options: {
        list: [
          { title: 'Yes', value: 'Yes' },
          { title: 'No', value: 'No' },
        ],
        layout: 'radio',
      },
      initialValue: 'No', // Default value for Toothpaste
    },
    {
      title: 'Other Amenities Available',
      name: 'Other',
      type: 'string',
      description: 'Needle/sewing kit etc...',
      options: {
        list: [
          { title: 'Yes', value: 'Yes' },
          { title: 'No', value: 'No' },
        ],
        layout: 'radio',
      },
      initialValue: 'No', // Default value for Other
    },

    {
      title: 'Useable Fridge available',
      name: 'Fridge',
      type: 'string',
      options: {
        list: [
          { title: 'Yes', value: 'Yes' },
          { title: 'No', value: 'No' },
        ],
        layout: 'radio',
      },
      initialValue: 'No', // Default value for Fridge
    },
    {
      title: 'Slippers available',
      name: 'Slippers',
      type: 'string',
      options: {
        list: [
          { title: 'Yes', value: 'Yes' },
          { title: 'No', value: 'No' },
        ],
        layout: 'radio',
      },
      initialValue: 'No', // Default value for Slippers
    },
  ],
})
