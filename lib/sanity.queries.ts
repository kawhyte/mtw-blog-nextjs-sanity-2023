import { groq } from 'next-sanity'

// ------------------------------
// 1. Core Field Definitions
// ------------------------------

const coreFields = groq`
    _id,
    title,
    date,
    excerpt2,
    coverImage,
    youtube,
    location,
    gallery,
    positives,
    negatives,
    verdict,
    tip,
    "slug": slug.current,
    "author": author->{name, picture},
    linkType,
    category
`
const coreFieldsLimited = groq`
    _id,
    title,
    date,

    coverImage,

    location,


    "slug": slug.current,

    linkType,
    category
`

// ------------------------------
// 2. Reusable Rating Field Definitions
// ------------------------------

const hotelRatingFields = groq`
    hotelRating{
        Value,
        Gym,
        Internet_Speed,
        Service,
        Room_Cleanliness,
        Bed_Comfort,
        Room_Amenities,
        Pool,
        Location
    }
`

const foodRatingFields = groq`
    foodRating{
        Flavor_and_Taste,
        Food_Value,
        Restaurant_Location,
        Presentation_on_Plate,
        Restaurant_Service,
        Memorability,
        Restaurant_Cleanliness
    }
`
// NOTE: Assuming a similar structure might exist or be needed for takeoutRating if it's an object
const takeoutRatingFields = groq`
    takeoutRating{
      tasteAndFlavor,
      presentation,
      accuracy,
      packaging,
      overallSatisfaction,
      foodValue
    }
`


// ------------------------------
// 3. Reusable Content-Type Specific Field Sets
// ------------------------------

const postFieldsFragment = groq`
    individualFoodRating, // Assuming this exists
    room,
    internetSpeed,
    techRating,
    roomAmenities,
    ${hotelRatingFields},
    ${foodRatingFields},
    ${takeoutRatingFields}, // Include if takeoutRating is an object
    // takeoutRating, // Use this if takeoutRating is a simple type (e.g., number)
    diningType
`

const hotelFieldsFragment = groq`
    room,
    internetSpeed,
    ${hotelRatingFields},
    techRating,
    roomAmenities
`
const hotelFieldsFragmentLimited = groq`
    ${hotelRatingFields},
`

const foodFieldsFragment = groq`
    ${foodRatingFields},
    ${takeoutRatingFields}, // Include if takeoutRating is an object
    // takeoutRating, // Use this if takeoutRating is a simple type
    diningType
`
const foodFieldsFragmentLimited = groq`
    ${foodRatingFields},
    ${takeoutRatingFields}, // Include if takeoutRating is an object
    // takeoutRating, // Use this if takeoutRating is a simple type
    diningType
`

const guideFieldsFragment = groq`` // No specific fields for guides yet

// ------------------------------
// 4. Combine Core and Specific Fields
// ------------------------------

const postFields = groq`
    ${coreFields},
    ${postFieldsFragment}
`

const hotelFields = groq`
    ${coreFields},
    ${hotelFieldsFragment}
`
const hotelFieldsLimited = groq`
    ${coreFieldsLimited},
    ${hotelFieldsFragmentLimited}
`

const foodFields = groq`
    ${coreFields}, // Use full core fields for single food view
    ${foodFieldsFragment}
`
const foodFieldsLimited = groq`
    ${coreFieldsLimited}, // Use limited core fields for food list view
    ${foodFieldsFragmentLimited}
`

const guideFields = groq`
    ${coreFields}, // Use full core fields for single guide view
    ${guideFieldsFragment}
`
const guideFieldsLimited = groq`
    ${coreFieldsLimited}, // Use limited core fields for guide list view
    ${guideFieldsFragment}
`

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

const arenaFields = groq`
    _id,
    name,
    arenaImage,
    gallery,
    location,
    buildDate,
    capacity,
    arenaReview,
    visited,
    date,
    "visitedCount": count(*[_type == 'arenas' && visited == true]),
    "galleryCount": count(gallery)
`

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
    options: { order?: string; where?: string; slice?: string } = {}
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


/**
 * Constructs a Groq query to fetch a single document by slug and related documents.
 */
const fetchDocumentAndRelated = (
  type: string,
  fields: string,
  slugField: string,
  relatedOptions: { where?: string } = {}
): string => {
  let relatedWhere = relatedOptions.where ? `&& (${relatedOptions.where})` : '' // Enclose where
  return groq`
        {
            "post": *[_type == "${type}" && ${slugField} == $slug] | order(_updatedAt desc) [0] {
                content,
                ${fields}
            },
            "morePosts": *[_type == "${type}" && ${slugField} != $slug ${relatedWhere}] | order(date desc, _updatedAt desc) [0...2] {
                content,
                // Use limited fields for related posts if desired for performance
                ${coreFieldsLimited} // Example: Using limited fields
            }
        }
    `
}

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
  filter?: string
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
  }
)

