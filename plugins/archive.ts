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

const NOT_ARCHIVED = '_type == $type && archived != true'

/** Status views of a type, archived entries left out of each */
const STATUS_VIEWS = [
  { id: 'all', title: 'All', filter: NOT_ARCHIVED },
  {
    id: 'published',
    title: 'Published',
    filter: `${NOT_ARCHIVED} && !(_id in path("drafts.**"))`,
  },
  {
    // A draft with no published twin has never gone live
    id: 'unpublished',
    title: 'Not Published Yet',
    filter: `${NOT_ARCHIVED} && _id in path("drafts.**") && !defined(*[_id == string::split(^._id, "drafts.")[1]][0]._id)`,
  },
]

/** The type's list split into All / Published / Not Published Yet */
export const withStatusLists = (
  S: StructureBuilder,
  listItem: ListItemBuilder,
): ListItemBuilder => {
  const type = listItem.getId()
  if (!type || !ARCHIVABLE_TYPES.includes(type)) return listItem
  const title = listItem.getTitle() ?? type
  return listItem.child(
    S.list()
      .title(title)
      .items(
        STATUS_VIEWS.map((view) =>
          S.listItem()
            .id(view.id)
            .title(view.title)
            .schemaType(type)
            .child(
              S.documentTypeList(type)
                .title(view.id === 'all' ? title : `${title}: ${view.title}`)
                .filter(view.filter)
                .params({ type }),
            ),
        ),
      ),
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
