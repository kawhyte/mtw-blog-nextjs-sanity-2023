import { groq } from 'next-sanity'

const postFields = groq`
  _id,
  title,
  date,
  excerpt2,
  coverImage,
  youtube,
  location,
  room,
  category,
  tip,
  gallery,
  internetSpeed,
  techRating,
  roomAmenities,
  hotelRating{Value,Gym,Internet_Speed,Service,Room_Cleanliness,Bed_Comfort,Room_Amenities,Pool,Location},
  foodRating{Flavor_and_Taste,Food_Value,Restaurant_Location,Presentation_on_Plate,Restaurant_Service,Memorability,Restaurant_Cleanliness},
  positives,
  negatives,
  verdict,
  linkType,
  "slug": slug.current,
  "author": author->{name, picture},
`

const hotelFields = groq`
  _id,
  title,
  date,
  excerpt2,
  coverImage,
  youtube,
  location,
  room,
  gallery,
  internetSpeed,
  techRating,
  roomAmenities,
  positives,
  negatives,
  verdict,
  category,
  tip,
  linkType,
  "slug": slug.current,
  "author": author->{name, picture},
`
const recommendationFields = groq`
id, title,listType, recommendations[] {post->{title, slug, coverImage, location,linkType}

}
`
const travelEssentialFields = groq`
id, name,link, background, description, productImage,categoryName 
`

export const recommendationQuery = groq`
*[_type == "recommendationList"] | order(date desc, _updatedAt desc) {${recommendationFields}}`

export const travelEssentialQuery = groq`
*[_type == "essential"] | order(date desc, _updatedAt desc)  {${travelEssentialFields}}`

export const settingsQuery = groq`*[_type == "settings"][0]`

export const indexQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}`

export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`

export const hotelQuery = groq`
*[_type == "post"&& linkType =="hotel"]  | order(date desc, _updatedAt desc) {${hotelFields}}`

export const foodQuery = groq`
*[_type == "post"&& linkType =="food"] | order(date desc, _updatedAt desc) {${postFields}}`

export const storyQuery = groq`
*[_type == "post"&& linkType =="story"] | order(date desc, _updatedAt desc) {${postFields}}`



export interface Author {
  name?: string
  picture?: any
}
export interface Recommendation {
  _id: string
  title?: string
  recommendations?: any
  listType?:string
  
}
export interface Esssential {
  _id: string
  name?: string
  link?:string
  background?:string
  description?: any
  productImage?:any
  categoryName?:any
  
}


export interface Post {
  _id: string
  title?: string
  coverImage?: any
  date?: string
  excerpt2?: any
  author?: Author
  slug?: string
  content?: any
  youtube?: any
  location?: string
  room?: any
  internetSpeed?: number
  techRating?: any
  roomAmenities?:any
  linkType?: any
  hotelRating?: any
  foodRating?:any
  positives?: any
  negatives?: any
  verdict?: any
  gallery?: any
  color?:string
  category?:string
  tip?:string
}

export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
}


export interface Instagram {

  id?:any
  caption?:any
  media_url?:any
  timestamp?:any
  media_type?:any
  permalink?:any
}