export const travelEssentialQuery = fetchDocuments(
  'essential',
  travelEssentialFields,
  {
    order: 'date desc, _updatedAt desc',
  }
)

export const arenaQuery = fetchDocuments('arenas', arenaFields, {
  order: 'name asc',
})

export const settingsQuery = groq`*[_type == "settings"][0]`

// Index query (example: first 6 of any post type, using limited fields)
export const indexQuery = fetchDocuments('post', coreFieldsLimited, {
    order: 'date desc, _updatedAt desc',
    slice: '[0...6]',
  })

// Post Slugs and Single Post Fetching (Generic)
export const postSlugsQuery = fetchSlugs('post')

export const postBySlugQuery = fetchDocumentBySlug(
  'post',
  postFields, // Use full fields for single generic post
  'slug.current'
)

export const postAndMoreStoriesQuery = fetchDocumentAndRelated(
  'post',
  postFields, // Fields for main post
  'slug.current'
  // Related posts will use coreFieldsLimited as defined in helper
)

// Type-Specific Slugs
export const hotelSlugsQuery = fetchSlugs('post', 'linkType == "hotel"')
export const storySlugsQuery = fetchSlugs('post', 'linkType == "story"')
export const foodSlugsQuery = fetchSlugs('post', 'linkType == "food"')

// Type-Specific Single Item Fetching
export const hotelBySlugQuery = fetchDocumentBySlug(
  'post',
  hotelFields, // Use full hotel fields
  'slug.current',
  'linkType == "hotel"'
)
export const storyBySlugQuery = fetchDocumentBySlug(
  'post',
  guideFields, // Use guide fields
  'slug.current',
  'linkType == "story"'
)
export const foodBySlugQuery = fetchDocumentBySlug(
  'post',
  foodFields, // Use full food fields
  'slug.current',
  'linkType == "food"'
)

// Type-Specific Single Item + Related Fetching
export const hotelAndMoreQuery = fetchDocumentAndRelated(
  'post',
  hotelFields, // Fields for main hotel post
  'slug.current',
  { where: 'linkType == "hotel"' }
)
export const storyAndMoreQuery = fetchDocumentAndRelated(
  'post',
  guideFields, // Fields for main guide post
  'slug.current',
  { where: 'linkType == "story"' }
)
export const foodAndMoreQuery = fetchDocumentAndRelated(
  'post',
  foodFields, // Fields for main food post
  'slug.current',
  { where: 'linkType == "food"' }
)

// Fetch ALL items of a specific type (NO pagination)
export const allHotelsQuery = fetchDocuments('post', hotelFieldsLimited, {
  order: 'date desc, _updatedAt desc',
  where: 'linkType == "hotel"',
})

export const allFoodQuery = fetchDocuments('post', foodFieldsLimited, {
  order: 'date desc, _createdAt desc',
  where: 'linkType == "food"',
})

export const allStoriesQuery = fetchDocuments('post', guideFieldsLimited, {
  order: 'date desc, _updatedAt desc',
  where: 'linkType == "story"',
})

// Global Search Query
export const globalSearchQuery = groq`
  *[_type == "post" && (
    title match $searchTerm ||
    location match $searchTerm
    // Add other fields to search here if needed
  )] {
    ${coreFieldsLimited} // Use limited fields for search results
  }
`

// ------------------------------
// 8. Top Weighted Queries
// ------------------------------
export const topWeightedHotelsQuery = groq`
  *[_type == "post" && defined(hotelRating) && linkType == "hotel"] {
    ${coreFieldsLimited},
    hotelRating{
      Value,
      Gym,
      Internet_Speed,
      Service,
      Room_Cleanliness,
      Bed_Comfort,
      Room_Amenities,
      Pool,
      Location
    },
    "weightedAverageRating": round(
      (
        (hotelRating.Location * 0.2) +
        (hotelRating.Bed_Comfort * 0.2) +
        (hotelRating.Room_Cleanliness * 0.1) +
        (hotelRating.Gym * 0.05) +
        (hotelRating.Pool * 0.05) +
        (hotelRating.Service * 0.15) +
        (hotelRating.Internet_Speed * 0.05) +
        (hotelRating.Room_Amenities * 0.1) +
        (hotelRating.Value * 0.1)
      ) * 1000
    ) / 1000,
    "totalAverageRating": round(
      (
        hotelRating.Value +
        hotelRating.Gym +
        hotelRating.Internet_Speed +
        hotelRating.Service +
        hotelRating.Room_Cleanliness +
        hotelRating.Bed_Comfort +
        hotelRating.Room_Amenities +
        hotelRating.Pool +
        hotelRating.Location
      ) / 9 * 1000
    ) / 1000
  }
  | order(totalAverageRating desc, hotelRating.Service desc, hotelRating.Location desc) [0...10]
`

