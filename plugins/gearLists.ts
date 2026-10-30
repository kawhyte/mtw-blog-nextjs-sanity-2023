import { GEAR_TRIPS } from 'lib/gearSections'
import { type StructureBuilder } from 'sanity/desk'

type ListItemBuilder = ReturnType<StructureBuilder['listItem']>

const TYPE = 'essential'

/** Travel Essential Picks split into All / By trip / Must pack / Missing */
export const withGearLists = (
  S: StructureBuilder,
  listItem: ListItemBuilder,
): ListItemBuilder => {
  if (listItem.getId() !== TYPE) return listItem
  const title = listItem.getTitle() ?? TYPE

  const list = (id: string, label: string, filter: string, params = {}) =>
    S.listItem()
      .id(id)
      .title(label)
      .schemaType(TYPE)
      .child(
        S.documentTypeList(TYPE)
          .title(label)
          .filter(`_type == $type && (${filter})`)
          .params({ type: TYPE, ...params }),
      )

  // A trip's list also holds the "Every trip" items, same as the page
  const byTrip = S.listItem()
    .id('by-trip')
    .title('By trip')
    .child(
      S.list()
        .title('By trip')
        .items(
          GEAR_TRIPS.map((trip) =>
            list(
              `trip-${trip.value}`,
              trip.title,
              trip.value === 'every'
                ? '"every" in tripType'
                : '$trip in tripType || "every" in tripType',
              { trip: trip.value },
            ),
          ),
        ),
    )

  return listItem.child(
    S.list()
      .title(title)
      .items([
        list('all', 'All items', 'true'),
        byTrip,
        list('must-pack', 'Must pack', 'featured == true'),
        list(
          'missing',
          'Missing a photo or trip',
          '!defined(productImage.asset) || count(coalesce(tripType, [])) == 0',
        ),
      ]),
  )
}
