import { SparklesIcon } from '@sanity/icons'
import { Box, Button, Card, Inline, Stack, Text, useToast } from '@sanity/ui'
import { useState } from 'react'
import type { StringInputProps } from 'sanity'
import { set, useFormValue } from 'sanity'

import { extractPlainText } from './utils'

/**
 * Verdict Headline field with a "Generate with Gemini" button. The button
 * stays disabled until the review has something to summarise (The Verdict,
 * What We Loved or What We Didn't Like); the result lands in the field so it
 * can be edited, and you can always just type your own.
 */
export function VerdictHeadlineGeneratorInput(props: StringInputProps) {
  const [state, setState] = useState<'idle' | 'confirming' | 'generating'>(
    'idle',
  )
  const toast = useToast()

  const doc = useFormValue([]) as any
  const verdictText = extractPlainText(doc?.verdict ?? [])
  const positives: string[] = (doc?.positives ?? []).filter(Boolean)
  const negatives: string[] = (doc?.negatives ?? []).filter(Boolean)
  const hasSource =
    Boolean(verdictText.trim()) || positives.length > 0 || negatives.length > 0
  const hasContent = Boolean(props.value?.trim())

  const runGenerate = async () => {
    setState('generating')
    try {
      const res = await fetch('/api/generate-verdict-headline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: doc?._type,
          title: doc?.title,
          location: doc?.location,
          category: doc?.category,
          room: doc?.room,
          verdict: verdictText,
          positives,
          negatives,
          wouldReturn: doc?.wouldReturn,
          priceTier: doc?.priceTier,
          internetSpeed: doc?.internetSpeed,
          techRating: doc?.techRating,
          roomAmenities: doc?.roomAmenities,
          // Food reviews
          diningType: doc?.diningType,
          dishes: (doc?.individualFoodRating ?? [])
            .filter((dish: any) => dish?.name)
            .map((dish: any) => ({
              name: dish.name,
              rating: dish.rating?.Dish,
              price: dish.price,
            })),
        }),
        signal: AbortSignal.timeout(20000),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')

      props.onChange(set(data.verdictHeadline))
      toast.push({
        status: 'success',
        title: `Verdict headline generated (${(data.verdictHeadline as string).length} chars)`,
        description:
          'Read it over and tweak anything that doesn’t sound like you.',
      })
    } catch (err: any) {
      toast.push({
        status: 'error',
        title: 'Failed to generate verdict headline',
        description: err.message,
      })
    } finally {
      setState('idle')
    }
  }

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {state === 'confirming' ? (
        <Card padding={3} tone="caution" radius={2} border>
          <Stack space={3}>
            <Text size={1} weight="medium">
              This will replace your current headline. This cannot be undone.
            </Text>
            <Inline space={2}>
              <Button
                text="Cancel"
                mode="ghost"
                fontSize={1}
                padding={2}
                onClick={() => setState('idle')}
              />
              <Button
                text="Generate Anyway"
                tone="caution"
                fontSize={1}
                padding={2}
                onClick={runGenerate}
              />
            </Inline>
          </Stack>
        </Card>
      ) : (
        <Stack space={2}>
          <Box>
            <Button
              icon={SparklesIcon}
              text={
                state === 'generating' ? 'Generating…' : 'Generate with Gemini'
              }
              tone="primary"
              mode="ghost"
              fontSize={1}
              padding={2}
              disabled={!hasSource || state === 'generating'}
              onClick={() =>
                hasContent ? setState('confirming') : runGenerate()
              }
            />
          </Box>
          {!hasSource && (
            <Text size={1} muted>
              Fill in The Verdict, What We Loved or What We Didn’t Like first —
              the headline is written from those.
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  )
}
