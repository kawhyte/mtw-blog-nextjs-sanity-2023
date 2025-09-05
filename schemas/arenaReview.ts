// eslint-disable-next-line import/no-anonymous-default-export
export default {
  name: 'arenaReview',
  title: 'Arena Review',
  type: 'object',
  fields: [
    {
      name: 'transportation',
      title: 'Ease of access (via public transport, walkability)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(10),
    },
    {
      name: 'walkability',
      title: 'Ease of access to/within arena',
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
      title: 'View from our seat',
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
      validation: (Rule) => Rule.max(37), // Limit to 37 characters
    },
  ],
}
