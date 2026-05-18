import { SparklesIcon } from '@sanity/icons'
import { Box, Button, Card, Inline, Stack, Text, useToast } from '@sanity/ui'
import { useState } from 'react'
import type { ArrayOfObjectsInputProps } from 'sanity'
import { set, useFormValue } from 'sanity'

function extractPlainText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((span: any) => span.text || '').join(''))
    .join(' ')
    .trim()
}

function textToBlocks(text: string) {
  return text
    .split('\n\n')
    .filter(Boolean)
    .map((para) => ({
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).slice(2),
          text: para.trim(),
          marks: [],
        },
      ],
    }))
}

export function VerdictGeneratorInput(props: ArrayOfObjectsInputProps) {
  const [state, setState] = useState<'idle' | 'confirming' | 'generating'>('idle')
  const toast = useToast()

  const doc = useFormValue([]) as any
  const docType = doc?._type as string | undefined
  const hasContent = Array.isArray(props.value) && props.value.length > 0

  const handleButtonClick = () => {
    if (hasContent) {
      setState('confirming')
    } else {
      runGenerate()
    }
  }

  const runGenerate = async () => {
    setState('generating')

    try {
      let payload: Record<string, unknown> = { docType }

      if (docType === 'hotelReview') {
        payload = {
          ...payload,
          title: doc?.title,
          location: doc?.location,
          category: doc?.category,
          positives: doc?.positives ?? [],
          negatives: doc?.negatives ?? [],
          tip: extractPlainText(doc?.tip ?? []),
          wouldReturn: doc?.wouldReturn,
          priceTier: doc?.priceTier,
          bestFor: doc?.bestFor ?? [],
          hotelRatings: doc?.hotelRating ?? {},
        }
      } else if (docType === 'foodReview') {
        payload = {
          ...payload,
          title: doc?.title,
          location: doc?.location,
          diningType: doc?.diningType,
          positives: doc?.positives ?? [],
          negatives: doc?.negatives ?? [],
          tip: extractPlainText(doc?.tip ?? []),
          foodItems: (doc?.individualFoodRating ?? []).map((item: any) => ({
            name: item?.name,
            rating: item?.rating?.Dish,
            review: item?.review,
          })),
          foodRatings: doc?.foodRating ?? {},
          takeoutRatings: doc?.takeoutRating ?? {},
        }
      } else if (docType === 'arenas') {
        payload = {
          ...payload,
          name: doc?.name,
          location: doc?.location,
          positives: doc?.prosConsVerdict?.positives ?? [],
          negatives: doc?.prosConsVerdict?.negatives ?? [],
          foodItems: (doc?.arenaFoodItems ?? []).map((item: any) => ({
            name: item?.name,
            rating: item?.rating?.Dish,
            review: item?.review,
          })),
          arenaRatings: doc?.arenaReview ?? {},
        }
      }

      const res = await fetch('/api/generate-verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')

      props.onChange(set(textToBlocks(data.verdict)))
      toast.push({
        status: 'success',
        title: 'Verdict generated',
        description: 'Review and edit as needed before saving.',
      })
    } catch (err: any) {
      toast.push({
        status: 'error',
        title: 'Failed to generate verdict',
        description: err.message,
      })
    } finally {
      setState('idle')
    }
  }

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      {state === 'confirming' ? (
        <Card padding={3} tone="caution" radius={2} border>
          <Stack space={3}>
            <Text size={1} weight="medium">
              This will replace your existing verdict. This cannot be undone.
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
        <Box>
          <Button
            icon={SparklesIcon}
            text={state === 'generating' ? 'Generating…' : 'Generate with Gemini'}
            tone="primary"
            mode="ghost"
            fontSize={1}
            padding={2}
            disabled={state === 'generating'}
            onClick={handleButtonClick}
          />
        </Box>
      )}
    </Stack>
  )
}
