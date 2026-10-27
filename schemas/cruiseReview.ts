import { EarthGlobeIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { DROVE_AND_PARKED } from '../lib/cruisePorts'
import { CRUISE_LINES, OTHER } from '../lib/cruiseShips'
import { AltTextGeneratorInput } from '../plugins/AltTextGeneratorInput'
import { CabinDetailsInput } from '../plugins/CabinDetailsInput'
import { CabinPerksInput, PerkProgramInput } from '../plugins/CabinPerksInput'
import {
  CabinTypeInput,
  CruiseLineInput,
  CruiseTitleInput,
  NightsInput,
  ShipNameInput,
} from '../plugins/CruiseSelectInputs'
import { RelatedReviewsInput, SuggestTagsInput } from '../plugins/CruiseSeoInputs'
import { ItineraryFillerInput } from '../plugins/ItineraryFillerInput'
import {
  AirportInput,
  BoardingTimeInput,
  CheckInWindowInput,
  DeparturePortInput,
  FlightTimeInput,
  MinutesToBoardInput,
  OffShipTimeInput,
  TerminalInput,
  TransferInput,
} from '../plugins/PickOrTypeInput'
import { SeoExcerptGeneratorInput } from '../plugins/SeoExcerptGeneratorInput'
import { ShipFactsFetcherInput } from '../plugins/ShipFactsFetcherInput'
import {
  galleryField,
  heroPhotosField,
  negativesField,
  positivesField,
  verdictField,
} from './sharedReviewFields'

/**
 * Cruise review: one document per SHIP. Repeat sailings on the same ship go
 * in `sailings` instead of a new page, so we never compete with ourselves in search.
 */

const GALLERY_ARGS: Parameters<typeof galleryField> = [
  'Choose a category. Cabin: bed, bathroom, balcony. Dining: restaurants and dishes. Ship: pools, decks, public spaces. Entertainment: shows and activities. Sports & Fitness: courts, track, gym, sports bar. Ports: shore days and excursions. Additional Photos: anything else.',
  [
    { title: 'Cabin', value: 'cabin' },
    { title: 'Dining', value: 'dining' },
    { title: 'Ship & Public Spaces', value: 'ship' },
    { title: 'Entertainment & Activities', value: 'entertainment' },
    { title: 'Sports & Fitness', value: 'sports-fitness' },
    { title: 'Ports & Excursions', value: 'ports' },
    { title: 'Additional Photos', value: 'other' },
  ],
  {
    cabin: 'Cabin',
    dining: 'Dining',
    ship: 'Ship',
    entertainment: 'Entertainment',
    'sports-fitness': 'Sports & Fitness',
    ports: 'Ports',
    other: 'Additional Photos',
  },
]

const WORTH_IT_OPTIONS = [
  { title: 'Yes, worth it', value: 'yes' },
  { title: 'Worth it once', value: 'once' },
  { title: 'Skip it', value: 'skip' },
]

const BOOKED_WHEN_OPTIONS = [
  { title: 'Before the cruise', value: 'pre-cruise' },
  { title: 'Onboard', value: 'onboard' },
]

const rating = (name = 'rating', title = 'Rating (0 to 10)') =>
  defineField({
    name,
    title,
    type: 'number',
    validation: (Rule) => Rule.min(0).max(10),
  })

const textList = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    of: [{ type: 'text', rows: 2 }],
  })

/** A one-click choice shown as a row of radio buttons */
// Wi-Fi details stay hidden until we say we used it
const noWifi = ({ parent }: { parent?: { usage?: string } }) =>
  !parent?.usage || parent.usage === 'none'

// USB details only matter once we say the room has USB ports
const noUsb = ({ parent }: { parent?: { usb?: string } }) => parent?.usb !== 'yes'

/** Several one-click choices shown as checkboxes */
const multi = (name: string, title: string, options: [string, string][]) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [{ type: 'string' }],
    // No grid layout: in the half-width cabin columns a grid squeezed each
    // label to one word per line, so one checkbox per line reads better
    options: {
      list: options.map(([t, value]) => ({ title: t, value })),
    },
  })

const pick = (name: string, title: string, options: [string, string][]) =>
  defineField({
    name,
    title,
    type: 'string',
    options: {
      list: options.map(([t, value]) => ({ title: t, value })),
      layout: 'radio',
      direction: 'horizontal',
    },
  })

const tagList = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'array',
    of: [{ type: 'string' }],
    options: { layout: 'tags' },
  })

