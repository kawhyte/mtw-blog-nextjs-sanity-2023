import { ImageIcon, SearchIcon } from '@sanity/icons'
import { Button, Card, Inline, Stack, Text, useToast } from '@sanity/ui'
import { useRef, useState } from 'react'
import type { ArrayOfObjectsInputProps } from 'sanity'
import { set, useFormValue } from 'sanity'

import type { Itinerary } from '../pages/api/cruise-itinerary'
import { postForAi } from './aiRequest'
import { useDocPatch } from './CruiseSelectInputs'

// Big enough for Gemini to read small app text, small enough to upload fast
const MAX_SIDE = 1600

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** Shrinks a screenshot to a JPEG and returns it as base64 (no data: prefix) */
async function shrinkImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.85).split(',')[1]
}

/**
 * "Fill Itinerary" panel above the Day by Day list: search the published
 * route online, or read it from a screenshot of the cruise app.
 */
export function ItineraryFillerInput(props: ArrayOfObjectsInputProps) {
  const [busy, setBusy] = useState<'search' | 'screenshot' | null>(null)
  const [pending, setPending] = useState<(() => void) | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const patchDoc = useDocPatch()

  const doc = (useFormValue([]) ?? {}) as any
  const hasDays = Array.isArray(props.value) && props.value.length > 0
  const canSearch = !!doc.shipName && !!doc.sailingDate

  const apply = (itinerary: Itinerary, sources: string[]) => {
    props.onChange(
      set(
        itinerary.days.map((d) => ({ _key: randomKey(), _type: 'itineraryDay', ...d })),
      ),
    )
    // Fill the Overview fields only when they are still empty
    const overview: Record<string, string> = {}
    if (!doc.itineraryName && itinerary.itineraryName) overview.itineraryName = itinerary.itineraryName
    if (!doc.departurePort && itinerary.departurePort) overview.departurePort = itinerary.departurePort
    if (Object.keys(overview).length) patchDoc(overview)

    const dateNote =
      itinerary.foundDate && itinerary.foundDate !== doc.sailingDate
        ? `Matched the ${itinerary.foundDate} sailing, not ${doc.sailingDate}. Check the days and times.`
        : null
    setNote(
      [dateNote, sources.length ? `Sources: ${sources.join(', ')}` : null]
        .filter(Boolean)
        .join(' ') || null,
    )
    toast.push({
      status: dateNote ? 'warning' : 'success',
      title: `Filled ${itinerary.days.length} days`,
      description: 'Check the ports and times, then add what you did each day.',
    })
  }

  const run = async (mode: 'search' | 'screenshot', file?: File) => {
    setBusy(mode)
    setNote(null)
    try {
      const body =
        mode === 'search'
          ? {
              mode,
              shipName: doc.shipName,
              cruiseLine: doc.cruiseLine,
              sailingDate: doc.sailingDate,
              nights: doc.nights,
            }
          : { mode, imageBase64: await shrinkImage(file as File), mimeType: 'image/jpeg' }
      const data = await postForAi<{ itinerary: Itinerary; sources: string[] }>(
        '/api/cruise-itinerary',
        body,
      )
      apply(data.itinerary, data.sources)
    } catch (err: any) {
      toast.push({ status: 'error', title: 'Could not fill the itinerary', description: err.message })
    } finally {
      setBusy(null)
    }
  }

  // Ask before replacing days that are already filled in
  const confirmThen = (action: () => void) => (hasDays ? setPending(() => action) : action())

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} tone="primary" border>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Fill Itinerary
          </Text>
          {pending ? (
            <Inline space={2}>
              <Text size={1}>Replace the days already filled in?</Text>
              <Button
                text="Replace"
                tone="critical"
                fontSize={1}
                padding={2}
                onClick={() => {
                  pending()
                  setPending(null)
                }}
              />
              <Button text="Cancel" mode="ghost" fontSize={1} padding={2} onClick={() => setPending(null)} />
            </Inline>
          ) : (
            <Inline space={2}>
              <Button
                icon={SearchIcon}
                text={busy === 'search' ? 'Searching…' : 'Search online'}
                tone="primary"
                fontSize={1}
                padding={2}
                disabled={!canSearch || !!busy}
                onClick={() => confirmThen(() => run('search'))}
              />
              <Button
                icon={ImageIcon}
                text={busy === 'screenshot' ? 'Reading…' : 'From my screenshot'}
                tone="primary"
                mode="ghost"
                fontSize={1}
                padding={2}
                disabled={!!busy}
                onClick={() => confirmThen(() => fileRef.current?.click())}
              />
            </Inline>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.currentTarget.files?.[0]
              e.currentTarget.value = ''
              if (file) run('screenshot', file)
            }}
          />
          <Text size={0} muted>
            {canSearch
              ? 'Search uses the ship and sailing date. A screenshot of your cruise app itinerary is the most accurate.'
              : 'Search needs Ship and Sailing Date on the Overview tab. A screenshot works any time.'}
          </Text>
          {note && <Text size={0}>{note}</Text>}
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