export const topWeightedFoodQuery = groq`
*[_type == "post" && (defined(takeoutRating) || defined(foodRating)) && linkType == "food"] {
  ${coreFieldsLimited},
  diningType,
  foodRating, // Keep for dine-in
  takeoutRating, // Keep field for takeout ratings (assuming simple type or object structure)
  "weightedAverageRating": round(
    select(
      diningType == "dinein" && defined(foodRating) => (
        (foodRating.Restaurant_Location * 0.05) +
        (foodRating.Restaurant_Service * 0.2) +
        (foodRating.Food_Value * 0.15) +
        (foodRating.Presentation_on_Plate * 0.05) +
        (foodRating.Memorability * 0.15) +
        (foodRating.Restaurant_Cleanliness * 0.2) +
        (foodRating.Flavor_and_Taste * 0.2)
      ),
      diningType == "takeout" && defined(takeoutRating) => (
        // Adjust weights based on your takeoutRating structure/importance
        (takeoutRating.tasteAndFlavor * 0.3) +
        (takeoutRating.presentation * 0.1) +
        (takeoutRating.accuracy * 0.1) +
        (takeoutRating.packaging * 0.1) +
        (takeoutRating.overallSatisfaction * 0.2) +
        (takeoutRating.foodValue * 0.2)
      ),
      // Handle cases where diningType is not defined or rating is missing
      0
    ) * 1000
  ) / 1000
}
| order(weightedAverageRating desc, takeoutRating.tasteAndFlavor desc, foodRating.Flavor_and_Taste desc) [0...10]
`


// --- PAGINATION QUERIES ---

// -- Generic Post Pagination (Example - if needed) --
export const paginatedAllPostsQuery = fetchDocuments(
    'post',
    coreFieldsLimited, // Use limited fields for generic list
    {
        order: 'date desc, _createdAt desc',
        slice: '[$start...$end]'
    }
);
export const allPostsTotalCountQuery = groq`count(*[_type == "post"])`


// -- Hotel Pagination --
export const paginatedHotelPostsQuery = fetchDocuments(
    'post',
    hotelFieldsLimited,
    {
        order: 'date desc, _createdAt desc',
        where: 'linkType == "hotel"',
        slice: '[$start...$end]'
    }
);
export const hotelPostsTotalCountQuery = groq`
  count(*[_type == "post" && linkType == "hotel"])
`

// -- Food Pagination --
export const paginatedFoodPostsQuery = fetchDocuments(
    'post',
    foodFieldsLimited,
    {
        order: 'date desc, _createdAt desc',
        where: 'linkType == "food"',
        slice: '[$start...$end]'
    }
);
export const foodPostsTotalCountQuery = groq`
  count(*[_type == "post" && linkType == "food"])
`;

// -- Guide/Story Pagination --
export const paginatedGuidePostsQuery = fetchDocuments(
    'post',
    guideFieldsLimited, // Assuming limited fields for guides
    {
        order: 'date desc, _createdAt desc',
        where: 'linkType == "story"', // Assuming 'story' is the linkType for guides
        slice: '[$start...$end]'
    }
);

export const guidePostsTotalCountQuery = groq`
  count(*[_type == "post" && linkType == "story"]) // Assuming 'story' is the linkType
`;


// ------------------------------
// 9. Interfaces
// ------------------------------

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

export interface Arena {
  _id: string
  name?: string
  arenaImage?: any // SanityImageObject
  gallery?: any[] // SanityImageObject[]
  location?: string
  buildDate?: string
  capacity?: number
  arenaReview?: any // PortableTextBlock
  visited?: boolean
  date?: string
  teamType?: string
  visitedCount?: number
  galleryCount?: number
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
    Flavor_and_Taste?: number,
    Food_Value?: number,
    Restaurant_Location?: number,
    Presentation_on_Plate?: number,
    Restaurant_Service?: number,
    Memorability?: number,
    Restaurant_Cleanliness?: number
  }
  takeoutRating?: { // Optional if defined
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