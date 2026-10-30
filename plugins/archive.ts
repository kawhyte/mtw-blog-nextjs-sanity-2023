import { ArchiveIcon, UnarchiveIcon } from '@sanity/icons'
import { apiVersion } from 'lib/sanity.api'
import { useState } from 'react'
import { type DocumentActionComponent, useClient } from 'sanity'
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

// Studio lists query with the drafts perspective, where a draft's _id loses
// its "drafts." prefix and only _originalId keeps it. The live listener runs
// the same filter on raw documents (no _originalId), hence the coalesce.
const IS_DRAFT = 'coalesce(_originalId, _id) in path("drafts.**")'

/** Status views of a type, archived entries left out of each */
const STATUS_VIEWS = [
  { id: 'all', title: 'All', filter: NOT_ARCHIVED },
  {
    id: 'published',
    title: 'Published',
    filter: `${NOT_ARCHIVED} && !(${IS_DRAFT})`,
  },
  {
    // A live entry with unsaved edits also lands here until it's republished
    id: 'unpublished',
    title: 'Not Published Yet',
    filter: `${NOT_ARCHIVED} && ${IS_DRAFT}`,
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

/**
 * Archive / Unarchive in the Publish menu. Patches the draft and the live
 * document directly, so archiving never leaves a stray draft to publish.
 */
export const ArchiveAction: DocumentActionComponent = ({
  draft,
  published,
  onComplete,
}) => {
  const client = useClient({ apiVersion })
  const [busy, setBusy] = useState(false)
  const archived = Boolean((draft ?? published)?.archived)

  return {
    label: archived ? 'Unarchive' : 'Archive',
    icon: archived ? UnarchiveIcon : ArchiveIcon,
    disabled: busy || (!draft && !published),
    onHandle: async () => {
      setBusy(true)
      const tx = client.transaction()
      for (const doc of [draft, published]) {
        if (doc) tx.patch(doc._id, (p) => p.set({ archived: !archived }))
      }
      try {
        await tx.commit()
      } finally {
        setBusy(false)
        onComplete()
      }
    },
  }
}