export default defineType({
  name: 'cruiseReview',
  title: 'Cruise Review',
  icon: EarthGlobeIcon,
  type: 'document',

  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'ship', title: 'Ship & Vibe' },
    { name: 'cabin', title: 'Cabin' },
    { name: 'cost', title: 'Cost' },
    { name: 'dining', title: 'Dining' },
    { name: 'activities', title: 'Activities & Sports' },
    { name: 'itinerary', title: 'Ports & Logistics' },
    { name: 'verdict', title: 'Scores & Verdict' },
    { name: 'seo', title: 'SEO & Links' },
  ],

  fieldsets: [
    {
      name: 'cardImage',
      title: 'Card & Share Image (optional)',
      options: { collapsible: true, collapsed: true },
    },
  ],

  fields: [
    // ── Overview ────────────────────────────────────────────────
    defineField({
      name: 'cruiseLine',
      title: 'Cruise Line',
      type: 'string',
      group: 'overview',
      description: 'Pick the line first: it fills Line Tier and the ship list.',
      options: {
        list: [
          ...CRUISE_LINES.map(({ title, value }) => ({ title, value })),
          { title: 'Other', value: OTHER },
        ],
      },
      components: { input: CruiseLineInput },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'shipName',
      title: 'Ship',
      type: 'string',
      group: 'overview',
      description: 'Not in the list? Choose "Other" and type the name.',
      components: { input: ShipNameInput },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'cabinType',
      title: 'Cabin Type',
      type: 'string',
      group: 'overview',
      description: 'Used in the title. Not in the list? Choose "Other" and type it.',
      components: { input: CabinTypeInput },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'cabinNumber',
      title: 'Cabin Number',
      type: 'string',
      group: 'overview',
      description: 'Used in the title, e.g. 12216A',
    }),

    defineField({
      name: 'lineTier',
      title: 'Line Tier',
      type: 'string',
      group: 'overview',
      description: 'Filled in from the cruise line. Used for the listing filter.',
      options: {
        list: [
          { title: 'Contemporary (mass market, e.g. Royal Caribbean, Carnival)', value: 'contemporary' },
          { title: 'Premium (e.g. Celebrity, Princess, Holland America)', value: 'premium' },
          { title: 'Upscale / Boutique-Lite (e.g. Virgin, Oceania, Azamara)', value: 'upscale' },
          { title: 'Luxury (e.g. Regent, Silversea, Seabourn)', value: 'luxury' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'sailingDate',
      title: 'Sailing Date',
      type: 'date',
      group: 'overview',
      description: 'First day of the sailing you reviewed.',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'nights',
      title: 'Number of Nights',
      type: 'number',
      group: 'overview',
      components: { input: NightsInput },
      validation: (rule) => rule.required().min(1).integer(),
    }),

    defineField({
      name: 'itineraryName',
      title: 'Itinerary Name',
      type: 'string',
      group: 'overview',
      description: 'e.g. 6-Night Mexican Riviera (Cabo Overnight & Ensenada)',
    }),

    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { title: 'Mexican Riviera / Baja', value: 'mexico' },
          { title: 'Caribbean', value: 'caribbean' },
          { title: 'Bahamas', value: 'bahamas' },
          { title: 'Alaska', value: 'alaska' },
          { title: 'Hawaii', value: 'hawaii' },
          { title: 'Mediterranean', value: 'mediterranean' },
          { title: 'Northern Europe', value: 'northern-europe' },
          { title: 'Asia', value: 'asia' },
          { title: 'Australia & South Pacific', value: 'australia' },
          { title: 'Pacific Coast', value: 'pacific-coast' },
          { title: 'Transatlantic / Repositioning', value: 'repositioning' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'departurePort',
      title: 'Departure Port',
      type: 'string',
      group: 'overview',
      description: 'Pick from the list, or choose "Other" and type it. Drives the airport and terminal lists.',
      components: { input: DeparturePortInput },
      validation: (rule) => rule.required(),
    }),

    defineField({ ...heroPhotosField(...GALLERY_ARGS), group: 'overview' }),

    defineField({ ...galleryField(...GALLERY_ARGS), group: 'overview' }),

    defineField({
      name: 'coverImage',
      fieldset: 'cardImage',
      group: 'overview',
      title: 'Card & Share Image',
      type: 'image',
      description:
        'Used on listing cards and when the page is shared. Optional: leave empty to use Hero Photo #1. Upload at 2400 × 1600 px (3:2 landscape), WebP 85% or JPEG 88%.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the image for SEO and accessibility.',
          components: { input: AltTextGeneratorInput },
        }),
      ],
    }),

    defineField({
      name: 'youtube',
      title: 'YouTube Video URL (optional)',
      type: 'string',
      group: 'overview',
      description: 'e.g. the cabin tour.',
    }),

    defineField({
      name: 'verdictHeadline',
      title: 'TL;DR (one sentence)',
      type: 'string',
      group: 'overview',
      description:
        'The one-line takeaway shown at the top of the page. The full Verdict goes on the Scores & Verdict tab.',
      validation: (Rule) =>
        Rule.max(160).warning('Keep it to one short sentence (under 160 characters)'),
    }),

    // Title and slug near the end of Overview, so they are already built from the fields above
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'overview',
      description:
        'Pattern: [Cruise Line] [Ship] [Cabin Type] [Cabin Number] Review ([Month Year]). Fills itself in as you complete those fields. Typing here turns that off.',
      components: { input: CruiseTitleInput },
      validation: (rule) => rule.required(),
    }),

    defineField({
      // Set when the title is typed by hand, so it stops following the pattern
      name: 'titleEdited',
      type: 'boolean',
      hidden: true,
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      description: 'Ship level, e.g. "quantum-of-the-seas-review". Keep cabin numbers out of the URL.',
      options: {
        source: 'shipName',
        slugify: (input: string) =>
          `${input}-review`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .slice(0, 96),
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'disclosure',
      title: 'Disclosure',
      type: 'text',
      rows: 3,
      group: 'overview',
      initialValue:
        'This sailing was self-funded. We received no comps, upgrades or promotional considerations. All opinions are our own. Some links may be affiliate links that support meetthewhytes.com at no extra cost to you.',
    }),

    // ── Ship & Vibe ─────────────────────────────────────────────
    defineField({
      name: 'shipFacts',
      title: 'Ship Facts',
      type: 'object',
      group: 'ship',
      description: 'Use Fetch Ship Facts to fill these in from Google Search, then check them.',
      components: { input: ShipFactsFetcherInput },
      options: { collapsible: true, collapsed: false, columns: 2 },
      fields: [
        defineField({ name: 'shipClass', title: 'Ship Class', type: 'string', description: 'e.g. Quantum Class' }),
        defineField({ name: 'yearBuilt', title: 'Year Built', type: 'number' }),
        defineField({ name: 'lastRefurb', title: 'Last Refurbished (year)', type: 'number' }),
        defineField({ name: 'grossTonnage', title: 'Gross Tonnage', type: 'number' }),
        defineField({ name: 'guestsDouble', title: 'Guests (double occupancy)', type: 'number', description: 'The normal capacity, used for the space ratio.' }),
        defineField({ name: 'guestsMax', title: 'Guests (max capacity)', type: 'number' }),
        defineField({ name: 'crew', title: 'Crew', type: 'number' }),
        defineField({ name: 'decks', title: 'Guest Decks', type: 'number' }),
        tagList('sisterShips', 'Sister Ships'),
        defineField({ name: 'sisterDifferences', title: 'How It Differs From Its Sisters', type: 'text', rows: 3 }),
        defineField({
          name: 'factsChecked',
          title: 'Facts checked',
          type: 'boolean',
          description: 'Tick once you have checked the facts against their sources. Ship facts stay off the page until this is ticked.',
          initialValue: false,
        }),
        defineField({
          // Filled by Fetch Ship Facts, shown in the panel above the fields
          name: 'factSources',
          title: 'Fact Sources',
          type: 'array',
          hidden: true,
          of: [
            defineArrayMember({
              type: 'object',
              name: 'factSource',
              fields: [
                defineField({ name: 'field', type: 'string' }),
                defineField({ name: 'sourceCount', type: 'number' }),
                defineField({
                  name: 'sources',
                  type: 'array',
                  of: [
                    defineArrayMember({
                      type: 'object',
                      name: 'source',
                      fields: [
                        defineField({ name: 'title', type: 'string' }),
                        defineField({ name: 'url', type: 'url' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'vibe',
      title: 'Vibe, Dress Code & Crowd',
      type: 'object',
      group: 'ship',
      description: 'All optional. Anything left blank is hidden on the page.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'dressCodeStyle',
          title: 'Dress Code',
          type: 'string',
          options: {
            list: [
              { title: 'No dress code, wear what you want (e.g. Virgin)', value: 'none' },
              { title: 'Relaxed, with optional dress-up nights (e.g. Dress Your Best)', value: 'relaxed' },
              { title: 'Formal nights expected (e.g. Cunard)', value: 'formal' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          // What packers ask: how many nice outfits to bring
          name: 'dressUpNights',
          title: 'Dress-Up or Theme Nights',
          type: 'string',
          options: {
            list: [
              { title: '1 night', value: '1' },
              { title: '2 nights', value: '2' },
              { title: '3 or more nights', value: '3+' },
              { title: 'Every night', value: 'all' },
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          hidden: ({ parent }) => parent?.dressCodeStyle === 'none',
        }),
        defineField({
          name: 'dressUpEnforced',
          title: 'Was It Enforced?',
          type: 'string',
          options: {
            list: [
              { title: 'Yes, they checked', value: 'yes' },
              { title: 'No, nobody checked', value: 'no' },
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          hidden: ({ parent }) => !parent?.dressUpNights || parent?.dressCodeStyle === 'none',
        }),
        defineField({
          name: 'dressCodeNote',
          title: 'Dress Code Note (optional)',
          type: 'string',
          description: 'Only if useful, e.g. "Night 2 is Dress Your Best" or "Scarlet Night: wear red."',
        }),
        defineField({
          name: 'crowd',
          title: 'Who Was Onboard',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Young families', value: 'young-families' },
              { title: 'Teens', value: 'teens' },
              { title: 'Couples', value: 'couples' },
              { title: 'Retirees', value: 'retirees' },
              { title: 'Big groups', value: 'groups' },
            ],
            layout: 'grid',
          },
        }),
        defineField({
          name: 'crowdAge',
          title: 'Main Age Group',
          type: 'string',
          options: {
            list: [
              { title: 'Mostly under 40', value: 'under-40' },
              { title: 'Mixed ages', value: 'mixed' },
              { title: 'Mostly over 55', value: 'over-55' },
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
        }),
        defineField({
          name: 'nightlife',
          title: 'Evenings After 9:30 PM',
          type: 'string',
          options: {
            list: [
              { title: 'Quiet', value: 'quiet' },
              { title: 'Some nightlife', value: 'some' },
              { title: 'Lively', value: 'lively' },
              { title: 'Party all night', value: 'party' },
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
        }),
      ],
    }),

    // ── Cabin ───────────────────────────────────────────────────
    defineField({
      name: 'cabin',
      title: 'Cabin',
      type: 'object',
      group: 'cabin',
      components: { input: CabinDetailsInput },
      options: { collapsible: true, collapsed: false, columns: 2 },
      fields: [
        defineField({ name: 'deck', title: 'Deck', type: 'number' }),
        defineField({
          name: 'position',
          title: 'Location on Ship',
          type: 'string',
          options: {
            list: [
              { title: 'Forward', value: 'forward' },
              { title: 'Midship', value: 'midship' },
              { title: 'Aft', value: 'aft' },
            ],
            layout: 'radio',
          },
        }),
        defineField({ name: 'sizeSqFt', title: 'Cabin Size (sq ft)', type: 'number' }),
        defineField({ name: 'balconySqFt', title: 'Balcony Size (sq ft)', type: 'number', description: 'Leave blank if no balcony.' }),
        defineField({ name: 'above', title: 'What Is Above', type: 'string', description: 'e.g. Cabins, Windjammer, pool deck' }),
        defineField({ name: 'below', title: 'What Is Below', type: 'string' }),
        pick('noiseAbove', 'Noise From Above', [
          ['Never heard it', 'none'],
          ['Some', 'some'],
          ['Loud', 'loud'],
        ]),
        pick('noiseBelow', 'Noise From Below', [
          ['Never heard it', 'none'],
          ['Some', 'some'],
          ['Loud', 'loud'],
        ]),
        defineField({
          ...pick('noiseNeighbors', 'Walls (Neighbors)', [
            ['Never heard them', 'none'],
            ['Heard some', 'some'],
            ['Heard everything', 'loud'],
          ]),
          description: 'How thin the walls were: could you hear the cabins next door?',
        }),
        pick('noiseHallway', 'Hallway Noise', [
          ['Quiet', 'none'],
          ['Some', 'some'],
          ['Loud', 'loud'],
        ]),
        pick('bedFeel', 'Bed', [
          ['Too soft', 'too-soft'],
          ['Just right', 'just-right'],
          ['Firm', 'firm'],
          ['Too firm', 'too-firm'],
        ]),
        pick('topper', 'Mattress Topper Available?', [
          ['Yes', 'yes'],
          ['No', 'no'],
        ]),
        pick('shower', 'Shower', [
          ['Curtain', 'curtain'],
          ['Glass door', 'glass-door'],
          ['Tub + shower', 'tub-shower'],
        ]),
        defineField({
          ...pick('showerSize', 'Shower Size', [
            ['Tight (hard to turn around)', 'tight'],
            ['Fits 1 comfortably', 'one'],
            ['Fits 2', 'two'],
            ['Roomy (3 or more)', 'roomy'],
          ]),
          description: 'How many adults could stand in it at once.',
        }),
        pick('splitBathroom', 'Split Bathroom?', [
          ['Yes', 'yes'],
          ['No', 'no'],
        ]),
        defineField({
          ...pick('storage', 'Storage', [
            ['Not enough', 'tight'],
            ['Just enough', 'enough'],
            ['Plenty of room', 'plenty'],
          ]),
          description:
            'Drawers, closet and hangers: was there room for everyone\'s clothes for the whole sailing? (Number of Guests on the Cost tab, Nights on Overview.)',
        }),
        multi('plugTypes', 'Plug Types', [
          ['American (110V)', 'us'],
          ['European (220V)', 'eu'],
          ['UK (230V)', 'uk'],
        ]),
        pick('outletCount', 'Outlets in the Room', [
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
          ['4+', '4+'],
        ]),
        multi('outletPlaces', 'Where the Outlets Are', [
          ['By the bed', 'bed'],
          ['Desk or vanity', 'desk'],
          ['Living area', 'living'],
          ['Bathroom (shaver only)', 'bathroom'],
        ]),
        pick('bedOutlets', 'Outlets at the Bed', [
          ['None', 'none'],
          ['One side', 'one-side'],
          ['Both sides', 'both-sides'],
        ]),
        pick('usb', 'USB Ports in the Room?', [
          ['Yes', 'yes'],
          ['No', 'no'],
        ]),
        defineField({
          ...multi('usbTypes', 'USB Types', [
            ['USB-A (classic)', 'usb-a'],
            ['USB-C', 'usb-c'],
          ]),
          hidden: noUsb,
        }),
        defineField({
          ...pick('usbCount', 'USB Ports in the Room', [
            ['1', '1'],
            ['2', '2'],
            ['3', '3'],
            ['4+', '4+'],
          ]),
          hidden: noUsb,
        }),
        defineField({
          ...pick('bedUsb', 'USB at the Bed?', [
            ['Yes', 'yes'],
            ['No', 'no'],
          ]),
          hidden: noUsb,
        }),
        pick('motion', 'Motion & Vibration', [
          ['Barely felt', 'barely'],
          ['Some', 'some'],
          ['A lot', 'a-lot'],
        ]),
        defineField({
          name: 'notes',
          title: 'Cabin Notes (optional)',
          type: 'text',
          rows: 3,
          description: 'Only what the picks above miss, e.g. "Engine hum at the stern when docking."',
        }),
        defineField({ name: 'balconyNotes', title: 'Balcony & View', type: 'text', rows: 2, description: 'Soot, obstructions, privacy.' }),
        textList('liked', 'What We Liked (optional)', 'One per line, e.g. "Split bathroom made mornings easy."'),
        textList('disliked', 'What We Did Not Like (optional)', 'One per line, e.g. "Sofa was too firm to lounge on."'),
        textList('tips', 'Cabin Tips (optional)', 'e.g. Ask for a mattress topper on Day 1.'),
      ],
    }),

    defineField({
      name: 'perks',
      title: 'Cabin Perks',
      type: 'object',
      group: 'cabin',
      description:
        'The perk program this cabin belongs to, what it really gets, and what people expect but do not get.',
      components: { input: CabinPerksInput },
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'program',
          title: 'Perk Program',
          type: 'string',
          description: 'e.g. Sky Class, The Retreat, RockStar. "None" for a standard cabin.',
          components: { input: PerkProgramInput },
        }),
        tagList('included', 'Perks You Get'),
        tagList('notIncluded', 'Perks People Expect But Do Not Get'),
      ],
    }),

    // ── Cost ────────────────────────────────────────────────────
    defineField({
      name: 'guests',
      title: 'Number of Guests',
      type: 'number',
      group: 'cost',
      description: 'How many people the costs below cover. Used for the per person numbers.',
      initialValue: 2,
      validation: (rule) => rule.min(1).integer(),
    }),

    defineField({
      name: 'costItems',
      title: 'What We Paid',
      type: 'array',
      group: 'cost',
      description:
        'One line per charge. The site adds up the total, per person and per person per night using Number of Guests and Number of Nights.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'costItem',
          fields: [
            defineField({ name: 'label', title: 'Item', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'costType',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Cruise fare', value: 'fare' },
                  { title: 'Taxes & port fees', value: 'taxes' },
                  { title: 'Gratuities', value: 'gratuities' },
                  { title: 'Drinks', value: 'drinks' },
                  { title: 'Specialty dining', value: 'dining' },
                  { title: 'Wi-Fi', value: 'wifi' },
                  { title: 'Excursions', value: 'excursions' },
                  { title: 'Activities & experiences', value: 'activities' },
                  { title: 'Transport & flights', value: 'transport' },
                  { title: 'Other', value: 'other' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'amount', title: 'Amount Paid ($, all guests)', type: 'number', validation: (rule) => rule.required().min(0) }),
            defineField({ name: 'regularPrice', title: 'Regular Price ($, optional)', type: 'number', description: 'Fill in if you bought on sale, so readers see the saving.' }),
            defineField({ name: 'bookedWhen', title: 'Booked', type: 'string', options: { list: BOOKED_WHEN_OPTIONS, layout: 'radio' } }),
            defineField({ name: 'includesGratuity', title: 'Includes 18% gratuity?', type: 'boolean' }),
            defineField({ name: 'worthIt', title: 'Worth It?', type: 'string', options: { list: WORTH_IT_OPTIONS, layout: 'radio' } }),
            defineField({ name: 'note', title: 'Note', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', amount: 'amount', when: 'bookedWhen' },
            prepare({ title, amount, when }) {
              return {
                title,
                subtitle: [amount != null && `$${amount.toFixed(2)}`, when].filter(Boolean).join(' • '),
              }
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'pricesCheckedOn',
      title: 'Prices Checked On',
      type: 'date',
      group: 'cost',
      description: 'Shown as "Prices checked on ..." so readers know how fresh the numbers are.',
    }),

    defineField({
      name: 'inclusionAudit',
      title: 'Included vs Upcharges',
      type: 'object',
      group: 'cost',
      options: { collapsible: true, collapsed: false },
      fields: [
        textList('frictionFree', 'Included and Worth It'),
        textList('traps', 'Upcharges & Traps'),
      ],
    }),

    defineField({
      name: 'packageComparisons',
      title: 'Package vs À La Carte Math',
      type: 'array',
      group: 'cost',
      description: 'Show the real math, e.g. dining package vs booking each restaurant on sale.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'packageComparison',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', description: 'e.g. 3-Night Dining Package vs À La Carte', validation: (rule) => rule.required() }),
            ...(['optionA', 'optionB'] as const).map((name, i) =>
              defineField({
                name,
                title: `Option ${i === 0 ? 'A' : 'B'}`,
                type: 'object',
                fields: [
                  defineField({ name: 'label', title: 'Label', type: 'string' }),
                  defineField({
                    name: 'items',
                    title: 'Line Items',
                    type: 'array',
                    of: [
                      defineArrayMember({
                        type: 'object',
                        name: 'lineItem',
                        fields: [
                          defineField({ name: 'label', title: 'Item', type: 'string' }),
                          defineField({ name: 'amount', title: 'Amount ($)', type: 'number' }),
                        ],
                        preview: {
                          select: { title: 'label', amount: 'amount' },
                          prepare: ({ title, amount }) => ({
                            title,
                            subtitle: amount != null ? `$${amount.toFixed(2)}` : undefined,
                          }),
                        },
                      }),
                    ],
                  }),
                ],
              }),
            ),
            defineField({
              name: 'winner',
              title: 'What We Chose / Recommend',
              type: 'string',
              options: {
                list: [
                  { title: 'Option A', value: 'a' },
                  { title: 'Option B', value: 'b' },
                ],
                layout: 'radio',
              },
            }),
            defineField({ name: 'breakEven', title: 'Break-Even Point', type: 'string', description: 'e.g. "6 drinks a day, every day" (optional)' }),
            defineField({ name: 'verdict', title: 'Verdict', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),

    defineField({ ...textList('moneyTips', 'Money-Saving Tips', 'e.g. Book Chef\'s Table during the Black Friday sale.'), group: 'cost' }),

    // ── Dining ──────────────────────────────────────────────────
    defineField({
      name: 'diningVenues',
      title: 'Restaurants & Bars',
      type: 'array',
      group: 'dining',
      description: 'One entry per venue you tried. Add venues you skipped with "Tried" off.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'diningVenue',
          fields: [
            defineField({ name: 'name', title: 'Venue Name', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'venueType',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Main dining room', value: 'main-dining' },
                  { title: 'Buffet', value: 'buffet' },
                  { title: 'Specialty restaurant', value: 'specialty' },
                  { title: 'Suite / exclusive restaurant', value: 'exclusive' },
                  { title: 'Casual / quick bite', value: 'casual' },
                  { title: 'Cafe', value: 'cafe' },
                  { title: 'Bar / lounge', value: 'bar' },
                  { title: 'Room service', value: 'room-service' },
                  { title: 'Tasting / class', value: 'experience' },
                ],
              },
            }),
            defineField({
              name: 'cost',
              title: 'Included or Extra?',
              type: 'string',
              options: {
                list: [
                  { title: 'Included', value: 'included' },
                  { title: 'Extra cost', value: 'extra' },
                  { title: 'Included with our cabin class', value: 'cabin-perk' },
                ],
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'price', title: 'Price per Person ($)', type: 'number', hidden: ({ parent }) => parent?.cost !== 'extra' }),
            defineField({ name: 'tried', title: 'Tried', type: 'boolean', initialValue: true }),
            tagList('meals', 'Meals', 'e.g. Breakfast, Lunch, Dinner'),
            defineField({ name: 'whenVisited', title: 'When We Ate', type: 'string', description: 'e.g. Night 2 dinner' }),
            rating(),
            defineField({ name: 'worthIt', title: 'Worth It?', type: 'string', options: { list: WORTH_IT_OPTIONS, layout: 'radio' } }),
            defineField({ name: 'bestDish', title: 'Best Dish', type: 'string' }),
            defineField({ name: 'worstDish', title: 'Worst Dish', type: 'string' }),
            defineField({
              name: 'dishes',
              title: 'Dishes',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'dish',
                  fields: [
                    defineField({ name: 'name', title: 'Dish', type: 'string' }),
                    rating(),
                    defineField({ name: 'note', title: 'Note', type: 'string' }),
                  ],
                  preview: {
                    select: { title: 'name', rating: 'rating' },
                    prepare: ({ title, rating }) => ({ title, subtitle: rating != null ? `${rating}/10` : undefined }),
                  },
                }),
              ],
            }),
            defineField({ name: 'review', title: 'Review', type: 'text', rows: 4 }),
            defineField({
              name: 'menu',
              title: 'Menu (optional)',
              type: 'array',
              description: 'Photos (JPEG, PNG) or a PDF of the menu. Add one file per page if needed.',
              of: [
                defineArrayMember({
                  type: 'file',
                  name: 'menuFile',
                  options: { accept: 'image/*,application/pdf' },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'name', cost: 'cost', rating: 'rating', tried: 'tried' },
            prepare({ title, cost, rating, tried }) {
              return {
                title,
                subtitle: [tried === false ? 'Not tried' : rating != null && `${rating}/10`, cost].filter(Boolean).join(' • '),
              }
            },
          },
        }),
      ],
    }),

    defineField({ ...textList('diningWatchOuts', 'Dining Watch-Outs', 'e.g. Steaks came out a level more done than ordered.'), group: 'dining' }),

    // ── Activities & Sports ─────────────────────────────────────
    defineField({
      name: 'attractions',
      title: 'Signature Attractions',
      type: 'array',
      group: 'activities',
      description: 'e.g. North Star, FlowRider, RipCord, SeaPlex, waterslides.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'attraction',
          fields: [
            defineField({ name: 'name', title: 'Attraction', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'tried', title: 'Tried', type: 'boolean', initialValue: true }),
            defineField({ name: 'cost', title: 'Included or Extra?', type: 'string', options: { list: [{ title: 'Included', value: 'included' }, { title: 'Extra cost', value: 'extra' }], layout: 'radio' } }),
            defineField({ name: 'price', title: 'Price per Person ($)', type: 'number', hidden: ({ parent }) => parent?.cost !== 'extra' }),
            defineField({ name: 'reservationNeeded', title: 'Reservation Needed?', type: 'boolean' }),
            defineField({ name: 'waitTime', title: 'Wait Time', type: 'string' }),
            rating(),
            defineField({ name: 'note', title: 'Note', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'name', rating: 'rating', tried: 'tried' },
            prepare: ({ title, rating, tried }) => ({
              title,
              subtitle: tried === false ? 'Not tried' : rating != null ? `${rating}/10` : undefined,
            }),
          },
        }),
      ],
    }),

    defineField({
      name: 'shows',
      title: 'Shows & Entertainment',
      type: 'array',
      group: 'activities',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'show',
          fields: [
            defineField({ name: 'name', title: 'Show', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'showType',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Production show', value: 'production' },
                  { title: 'Comedy', value: 'comedy' },
                  { title: 'Live music', value: 'music' },
                  { title: 'Game show / trivia', value: 'game' },
                  { title: 'Deck party', value: 'party' },
                  { title: 'Tasting / class', value: 'class' },
                  { title: 'Movie', value: 'movie' },
                  { title: 'Other', value: 'other' },
                ],
              },
            }),
            defineField({ name: 'venue', title: 'Venue', type: 'string' }),
            defineField({ name: 'bookingNeeded', title: 'Booking Needed?', type: 'boolean' }),
            defineField({ name: 'arriveEarly', title: 'Arrive How Early', type: 'string', description: 'e.g. 35 minutes' }),
            rating(),
            defineField({ name: 'note', title: 'Note', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'name', rating: 'rating', showType: 'showType' },
            prepare: ({ title, rating, showType }) => ({
              title,
              subtitle: [showType, rating != null && `${rating}/10`].filter(Boolean).join(' • '),
            }),
          },
        }),
      ],
    }),

    defineField({
      name: 'crowdHotSpots',
      title: 'Crowd Hot Spots',
      type: 'array',
      group: 'activities',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hotSpot',
          fields: [
            defineField({ name: 'place', title: 'Place', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'peakTimes', title: 'Peak Times', type: 'string', description: 'e.g. 7:00 to 9:30 AM on sea days' }),
            defineField({ name: 'tip', title: 'Tip', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'place', subtitle: 'peakTimes' } },
        }),
      ],
    }),

    defineField({ ...textList('reservationTips', 'Book Ahead Tips', 'What had to be booked before sailing, and what sold out.'), group: 'activities' }),

    defineField({
      name: 'sportsFitness',
      title: 'Sports & Fitness',
      type: 'object',
      group: 'activities',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'gamesWatched',
          title: 'Games We Watched',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'game',
              fields: [
                defineField({
                  name: 'league',
                  title: 'League',
                  type: 'string',
                  options: { list: ['NBA', 'WNBA', 'NFL', 'MLB', 'NHL', 'College', 'Soccer', 'Other'] },
                }),
                defineField({ name: 'game', title: 'Game', type: 'string', description: 'e.g. Lakers vs Warriors' }),
                defineField({ name: 'date', title: 'Date', type: 'date' }),
                defineField({ name: 'venue', title: 'Where We Watched', type: 'string', description: 'e.g. Playmakers, pool screen, cabin TV' }),
                defineField({
                  name: 'access',
                  title: 'Free or Paid?',
                  type: 'string',
                  options: { list: [{ title: 'Free', value: 'free' }, { title: 'Paid reserved event', value: 'paid' }], layout: 'radio' },
                }),
                defineField({ name: 'note', title: 'Atmosphere & Notes', type: 'text', rows: 2 }),
              ],
              preview: {
                select: { league: 'league', game: 'game', venue: 'venue' },
                prepare: ({ league, game, venue }) => ({ title: [league, game].filter(Boolean).join(': '), subtitle: venue }),
              },
            }),
          ],
        }),
        defineField({ name: 'gameRequests', title: 'Could You Request a Game?', type: 'text', rows: 2, description: 'Or did they only show the national game?' }),
        tagList('cabinTvChannels', 'Cabin TV Sports Channels', 'e.g. ESPN, ESPN2'),
        defineField({
          name: 'streamingTests',
          title: 'Streaming Apps on Ship Wi-Fi',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'streamingTest',
              fields: [
                defineField({ name: 'service', title: 'App', type: 'string', description: 'e.g. NBA League Pass, ESPN, Peacock' }),
                defineField({
                  name: 'result',
                  title: 'Did It Work?',
                  type: 'string',
                  options: { list: [{ title: 'Yes', value: 'yes' }, { title: 'Partly (buffering)', value: 'partly' }, { title: 'No', value: 'no' }], layout: 'radio' },
                }),
                defineField({ name: 'note', title: 'Note', type: 'string' }),
              ],
              preview: { select: { title: 'service', subtitle: 'result' } },
            }),
          ],
        }),
        defineField({
          name: 'basketballCourt',
          title: 'Basketball Court',
          type: 'object',
          options: { collapsible: true, collapsed: true, columns: 2 },
          fields: [
            defineField({ name: 'available', title: 'Court Onboard?', type: 'boolean' }),
            defineField({ name: 'location', title: 'Where', type: 'string', description: 'e.g. SeaPlex, Deck 15' }),
            defineField({ name: 'setting', title: 'Indoor or Outdoor', type: 'string', options: { list: ['Indoor', 'Outdoor'], layout: 'radio' } }),
            defineField({ name: 'size', title: 'Court Size', type: 'string', options: { list: ['Full court', 'Half court'], layout: 'radio' } }),
            defineField({ name: 'ballsProvided', title: 'Balls Provided?', type: 'boolean' }),
            defineField({ name: 'condition', title: 'Hoop & Floor Condition', type: 'text', rows: 2 }),
            defineField({ name: 'busy', title: 'How Busy / Pickup Games', type: 'text', rows: 2 }),
          ],
        }),
        defineField({
          name: 'runningTrack',
          title: 'Running Track',
          type: 'object',
          options: { collapsible: true, collapsed: true, columns: 2 },
          fields: [
            defineField({ name: 'available', title: 'Track Onboard?', type: 'boolean' }),
            defineField({ name: 'lapsPerMile', title: 'Laps per Mile', type: 'number' }),
            defineField({ name: 'surface', title: 'Surface', type: 'string' }),
            defineField({ name: 'bestTime', title: 'Best Time to Run', type: 'string' }),
            defineField({ name: 'note', title: 'Crowds & Views', type: 'text', rows: 2 }),
          ],
        }),
        defineField({
          name: 'gym',
          title: 'Gym',
          type: 'object',
          options: { collapsible: true, collapsed: true, columns: 2 },
          fields: [
            defineField({ name: 'heaviestDumbbell', title: 'Heaviest Dumbbell (lb)', type: 'number' }),
            defineField({ name: 'equipment', title: 'Equipment', type: 'text', rows: 2, description: 'Racks, machines, cardio.' }),
            defineField({ name: 'peakHours', title: 'Peak Hours', type: 'string' }),
            defineField({ name: 'bestTime', title: 'Best Time to Go', type: 'string' }),
            defineField({ name: 'classes', title: 'Classes & Fees', type: 'text', rows: 2 }),
            defineField({ name: 'lockerSauna', title: 'Locker Rooms, Sauna & Steam', type: 'text', rows: 2 }),
            defineField({ name: 'etiquette', title: 'Cleanliness & Etiquette', type: 'text', rows: 2 }),
          ],
        }),
        defineField({
          name: 'otherSports',
          title: 'Other Sports',
          type: 'array',
          description: 'e.g. pickleball, mini golf, rock wall.',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'otherSport',
              fields: [
                defineField({ name: 'name', title: 'Activity', type: 'string' }),
                defineField({ name: 'note', title: 'Note', type: 'string' }),
              ],
              preview: { select: { title: 'name', subtitle: 'note' } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'family',
      title: 'Family & Kids',
      type: 'object',
      group: 'activities',
      description: 'Optional. Only fill in for sailings with kids.',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'kidsClubs',
          title: 'Kids Clubs',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'kidsClub',
              fields: [
                defineField({ name: 'name', title: 'Club', type: 'string' }),
                defineField({ name: 'ages', title: 'Ages', type: 'string', description: 'e.g. 6 to 8' }),
                defineField({ name: 'hours', title: 'Hours', type: 'string' }),
                defineField({ name: 'note', title: 'Note', type: 'text', rows: 2 }),
              ],
              preview: { select: { title: 'name', subtitle: 'ages' } },
            }),
          ],
        }),
        defineField({ name: 'babysitting', title: 'Babysitting & Nursery', type: 'text', rows: 2 }),
        defineField({ name: 'familyCabins', title: 'Family Cabin Options', type: 'text', rows: 2, description: 'Connecting cabins vs family suite.' }),
      ],
    }),

    // ── Ports & Logistics ───────────────────────────────────────
    defineField({
      name: 'itinerary',
      title: 'Day by Day',
      type: 'array',
      group: 'itinerary',
      components: { input: ItineraryFillerInput },
      of: [
        defineArrayMember({
          type: 'object',
          name: 'itineraryDay',
          fields: [
            defineField({ name: 'day', title: 'Day', type: 'number', validation: (rule) => rule.required().min(1) }),
            defineField({ name: 'port', title: 'Port (or "Sea Day")', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'stopType',
              title: 'Stop Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Embarkation', value: 'embarkation' },
                  { title: 'Sea day', value: 'sea' },
                  { title: 'Docked', value: 'docked' },
                  { title: 'Tendered', value: 'tendered' },
                  { title: 'Overnight', value: 'overnight' },
                  { title: 'Debarkation', value: 'debarkation' },
                ],
              },
            }),
            defineField({ name: 'arrive', title: 'Arrive', type: 'string', description: 'e.g. 1:00 PM' }),
            defineField({ name: 'depart', title: 'Depart', type: 'string' }),
            defineField({ name: 'allAboard', title: 'All Aboard', type: 'string' }),
            defineField({ name: 'tenderWait', title: 'Tender Wait', type: 'string', description: 'e.g. 45 minutes on Day 2' }),
            defineField({ name: 'whatWeDid', title: 'What We Did', type: 'text', rows: 3 }),
            defineField({
              name: 'excursionType',
              title: 'Excursion',
              type: 'string',
              options: {
                list: [
                  { title: 'Ship excursion', value: 'ship' },
                  { title: 'Booked independently', value: 'independent' },
                  { title: 'Explored on our own', value: 'diy' },
                  { title: 'Stayed onboard', value: 'onboard' },
                ],
              },
            }),
            defineField({ name: 'excursionCost', title: 'Excursion Cost ($, all guests)', type: 'number' }),
            rating(),
            defineField({ name: 'tip', title: 'Tip', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { day: 'day', port: 'port', stopType: 'stopType' },
            prepare: ({ day, port, stopType }) => ({ title: `Day ${day ?? '?'}: ${port ?? ''}`, subtitle: stopType }),
          },
        }),
      ],
    }),

    defineField({
      name: 'gettingThere',
      title: 'Getting to the Port',
      type: 'object',
      group: 'itinerary',
      options: { collapsible: true, collapsed: false, columns: 2 },
      fields: [
        defineField({ name: 'airport', title: 'Airport', type: 'string', components: { input: AirportInput } }),
        defineField({ name: 'terminal', title: 'Terminal / Pier', type: 'string', components: { input: TerminalInput } }),
        defineField({ name: 'transfer', title: 'How We Got There', type: 'string', components: { input: TransferInput } }),
        defineField({ name: 'transferMinutes', title: 'Transfer Time (minutes)', type: 'number' }),
        defineField({ name: 'transferCost', title: 'Transfer Cost ($, one way)', type: 'number' }),
        defineField({
          name: 'parkingCost',
          title: 'Port Parking ($ per day)',
          type: 'number',
          hidden: ({ parent }) => parent?.transfer !== DROVE_AND_PARKED,
        }),
        defineField({
          name: 'whyThisAirport',
          title: 'Tip (optional)',
          type: 'text',
          rows: 2,
          description: 'e.g. "LGB is closer to San Pedro than LAX and skips the traffic."',
        }),
      ],
    }),

    defineField({
      name: 'embarkation',
      title: 'Embarkation',
      type: 'object',
      group: 'itinerary',
      options: { collapsible: true, collapsed: false, columns: 2 },
      fields: [
        defineField({
          name: 'checkInWindow',
          title: 'Check-In Time Slot',
          type: 'string',
          description: 'The start of your assigned arrival window.',
          components: { input: CheckInWindowInput },
        }),
        pick('priorityBoarding', 'Priority Boarding?', [
          ['Yes', 'yes'],
          ['No', 'no'],
        ]),
        defineField({ name: 'arrivedAt', title: 'We Arrived At', type: 'string', components: { input: BoardingTimeInput } }),
        defineField({ name: 'boardedAt', title: 'We Boarded At', type: 'string', components: { input: BoardingTimeInput } }),
        defineField({
          name: 'minutesToBoard',
          title: 'Minutes From Arrival to Onboard',
          type: 'number',
          components: { input: MinutesToBoardInput },
        }),
        pick('lines', 'Lines', [
          ['Short', 'short'],
          ['Moderate', 'moderate'],
          ['Long', 'long'],
        ]),
        textList('tips', 'Tips (optional)'),
      ],
    }),

    defineField({
      name: 'debarkation',
      title: 'Debarkation',
      type: 'object',
      group: 'itinerary',
      options: { collapsible: true, collapsed: false, columns: 2 },
      fields: [
        defineField({
          name: 'method',
          title: 'Method',
          type: 'string',
          options: { list: [{ title: 'Self-assist (carry your bags)', value: 'self-assist' }, { title: 'Assigned group', value: 'assigned' }], layout: 'radio' },
        }),
        defineField({ name: 'offShipAt', title: 'Off the Ship At', type: 'string', components: { input: OffShipTimeInput } }),
        defineField({ name: 'minutesToExit', title: 'Minutes to Clear the Terminal', type: 'number' }),
        pick('facialRecognition', 'Facial Recognition at Customs?', [
          ['Yes', 'yes'],
          ['No', 'no'],
        ]),
        defineField({
          name: 'flightTime',
          title: 'Our Flight Time',
          type: 'string',
          description: 'Helps answer "Is an 11 AM flight too early?"',
          components: { input: FlightTimeInput },
        }),
        textList('tips', 'Tips (optional)'),
      ],
    }),

    defineField({
      name: 'wifi',
      title: 'Wi-Fi',
      type: 'object',
      group: 'itinerary',
      options: { collapsible: true, collapsed: false, columns: 2 },
      fields: [
        pick('usage', 'Did We Use Ship Wi-Fi?', [
          ['Yes, we bought a plan', 'bought'],
          ['Yes, it came with our cabin or fare', 'included'],
          ['No, we stayed offline', 'none'],
        ]),
        defineField({
          name: 'offlineNote',
          title: 'Staying in Touch (optional)',
          type: 'string',
          description: 'e.g. "Used our phone plan in port."',
          hidden: ({ parent }) => parent?.usage !== 'none',
        }),
        defineField({
          ...pick('plan', 'Plan Level', [
            ['Basic (browse and message)', 'basic'],
            ['Premium (stream and video call)', 'premium'],
          ]),
          hidden: noWifi,
        }),
        defineField({
          name: 'planName',
          title: 'Plan Name (optional)',
          type: 'string',
          description: 'e.g. VOOM Surf + Stream',
          hidden: noWifi,
        }),
        defineField({
          ...pick('devices', 'Devices on Plan', [
            ['1', '1'],
            ['2', '2'],
            ['3', '3'],
            ['4+', '4+'],
          ]),
          hidden: noWifi,
        }),
        defineField({
          name: 'pricePaid',
          title: 'Price Paid ($, whole sailing)',
          type: 'number',
          hidden: ({ parent }) => parent?.usage !== 'bought',
        }),
        defineField({
          name: 'bookedWhen',
          title: 'Booked',
          type: 'string',
          options: { list: BOOKED_WHEN_OPTIONS, layout: 'radio', direction: 'horizontal' },
          hidden: ({ parent }) => parent?.usage !== 'bought',
        }),
        defineField({
          ...pick('sharingRule', 'Sharing', [
            ['One device at a time', 'one-at-a-time'],
            ['Each device needs a plan', 'per-device'],
            ['Shared freely', 'shared'],
          ]),
          hidden: noWifi,
        }),
        defineField({
          name: 'speedTests',
          title: 'Speed Tests (optional)',
          type: 'array',
          hidden: noWifi,
          of: [
            defineArrayMember({
              type: 'object',
              name: 'speedTest',
              fields: [
                defineField({ name: 'date', title: 'Date', type: 'date' }),
                defineField({ name: 'location', title: 'Where on Ship', type: 'string', description: 'e.g. Cabin 7640' }),
                defineField({ name: 'atSea', title: 'At Sea?', type: 'boolean', description: 'Off = in port' }),
                defineField({ name: 'download', title: 'Download (Mbps)', type: 'number' }),
                defineField({ name: 'upload', title: 'Upload (Mbps)', type: 'number' }),
                defineField({ name: 'ping', title: 'Ping (ms)', type: 'number' }),
                defineField({ name: 'streamed', title: 'What Streamed OK', type: 'string' }),
              ],
              preview: {
                select: { down: 'download', up: 'upload', location: 'location' },
                prepare: ({ down, up, location }) => ({ title: `${down ?? '?'} down / ${up ?? '?'} up Mbps`, subtitle: location }),
              },
            }),
          ],
        }),
        defineField({
          ...pick('verdict', 'How Was It?', [
            ['Great', 'great'],
            ['Good enough', 'good'],
            ['Slow', 'slow'],
            ['Unusable', 'unusable'],
          ]),
          hidden: noWifi,
        }),
        defineField({
          name: 'verdictNote',
          title: 'Wi-Fi Note (optional)',
          type: 'string',
          description: 'e.g. "Buffered during evening peak hours."',
          hidden: noWifi,
        }),
      ],
    }),

    // ── Scores & Verdict ────────────────────────────────────────
    defineField({
      name: 'cruiseRating',
      title: 'Cruise Ratings',
      type: 'cruiseRating',
      group: 'verdict',
      validation: (rule) => rule.required(),
    }),

    defineField({ ...positivesField('cruise'), group: 'verdict' }),

    defineField({ ...negativesField('cruise'), group: 'verdict' }),

    // No AI generator here yet, the generate-verdict API has no cruise prompt
    defineField({ ...verdictField('cruise', 1200), group: 'verdict', components: undefined }),

    defineField({
      name: 'wouldSailAgain',
      title: 'Would We Sail It Again?',
      type: 'string',
      group: 'verdict',
      options: {
        list: [
          { title: 'Yes, absolutely', value: 'yes' },
          { title: 'Yes, with conditions', value: 'conditional' },
          { title: 'Maybe', value: 'maybe' },
          { title: 'No', value: 'no' },
        ],
        layout: 'radio',
      },
    }),

    defineField({ name: 'wouldSailAgainNote', title: 'Sail Again Note', type: 'string', group: 'verdict', description: 'e.g. Only for an overnight port itinerary.' }),

    defineField({ ...textList('bookItIf', 'Book It If'), group: 'verdict' }),

    defineField({ ...textList('skipItIf', 'Skip It If'), group: 'verdict' }),

    defineField({
      name: 'bestFor',
      title: 'Best For',
      type: 'array',
      group: 'verdict',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Families', value: 'families' },
          { title: 'Multi-generational', value: 'multigen' },
          { title: 'Couples', value: 'couples' },
          { title: 'First-timers', value: 'first-timers' },
          { title: 'Sports fans', value: 'sports-fans' },
          { title: 'Foodies', value: 'foodies' },
          { title: 'Solo travelers', value: 'solo' },
          { title: 'Loyalty points runs', value: 'loyalty' },
        ],
        layout: 'grid',
      },
    }),

    defineField({
      name: 'comparisons',
      title: 'Head-to-Head Comparisons',
      type: 'array',
      group: 'verdict',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'comparison',
          fields: [
            defineField({ name: 'otherShip', title: 'Compared With', type: 'string', description: 'e.g. Celebrity Silhouette (Sky Suite 1233)', validation: (rule) => rule.required() }),
            defineField({ name: 'otherReview', title: 'Link to Our Review (optional)', type: 'reference', to: [{ type: 'cruiseReview' }] }),
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'comparisonRow',
                  fields: [
                    defineField({ name: 'metric', title: 'Metric', type: 'string' }),
                    defineField({ name: 'thisShip', title: 'This Ship', type: 'string' }),
                    defineField({ name: 'otherShip', title: 'Other Ship', type: 'string' }),
                    defineField({ name: 'edge', title: 'The Whyte Edge', type: 'string' }),
                  ],
                  preview: { select: { title: 'metric', subtitle: 'edge' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'otherShip' } },
        }),
      ],
    }),

    defineField({
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      group: 'verdict',
      description: 'Write questions the way cruisers search, e.g. "Is the dining package worth it on Quantum?"',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faq',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
    }),

    defineField({
      name: 'content',
      title: 'Extra Story (optional)',
      type: 'array',
      group: 'verdict',
      description: 'Anything that does not fit a field above.',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Image Caption' },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility',
              components: { input: AltTextGeneratorInput },
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'sailings',
      title: 'Other Sailings on This Ship',
      type: 'array',
      group: 'verdict',
      description: 'Log later sailings here instead of starting a new review.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'sailing',
          fields: [
            defineField({ name: 'sailingDate', title: 'Sailing Date', type: 'date', validation: (rule) => rule.required() }),
            defineField({ name: 'nights', title: 'Nights', type: 'number' }),
            defineField({ name: 'itineraryName', title: 'Itinerary', type: 'string' }),
            defineField({ name: 'cabin', title: 'Cabin', type: 'string' }),
            defineField({ name: 'notes', title: 'What Changed?', type: 'array', of: [{ type: 'block' }], validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { date: 'sailingDate', title: 'itineraryName' },
            prepare: ({ date, title }) => ({ title: title || 'Sailing', subtitle: date }),
          },
        }),
      ],
    }),

    defineField({
      name: 'changesSinceSailing',
      title: 'What Changed Since We Sailed',
      type: 'array',
      group: 'verdict',
      description: 'Dated notes when the line changes prices, perks or venues.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'change',
          fields: [
            defineField({ name: 'date', title: 'Date', type: 'date' }),
            defineField({ name: 'note', title: 'Note', type: 'string' }),
          ],
          preview: { select: { title: 'note', subtitle: 'date' } },
        }),
      ],
    }),

    // ── SEO & Links ─────────────────────────────────────────────
    defineField({
      name: 'seoExcerpt',
      title: 'SEO Excerpt / Meta Description',
      type: 'string',
      group: 'seo',
      description: 'Plain text shown in Google search results and social shares. 120 to 155 characters ideal.',
      validation: (Rule) => [
        Rule.max(155).warning('Keep under 155 characters for Google search results'),
        Rule.min(120).warning('At least 120 characters recommended for Google search results'),
      ],      components: { input: SeoExcerptGeneratorInput },
    }),

    defineField({
      ...tagList('tags', 'Tags', 'e.g. Royal Caribbean, Junior Suite, Cabo Overnight'),
      group: 'seo',
      components: { input: SuggestTagsInput },
    }),

    defineField({
      name: 'relatedHotels',
      title: 'Related Hotels',
      type: 'array',
      group: 'seo',
      description: 'e.g. hotels near the departure port.',
      components: { input: RelatedReviewsInput },
      of: [{ type: 'reference', to: [{ type: 'hotelReview' }] }],
    }),

    defineField({
      name: 'relatedFood',
      title: 'Related Food Reviews',
      type: 'array',
      group: 'seo',
      description: 'e.g. restaurants in the ports.',
      components: { input: RelatedReviewsInput },
      of: [{ type: 'reference', to: [{ type: 'foodReview' }] }],
    }),

    defineField({
      name: 'relatedGuides',
      title: 'Related Guides',
      type: 'array',
      group: 'seo',
      components: { input: RelatedReviewsInput },
      of: [{ type: 'reference', to: [{ type: 'guide' }] }],
    }),

    defineField({
      name: 'publishedAt',
      title: 'Publish Date / Scheduled Time',
      type: 'datetime',
      group: 'seo',
      description: 'Set a future date to schedule, or leave blank to publish immediately.',
      validation: (rule) =>
        rule
          .custom((value) => {
            if (!value) return true
            if (new Date(value as string) > new Date()) {
              return `Scheduled: this post will not appear publicly until ${new Date(value as string).toLocaleDateString('en-US', { dateStyle: 'long' })}.`
            }
            return true
          })
          .warning(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      ship: 'shipName',
      date: 'sailingDate',
      nights: 'nights',
      media: 'coverImage',
      heroMedia: 'heroPhotos.0',
    },
    prepare({ title, ship, media, heroMedia, date, nights }) {
      const subtitles = [
        ship && `🚢 ${ship}`,
        nights && `${nights} nights`,
        date && `📅 ${format(parseISO(date), 'LLL yyyy')}`,
      ].filter(Boolean)

      return { title, media: media || heroMedia, subtitle: subtitles.join(' • ') }
    },
  },

  orderings: [
    {
      title: 'Sailing Date, New',
      name: 'sailingDateDesc',
      by: [{ field: 'sailingDate', direction: 'desc' }],
    },
    {
      title: 'Ship, A-Z',
      name: 'shipAsc',
      by: [{ field: 'shipName', direction: 'asc' }],
    },
  ],
})
