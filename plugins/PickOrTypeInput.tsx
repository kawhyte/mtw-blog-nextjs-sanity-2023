import { Select, Stack, Text, TextInput } from '@sanity/ui'
import { useEffect, useState } from 'react'
import type { NumberInputProps, StringInputProps } from 'sanity'
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

/** "9:00 AM" style times from startHour to endHour, every stepMinutes */
function timeOptions(startHour: number, endHour: number, stepMinutes: number): string[] {
  const times: string[] = []
  for (let m = startHour * 60; m <= endHour * 60; m += stepMinutes) {
    const h24 = Math.floor(m / 60)
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12
    times.push(`${h12}:${String(m % 60).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`)
  }
  return times
}

/** Minutes since midnight from "9:15 AM", or null */
export function parseTime(value?: string): number | null {
  const match = value?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return null
  const hour = (Number(match[1]) % 12) + (match[3].toUpperCase() === 'PM' ? 12 : 0)
  return hour * 60 + Number(match[2])
}

const BOARDING_TIMES = timeOptions(9, 16, 15)

export const CheckInWindowInput = pickOrType(() => timeOptions(10, 15, 30), 'Type the window, e.g. 11:00 to 11:30 AM')
export const BoardingTimeInput = pickOrType(() => BOARDING_TIMES, 'Type the time, e.g. 11:20 AM')
export const OffShipTimeInput = pickOrType(() => timeOptions(5, 12, 15), 'Type the time, e.g. 7:45 AM')
export const FlightTimeInput = pickOrType(
  () => ['No flight that day', ...timeOptions(7, 22, 30)],
  'Type the flight time',
)

/**
 * Minutes from arrival to onboard, worked out from the two embarkation times.
 * Read-only: change the times to change it.
 */
export function MinutesToBoardInput(props: NumberInputProps) {
  const arrived = parseTime(useFormValue(['embarkation', 'arrivedAt']) as string | undefined)
  const boarded = parseTime(useFormValue(['embarkation', 'boardedAt']) as string | undefined)
  const minutes = arrived != null && boarded != null && boarded >= arrived ? boarded - arrived : null

  useEffect(() => {
    if (minutes !== (props.value ?? null)) {
      props.onChange(minutes == null ? unset() : set(minutes))
    }
  }, [minutes]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Text size={1} muted>
      {minutes == null
        ? 'Pick "We Arrived At" and "We Boarded At" and this fills itself in.'
        : `${minutes} minutes`}
    </Text>
  )
}
