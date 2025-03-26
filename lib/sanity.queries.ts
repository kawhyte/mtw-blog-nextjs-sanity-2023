import { groq } from 'next-sanity';

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
`;

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
`;

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
`;

// ------------------------------
// 3. Reusable Content-Type Specific Field Sets
// ------------------------------

const postFieldsFragment = groq`
    individualFoodRating,
    room,
    internetSpeed,
    techRating,
    roomAmenities,
    ${hotelRatingFields},
    ${foodRatingFields},
    takeoutRating,
    diningType
`;

const hotelFieldsFragment = groq`
    room,
    internetSpeed,
    ${hotelRatingFields},
    techRating,
    roomAmenities
`;

const foodFieldsFragment = groq`
    ${foodRatingFields},
    takeoutRating,
    diningType
`;

const guideFieldsFragment = groq``; // No specific fields for guides

// ------------------------------
// 4. Combine Core and Specific Fields
// ------------------------------

const postFields = groq`
    ${coreFields},
    ${postFieldsFragment}
`;

const hotelFields = groq`
    ${coreFields},
    ${hotelFieldsFragment}
`;

const foodFields = groq`
    ${coreFields},
    ${foodFieldsFragment}
`;

const guideFields = groq`
    ${coreFields},
    ${guideFieldsFragment}
`;

// ------------------------------
// 5. Specialized Field Sets
// ------------------------------

const recommendationFields = groq`
    _id,
    title,
    listType,
    recommendations[] {
        post->{
            title,
            "slug": slug.current,
            coverImage,
            location,
            linkType
        }
    }
