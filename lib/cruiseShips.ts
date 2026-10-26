// Cruise lines and their ocean ships, for the Cruise Review dropdowns in Studio.
// Hand-maintained (fleets as of 2026): add new ships here when they launch.
// Tiers follow the MTW cruise tier framework: the line's baseline tier.

export type LineTier = 'contemporary' | 'premium' | 'upscale' | 'luxury'

export interface CruiseLine {
  value: string
  title: string
  tier: LineTier
  /** Name used in titles when it differs from `title` */
  titlePrefix?: string
  ships: string[]
}

export const OTHER = 'other'

// Common names across lines; anything else goes in "Other"
export const CABIN_TYPES = [
  'Interior',
  'Oceanview',
  'Balcony',
  'Mini-Suite',
  'Junior Suite',
  'Suite',
  'Studio',
]

export const CRUISE_LINES: CruiseLine[] = [
  {
    value: 'azamara',
    title: 'Azamara',
    tier: 'upscale',
    ships: ['Azamara Journey', 'Azamara Onward', 'Azamara Pursuit', 'Azamara Quest'],
  },
  {
    value: 'carnival',
    title: 'Carnival',
    tier: 'contemporary',
    ships: [
      'Carnival Adventure', 'Carnival Breeze', 'Carnival Celebration', 'Carnival Conquest',
      'Carnival Dream', 'Carnival Elation', 'Carnival Encounter', 'Carnival Firenze',
      'Carnival Freedom', 'Carnival Glory', 'Carnival Horizon', 'Carnival Jubilee',
      'Carnival Legend', 'Carnival Liberty', 'Carnival Luminosa', 'Carnival Magic',
      'Carnival Miracle', 'Carnival Panorama', 'Carnival Paradise', 'Carnival Pride',
      'Carnival Radiance', 'Carnival Splendor', 'Carnival Spirit', 'Carnival Sunrise',
      'Carnival Sunshine', 'Carnival Valor', 'Carnival Venezia', 'Carnival Vista',
      'Mardi Gras',
    ],
  },
  {
    value: 'celebrity',
    title: 'Celebrity Cruises',
    tier: 'premium',
    ships: [
      'Celebrity Apex', 'Celebrity Ascent', 'Celebrity Beyond', 'Celebrity Constellation',
      'Celebrity Eclipse', 'Celebrity Edge', 'Celebrity Equinox', 'Celebrity Flora',
      'Celebrity Infinity', 'Celebrity Millennium', 'Celebrity Reflection',
      'Celebrity Silhouette', 'Celebrity Solstice', 'Celebrity Summit', 'Celebrity Xcel',
    ],
  },
  {
    value: 'costa',
    title: 'Costa',
    tier: 'contemporary',
    ships: [
      'Costa Deliziosa', 'Costa Diadema', 'Costa Fascinosa', 'Costa Favolosa',
      'Costa Fortuna', 'Costa Pacifica', 'Costa Serena', 'Costa Smeralda', 'Costa Toscana',
    ],
  },
  {
    value: 'crystal',
    title: 'Crystal',
    tier: 'luxury',
    ships: ['Crystal Serenity', 'Crystal Symphony'],
  },
  {
    value: 'cunard',
    title: 'Cunard',
    tier: 'premium',
    ships: ['Queen Anne', 'Queen Elizabeth', 'Queen Mary 2', 'Queen Victoria'],
  },
  {
    value: 'disney',
    title: 'Disney Cruise Line',
    tier: 'premium',
    ships: [
      'Disney Adventure', 'Disney Destiny', 'Disney Dream', 'Disney Fantasy',
      'Disney Magic', 'Disney Treasure', 'Disney Wish', 'Disney Wonder',
    ],
  },
  {
    value: 'holland-america',
    title: 'Holland America',
    tier: 'premium',
    ships: [
      'Eurodam', 'Koningsdam', 'Nieuw Amsterdam', 'Nieuw Statendam', 'Noordam',
      'Oosterdam', 'Rotterdam', 'Volendam', 'Westerdam', 'Zaandam', 'Zuiderdam',
    ],
  },
  {
    value: 'msc',
    title: 'MSC',
    tier: 'contemporary',
    ships: [
      'MSC Armonia', 'MSC Bellissima', 'MSC Divina', 'MSC Euribia', 'MSC Fantasia',
      'MSC Grandiosa', 'MSC Lirica', 'MSC Magnifica', 'MSC Meraviglia', 'MSC Musica',
      'MSC Opera', 'MSC Orchestra', 'MSC Poesia', 'MSC Preziosa', 'MSC Seascape',
      'MSC Seashore', 'MSC Seaside', 'MSC Seaview', 'MSC Sinfonia', 'MSC Splendida',
      'MSC Virtuosa', 'MSC World America', 'MSC World Europa',
    ],
  },
  {
    value: 'norwegian',
    title: 'Norwegian (NCL)',
    titlePrefix: 'Norwegian',
    tier: 'contemporary',
    ships: [
      'Norwegian Aqua', 'Norwegian Bliss', 'Norwegian Breakaway', 'Norwegian Dawn',
      'Norwegian Encore', 'Norwegian Epic', 'Norwegian Escape', 'Norwegian Gem',
      'Norwegian Getaway', 'Norwegian Jade', 'Norwegian Jewel', 'Norwegian Joy',
      'Norwegian Luna', 'Norwegian Pearl', 'Norwegian Prima', 'Norwegian Sky',
      'Norwegian Spirit', 'Norwegian Star', 'Norwegian Sun', 'Norwegian Viva',
      'Pride of America',
    ],
  },
  {
    value: 'oceania',
    title: 'Oceania',
    tier: 'upscale',
    ships: ['Allura', 'Insignia', 'Marina', 'Nautica', 'Regatta', 'Riviera', 'Sirena', 'Vista'],
  },
  {
    value: 'princess',
    title: 'Princess',
    tier: 'premium',
    ships: [
      'Caribbean Princess', 'Coral Princess', 'Crown Princess', 'Diamond Princess',
      'Discovery Princess', 'Emerald Princess', 'Enchanted Princess', 'Grand Princess',
      'Island Princess', 'Majestic Princess', 'Regal Princess', 'Royal Princess',
      'Ruby Princess', 'Sapphire Princess', 'Sky Princess', 'Star Princess', 'Sun Princess',
    ],
  },
  {
    value: 'regent',
    title: 'Regent Seven Seas',
    titlePrefix: 'Regent',
    tier: 'luxury',
    ships: [
      'Seven Seas Explorer', 'Seven Seas Grandeur', 'Seven Seas Mariner',
      'Seven Seas Navigator', 'Seven Seas Prestige', 'Seven Seas Splendor',
      'Seven Seas Voyager',
    ],
  },
  {
    value: 'royal-caribbean',
    title: 'Royal Caribbean',
    tier: 'contemporary',
    ships: [
      'Adventure of the Seas', 'Allure of the Seas', 'Anthem of the Seas',
      'Brilliance of the Seas', 'Enchantment of the Seas', 'Explorer of the Seas',
      'Freedom of the Seas', 'Grandeur of the Seas', 'Harmony of the Seas',
      'Icon of the Seas', 'Independence of the Seas', 'Jewel of the Seas',
      'Legend of the Seas', 'Liberty of the Seas', 'Mariner of the Seas',
      'Navigator of the Seas', 'Oasis of the Seas', 'Odyssey of the Seas',
      'Ovation of the Seas', 'Quantum of the Seas', 'Radiance of the Seas',
      'Rhapsody of the Seas', 'Serenade of the Seas', 'Spectrum of the Seas',
      'Star of the Seas', 'Symphony of the Seas', 'Utopia of the Seas',
      'Vision of the Seas', 'Voyager of the Seas', 'Wonder of the Seas',
    ],
  },
  {
    value: 'seabourn',
    title: 'Seabourn',
    tier: 'luxury',
    ships: [
      'Seabourn Encore', 'Seabourn Ovation', 'Seabourn Pursuit', 'Seabourn Quest',
      'Seabourn Sojourn', 'Seabourn Venture',
    ],
  },
  {
    value: 'silversea',
    title: 'Silversea',
    tier: 'luxury',
    ships: [
      'Silver Cloud', 'Silver Dawn', 'Silver Endeavour', 'Silver Moon', 'Silver Muse',
      'Silver Nova', 'Silver Origin', 'Silver Ray', 'Silver Shadow', 'Silver Spirit',
      'Silver Whisper', 'Silver Wind',
    ],
  },
  {
    value: 'viking',
    title: 'Viking Ocean Cruises',
    tier: 'upscale',
    ships: [
      'Viking Jupiter', 'Viking Mars', 'Viking Neptune', 'Viking Octantis', 'Viking Orion',
      'Viking Polaris', 'Viking Saturn', 'Viking Sea', 'Viking Sky', 'Viking Star',
      'Viking Vela', 'Viking Venus', 'Viking Vesta',
    ],
  },
  {
    value: 'virgin',
    title: 'Virgin Voyages',
    tier: 'upscale',
    ships: ['Brilliant Lady', 'Resilient Lady', 'Scarlet Lady', 'Valiant Lady'],
  },
]

