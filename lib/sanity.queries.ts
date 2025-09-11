import { groq } from 'next-sanity'

// ------------------------------
// 1. Core Field Definitions
// ------------------------------

// LEGACY CORE FIELDS REMOVED - These included linkType which doesn't exist in independent schemas

// ------------------------------
// 2. Rating Field Definitions
// ------------------------------
// LEGACY RATING FIELDS REMOVED - These were only used by legacy field fragments
// Modern queries define rating fields inline as needed

// ------------------------------
// 3. Reusable Content-Type Specific Field Sets
// ------------------------------

// LEGACY FIELD FRAGMENTS REMOVED - These were only used by the legacy combined field definitions

// ------------------------------
// 4. Combined Field Definitions
// ------------------------------
// LEGACY FIELD DEFINITIONS REMOVED - These referenced the legacy post schema with linkType
// Modern queries use schema-specific field definitions directly

// ------------------------------
// 5. Specialized Field Sets
// ------------------------------

const recommendationFields = groq`
    _id,
    title,
    listType,
    recommendations[] {
        post->{
            _id, // Added _id for key prop usage
            title,
            "slug": slug.current,
            coverImage,
            location,
            linkType
        }
    }
`

const travelEssentialFields = groq`
    _id,
    name,
    link,
    background,
    date,
    description,
    recommend,
    price,
    productImage,
    categoryName
`

// Optimized arenaFields for listing page - reduced payload
const arenaFields = groq`
    _id,
    name,
    "slug": slug.current, 
    arenaImage,
    "firstGalleryImage": gallery[0],
    location,
    buildDate,
    capacity,
    visited,
    arenaReview {
      transportation,
      walkability,
      vibes,
      view,
      seatComfort,
      food
    },
    date
`

// Full arenaFields for individual arena pages
const arenaFieldsDetailed = groq`
    _id,
    name,
    "slug": slug.current, 
    arenaImage,
    gallery,
    location,
    buildDate,
    capacity,
    photoGallerySection,
    imageGallery,
    visited,
    videoUrl,
    prosConsVerdict { 
      positives,     
      negatives,     
      verdict       
    },
    arenaReview {
      transportation,
      walkability,
      vibes,
      view,
      seatComfort,
      food
    },
    date
`
// Define Arena Type Name - PLEASE VERIFY THIS matches your Sanity Studio schema
const ARENA_TYPE_NAME = 'arenas' // Or 'arena' - CHECK YOUR SCHEMA

// ------------------------------
// 6. Generic Query Functions
// ------------------------------

/**
 * Constructs a Groq query to fetch documents of a specific type.
 * Includes handling for slice parameters which are passed at fetch time.
 */
const fetchDocuments = (
  type: string,
  fields: string,
  options: { order?: string; where?: string; slice?: string } = {},
): string => {
  let query = `*[_type == "${type}"`
  if (options.where) {
    query += ` && (${options.where})` // Ensure 'where' is enclosed if complex
  }
  query += `]`
  if (options.order) {
    query += ` | order(${options.order})`
  }
  // Apply slice if provided (e.g., '[$start...$end]' or '[0...10]')
  if (options.slice) {
    // The actual values for $start/$end are added by the client fetch call
    query += ` ${options.slice}`
  }
  query += ` {${fields}}`
  return query
}

// LEGACY FUNCTION REMOVED - fetchDocumentAndRelated used legacy field definitions

/**
 * Constructs a Groq query to fetch slugs for a given document type.
 */
const fetchSlugs = (type: string, filter?: string): string => {
  let query = `*[_type == "${type}"`
  if (filter) {
    query += ` && (${filter})` // Enclose filter
  }
  query += ` && defined(slug.current)][].slug.current`
  return query
}

/**
 * Constructs a Groq query to fetch a single document by slug.
 */
const fetchDocumentBySlug = (
  type: string,
  fields: string,
  slugField: string,
  filter?: string,
): string => {
  let query = `*[_type == "${type}" && ${slugField} == $slug`
  if (filter) {
    query += ` && (${filter})` // Enclose filter
  }
  query += `][0] {${fields}}`
  return query
}

