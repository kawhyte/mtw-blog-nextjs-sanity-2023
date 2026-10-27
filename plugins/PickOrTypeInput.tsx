import { Select, Stack, Text, TextInput } from '@sanity/ui'
import { useState } from 'react'
import type { StringInputProps } from 'sanity'
import { set, unset, useFormValue } from 'sanity'

import { CRUISE_PORTS, findPort, TRANSFER_OPTIONS } from '../lib/cruisePorts'

const TYPE_IT = '__type__'

/**
 * Builds a dropdown input whose options can depend on the document, with a
 * last "Other (type it)" choice that switches to a text box. When there are no
 * options it is just a text box.
 */
function pickOrType(getOptions: (doc: any) => string[], placeholder: string) {
  return function PickOrTypeInput(props: StringInputProps) {
    const doc = (useFormValue([]) ?? {}) as any
    const options = getOptions(doc)
    const isListed = !!props.value && options.includes(props.value)
    const [typing, setTyping] = useState(!!props.value && !isListed)
    const setText = (value: string) => props.onChange(value ? set(value) : unset())

    if (typing || options.length === 0) {
      return (
        <Stack space={2}>
          <TextInput
            value={props.value ?? ''}
            placeholder={placeholder}
            onChange={(e) => setText(e.currentTarget.value)}
          />
          {options.length > 0 && (
            <Text size={0}>
              <a href="#" onClick={(e) => (e.preventDefault(), setTyping(false))}>
                Back to the list
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
          if (value === TYPE_IT) setTyping(true)
          else setText(value)
        }}
      >
        <option value="">Choose…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        <option value={TYPE_IT}>Other (type it)</option>
      </Select>
    )
  }
}

export const DeparturePortInput = pickOrType(
  () => CRUISE_PORTS.map((p) => p.name),
  'Type the port, e.g. Bayonne',
)

export const AirportInput = pickOrType(
  (doc) => findPort(doc.departurePort)?.airports ?? [],
  'Type the airport, e.g. Long Beach (LGB)',
)

export const TerminalInput = pickOrType(
  (doc) => findPort(doc.departurePort)?.terminals ?? [],
  'Type the terminal or pier, e.g. Terminal 25',
)

export const TransferInput = pickOrType(() => TRANSFER_OPTIONS, 'Type how you got there')
