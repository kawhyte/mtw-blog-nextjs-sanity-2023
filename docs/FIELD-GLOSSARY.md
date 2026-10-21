# Field Glossary

Some Sanity fields have names that don't say what they hold. They are **not
renamed** on purpose: renaming a stored field would orphan the content already
saved under the old name. This page is the decoder ring. Each of these fields
also has a comment next to it in `schemas/`.

## Fields whose name doesn't match what they are

| Field (as stored) | On | What it actually is | Where it's used |
| --- | --- | --- | --- |
| `excerpt2` | hotelReview, foodReview | Old short summary (rich text). Hidden in Studio for hotels; not shown on the site to avoid duplicate content. | Search only (`pt::text(excerpt2)` in `globalSearchQuery`). Legacy `post` pages still render it. |
| `excerpt` | arenas | SEO meta description (≤155 chars). Hotels, food and guides call this `seoExcerpt`. | `<meta name="description">` |
| `seoExcerpt` | hotelReview, foodReview | SEO meta description (≤155 chars). | `PostPageHead` |
| `summary` | guide | Plain-text guide summary. | Guide cards, search |
| `individualFoodRating` | foodReview | The **dishes & drinks** list: photo, name, price, rating, mini review. | Food review page |
| `foodRating` | foodReview | Dine-in scores (object type `foodRating`). | Rating badge, weighted score |
| `takeoutRating` | foodReview | Takeout scores (object type `takeOutFoodRating`). Used when `diningType` is `takeout`. | Rating badge, weighted score |
| `gallery` | arenas | **Team logos** for the arena's home teams, not photos. | Arena page/cards |
| `imageGallery` | arenas | The arena photo gallery. | Arena page |
| `gallery` | hotelReview, foodReview, guide | The photo gallery. | Review/guide pages |

## Images: which one is which

| Field | On | Purpose |
| --- | --- | --- |
| `heroPhotos` | hotel, food, arenas | Up to 5 photos at the top of the page. `heroPhotos[0]` is the default card image. |
| `coverImage` | hotel, food, guide | Optional **card & share image**. Falls back to `heroPhotos[0]` (queries use `coalesce(coverImage, heroPhotos[0])`). |
| `arenaImage` | arenas | Same role as `coverImage`, for arenas. |
| `cardImage` | hotel, food, arenas | Not a field — the collapsible Studio group that holds the card image. |

## Rating update keys

`revisits[].ratingUpdates` (hotels), `foodRatingUpdates` and
`takeoutRatingUpdates` (food) only hold the scores that changed on a revisit.
Their keys must match the rating object's field names exactly, including the
mixed case stored in hotel data (`Bed_Comfort`, `Room_Cleanliness`, …).

## Card content type (code only)

Listing cards (`DynamicPostCard`, `CoverImage`) take a `contentType` prop:
`'hotel' | 'food' | 'guide' | 'favorite'` (`lib/cardContentType.ts`). Legacy
`post` documents store this as `linkType`, where guides are `'story'`; convert
with `cardContentTypeFromLinkType()`.