// ------------------------------
// 7. Exported Queries (General, Slugs, By Slug, Fetch All Type)
// ------------------------------

export const recommendationQuery = fetchDocuments(
  'recommendationList',
  recommendationFields,
  {
    order: 'date desc, _updatedAt desc',
  },
)

export const travelEssentialQuery = fetchDocuments(
  'essential',
  travelEssentialFields,
  {
    order: 'date desc, _updatedAt desc',
  },
)

// --- Arena Queries ---
export const arenaQuery = fetchDocuments(ARENA_TYPE_NAME, arenaFields, {
  order: 'name asc',
})

// --- NEW: Arena Slugs Query ---
// Fetches just the slugs for all arenas, needed for getStaticPaths
export const arenaSlugsQuery = fetchSlugs(
  ARENA_TYPE_NAME,
  'defined(slug.current)',
)

// --- NEW: Single Arena By Slug Query ---
// Fetches a single arena document based on its slug
export const arenaBySlugQuery = fetchDocumentBySlug(
  ARENA_TYPE_NAME,
  arenaFieldsDetailed, // Use the detailed fields for individual pages
  'slug.current',
)
// --- End Arena Queries ---

// --- NEW: Independent Guide Document Queries ---
export const independentGuideFields = groq`
  _id,
  title,
  date,
  coverImage,
  category,
  content,
  gallery,
  tags,
  "slug": slug.current
`

// Guide slugs query
export const guideSlugsQuery = fetchSlugs('guide')

// Single guide by slug
export const guideBySlugQuery = fetchDocumentBySlug(
  'guide',
  independentGuideFields,
  'slug.current',
)

// Minimal guide query for preview API
export const guideBySlugPreviewQuery = groq`
  *[_type == "guide" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category
  }
`

// All guides query
export const allGuidesQuery = groq`
  *[_type == "guide"] | order(date desc) {
    ${independentGuideFields}
  }
`

// Guides by category
export const guidesByCategoryQuery = groq`
  *[_type == "guide" && category == $category] | order(date desc) {
    ${independentGuideFields}
  }
`
// --- End Independent Guide Document Queries ---

// --- NEW: Independent Hotel Review Document Queries ---
export const independentHotelReviewFields = groq`
  _id,
  title,
  date,
  location,
  category,
  room,
  lounge,
  coverImage,
  excerpt2,
  blurbSource,
  blurbUrl,
  tip,
  gallery,
  youtube,
  hotelRating,
  internetSpeed,
  roomAmenities,
  techRating,
  positives,
  negatives,
  verdict,
  content,
  tags,
  "slug": slug.current
`

// Hotel review slugs query
export const hotelReviewSlugsQuery = fetchSlugs('hotelReview')

// Single hotel review by slug
export const hotelReviewBySlugQuery = fetchDocumentBySlug(
  'hotelReview',
  independentHotelReviewFields,
  'slug.current',
)

// Minimal hotel review query for preview API
export const hotelReviewBySlugPreviewQuery = groq`
  *[_type == "hotelReview" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    location
  }
`

// All hotel reviews query
export const allHotelReviewsQuery = groq`
  *[_type == "hotelReview"] | order(date desc) {
    ${independentHotelReviewFields}
  }
`

// Top hotel reviews for rankings/top lists
export const topHotelReviewsQuery = groq`
  *[_type == "hotelReview" && defined(hotelRating)] {
    ${independentHotelReviewFields}
  }
`

// Hotel reviews by category
export const hotelReviewsByCategoryQuery = groq`
  *[_type == "hotelReview" && category == $category] | order(date desc) {
    ${independentHotelReviewFields}
  }
`
// --- End Independent Hotel Review Document Queries ---

// --- NEW: Independent Food Review Document Queries ---
export const independentFoodReviewFields = groq`
  _id,
  title,
  date,
  location,
  diningType,
  coverImage,
  excerpt2,
  tip,
  individualFoodRating,
  gallery,
  youtube,
  foodRating,
  takeoutRating,
  positives,
  negatives,
  verdict,
  content,
  tags,
  "slug": slug.current
`

