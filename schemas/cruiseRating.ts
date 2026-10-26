import { defineField, defineType } from 'sanity'

const score = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'number',
    validation: (Rule) => Rule.required().min(0).max(10),
    initialValue: 6,
  })

// Weights live in lib/ratingWeights.ts (CRUISE_WEIGHTS)
export default defineType({
  name: 'cruiseRating',
  type: 'object',
  title: 'Cruise Ratings',
  description: 'Rating for the CRUISE (0 to 10 scale).',
  options: {
    collapsible: true,
    collapsed: false,
    columns: 2,
  },
  fields: [
    score('Cabin', 'Cabin & Comfort (20%)'),
    score('Dining', 'Dining & Drinks (20%)'),
    score('Service', 'Service & Operations (15%)', 'Includes embarkation and debarkation.'),
    score('Ship_Flow', 'Ship Flow & Crowds (15%)', 'Lines, crowding, how easy it was to find a seat.'),
    score('Entertainment', 'Entertainment & Activities (10%)'),
    score('Itinerary', 'Itinerary & Ports (10%)'),
    score('Value', 'Value (10%)', 'Was the total you paid worth it?'),
    defineField({
      name: 'Sports_Fan',
      title: 'Sports Fan Score (not in overall)',
      description:
        'Watching games, courts, track and gym. Shown as its own badge and left out of the overall score. Leave blank to hide the badge.',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(10),
    }),
  ],
})
