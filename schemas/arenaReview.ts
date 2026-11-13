// eslint-disable-next-line import/no-anonymous-default-export
export default {
  name: 'arenaReview',
  title: 'Arena Review',
  type: 'object',
  fields: [
    {
      name: 'transportation',
      title: 'Transportation (getting to the arena)',
      description:
        'How easy is it to get to the arena by transit, car or on foot?',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(10),
    },
    {
      name: 'walkability',
      title: 'Accessibility (easy for everyone to get around?)',
      description:
        'How easy is it for everyone to move around inside: wheelchair users, people with low vision or limited mobility, and families with strollers. Think ramps, elevators, accessible seating, restrooms and clear signs.',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(10),
    },
    {
      name: 'seatComfort',
      title: 'Seat (comfort, width, cup holder)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(10),
    },
    {
      name: 'food',
      title: 'Food Options',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(10),
    },
    {
      name: 'view',
      title: 'Seat Value (was the view worth what we paid?)',
      description:
        'Score the view against the ticket price. A cheap seat with a clean view scores high; a pricey seat that is blocked or far from the action scores low.',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(10),
    },
    {
      name: 'vibes',
      title: 'Arena Vibes (DJ, dancers, silver dancers, activities)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(10),
    },

    {
      name: 'comments',
      title: 'Comments',
      type: 'text',
      validation: (Rule) => Rule.max(370),
    },
  ],
}