export const findLine = (value?: string) => CRUISE_LINES.find((l) => l.value === value)

/**
 * "[Cruise Line] [Ship] [Cabin Type] [Cabin Number] Review ([Month Year])", the title pattern from
 * the MTW cruise review template. Parts that aren't filled in yet are skipped.
 */
export function buildCruiseTitle(doc: {
  cruiseLine?: string
  shipName?: string
  cabinType?: string
  cabinNumber?: string
  sailingDate?: string
}): string {
  if (!doc.shipName) return ''
  const line = findLine(doc.cruiseLine)
  // Ship names like "Carnival Vista" or "Sun Princess" already include the line
  const prefix = line ? (line.titlePrefix ?? line.title) : ''
  const lineName = prefix && !doc.shipName.includes(prefix.split(' ')[0]) ? prefix : ''
  const when = doc.sailingDate
    ? new Date(`${doc.sailingDate}T12:00:00`).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : ''
  return [
    lineName,
    doc.shipName,
    doc.cabinType,
    doc.cabinNumber?.trim().toUpperCase(),
    'Review',
    when && `(${when})`,
  ]
    .filter(Boolean)
    .join(' ')
}

/** "Jan 3 to Jan 7, 2026" from the first day and the number of nights */
export function formatSailingRange(sailingDate?: string, nights?: number): string {
  if (!sailingDate || !nights) return ''
  const start = new Date(`${sailingDate}T12:00:00`)
  if (isNaN(start.getTime())) return ''
  const end = new Date(start)
  end.setDate(end.getDate() + nights)
  const sameYear = start.getFullYear() === end.getFullYear()
  const short = { month: 'short', day: 'numeric' } as const
  const long = { ...short, year: 'numeric' } as const
  return `${start.toLocaleDateString('en-US', sameYear ? short : long)} to ${end.toLocaleDateString('en-US', long)}`
}

// Suite and cabin perk programs by line ("ship within a ship" enclaves and
// perk tiers). Names only; the perks themselves are looked up per review
// because lines change them often.
export const PERK_PROGRAMS: Record<string, string[]> = {
  'royal-caribbean': [
    'Royal Suite Class: Star Class',
    'Royal Suite Class: Sky Class',
    'Royal Suite Class: Sea Class',
  ],
  celebrity: ['The Retreat (suites)', 'AquaClass', 'Concierge Class'],
  virgin: ['RockStar Quarters: Mega RockStar', 'RockStar Quarters: RockStar'],
  norwegian: ['The Haven', 'Club Balcony Suite'],
  msc: ['MSC Yacht Club', 'Aurea Experience'],
  princess: ['Reserve Collection', 'Suites'],
  'holland-america': ['Pinnacle Suite', 'Neptune Suite', 'Signature Suite'],
  cunard: ['Queens Grill', 'Princess Grill', 'Britannia Club'],
  disney: ['Concierge Level'],
  carnival: ['Suites', 'Havana', 'Cloud 9 Spa'],
}

/** Standard cabin with no perk program */
export const NO_PROGRAM = 'none'
