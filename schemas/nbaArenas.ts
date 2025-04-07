// schemas/arenas.js
import { StarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

// --- Helper Function for Verdict Character Count ---
// Calculates the plain text length of Portable Text content
const getPortableTextLength = (blocks) => {
  if (!Array.isArray(blocks)) {
    return 0;
  }
  return blocks
    // Filter out non-text blocks if any (e.g., images)
    .filter(block => block._type === 'block' && Array.isArray(block.children))
    // Map each block to its text content by joining the text of its children (spans)
    .map(block => block.children.map(span => span.text || '').join(''))
    // Join the text content of all blocks
    .join('\n') // Count newlines between blocks
    .length;
};
// --- End Helper Function ---

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
      options: {
        source: 'name',
        maxLength: 96,
      },
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
      options: {
        dateFormat: 'YYYY-MM-DD',
      }
    }),

    // --- Images & Gallery ---
    defineField({
      name: 'arenaImage', // Main image for cards/lists
      title: 'Arena Image (Card/List View)',
      type: 'image',
      description: 'Image used for previews. Size suggestion: 350x205.',
      options: {
        hotspot: true,
      },
       fields: [
         defineField({
            name: 'alt',
            title: 'Alternative Text',
            type: 'string',
            description: 'REQUIRED: Describe the image.',
            validation: (Rule) => Rule.required().error('Alt text is required.'),
            // options: { isHighlighted: true }
         })
      ],
       // validation: (Rule) => Rule.required(), // Consider if required
    }),
    defineField({
        name: 'photoGallerySection', // Main Photo Gallery (1+4 layout)
        title: 'Arena Photo Gallery (1 Main + 4 Others)',
        type: 'photoGallery', // References 'photoGallery' object schema
        description: 'Add the main photo and exactly four supporting photos for the detailed arena page gallery.',
        // validation: Rule => Rule.required() // Uncomment if required
    }),
    defineField({
      name: 'gallery', // Changed from 'gallery' for team logos
      title: 'Teams / Logos',
      description: 'Logos/info for teams associated with the arena. Logo size suggestion: 96x96.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Team Name', validation: (Rule) => Rule.required() }),
            defineField({ title: 'Did we see this team play?', name: 'played', type: 'boolean' }),
            defineField({
              title: 'Team type',
              name: 'teamType',
              type: 'string',
              options: {
                list: [ { title: 'NBA', value: 'nba' }, { title: 'WNBA', value: 'wnba' } ],
                layout: 'radio',
              },
            }),
            defineField({ name: 'link', type: 'url', title: 'Link to Team/Arena Page (Optional)' }),
            defineField({
              name: 'alt',
              title: 'Logo Alt Text',
              type: 'string',
              description: 'REQUIRED: e.g., "Los Angeles Lakers Logo"',
              validation: Rule => Rule.required().error('Alt text for the logo is required.'),
              // options: { isHighlighted: true }
            })
          ],
          preview: {
            select: { title: 'name', subtitle: 'teamType', media: 'asset' },
            prepare(selection) {
              const {title, subtitle, media} = selection;
              return {
                title: title || 'No team name',
                subtitle: subtitle ? subtitle.toUpperCase() : '',
                media: media
              }
            }
          }
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
      hidden: ({ document }) => !document?.visited, // Hide if not visited
    }),

    // --- Pros / Cons / Verdict Group ---
    defineField({
      name: 'prosConsVerdict',
      title: 'Pros, Cons, & Verdict',
      type: 'object',
      description: 'Summarize the positive, negative, and concluding points about visiting this arena.',
      options: { collapsible: true, collapsed: false },
      // This group is hidden entirely if the arena wasn't visited
      hidden: ({ document }) => !document?.visited,
      fields: [
        // Positives
        defineField({
          title: 'Pros (Positives)',
          name: 'positives',
          description: 'Add multiple positive points about the arena experience.',
          type: 'array',
          of: [ { type: 'string', title: 'Pro', placeholder: 'e.g., Great food variety' } ],
        }),
        // Negatives
        defineField({
          title: 'Cons (Negatives)',
          name: 'negatives',
          description: 'Add multiple negative points about the arena experience.',
          type: 'array',
          of: [ { type: 'string', title: 'Con', placeholder: 'e.g., Expensive parking' } ],
        }),
        // Verdict (Portable Text with Character Limit)
        defineField({
          name: 'verdict',
          title: 'Overall Verdict',
          description: 'Write a concluding summary (max 600 characters). Basic formatting is allowed.', // Description updated
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
          // --- VALIDATION FOR CHARACTER LIMIT ---
          validation: Rule => Rule.custom((portableTextValue) => {
            const textLength = getPortableTextLength(portableTextValue);
            const limit = 600;
            if (textLength > limit) {
              return `Verdict exceeds ${limit} characters (${textLength}/${limit})`;
            }
            return true; // Validation passes
          }).error() // Makes it a hard error
          // --- END VALIDATION ---
        }) // --- End Verdict ---
      ] // --- End of fields INSIDE the group ---
    }), // --- End of the GROUPING Fieldset ---

    // --- Detailed Ratings ---
    defineField({
      name: 'arenaReview', // References 'arenaReview' object/document type
      title: 'Arena Rating Breakdown',
      type: 'arenaReview',
      hidden: ({ document }) => !document?.visited, // Hide if not visited
      validation: (Rule) => Rule.custom((value, context) => {
        if (context.document?.visited && !value) {
          return 'Arena review is required if you have visited the arena.';
        }
        return true;
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
       fallbackMedia: 'arenaImage' // Fallback to the card image
     },
     prepare(selection) {
       const { title, location, visited, media, fallbackMedia } = selection;
       const status = visited ? '✅ Visited' : '❌ Not Visited';
       return {
         title: title,
         subtitle: `${location} (${status})`,
         media: media || fallbackMedia
       };
     },
   }, // --- End Preview ---

}) // --- End defineType ---