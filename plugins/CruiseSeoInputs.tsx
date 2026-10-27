import { AddIcon, SearchIcon, SparklesIcon } from '@sanity/icons'
import { Button, Card, Flex, Inline, Stack, Text, useToast } from '@sanity/ui'
import { apiVersion } from 'lib/sanity.api'
import { useState } from 'react'
import type { ArrayOfObjectsInputProps, ArrayOfPrimitivesInputProps } from 'sanity'
import { insert, set, setIfMissing, useClient, useFormValue } from 'sanity'

import { findLine } from '../lib/cruiseShips'
import { postForAi } from './aiRequest'

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** "Cabo San Lucas, Mexico" → "Cabo San Lucas"; "Los Angeles (San Pedro)" → "Los Angeles" */
function placeName(port?: string): string {
  return (port ?? '').split(/[,(]/)[0].trim()
}

/** Departure port plus every port in the day-by-day list, no sea days, no repeats */
function cruisePlaces(doc: any): string[] {
  const names = [doc.departurePort, ...(doc.itinerary ?? []).map((d: any) => d?.port)]
    .map(placeName)
    .filter((p) => p && !/sea day/i.test(p))
  return names.filter((p, i) => names.indexOf(p) === i)
}

/** Tags with a "Suggest Tags" button that adds Gemini's picks to the list */
export function SuggestTagsInput(props: ArrayOfPrimitivesInputProps) {
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const doc = (useFormValue([]) ?? {}) as any
  const current = (props.value ?? []) as string[]

  const run = async () => {
    setBusy(true)
    try {
      const data = await postForAi<{ tags: string[] }>('/api/suggest-cruise-tags', {
        shipName: doc.shipName,
        cruiseLine: findLine(doc.cruiseLine)?.title,
        cabinType: doc.cabinType,
        perkProgram: doc.perks?.program !== 'none' ? doc.perks?.program : undefined,
        nights: doc.nights,
        itineraryName: doc.itineraryName,
        region: doc.region,
        departurePort: doc.departurePort,
        ports: cruisePlaces(doc).slice(1),
      })
      const lower = current.map((t) => t.toLowerCase())
      const added = data.tags.filter((t) => !lower.includes(t.toLowerCase()))
      props.onChange(set([...current, ...added]))
      toast.push({
        status: 'success',
        title: `Added ${added.length} tags`,
        description: 'Remove any that do not fit with the x on each tag.',
      })
    } catch (err: any) {
      toast.push({ status: 'error', title: 'Could not suggest tags', description: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Stack space={3}>
      <Inline space={2}>
        <Button
          icon={SparklesIcon}
          text={busy ? 'Thinking…' : 'Suggest Tags'}
          tone="primary"
          mode="ghost"
          fontSize={1}
          padding={2}
          disabled={!doc.shipName || busy}
          onClick={run}
        />
        <Text size={0} muted>
          {doc.shipName
            ? 'Adds search phrases for the ship, cabin, route and ports.'
            : 'Pick the Ship on Overview first.'}
        </Text>
      </Inline>
      {props.renderDefault(props)}
    </Stack>
  )
}

interface Candidate {
  _id: string
  title: string
  location?: string
}

/**
 * Related reviews list with a "Find Related" button that searches our own
 * reviews in the departure port and ports of call. No AI: a GROQ text match.
 */
export function RelatedReviewsInput(props: ArrayOfObjectsInputProps) {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null)
  const [busy, setBusy] = useState(false)
  const client = useClient({ apiVersion })
  const doc = (useFormValue([]) ?? {}) as any
  const places = cruisePlaces(doc)
  // e.g. "hotelReview" from the field's reference type
  const docType = (props.schemaType as any).of?.[0]?.to?.[0]?.name as string
  const linked = new Set(((props.value ?? []) as any[]).map((r) => r._ref))

  const find = async () => {
    setBusy(true)
    try {
      // `match` against a list needs every term to match, so OR one place at a time
      const params: Record<string, string> = { type: docType }
      const anyPlace = places
        .map((place, i) => {
          params[`p${i}`] = place
          return `location match $p${i} || title match $p${i}`
        })
        .join(' || ')
      const results = await client.fetch<Candidate[]>(
        `*[_type == $type && !(_id in path("drafts.**")) && (${anyPlace})]
          | order(_updatedAt desc)[0...12]{ _id, title, location }`,
        params,
      )
      setCandidates(results)
    } finally {
      setBusy(false)
    }
  }

  const add = (id: string) =>
    props.onChange([
      setIfMissing([]),
      insert([{ _key: randomKey(), _type: 'reference', _ref: id }], 'after', [-1]),
    ])

  return (
    <Stack space={3}>
      <Inline space={2}>
        <Button
          icon={SearchIcon}
          text={busy ? 'Searching…' : 'Find Related'}
          tone="primary"
          mode="ghost"
          fontSize={1}
          padding={2}
          disabled={!places.length || busy}
          onClick={find}
        />
        <Text size={0} muted>
          {places.length
            ? `Looks for our reviews in ${places.join(', ')}.`
            : 'Fill in the Departure Port or the Day by Day ports first.'}
        </Text>
      </Inline>
      {candidates && (
        <Card padding={3} radius={2} border>
          {candidates.length === 0 ? (
            <Text size={1} muted>
              No published reviews match these places yet.
            </Text>
          ) : (
            <Stack space={2}>
              {candidates.map((c) => (
                <Flex key={c._id} align="center" gap={2}>
                  <Button
                    icon={AddIcon}
                    mode="bleed"
                    fontSize={1}
                    padding={2}
                    disabled={linked.has(c._id)}
                    onClick={() => add(c._id)}
                  />
                  <Text size={1}>
                    {c.title}
                    {c.location ? ` · ${c.location}` : ''}
                    {linked.has(c._id) ? ' (added)' : ''}
                  </Text>
                </Flex>
              ))}
            </Stack>
          )}
        </Card>
      )}
      {props.renderDefault(props)}
    </Stack>
  )
}
