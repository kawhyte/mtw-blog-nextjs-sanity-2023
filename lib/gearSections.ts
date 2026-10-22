/** The groups on the Travel Gear page, in page order (also the Studio dropdown) */
export const GEAR_SECTIONS = [
  {
    value: 'tech',
    title: 'Tech & charging',
    blurb: 'Cameras, chargers and the bag that keeps the cables in one place.',
  },
  {
    value: 'room',
    title: 'In the hotel room',
    blurb: 'What we use the minute we check in.',
  },
  {
    value: 'toiletries',
    title: 'Toiletries & health',
    blurb: 'Small things that save a trip.',
  },
  {
    value: 'bags',
    title: 'Bags & shoes',
    blurb: 'For long walks to the arena and everywhere after.',
  },
] as const

export type GearSection = (typeof GEAR_SECTIONS)[number]['value']
