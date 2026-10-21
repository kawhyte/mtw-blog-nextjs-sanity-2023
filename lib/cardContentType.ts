// Which kind of content a listing card shows. Drives the card's link prefix,
// type badge and whether a rating is shown (guides never have one).
//
// Legacy `post` documents store this as `linkType`, where guides are 'story';
// use `cardContentTypeFromLinkType` to convert those.
export type CardContentType = 'hotel' | 'food' | 'guide' | 'favorite'

export const cardContentTypeFromLinkType = (
  linkType?: string,
): CardContentType => {
  switch (linkType) {
    case 'hotel':
    case 'food':
      return linkType
    case 'story':
      return 'guide'
    default:
      return 'favorite'
  }
}
