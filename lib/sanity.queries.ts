import { groq } from 'next-sanity'

const postFields = groq`
  _id,
  title,
  date,
  excerpt,
  coverImage,
  youtube,
  location,
  room,
  gallery,
  internetSpeed,
  techRating,
  hotelRating,
  positives,
  negatives,
  verdict,
  linkType,
  "slug": slug.current,
  "author": author->{name, picture},
`
const recommendationFields = groq`
id, title, recommendations[] {post->{title, slug, coverImage, location}

}
`

export const recommendationQuery = groq`
*[_type == "recommendationList"] | order(date desc, _updatedAt desc) {${recommendationFields}}`

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
*[_type == "post"&& linkType =="hotel"] | order(date desc, _updatedAt desc) {${postFields}}`

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
}

export interface Post {
  _id: string
  title?: string
  coverImage?: any
  date?: string
  excerpt?: any
  author?: Author
  slug?: string
  content?: any
  youtube?: any
  location?: string
  room?: any
  internetSpeed?: number
  techRating?: any
  linkType?: any
  hotelRating?: any
  positives?: any
  negatives?: any
  verdict?: any
  gallery?: any
}

export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
}