`;

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
`;

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
`;

// ------------------------------
// 6. Generic Query Functions
// ------------------------------

/**
 * Constructs a Groq query to fetch documents of a specific type.
 *
 * @param type The document type to query (e.g., 'post', 'hotel').
 * @param fields The Groq fragment specifying the fields to retrieve.
 * @param options Additional query options (order, where).
 * @returns A Groq query string.
 */
const fetchDocuments = (
    type: string,
    fields: string,
    options: { order?: string; where?: string } = {}
): string => {
    let query = `*[_type == "${type}"`;
    if (options.where) {
        query += ` && ${options.where}`;
    }
    query += `]`;
    if (options.order) {
        query += ` | order(${options.order})`;
    }
    query += `{${fields}}`;
    return query;
};

/**
 * Constructs a Groq query to fetch a single document by slug and related documents.
 *
 * @param type The document type.
 * @param fields The fields to fetch.
 * @param slugField The name of the slug field ('slug.current' or 'slug').
 * @param relatedOptions Options for fetching related documents (where clause).
 * @returns A Groq query.
 */
const fetchDocumentAndRelated = (
    type: string,
    fields: string,
    slugField: string,
    relatedOptions: { where?: string } = {}
): string => {
    let relatedWhere = relatedOptions.where ? `&& ${relatedOptions.where}` : '';
    return groq`
        {
            "post": *[_type == "${type}" && ${slugField} == $slug] | order(_updatedAt desc) [0] {
                content,
                ${fields}
            },
            "morePosts": *[_type == "${type}" && ${slugField} != $slug ${relatedWhere}] | order(date desc, _updatedAt desc) [0...2] {
                content,
                ${fields}
            }
        }
    `;
};

/**
  * Constructs a Groq query to fetch slugs for a given document type.
  *
  * @param type The document type.
  * @param filter An optional filter to apply to the query.
  * @returns A Groq query string.
  */
const fetchSlugs = (type: string, filter?: string): string => {
      let query = `*[_type == "${type}"`;
      if (filter) {
          query += ` && ${filter}`;
      }
      query += ` && defined(slug.current)][].slug.current`;
      return query;
};

/**
 * Constructs a Groq query to fetch a single document by slug.
 *
 * @param type The document type.
 * @param fields The fields to fetch.
 * @param slugField The field name for the slug.
 * @param filter Additional filter
 * @returns A Groq query string.
 */
const fetchDocumentBySlug = (type: string, fields: string, slugField: string, filter?:string): string => {
  let query = `*[_type == "${type}" && ${slugField} == $slug`;
  if(filter){
    query += ` && ${filter}`;
  }
  query += `][0] {${fields}}`;
  return query;
};

// ------------------------------
// 7. Exported Queries
// ------------------------------

export const recommendationQuery = fetchDocuments('recommendationList', recommendationFields, {
    order: 'date desc, _updatedAt desc',
});

export const travelEssentialQuery = fetchDocuments('essential', travelEssentialFields, {
    order: 'date desc, _updatedAt desc',
});

export const arenaQuery = fetchDocuments('arenas', arenaFields, { order: 'name asc' });

export const settingsQuery = `*[_type == "settings"][0]`;

export const indexQuery = fetchDocuments('post', postFields, {
    order: 'date desc, _updatedAt desc',
});

export const postAndMoreStoriesQuery = fetchDocumentAndRelated('post', postFields, 'slug.current');

export const postSlugsQuery = fetchSlugs('post');

export const postBySlugQuery = fetchDocumentBySlug('post', postFields, 'slug.current');

export const hotelSlugsQuery = fetchSlugs('post', 'linkType == "hotel"');
export const storySlugsQuery = fetchSlugs('post', 'linkType == "story"');
export const foodSlugsQuery = fetchSlugs('post', 'linkType == "food"');

export const hotelBySlugQuery = fetchDocumentBySlug('post', hotelFields, 'slug.current', 'linkType == "hotel"');
export const storyBySlugQuery = fetchDocumentBySlug('post', guideFields, 'slug.current', 'linkType == "story"');
export const foodBySlugQuery = fetchDocumentBySlug('post', foodFields, 'slug.current', 'linkType == "food"');

export const hotelAndMoreQuery = fetchDocumentAndRelated('post', postFields, 'slug.current', { where: 'linkType == "hotel"' });
export const storyAndMoreQuery = fetchDocumentAndRelated('post', postFields, 'slug.current', { where: 'linkType == "story"' });
export const foodAndMoreQuery = fetchDocumentAndRelated('post', postFields, 'slug.current', { where: 'linkType == "food"' });

export const hotelQuery = fetchDocuments('post', hotelFields, {
    order: 'date desc, _updatedAt desc',
    where: 'linkType == "hotel"',
});

export const foodQuery = fetchDocuments('post', foodFields, {
    order: 'date desc, _updatedAt desc',
    where: 'linkType == "food"',
});

export const storyQuery = fetchDocuments('post', guideFields, {
    order: 'date desc, _updatedAt desc',
    where: 'linkType == "story"',
});

// ------------------------------
// 8. Interfaces
// ------------------------------

export interface Author {
    name?: string;
    picture?: any;
}

export interface Recommendation {
    _id: string;
    title?: string;
    recommendations?: {
        post?: {
            title?: string;
            slug?: string;
            coverImage?: any;
            location?: string;
            linkType?: string;
        };
    }[];
    listType?: string;
}

export interface Essential {
    _id: string;
    name?: string;
    link?: string;
    background?: string;
    description?: any;
    productImage?: any;
    categoryName?: string;
    recommend?: boolean;
    price?: number;
    date?: string;
}

export interface Arena {
    _id: string;
    name?: string;
    gallery?: any;
    location?: string;
    description?: any;
    arenaImage?: any;
    visited?: boolean;
    date?: string;
    teamType?: string;
    capacity?: number;
    buildDate?: string;
    arenaReview?: any;
    visitedCount?: number;
    galleryCount?: number;
}

interface BasePost {
    _id: string;
    title?: string;
    coverImage?: any;
    date?: string;
    excerpt2?: any;
    author?: Author;
    slug?: string;
    content?: any;
    youtube?: any;
    location?: string;
    linkType?: any;
    positives?: any;
    negatives?: any;
    verdict?: any;
    gallery?: any;
    color?: string;
    category?: string;
    tip?: string;
    showRating?: boolean;
}

export interface Post extends BasePost {
    individualFoodRating?: any;
    room?: any;
    internetSpeed?: number;
    techRating?: any;
    roomAmenities?: any;
    hotelRating?: any;
    foodRating?: any;
    takeoutRating?: any;
    diningType?: any;
}

export interface Story extends BasePost {}

export interface Food extends BasePost {
    foodRating?: any;
    takeoutRating?: any;
    diningType?: any;
}

export interface Hotel extends BasePost {
    room?: any;
    internetSpeed?: number;
    techRating?: any;
    roomAmenities?: any;
    hotelRating?: any;
}

export interface Settings {
    title?: string;
    description?: any[];
    ogImage?: {
        title?: string;
    };
}

export interface Instagram {
    id?: any;
    caption?: any;
    media_url?: any;
    timestamp?: any;
    media_type?: any;
    permalink?: any;
}