// Top food reviews for rankings/top lists
export const topFoodReviewsQuery = groq`
  *[_type == "foodReview" && (defined(foodRating) || defined(takeoutRating))] {
    ${independentFoodReviewFields}
  }
`

// Food review slugs query
export const foodReviewSlugsQuery = fetchSlugs('foodReview')

// Single food review by slug
export const foodReviewBySlugQuery = fetchDocumentBySlug(
  'foodReview',
  independentFoodReviewFields,
  'slug.current',
)

// Minimal food review query for preview API
export const foodReviewBySlugPreviewQuery = groq`
  *[_type == "foodReview" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    diningType,
    location
  }
`

// All food reviews query
export const allFoodReviewsQuery = groq`
  *[_type == "foodReview"] | order(date desc) {
    ${independentFoodReviewFields}
  }
`

// Food reviews by dining type
export const foodReviewsByDiningTypeQuery = groq`
  *[_type == "foodReview" && diningType == $diningType] | order(date desc) {
    ${independentFoodReviewFields}
  }
`
// --- End Independent Food Review Document Queries ---

// Export Guide type
export interface Guide {
  _id: string
  title?: string
  slug?: string
  excerpt2?: any[] // Changed to array for PortableText
  coverImage?: any
  date?: string
  category?: string
  content?: any[]
  gallery?: any[] // Changed to array for standard gallery
  tip?: any[]
  tags?: string[]
}

// Export HotelReview type
export interface HotelReview {
  _id: string
  title?: string
  slug?: string
  date?: string
  location?: string
  category?: string
  room?: string
  lounge?: string
  coverImage?: any
  excerpt2?: any[]
  blurbSource?: string
  blurbUrl?: string
  tip?: any[]
  gallery?: any[]
  youtube?: string
  hotelRating?: {
    Value?: number
    Gym?: number
    Internet_Speed?: number
    Service?: number
    Room_Cleanliness?: number
    Bed_Comfort?: number
    Room_Amenities?: number
    Pool?: number
    Location?: number
  }
  internetSpeed?: number
  roomAmenities?: any
  techRating?: any
  positives?: string[]
  negatives?: string[]
  verdict?: any[]
  content?: any[]
  tags?: string[]
}

// Export FoodReview type
export interface FoodReview {
  _id: string
  title?: string
  slug?: string
  date?: string
  location?: string
  diningType?: 'dinein' | 'takeout'
  coverImage?: any
  excerpt2?: any[]
  tip?: any[]
  individualFoodRating?: any[]
  gallery?: any[]
  youtube?: string
  foodRating?: any
  takeoutRating?: any
  positives?: string[]
  negatives?: string[]
  verdict?: any[]
  content?: any[]
  tags?: string[]
}

// Unified content type for independent schemas (no legacy posts)
export interface IndependentContentItem {
  _id: string
  title?: string
  slug?: string
  date?: string
  location?: string
  coverImage?: any
  contentType: 'guide' | 'hotelReview' | 'foodReview'
  category?: string // for guides and hotel reviews
  diningType?: 'dinein' | 'takeout' // for food reviews only
}

// Response type for latest independent content query
export interface LatestIndependentContentResponse {
  allContent: IndependentContentItem[]
}

export const settingsQuery = groq`*[_type == "settings"][0]`

// REMOVED: Legacy indexQuery - replaced by latestIndependentContentQuery

// Combined latest content query that merges and sorts all independent content types
export const latestIndependentContentQuery = groq`
{
  "allContent": [
    ...*[_type == "guide"] | order(date desc) [0...10] {
      ${independentGuideFields},
      _type
    },
    ...*[_type == "hotelReview"] | order(date desc) [0...10] {
      ${independentHotelReviewFields},
      _type
    },
    ...*[_type == "foodReview"] | order(date desc) [0...10] {
      ${independentFoodReviewFields},
      _type
    }
  ] | order(date desc) [0...6]
}`

// Post Slugs and Single Post Fetching (Generic)
// REMOVED: Legacy post queries - replaced by independent schema queries
// postSlugsQuery -> use hotelReviewSlugsQuery/foodReviewSlugsQuery/guideSlugsQuery
// postBySlugQuery -> use hotelReviewBySlugQuery/foodReviewBySlugQuery/guideBySlugQuery
// postAndMoreStoriesQuery -> use specific schema queries with related content

