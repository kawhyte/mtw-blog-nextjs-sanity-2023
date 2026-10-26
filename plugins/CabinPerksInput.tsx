import { SearchIcon } from '@sanity/icons'
import { Button, Card, Inline, Select, Stack, Text, TextInput, useToast } from '@sanity/ui'
import { useState } from 'react'
import type { ObjectInputProps, StringInputProps } from 'sanity'
import { set, setIfMissing, unset, useFormValue } from 'sanity'

import { findLine, NO_PROGRAM, OTHER, PERK_PROGRAMS } from '../lib/cruiseShips'
import { postForAi } from './aiRequest'

/** Perk program dropdown for the chosen line, plus "None" and "Other" */
export function PerkProgramInput(props: StringInputProps) {
  const cruiseLine = useFormValue(['cruiseLine']) as string | undefined
  const programs = PERK_PROGRAMS[cruiseLine ?? ''] ?? []
  const isListed = !!props.value && (programs.includes(props.value) || props.value === NO_PROGRAM)
  const [typing, setTyping] = useState(!!props.value && !isListed)

  if (typing) {
    return (
      <Stack space={2}>
        <TextInput
          value={props.value ?? ''}
          placeholder="Type the program, e.g. The Haven"
          onChange={(e) =>
            props.onChange(e.currentTarget.value ? set(e.currentTarget.value) : unset())
          }
        />
        <Text size={0}>
          <a href="#" onClick={(e) => (e.preventDefault(), setTyping(false))}>
            Back to the list
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
      <option value="">Choose a perk program…</option>
      <option value={NO_PROGRAM}>None (standard cabin)</option>
      {programs.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
      <option value={OTHER}>Other (type it)</option>
    </Select>
  )
}

/** Cabin Perks with a "Fetch Perks" button that fills both perk lists */
export function CabinPerksInput(props: ObjectInputProps) {
  const [state, setState] = useState<'idle' | 'confirming' | 'fetching'>('idle')
  const [sources, setSources] = useState<string[]>([])
  const toast = useToast()

  const doc = (useFormValue([]) ?? {}) as any
  const value = (props.value ?? {}) as Record<string, any>
  const line = findLine(doc.cruiseLine)
  const hasPerks = !!(value.included?.length || value.notIncluded?.length)
  const ready = !!line && !!(value.program || doc.cabinType)

  const runFetch = async () => {
    setState('fetching')
    try {
      const data = await postForAi<{ included: string[]; notIncluded: string[]; sources: string[] }>(
        '/api/cabin-perks',
        {
          cruiseLine: line?.title,
          shipName: doc.shipName,
          program: value.program,
          cabinType: doc.cabinType,
        },
      )
      props.onChange([
        setIfMissing({}),
        set(data.included, ['included']),
        set(data.notIncluded, ['notIncluded']),
      ])
      setSources(data.sources)
      toast.push({
        status: 'success',
        title: `Filled ${data.included.length + data.notIncluded.length} perks`,
        description: 'Check them against what you actually got onboard.',
      })
    } catch (err: any) {
      toast.push({ status: 'error', title: 'Could not fetch perks', description: err.message })
    } finally {
      setState('idle')
    }
  }

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} tone="primary" border>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Fetch Perks
          </Text>
          {state === 'confirming' ? (
            <Inline space={2}>
              <Text size={1}>Replace the perks already filled in?</Text>
              <Button text="Replace" tone="critical" fontSize={1} padding={2} onClick={runFetch} />
              <Button text="Cancel" mode="ghost" fontSize={1} padding={2} onClick={() => setState('idle')} />
            </Inline>
          ) : (
            <Inline space={2}>
              <Button
                icon={SearchIcon}
                text={state === 'fetching' ? 'Searching…' : 'Fetch Perks'}
                tone="primary"
                fontSize={1}
                padding={2}
                disabled={!ready || state === 'fetching'}
                onClick={() => (hasPerks ? setState('confirming') : runFetch())}
              />
            </Inline>
          )}
          <Text size={0} muted>
            {ready
              ? 'Looks up the current perks for the program below (or the cabin type). Remove anything you did not actually get.'
              : 'Pick the Cruise Line on Overview and a Perk Program below first.'}
          </Text>
          {sources.length > 0 && <Text size={0}>Sources: {sources.join(', ')}</Text>}
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
