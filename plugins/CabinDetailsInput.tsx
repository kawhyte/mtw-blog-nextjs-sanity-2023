import { SearchIcon } from '@sanity/icons'
import { Button, Card, Inline, Stack, Text, useToast } from '@sanity/ui'
import { useState } from 'react'
import type { ObjectInputProps } from 'sanity'
import { set, setIfMissing, useFormValue } from 'sanity'

import type { CabinDetails } from '../pages/api/cabin-details'
import { postForAi } from './aiRequest'

const LOOKUP_KEYS = ['deck', 'position', 'sizeSqFt', 'balconySqFt', 'above', 'below']

/** Cabin with a "Fetch Cabin Details" button that fills size, deck and location */
export function CabinDetailsInput(props: ObjectInputProps) {
  const [state, setState] = useState<'idle' | 'confirming' | 'fetching'>('idle')
  const [sources, setSources] = useState<string[]>([])
  const toast = useToast()

  const doc = (useFormValue([]) ?? {}) as any
  const value = (props.value ?? {}) as Record<string, any>
  const ready = !!doc.shipName && !!(doc.cabinNumber || doc.cabinType)
  const hasValues = LOOKUP_KEYS.some((k) => value[k] != null)

  const runFetch = async () => {
    setState('fetching')
    try {
      const data = await postForAi<{ details: CabinDetails; sources: string[] }>(
        '/api/cabin-details',
        {
          shipName: doc.shipName,
          cruiseLine: doc.cruiseLine,
          cabinNumber: doc.cabinNumber,
          cabinType: doc.cabinType,
        },
      )
      const entries = Object.entries(data.details)
      props.onChange([setIfMissing({}), ...entries.map(([k, v]) => set(v, [k]))])
      setSources(data.sources)
      toast.push({
        status: 'success',
        title: `Filled ${entries.length} cabin details`,
        description: 'Check them against the deck plan. Blank ones were not found.',
      })
    } catch (err: any) {
      toast.push({ status: 'error', title: 'Could not fetch cabin details', description: err.message })
    } finally {
      setState('idle')
    }
  }

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} tone="primary" border>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            {ready
              ? `Look up ${doc.cabinNumber ? `cabin ${doc.cabinNumber}` : doc.cabinType} on ${doc.shipName}`
              : 'Fill in Ship and Cabin Number on the Overview tab first'}
          </Text>
          {state === 'confirming' ? (
            <Inline space={2}>
              <Text size={1}>Replace the details already filled in?</Text>
              <Button text="Replace" tone="critical" fontSize={1} padding={2} onClick={runFetch} />
              <Button text="Cancel" mode="ghost" fontSize={1} padding={2} onClick={() => setState('idle')} />
            </Inline>
          ) : (
            <Inline space={2}>
              <Button
                icon={SearchIcon}
                text={state === 'fetching' ? 'Searching…' : 'Fetch Cabin Details'}
                tone="primary"
                fontSize={1}
                padding={2}
                disabled={!ready || state === 'fetching'}
                onClick={() => (hasValues ? setState('confirming') : runFetch())}
              />
            </Inline>
          )}
          <Text size={0} muted>
            Fills deck, location, cabin and balcony size, and what is above and below when a source has them.
          </Text>
          {sources.length > 0 && <Text size={0}>Sources: {sources.join(', ')}</Text>}
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