// REMOVED: Legacy linkType-specific queries - replaced by independent schema queries
// hotelSlugsQuery -> hotelReviewSlugsQuery
// storySlugsQuery -> guideSlugsQuery
// foodSlugsQuery -> foodReviewSlugsQuery
// hotelBySlugQuery -> hotelReviewBySlugQuery
// storyBySlugQuery -> guideBySlugQuery
// foodBySlugQuery -> foodReviewBySlugQuery

// REMOVED: Legacy linkType-specific related and collection queries
// hotelAndMoreQuery -> hotelReviewAndMoreQuery (if needed)
// storyAndMoreQuery -> guideAndMoreQuery (if needed)
// foodAndMoreQuery -> foodReviewAndMoreQuery (if needed)
// allHotelsQuery -> allHotelReviewsQuery
// allFoodQuery -> allFoodReviewsQuery
// allStoriesQuery -> allGuidesQuery

// Global Search Query - Searches across all independent schemas
export const globalSearchQuery = groq`
{
  "hotels": *[_type == "hotelReview" && (
    title match $searchTerm ||
    location match $searchTerm ||
    excerpt2 match $searchTerm ||
    category match $searchTerm
  )] {
    ${independentHotelReviewFields},
    "_contentType": "hotel"
  },
  "food": *[_type == "foodReview" && (
    title match $searchTerm ||
    location match $searchTerm ||
    excerpt2 match $searchTerm ||
    diningType match $searchTerm
  )] {
    ${independentFoodReviewFields},
    "_contentType": "food"
  },
  "guides": *[_type == "guide" && (
    title match $searchTerm ||
    location match $searchTerm ||
    excerpt2 match $searchTerm ||
    guideType match $searchTerm
  )] {
    ${independentGuideFields},
    "_contentType": "guide"
  }
}`

// REMOVED: Legacy weighted queries - replaced by new weighted calculation functions
// topWeightedHotelsQuery -> getTopWeightedHotelReviews() in sanity.client.ts
// topWeightedFoodQuery -> getTopWeightedFoodReviews() in sanity.client.ts

// --- PAGINATION QUERIES ---
// LEGACY QUERIES REMOVED - Use independent schema queries instead:
// - For hotels: Use hotelReviewsQuery with slice parameters
// - For food: Use foodReviewsQuery with slice parameters
// - For guides: Use guidesQuery with slice parameters
// - For all content: Use latestIndependentContentQuery with slice parameters

// ------------------------------
// 9. Interfaces
// ------------------------------

export interface ProsConsVerdict {
  positives?: string // Adjust type based on your schema
  negatives?: string // Adjust type based on your schema
  verdict?: string // Adjust type based on your schema
}

export interface Author {
  name?: string
  picture?: any // Consider more specific type e.g., SanityImageObject
}

export interface Recommendation {
  _id: string
  title?: string
  recommendations?: {
    post?: {
      _id: string // Add _id
      // author?: Author // Maybe not needed for recommendation link
      // date?: string // Maybe not needed
      // current?: string // Not applicable here
      title?: string
      // excerpt2?: any // Maybe not needed
      // category?: string // Maybe not needed
      slug?: { current: string }
      coverImage?: any // SanityImageObject
      location?: string
      linkType?: string
    }
  }[]
  listType?: string
}

export interface Essential {
  _id: string
  name?: string
  link?: string
  background?: string
  description?: any // Consider PortableTextBlock
  productImage?: any // SanityImageObject
  categoryName?: string
  recommend?: boolean
  price?: number
  date?: string
}

// UPDATED Arena Interface - optimized for listing page
export interface Arena {
  _id: string
  name?: string
  slug?: string
  arenaImage?: any // SanityImageObject
  firstGalleryImage?: any // Single gallery image for listing
  gallery?: any[] // Full gallery for detailed pages
  imageGallery?: any // For detailed pages
  photoGallerySection?: {
    mainImage?: any // SanityImageObject
    otherImages?: any[] // SanityImageObject[]
  }
  location?: string
  buildDate?: string
  capacity?: number
  videoUrl?: string
  prosConsVerdict?: {
    positives?: any
    negatives?: any
    verdict?: any
  }
  arenaReview?:
    | {
        transportation?: number
        walkability?: number
        vibes?: number
        view?: number
        seatComfort?: number
        food?: number
      }
    | any // Or use 'any' or PortableTextBlock if it's simple content
  visited?: boolean
  date?: string
  teamType?: string // Keep if you use this field
  // Remove calculated fields if not fetched in arenaFields
  // visitedCount?: number
  // galleryCount?: number
}

