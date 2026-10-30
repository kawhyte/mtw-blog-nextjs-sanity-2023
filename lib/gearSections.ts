/** The groups on the Travel Gear page, in page order (also the Studio dropdown) */
export const GEAR_SECTIONS = [
  {
    value: 'tech',
    title: 'Tech & charging',
    blurb: 'Cameras, chargers and the bag that keeps the cables in one place.',
  },
  {
    // Value kept as "room" so existing items stay in this group
    value: 'room',
    title: 'In the room',
    blurb: 'Hotel room or cabin: what we use the minute we check in.',
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
  {
    value: 'clothes',
    title: 'Clothes & comfort',
    blurb:
      'What we wear on the way there and what keeps us comfy once we land.',
  },
  {
    value: 'documents',
    title: 'Documents & safety',
    blurb: 'Passports, cards and the things that keep them safe.',
  },
] as const

export type GearSection = (typeof GEAR_SECTIONS)[number]['value']

/** The trips an item can be packed for, in button order ("Pack it for" in Studio) */
export const GEAR_TRIPS = [
  { value: 'every', title: 'Every trip' },
  { value: 'weekend', title: 'Weekend' },
  { value: 'daytrip', title: 'Day trip' },
  { value: 'warm', title: 'Warm weather' },
  { value: 'cold', title: 'Cold weather' },
  { value: 'cruise', title: 'Cruise' },
  { value: 'gameday', title: 'Game day' },
  { value: 'flying', title: 'Flying far' },
] as const

export type GearTrip = (typeof GEAR_TRIPS)[number]['value']
