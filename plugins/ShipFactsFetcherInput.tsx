import { SearchIcon, WarningOutlineIcon } from '@sanity/icons'
import { Box, Button, Card, Flex, Inline, Stack, Text, useToast } from '@sanity/ui'
import { useState } from 'react'
import type { ObjectInputProps } from 'sanity'
import { set, setIfMissing, useFormValue } from 'sanity'

import type { FactSource, ShipFacts } from '../pages/api/ship-facts'
import { postForAi } from './aiRequest'

// Fewer sites than this agreeing on a fact gets a "check this" warning
const MIN_SOURCES = 3

const FIELD_LABELS: Record<string, string> = {
  shipClass: 'Ship class',
  yearBuilt: 'Year built',
  lastRefurb: 'Last refurbished',
  grossTonnage: 'Gross tonnage',
  guestsDouble: 'Guests (double)',
  guestsMax: 'Guests (max)',
  crew: 'Crew',
  decks: 'Decks',
  sisterShips: 'Sister ships',
  sisterDifferences: 'Sister differences',
}

export function ShipFactsFetcherInput(props: ObjectInputProps) {
  const [state, setState] = useState<'idle' | 'confirming' | 'fetching'>('idle')
  const toast = useToast()

  const shipName = useFormValue(['shipName']) as string | undefined
  const cruiseLine = useFormValue(['cruiseLine']) as string | undefined
  const value = (props.value ?? {}) as Record<string, any>
  const factSources = (value.factSources ?? []) as FactSource[]
  const hasValues = Object.keys(FIELD_LABELS).some((k) => value[k] != null)

  const runFetch = async () => {
    setState('fetching')
    try {
      const data = await postForAi<{ facts: ShipFacts; factSources: FactSource[] }>(
        '/api/ship-facts',
        { shipName, cruiseLine },
      )
      const entries = Object.entries(data.facts)
      props.onChange([
        setIfMissing({}),
        ...entries.map(([key, fact]) => set(fact, [key])),
        set(data.factSources, ['factSources']),
        // New AI data has not been checked yet
        set(false, ['factsChecked']),
      ])
      const weak = data.factSources.filter((f) => f.sourceCount < MIN_SOURCES).length
      toast.push({
        status: weak ? 'warning' : 'success',
        title: `Filled ${entries.length} ship facts`,
        description: weak
          ? `${weak} with fewer than ${MIN_SOURCES} sources. Check those first.`
          : 'Check them against the sources, then tick Facts checked.',
      })
    } catch (err: any) {
      toast.push({
        status: 'error',
        title: 'Could not fetch ship facts',
        description: err.message,
      })
    } finally {
      setState('idle')
    }
  }

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} tone="primary" border>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            {shipName ? `Look up facts for ${shipName}` : 'Fill in Ship Name on the Overview tab first'}
          </Text>
          {state === 'confirming' ? (
            <Inline space={2}>
              <Text size={1}>Replace the facts already filled in?</Text>
              <Button text="Replace" tone="critical" fontSize={1} padding={2} onClick={runFetch} />
              <Button text="Cancel" mode="ghost" fontSize={1} padding={2} onClick={() => setState('idle')} />
            </Inline>
          ) : (
            <Inline space={2}>
              <Button
                icon={SearchIcon}
                text={state === 'fetching' ? 'Searching…' : 'Fetch Ship Facts'}
                tone="primary"
                fontSize={1}
                padding={2}
                disabled={!shipName || state === 'fetching'}
                onClick={() => (hasValues ? setState('confirming') : runFetch())}
              />
            </Inline>
          )}

          {factSources.length > 0 && (
            <Stack space={3}>
              <Text size={0} muted>
                Sources for each fact (Google Search). Fewer than {MIN_SOURCES} sites means check it yourself.
              </Text>
              {factSources.map((f) => (
                <Flex key={f.field} gap={2} align="flex-start">
                  <Box style={{ width: 150, flexShrink: 0 }}>
                    <Text size={0} weight="semibold">
                      {f.sourceCount < MIN_SOURCES && <WarningOutlineIcon />} {FIELD_LABELS[f.field] ?? f.field}
                    </Text>
                  </Box>
                  <Stack space={2} flex={1}>
                    <Text size={0} muted>
                      {f.sourceCount} {f.sourceCount === 1 ? 'site' : 'sites'}
                    </Text>
                    {f.sources.map((s) => (
                      <Text key={s.url} size={0}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.title}
                        </a>
                      </Text>
                    ))}
                  </Stack>
                </Flex>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