// Base interface for common Post fields
interface BasePost {
  _id: string
  title?: string
  coverImage?: any // SanityImageObject
  date?: string
  excerpt2?: string
  author?: Author
  slug?: string // Note: slug is projected as string, not object here
  content?: any // PortableTextBlock
  youtube?: any // Specific type if available
  location?: string
  linkType?: 'hotel' | 'food' | 'story' | string // Use specific types + string fallback
  positives?: any // PortableTextBlock
  negatives?: any // PortableTextBlock
  verdict?: any // PortableTextBlock
  gallery?: any[] // SanityImageObject[]
  // color?: string // Removed if not used
  category?: string
  tip?: string
  showRating?: boolean // This seems like a presentation concern, maybe remove from data?
}

// Interface combining BasePost with all possible specific fields
// Used for generic fetching where type might be mixed or unknown upfront
export interface Post extends BasePost {
  // Hotel specific (optional)
  room?: any
  internetSpeed?: number
  techRating?: any
  roomAmenities?: any
  hotelRating?: {
    Value?: number
    Gym?: number
    Internet_Speed?: number
    Service?: number
    Room_Cleanliness?: number
    Bed_Comfort?: number
    Room_Amenities?: number
    Pool?: number
    Location?: number
  }
  // Food specific (optional)
  foodRating?: {
    Flavor_and_Taste?: number
    Food_Value?: number
    Restaurant_Location?: number
    Presentation_on_Plate?: number
    Restaurant_Service?: number
    Memorability?: number
    Restaurant_Cleanliness?: number
  }
  takeoutRating?: {
    // Optional if defined
    tasteAndFlavor?: number
    presentation?: number
    accuracy?: number
    packaging?: number
    overallSatisfaction?: number
    foodValue?: number
  }
  // takeoutRating?: number; // Alternative if simple type
  diningType?: 'dinein' | 'takeout'
  individualFoodRating?: any // Needs definition if used

  // Calculated fields (optional, added by specific queries)
  weightedAverageRating?: number
  totalAverageRating?: number
}

// Specific type interfaces (can extend BasePost or Post)
export interface Story extends BasePost {
  // No story-specific fields defined yet
}

export interface Food extends BasePost {
  foodRating?: Post['foodRating'] // Reuse from Post
  takeoutRating?: Post['takeoutRating'] // Reuse from Post
  diningType?: Post['diningType'] // Reuse from Post
}

export interface Hotel extends BasePost {
  room?: Post['room']
  internetSpeed?: Post['internetSpeed']
  techRating?: Post['techRating']
  roomAmenities?: Post['roomAmenities']
  hotelRating?: Post['hotelRating']
}

// Settings Interface
export interface Settings {
  title?: string
  description?: any[] // PortableTextBlock[]
  ogImage?: {
    asset: any
    title?: string
    // Add image asset reference if needed: image?: any
  }
}

// Instagram Interface
export interface Instagram {
  // Define based on actual API response structure
  id?: string
  caption?: string
  media_url?: string
  timestamp?: string
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | string
  permalink?: string
  thumbnail_url?: string // For videos
  username?: string
  // Add children field if handling CAROUSEL_ALBUM
  // children?: { data: { id: string; media_url: string; media_type: string }[] }
}

// --- IMPORTANT ---
// The code above defines the GROQ query *strings*.
// You still need to create the actual asynchronous functions
// (like getArenaBySlug and getAllArenaSlugs) in your
// `lib/sanity.client.ts` file. Those functions will import
// these query strings (arenaBySlugQuery, arenaSlugsQuery)
// and use your configured Sanity client instance (`client.fetch(...)`)
// to execute them.
