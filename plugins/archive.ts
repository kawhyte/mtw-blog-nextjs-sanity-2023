import { ArchiveIcon } from '@sanity/icons'
import { type StructureBuilder } from 'sanity/desk'

type ListItemBuilder = ReturnType<StructureBuilder['listItem']>

/** Types with an `archived` switch; archived entries leave the main list */
export const ARCHIVABLE_TYPES = [
  'hotelReview',
  'foodReview',
  'cruiseReview',
  'guide',
]

/** The type's usual list, minus anything archived */
export const withoutArchived = (
  S: StructureBuilder,
  listItem: ListItemBuilder,
): ListItemBuilder => {
  const type = listItem.getId()
  if (!type || !ARCHIVABLE_TYPES.includes(type)) return listItem
  return listItem.child(
    S.documentTypeList(type)
      .title(listItem.getTitle() ?? type)
      .filter('_type == $type && archived != true')
      .params({ type }),
  )
}

/** One "Archived" entry holding each type's archived documents */
export const archivedListItem = (S: StructureBuilder) =>
  S.listItem()
    .title('Archived')
    .icon(ArchiveIcon)
    .child(
      S.list()
        .title('Archived')
        .items(
          ARCHIVABLE_TYPES.map((type) => {
            const title = S.documentTypeListItem(type).getTitle() ?? type
            return S.listItem()
              .id(`archived-${type}`)
              .title(title)
              .schemaType(type)
              .child(
                S.documentTypeList(type)
                  .title(`Archived ${title}`)
                  .filter('_type == $type && archived == true')
                  .params({ type }),
              )
          }),
        ),
    )
