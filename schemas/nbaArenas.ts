// schemas/nbaArenas.ts
import { StarIcon, ImagesIcon } from '@sanity/icons' // Added ImagesIcon
import { defineField, defineType } from 'sanity'

// --- Helper Function for Verdict Character Count ---
const getPortableTextLength = (blocks) => {
  if (!Array.isArray(blocks)) {
    return 0
  }
  return blocks
    .filter((block) => block._type === 'block' && Array.isArray(block.children))
    .map((block) => block.children.map((span) => span.text || '').join(''))
    .join('\n').length
}

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

    // --- Images & Galleries ---
    defineField({
      name: 'arenaImage', // Main image for cards/lists
      title: 'Arena Image (Card/List View)',
      type: 'image',
      description: 'Image used for previews. Size suggestion: 350x205.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'REQUIRED: Describe the image.',
          // validation: (Rule) => Rule.required().error('Alt text is required.'),
          // options: { isHighlighted: true } // Removed previously
        }),
      ],
      // validation: (Rule) => Rule.required(), // Consider if required
    }),
    defineField({
      name: 'photoGallerySection', // Main Photo Gallery (1+4 layout)
      title: 'Arena Photo Gallery (1 Main + 4 Others)',
      type: 'photoGallery', // References 'photoGallery' object schema
      description:
        'Add the main photo and exactly four supporting photos for the detailed arena page gallery.',
      // validation: Rule => Rule.required() // Uncomment if required
    }),

    // --- NEW Image Gallery Field ---
    defineField({
      name: 'imageGallery', // New field name
      title: 'Image Gallery',
      description:
        'Upload multiple photos of the arena (interior, exterior, food, views, etc.). Add descriptive alt text for each.',
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
            }),
            // Optional Caption
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional: Add a brief caption for the image.',
            }),
          ],

          // Optional: Preview configuration for images within the array
          preview: {
            select: {
              imageUrl: 'asset.url',
              title: 'caption',
              subtitle: 'alt',
            },
          },
        },
      ],
    }),
    // --- END NEW Image Gallery Field ---

    defineField({
      name: 'gallery', // Renamed field for Teams / Logos
      title: 'Teams / Logos',
      description:
        'Logos/info for teams associated with the arena. Logo size suggestion: 96x96.',
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
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              title: 'Did we see this team play?',
              name: 'played',
              type: 'boolean',
            }),
            defineField({
              title: 'Team type',
              name: 'teamType',
              type: 'string',
              options: {
                list: [
                  { title: 'NBA', value: 'nba' },
                  { title: 'WNBA', value: 'wnba' },
                ],
                layout: 'radio',
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
              // options: { isHighlighted: true } // Removed previously
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
            'Add multiple positive points about the arena experience.',
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
            'Add multiple negative points about the arena experience.',
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
              const textLength = getPortableTextLength(portableTextValue)
              const limit = 600
              if (textLength > limit) {
                return `Verdict exceeds ${limit} characters (${textLength}/${limit})`
              }
              return true
            }).error(),
        }), // --- End Verdict ---
      ], // --- End of fields INSIDE the group ---
    }), // --- End of the GROUPING Fieldset ---

    // --- Video URL Field ---
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube / Instagram)',
      description:
        'Optional: Add a link to a relevant YouTube video or Instagram post/reel.',
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
  ], // --- End Main Fields Array ---

  // --- Document Preview Configuration ---
  preview: {
    select: {
      title: 'name',
      location: 'location',
      visited: 'visited',
      media: 'photoGallerySection.mainImage', // Use the specific gallery main image
      fallbackMedia: 'arenaImage', // Fallback to the card image
    },
    prepare(selection) {
      const { title, location, visited, media, fallbackMedia } = selection
      const status = visited ? '✅ Visited' : '❌ Not Visited'
      return {
        title: title,
        subtitle: `${location} (${status})`,
        media: media || fallbackMedia,
      }
    },
  }, // --- End Preview ---
}) // --- End defineType ---
