import { Button, Flex, Select, Stack, Text, TextInput } from '@sanity/ui'
import { useEffect, useState } from 'react'
import type { NumberInputProps, StringInputProps } from 'sanity'
import { set, unset, useDocumentOperation, useFormValue } from 'sanity'

import {
  buildCruiseTitle,
  CABIN_TYPES,
  CRUISE_LINES,
  findLine,
  formatSailingRange,
  OTHER,
} from '../lib/cruiseShips'

// Patches other fields of the open document (title, line tier) from an input
export function useDocPatch() {
  const id = String(useFormValue(['_id']) ?? '').replace(/^drafts\./, '')
  const type = String(useFormValue(['_type']) ?? 'cruiseReview')
  const { patch } = useDocumentOperation(id, type)
  return (fields: Record<string, unknown>) => patch.execute([{ set: fields }])
}

/** Cruise Line dropdown; also fills Line Tier from the line's baseline tier */
export function CruiseLineInput(props: StringInputProps) {
  const patchDoc = useDocPatch()

  return (
    <Select
      value={props.value ?? ''}
      onChange={(e) => {
        const value = e.currentTarget.value
        props.onChange(value ? set(value) : unset())
        const line = findLine(value)
        if (line) patchDoc({ lineTier: line.tier })
      }}
    >
      <option value="">Choose a cruise line…</option>
      {CRUISE_LINES.map((line) => (
        <option key={line.value} value={line.value}>
          {line.title}
        </option>
      ))}
      <option value={OTHER}>Other</option>
    </Select>
  )
}

/** Ship dropdown filtered by the chosen cruise line, with "Other" for typing a name */
export function ShipNameInput(props: StringInputProps) {
  const cruiseLine = useFormValue(['cruiseLine']) as string | undefined
  const line = findLine(cruiseLine)
  const ships = line?.ships ?? []
  const isListed = !!props.value && ships.includes(props.value)
  const [typing, setTyping] = useState(!!props.value && !isListed)

  const choose = (shipName: string) => props.onChange(shipName ? set(shipName) : unset())

  if (!line || typing) {
    return (
      <Stack space={2}>
        <TextInput
          value={props.value ?? ''}
          placeholder="Type the ship name, e.g. Quantum of the Seas"
          onChange={(e) => choose(e.currentTarget.value)}
        />
        {line && (
          <Text size={0}>
            <a href="#" onClick={(e) => (e.preventDefault(), setTyping(false))}>
              Back to the {line.title} ship list
            </a>
          </Text>
        )}
      </Stack>
    )
  }

  return (
    <Select
      value={isListed ? props.value : ''}
      onChange={(e) => {
        const value = e.currentTarget.value
        if (value === OTHER) {
          setTyping(true)
          return
        }
        choose(value)
      }}
    >
      <option value="">Choose a {line.title} ship…</option>
      {ships.map((ship) => (
        <option key={ship} value={ship}>
          {ship}
        </option>
      ))}
      <option value={OTHER}>Other (type the name)</option>
    </Select>
  )
}

/**
 * Title that follows [Cruise Line] [Ship] [Cabin Type] [Cabin Number] Review ([Month Year]) and
 * updates itself as those fields are filled in, until it is edited by hand.
 */
export function CruiseTitleInput(props: StringInputProps) {
  const doc = (useFormValue([]) ?? {}) as any
  const patchDoc = useDocPatch()
  const suggested = buildCruiseTitle(doc)
  const edited = doc.titleEdited === true

  useEffect(() => {
    if (!edited && !props.readOnly && suggested && suggested !== props.value) {
      props.onChange(set(suggested))
    }
  }, [edited, suggested]) // eslint-disable-line react-hooks/exhaustive-deps

  const missing = [
    !doc.cruiseLine && 'Cruise Line',
    !doc.shipName && 'Ship',
    !doc.cabinType && 'Cabin Type',
    !doc.sailingDate && 'Sailing Date',
  ].filter(Boolean)

  return (
    <Stack space={2}>
      {props.renderDefault({
        ...props,
        // Typing in the title stops the automatic updates
        onChange: (patch) => {
          props.onChange(patch)
          if (!edited) patchDoc({ titleEdited: true })
        },
      })}
      {missing.length > 0 && !edited && (
        <Text size={1} muted>
          Still needed for the full title: {missing.join(', ')}.
        </Text>
      )}
      {edited && suggested && suggested !== props.value && (
        <Flex gap={2} align="center">
          <Button
            text="Use suggested title"
            mode="ghost"
            tone="primary"
            fontSize={1}
            padding={2}
            onClick={() => {
              props.onChange(set(suggested))
              patchDoc({ titleEdited: false })
            }}
          />
          <Text size={1} muted>
            {suggested}
          </Text>
        </Flex>
      )}
    </Stack>
  )
}

/** Number of Nights, with the sailing range it works out to */
export function NightsInput(props: NumberInputProps) {
  const sailingDate = useFormValue(['sailingDate']) as string | undefined
  const range = formatSailingRange(sailingDate, props.value)

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {range && (
        <Text size={1} muted>
          Sails {range}
        </Text>
      )}
    </Stack>
  )
}

/** Cabin type dropdown with "Other" for line-specific names like Sea Terrace */
export function CabinTypeInput(props: StringInputProps) {
  const isListed = !!props.value && CABIN_TYPES.includes(props.value)
  const [typing, setTyping] = useState(!!props.value && !isListed)

  if (typing) {
    return (
      <Stack space={2}>
        <TextInput
          value={props.value ?? ''}
          placeholder="Type the cabin type, e.g. Sea Terrace"
          onChange={(e) =>
            props.onChange(e.currentTarget.value ? set(e.currentTarget.value) : unset())
          }
        />
        <Text size={0}>
          <a href="#" onClick={(e) => (e.preventDefault(), setTyping(false))}>
            Back to the cabin type list
          </a>
        </Text>
      </Stack>
    )
  }

  return (
    <Select
      value={isListed ? props.value : ''}
      onChange={(e) => {
        const value = e.currentTarget.value
        if (value === OTHER) setTyping(true)
        else props.onChange(value ? set(value) : unset())
      }}
    >
      <option value="">Choose a cabin type…</option>
      {CABIN_TYPES.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
      <option value={OTHER}>Other (type it)</option>
    </Select>
  )
}
