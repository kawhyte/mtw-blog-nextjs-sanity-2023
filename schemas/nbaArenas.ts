// schemas/nbaArenas.ts
import { ImagesIcon, StarIcon } from '@sanity/icons' // Added ImagesIcon
import { defineField, defineType } from 'sanity'
import { AltTextGeneratorInput } from '../plugins/AltTextGeneratorInput'
import { CaptionGeneratorInput } from '../plugins/CaptionGeneratorInput'
import { GameDataFetcherInput } from '../plugins/GameDataFetcherInput'
import { SeoExcerptGeneratorInput } from '../plugins/SeoExcerptGeneratorInput'
import { VerdictGeneratorInput } from '../plugins/VerdictGeneratorInput'
import { VerdictHeadlineGeneratorInput } from '../plugins/VerdictHeadlineGeneratorInput'
import { heroPhotosField } from './sharedReviewFields'
import { getPortableTextLength } from './utils'

// Regex to validate common YouTube or Instagram video/reel/post URLs
const videoUrlPattern =
  /^(http(s)?:\/\/)?((w){3}.)?(youtu(be|.be)?(\.com)?\/.+|instagram\.com\/(p|reel|tv)\/.+)/
// --- End Helper Functions ---

export default defineType({
  name: 'arenas',
  title: 'NBA/(W)NBA Arenas',
  icon: StarIcon,
  type: 'document',
  initialValue: {
    visited: false,
  },

  // Optional override, collapsed by default — cards and share previews use
  // Hero Photo #1 when it's empty.
  fieldsets: [
    {
      name: 'cardImage',
      title: 'Card & Share Image (optional)',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    // --- Basic Info ---
    defineField({
      name: 'name',
      title: 'Arena Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The name of Arena/Stadium ( ex. Crypto )',
    }),
    defineField({
      name: 'currentName',
      title: 'Now called (optional)',
      type: 'string',
      description:
        'Only if the arena was renamed after our visit, e.g. "Kia Center". Arena Name above stays the name from our visit; the page shows "Now called …" under it.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'Arena slug (ex. crypto)',
    }),
    defineField({
      name: 'location',
      title: 'Arena Location',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      // SEO meta description — hotels/food/guides call this `seoExcerpt`.
      name: 'excerpt',
      title: 'SEO Excerpt',
      type: 'string',
      description:
        'A 1–2 sentence description that appears in Google search results. Keep it under 155 characters. Example: "Our full review of Barclays Center in Brooklyn — food, parking, sightlines, and tips for first-time visitors."',
      validation: (Rule) =>
        Rule.max(155).warning('Keep under 155 characters for best SEO results.'),
      components: { input: SeoExcerptGeneratorInput },
    }),
    defineField({
      name: 'capacity',
      title: 'Arena Capacity',
      type: 'number',
    }),
    defineField({
      name: 'buildDate',
      title: 'Arena Build Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'venueNote',
      title: 'Venue Note (Optional)',
      type: 'string',
      description:
        'Short context for multi-use or neutral-site venues. e.g. "Multi-purpose venue; hosts Las Vegas Aces home games and NBA special events."',
    }),

    // --- Images & Galleries ---
    heroPhotosField(
      "Choose a category — Seating & Game Floor: court, baskets, view from your seat. Concessions & Food: food stalls, menu boards, food shots. Exterior: outside the building, signage, plaza. Entrances & Lobby: inside entrance, hallways, common areas. Additional Photos: anything that doesn't fit above.",
      [
        { title: 'Seating & Game Floor', value: 'court' },
        { title: 'Concessions & Food', value: 'concessions' },
        { title: 'Exterior', value: 'exterior' },
        { title: 'Entrances & Lobby', value: 'lobby' },
        { title: 'Additional Photos', value: 'other' },
      ],
      {
        court: 'Court & Game Floor',
        seating: 'Seating & Views',
        concessions: 'Concessions & Food',
        exterior: 'Exterior',
        lobby: 'Entrances & Lobby',
        'game-atmosphere': 'Game Atmosphere',
        other: 'Additional Photos',
      },
    ),

    defineField({
      name: 'arenaImage', // Card & share image (falls back to heroPhotos[0])
      fieldset: 'cardImage',
      title: 'Card & Share Image',
      type: 'image',
      description: 'Used on arena cards and when the page is shared. Optional — leave empty to use Hero Photo #1. Upload at 2400 × 1600 px (3:2 landscape), WebP 85% or JPEG 88%.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'REQUIRED: Describe the image.',
          // validation: (Rule) => Rule.required().error('Alt text is required.'),
          // options: { isHighlighted: true } // Removed previously
          components: { input: AltTextGeneratorInput },
        }),
      ],
      // validation: (Rule) => Rule.required(), // Consider if required
    }),

    // Legacy 1+4 block, superseded by heroPhotos. Kept read-only so existing
    // photos stay in the dataset and visible until heroPhotos is filled in.
    defineField({
      name: 'photoGallerySection',
      title: 'Legacy Hero Gallery (replaced by Hero Photos)',
      type: 'photoGallery', // References 'photoGallery' object schema
      description:
        'Read-only backup of the old 1 main + 4 layout. Its photos were copied into Hero Photos above — edit those instead.',
      readOnly: true,
      hidden: ({ document }) =>
        Array.isArray(document?.heroPhotos) && document.heroPhotos.length > 0,
    }),

    // --- NEW Image Gallery Field ---
    defineField({
      name: 'imageGallery', // New field name
      title: 'Image Gallery',
      description:
        'All other arena photos, shown in "Show all photos" after the hero photos. Upload multiple arena photos (interior, exterior, food, views, etc.). Max 1600 px on the longest edge, any aspect ratio. WebP 85% or JPEG 88% quality. Add alt text for each.',
      type: 'array',
      icon: ImagesIcon, // Add a relevant icon
      hidden: ({ document }) => !document?.visited, // Hide if not visited
      of: [
        {
          type: 'image',
          options: {
            hotspot: true, // Enable hotspot for better cropping
          },
          fields: [
            // Required Alt Text
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description:
                'REQUIRED: Describe the image for accessibility and SEO.',
              // validation: Rule => Rule.required().error('Alt text is required for every gallery image.'),
              components: { input: AltTextGeneratorInput },
            }),
            // Optional Caption
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional: Add a brief caption for the image.',
              components: { input: CaptionGeneratorInput },
            }),
            defineField({
              name: 'category',
              title: 'Photo Category',
              type: 'string',
              description:
                "Choose a category — Seating & Game Floor: court, baskets, view from your seat. Concessions & Food: food stalls, menu boards, food shots. Exterior: outside the building, signage, plaza. Entrances & Lobby: inside entrance, hallways, common areas. Additional Photos: anything that doesn't fit above.",
              options: {
                list: [
                  { title: 'Seating & Game Floor', value: 'court' },
                  { title: 'Concessions & Food', value: 'concessions' },
                  { title: 'Exterior', value: 'exterior' },
                  { title: 'Entrances & Lobby', value: 'lobby' },
                  { title: 'Additional Photos', value: 'other' },
                ],
              },
            }),
          ],

          preview: {
            select: {
              media: 'asset',
              title: 'alt',
              category: 'category',
            },
            prepare({ media, title, category }: { media: any; title?: string; category?: string }) {
              const labels: Record<string, string> = {
                court: 'Court & Game Floor',
                seating: 'Seating & Views',
                concessions: 'Concessions & Food',
                exterior: 'Exterior',
                lobby: 'Entrances & Lobby',
                'game-atmosphere': 'Game Atmosphere',
                other: 'Additional Photos',
              }
              return {
                media,
                title: title || 'No alt text',
                subtitle: category ? `✓  ${labels[category] ?? category}` : '⚠  No category set',
              }
            },
          },
        },
      ],
    }),
    // --- END NEW Image Gallery Field ---

    defineField({
      // Team logos for the arena's home teams (not a photo gallery — photos
      // live in `imageGallery`). Stored name kept so existing content isn't lost — see docs/FIELD-GLOSSARY.md.
      name: 'gallery',
      title: 'Teams / Logos',
      description:
        'Logos/info for teams associated with the arena. Logo size: 200 × 200 px (square). PNG with transparent background preferred.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Team Name',
              description:
                'Full team name — e.g., "Houston Rockets", not just "Rockets"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              title: 'Did we see this team play?',
              name: 'played',
              type: 'boolean',
            }),
            defineField({
              title: 'Special game here (not their home arena)',
              name: 'specialGame',
              type: 'boolean',
              description:
                'Tick for a one-off game at this arena, e.g. an NBA Cup game in Las Vegas or a WNBA game at TD Garden. The team then shows as a special game instead of a home team.',
            }),
            defineField({
              name: 'timesAttended',
              title: 'Times We Saw This Team Play Here',
              type: 'number',
              description:
                'How many games of this team have we attended at this arena? (default: 1)',
              hidden: ({ parent }) => !parent?.played,
              validation: (Rule) => Rule.min(1).integer(),
            }),
            defineField({
              name: 'attendedGames',
              title: 'Games We Attended',
              type: 'array',
              description:
                'Use the "Fetch Game" button above to auto-populate game data from ESPN.',
              hidden: ({ parent }) => !parent?.played,
              components: { input: GameDataFetcherInput },
              of: [
                {
                  type: 'object',
                  name: 'gameEntry',
                  title: 'Game',
                  options: { collapsible: true, collapsed: false },
                  preview: {
                    select: {
                      gameDate: 'gameDate',
                      opponent: 'opponent',
                      homeScore: 'homeScore',
                      awayScore: 'awayScore',
                    },
                    prepare({ gameDate, opponent, homeScore, awayScore }) {
                      const date = gameDate
                        ? new Date(gameDate + 'T12:00:00').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'No date'
                      const score =
                        homeScore != null && awayScore != null
                          ? ` · ${homeScore}–${awayScore}`
                          : ''
                      return {
                        title: opponent ? `vs. ${opponent}${score}` : 'Game entry',
                        subtitle: date,
                      }
                    },
                  },
                  fields: [
                    defineField({
                      name: 'gameDate',
                      title: 'Game Date',
                      type: 'date',
                      options: { dateFormat: 'YYYY-MM-DD' },
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'opponent',
                      title: 'Opponent',
                      type: 'string',
                      description: 'Full team name, e.g. "San Antonio Spurs"',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'homeScore',
                      title: 'Home Team Score',
                      type: 'number',
                      validation: (Rule) => Rule.integer().min(0),
                    }),
                    defineField({
                      name: 'awayScore',
                      title: 'Away Team Score',
                      type: 'number',
                      validation: (Rule) => Rule.integer().min(0),
                    }),
                    defineField({
                      name: 'seasonType',
                      title: 'Season Type',
                      type: 'string',
                      initialValue: 'Regular Season',
                      options: {
                        list: [
                          { title: 'Regular Season', value: 'Regular Season' },
                          { title: 'Playoffs', value: 'Playoffs' },
                          { title: 'Play-In', value: 'Play-In' },
                          {
                            title: 'In-Season Tournament',
                            value: 'In-Season Tournament',
                          },
                          { title: 'Pre-Season', value: 'Pre-Season' },
                        ],
                        layout: 'radio',
                      },
                    }),
                    defineField({
                      name: 'overtimePeriods',
                      title: 'Overtime Periods',
                      type: 'number',
                      description: '0 = regulation, 1 = one OT, etc.',
                      initialValue: 0,
                      validation: (Rule) => Rule.integer().min(0),
                    }),
                    defineField({
                      name: 'eventName',
                      title: 'Event / Tournament Name (Optional)',
                      type: 'string',
                      description:
                        'e.g. "Emirates NBA Cup 2024", "NBA Paris Game". Leave blank for regular season games.',
                    }),
                    defineField({
                      name: 'playerOfGame',
                      title: 'Key Players',
                      type: 'array',
                      description: 'Top performer from each team, auto-fetched from ESPN.',
                      of: [
                        {
                          type: 'object',
                          preview: {
                            select: { title: 'playerName', subtitle: 'teamName' },
                          },
                          fields: [
                            defineField({
                              name: 'playerName',
                              title: 'Player Name',
                              type: 'string',
                            }),
                            defineField({
                              name: 'teamName',
                              title: "Player's Team",
                              type: 'string',
                            }),
                            defineField({
                              name: 'points',
                              title: 'Points',
                              type: 'number',
                              validation: (Rule) => Rule.integer().min(0),
                            }),
                            defineField({
                              name: 'rebounds',
                              title: 'Rebounds',
                              type: 'number',
                              validation: (Rule) => Rule.integer().min(0),
                            }),
                            defineField({
                              name: 'assists',
                              title: 'Assists',
                              type: 'number',
                              validation: (Rule) => Rule.integer().min(0),
                            }),
                            defineField({
                              name: 'nbaPlayerId',
                              title: 'ESPN Athlete ID',
                              type: 'number',
                              description:
                                'ESPN athlete ID — used to load the player headshot.',
                            }),
                          ],
                        },
                      ],
                    }),
                  ],
                },
              ],
            }),
            defineField({
              title: 'League / Team Type',
              name: 'teamType',
              type: 'string',
              options: {
                list: [
                  { title: 'NBA', value: 'nba' },
                  { title: 'WNBA', value: 'wnba' },
                  { title: 'Other', value: 'other' },
                ],
              },
            }),
            defineField({
              name: 'link',
              type: 'url',
              title: 'Link to Team/Arena Page (Optional)',
            }),
            defineField({
              name: 'alt',
              title: 'Logo Alt Text',
              type: 'string',
              description: 'REQUIRED: e.g., "Los Angeles Lakers Logo"',
              // validation: Rule => Rule.required().error('Alt text for the logo is required.'),
              components: { input: AltTextGeneratorInput },
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'teamType', media: 'asset' },
            prepare(selection) {
              const { title, subtitle, media } = selection
              return {
                title: title || 'No team name',
                subtitle: subtitle ? subtitle.toUpperCase() : '',
                media: media,
              }
            },
          },
        },
      ],
    }),

    // --- Visit Status & Date ---
    defineField({
      title: 'Did we visit this Arena?',
      name: 'visited',
      type: 'boolean',
    }),
    defineField({
      name: 'date',
      title: 'Date Visited',
      type: 'datetime',
      description: 'This is the date we visited the Arena',
      hidden: ({ document }) => !document?.visited,
    }),

    // --- Pros / Cons / Verdict Group ---
    defineField({
      name: 'prosConsVerdict',
      title: 'Pros, Cons, & Verdict',
      type: 'object',
      description:
        'Summarize the positive, negative, and concluding points about visiting this arena.',
      options: { collapsible: true, collapsed: false },
      hidden: ({ document }) => !document?.visited,
      fields: [
        // Positives
        defineField({
          title: 'Pros (Positives)',
          name: 'positives',
          description:
            "Add the arena's standout positives. Keep each point to 1–2 short sentences (aim for 100–150 chars each).",
          type: 'array',
          of: [
            {
              type: 'string',
              title: 'Pro',
              placeholder: 'e.g., Great food variety',
            },
          ],
        }),
        // Negatives
        defineField({
          title: 'Cons (Negatives)',
          name: 'negatives',
          description:
            "Add the arena's main drawbacks. Keep each point to 1–2 short sentences (aim for 100–150 chars each).",
          type: 'array',
          of: [
            {
              type: 'string',
              title: 'Con',
              placeholder: 'e.g., Expensive parking',
            },
          ],
        }),
        // Verdict (Portable Text with Character Limit)
        defineField({
          name: 'verdict',
          title: 'Overall Verdict',
          description:
            'Write a concluding summary (max 600 characters). Basic formatting is allowed.',
          type: 'array', // Portable Text
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              lists: [{ title: 'Bullet', value: 'bullet' }],
              marks: {
                decorators: [
                  { title: 'Strong (Bold)', value: 'strong' },
                  { title: 'Emphasis (Italic)', value: 'em' },
                ],
                // annotations: [ /* link config */ ]
              },
            },
          ],
          validation: (Rule) =>
            Rule.custom((portableTextValue) => {
              const textLength = getPortableTextLength(portableTextValue ?? [])
              const limit = 600
              if (textLength > limit) {
                return `Verdict exceeds ${limit} characters (${textLength}/${limit})`
              }
              return true
            }).error(),
          components: { input: VerdictGeneratorInput },
        }), // --- End Verdict ---
      ], // --- End of fields INSIDE the group ---
    }), // --- End of the GROUPING Fieldset ---

    defineField({
      name: 'verdictHeadline',
      title: 'Verdict Headline (optional)',
      type: 'string',
      description:
        'One punchy sentence shown under the photos as "Our take", e.g. "The Aces crowd is loud, the sightlines are great, and you should eat before you go." Leave blank to hide the section.',
      hidden: ({ document }) => !document?.visited,
      validation: (Rule) =>
        Rule.max(120).warning(
          'Keep it to one short sentence (under 120 characters)',
        ),
      components: { input: VerdictHeadlineGeneratorInput },
    }),

    // --- Video URL Field ---
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube / Instagram)',
      description:
        'OUR EXPERIENCE video — your full visit vlog or highlights reel. YouTube or Instagram both work here. Use the "Seat View Video" field inside each View From My Seat entry for short clips filmed from your actual seat.',
      type: 'url',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) {
            return true
          }
          if (typeof value === 'string') {
            if (videoUrlPattern.test(value)) {
              return true
            } else {
              return 'Please enter a valid URL for a YouTube video or an Instagram post/reel/tv.'
            }
          }
          return 'Invalid input: Expected a URL string.'
        }),
      // hidden: ({ document }) => !document?.visited,
    }),
    // --- End Video URL Field ---

    // --- Detailed Ratings ---
    defineField({
      name: 'arenaReview', // References 'arenaReview' object/document type
      title: 'Arena Rating Breakdown',
      type: 'arenaReview',
      hidden: ({ document }) => !document?.visited,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.visited && !value) {
            return 'Arena review is required if you have visited the arena.'
          }
          return true
        }),
    }), // --- End Detailed Ratings ---

    // --- Arena Food & Drink Items (optional) ---
    defineField({
      name: 'arenaFoodItems',
      title: 'Arena Food & Drinks We Tried',
      type: 'array',
      description:
        'Rate individual food/drink items tried at this arena (optional). Photo for each item: max 1600 px on the longest edge, natural shape. Cards crop to 3:2, so landscape shots fill them best (portrait loses the top and bottom — set the hotspot). WebP 85% or JPEG 88%.',
      hidden: ({ document }) => !document?.visited,
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Food/Drink Name',
              description: 'The name should be 40 characters or less',
              validation: (Rule) =>
                Rule.max(40)
                  .warning(`The name shouldn't be more than 40 characters.`)
                  .required(),
            }),
            defineField({
              name: 'rating',
              type: 'individualFoodType',
              title: 'Rating',
            }),
            defineField({
              name: 'price',
              type: 'number',
              title: 'Price (USD)',
              description: 'Optional: What did this item cost? (e.g., 12.50)',
            }),
            defineField({
              name: 'review',
              type: 'string',
              title: 'Short Review (120 chars max)',
              validation: (Rule) =>
                Rule.max(120).warning(`Shouldn't be more than 120 characters.`),
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Describe the food/drink item for SEO.',
              components: { input: AltTextGeneratorInput },
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'review', media: 'asset' },
            prepare({ title, subtitle, media }) {
              return { title: title || 'Unnamed item', subtitle, media }
            },
          },
        },
      ],
    }),

    // --- View From My Seat ---
    defineField({
      name: 'viewFromSeat',
      title: 'View From My Seat',
      type: 'array',
      description:
        'Photos and optional video from your actual seats. Add one entry per visit or section.',
      hidden: ({ document }) => !document?.visited,
      of: [
        {
          type: 'object',
          name: 'seatViewEntry',
          title: 'Seat View Entry',
          options: { collapsible: true, collapsed: false },
          preview: {
            select: { title: 'seatInfo', subtitle: 'seatType' },
            prepare({ title, subtitle }) {
              const labels: Record<string, string> = {
                lower_bowl: 'Lower Bowl',
                upper_bowl: 'Upper Bowl',
                club: 'Club Level',
                courtside: 'Courtside / Floor',
                suite: 'Suite / Box',
                standing_room: 'Standing Room',
              }
              return {
                title: title || 'Seat View Entry',
                subtitle: subtitle ? labels[subtitle] || subtitle : undefined,
              }
            },
          },
          fields: [
            defineField({
              name: 'seatInfo',
              title: 'Seat Location',
              type: 'string',
              description:
                'e.g., "Section 210, Row L, Seats 1–2" or "Club Level, Corner"',
              validation: (Rule) => Rule.max(80),
            }),
            defineField({
              name: 'seatType',
              title: 'Seat Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Lower Bowl', value: 'lower_bowl' },
                  { title: 'Upper Bowl', value: 'upper_bowl' },
                  { title: 'Club Level', value: 'club' },
                  { title: 'Courtside / Floor', value: 'courtside' },
                  { title: 'Suite / Box', value: 'suite' },
                  { title: 'Standing Room', value: 'standing_room' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'ticketPrice',
              title: 'Ticket Price Paid (per ticket, USD)',
              type: 'number',
              description: 'What you paid per ticket. Optional.',
              validation: (Rule) => Rule.min(0).precision(2),
            }),
            defineField({
              name: 'photos',
              title: 'Seat View Photos',
              type: 'array',
              description:
                'Max 1600 px on the longest edge, natural shape. WebP 85% or JPEG 88%. The page crops every photo to 4:3 — landscape shots fill the frame perfectly. Portrait photos (phone held vertically) will lose the top and bottom; use the hotspot tool to anchor the court/key area.',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: 'alt',
                      type: 'string',
                      title: 'Alt Text',
                      components: { input: AltTextGeneratorInput },
                    }),
                    defineField({
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                      description:
                        'Optional: e.g., "Halftime view, second deck"',
                    }),
                  ],
                },
              ],
            }),
            defineField({
              name: 'seatVideoUrl',
              title: 'Seat View Video (optional)',
              type: 'url',
              description:
                'A short clip filmed from this specific seat. YouTube (landscape 1920×1080) looks best on desktop. Instagram Reels (1080×1920 vertical) also work but render narrower. Keep it under 60 seconds — this is a seat preview, not a full game highlight.',
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (!value) return true
                  if (
                    typeof value === 'string' &&
                    videoUrlPattern.test(value)
                  ) {
                    return true
                  }
                  return 'Please enter a valid YouTube or Instagram URL.'
                }),
            }),
          ],
        },
      ],
    }),
    // --- End View From My Seat ---

    // --- Hotel Stays (optional, supports multiple visits) ---
    defineField({
      name: 'hotelStays',
      title: 'Hotel Stays',
      description:
        'Add one entry per visit where you stayed overnight. Leave empty for day trips.',
      type: 'array',
      hidden: ({ document }) => !document?.visited,
      of: [
        {
          type: 'object',
          title: 'Hotel Stay',
          options: { collapsible: true, collapsed: false },
          fields: [
            defineField({
              name: 'visitDate',
              title: 'Visit Date (optional)',
              type: 'datetime',
              description:
                'Which visit was this hotel for? Shown as a label when you have multiple stays.',
            }),
            defineField({
              name: 'hotel',
              type: 'reference',
              title: 'Linked Hotel Review (optional)',
              description: 'Link to an existing hotel review on this site.',
              to: [{ type: 'hotelReview' }],
            }),
            defineField({
              name: 'hotelName',
              type: 'string',
              title: 'Hotel Name (if no formal review)',
              description: 'Only needed if there is no linked hotel review above.',
            }),
            defineField({
              name: 'nightsStayed',
              type: 'number',
              title: 'Nights Stayed',
            }),
          ],
          preview: {
            select: {
              hotelTitle: 'hotel.title',
              hotelName: 'hotelName',
              date: 'visitDate',
            },
            prepare({ hotelTitle, hotelName, date }: { hotelTitle?: string; hotelName?: string; date?: string }) {
              const name = hotelTitle ?? hotelName ?? 'Unnamed hotel'
              const dateStr = date
                ? new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                : 'No date'
              return { title: `${name} · ${dateStr}` }
            },
          },
        },
      ],
    }),

    // --- Revisit History ---
    defineField({
      name: 'revisits',
      title: 'Revisit History',
      description:
        'Log subsequent visits. Only fill in the rating categories that actually changed.',
      type: 'array',
      hidden: ({ document }) => !document?.visited,
      of: [
        {
          type: 'object',
          title: 'Revisit',
          options: { collapsible: true, collapsed: false },
          fields: [
            defineField({
              name: 'visitDate',
              title: 'Visit Date',
              type: 'datetime',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'notes',
              title: 'What Changed?',
              description:
                'Describe what improved or declined since the original visit.',
              type: 'array',
              of: [{ type: 'block' }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'ratingUpdates',
              title: 'Changed Ratings Only',
              description:
                'Leave blank for any category that did NOT change. Enter a value to override it.',
              type: 'object',
              options: { collapsible: true, collapsed: true, columns: 3 },
              fields: [
                {
                  name: 'transportation',
                  title: 'Transportation',
                  type: 'number',
                  validation: (rule) => rule.min(1).max(10),
                },
                {
                  name: 'walkability',
                  title: 'Walkability',
                  type: 'number',
                  validation: (rule) => rule.min(1).max(10),
                },
                {
                  name: 'seatComfort',
                  title: 'Seat Comfort',
                  type: 'number',
                  validation: (rule) => rule.min(1).max(10),
                },
                {
                  name: 'food',
                  title: 'Food',
                  type: 'number',
                  validation: (rule) => rule.min(1).max(10),
                },
                {
                  name: 'view',
                  title: 'View',
                  type: 'number',
                  validation: (rule) => rule.min(1).max(10),
                },
                {
                  name: 'vibes',
                  title: 'Vibes',
                  type: 'number',
                  validation: (rule) => rule.min(1).max(10),
                },
              ],
            }),
          ],
          preview: {
            select: { date: 'visitDate' },
            prepare({ date }) {
              return {
                title: date
                  ? `Revisit: ${new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' })}`
                  : 'Revisit: No date set',
              }
            },
          },
        },
      ],
    }), // --- End Revisit History ---

    // --- FAQs for SEO rich results ---
    defineField({
      name: 'faqs',
      title: 'FAQs (for Google rich results)',
      type: 'array',
      description: 'Add 3–5 Q&A pairs that fans commonly ask about this arena. These appear as expandable answers in Google search results.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
            prepare({ title }) {
              return { title: title || 'FAQ item' }
            },
          },
        },
      ],
    }),
  ], // --- End Main Fields Array ---

  // --- Document Preview Configuration ---
  preview: {
    select: {
      title: 'name',
      location: 'location',
      visited: 'visited',
      media: 'arenaImage', // Card image
      heroMedia: 'heroPhotos.0', // Falls back to hero photo #1
      fallbackMedia: 'photoGallerySection.mainImage', // Legacy hero
    },
    prepare(selection) {
      const { title, location, visited, media, heroMedia, fallbackMedia } =
        selection
      const status = visited ? '✅ Visited' : '❌ Not Visited'
      return {
        title: title,
        subtitle: `${location} (${status})`,
        media: media || heroMedia || fallbackMedia,
      }
    },
  }, // --- End Preview ---
}) // --- End defineType ---
