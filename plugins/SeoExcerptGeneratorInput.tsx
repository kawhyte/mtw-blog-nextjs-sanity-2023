import { SparklesIcon } from '@sanity/icons'
import { Box, Button, Card, Inline, Stack, Text, useToast } from '@sanity/ui'
import { useState } from 'react'
import type { StringInputProps } from 'sanity'
import { set, useFormValue } from 'sanity'
import { extractPlainText } from './utils'

export function SeoExcerptGeneratorInput(props: StringInputProps) {
  const [state, setState] = useState<'idle' | 'confirming' | 'generating'>('idle')
  const toast = useToast()

  const doc = useFormValue([]) as any
  const docType = doc?._type as string | undefined
  const hasContent = Boolean(props.value?.trim())

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
          wouldReturn: doc?.wouldReturn,
          verdict: extractPlainText(doc?.verdict ?? []),
        }
      } else if (docType === 'foodReview') {
        payload = {
          ...payload,
          title: doc?.title,
          location: doc?.location,
          diningType: doc?.diningType,
          positives: doc?.positives ?? [],
          verdict: extractPlainText(doc?.verdict ?? []),
        }
      } else if (docType === 'arenas') {
        payload = {
          ...payload,
          name: doc?.name,
          location: doc?.location,
          positives: doc?.prosConsVerdict?.positives ?? [],
          verdict: extractPlainText(doc?.prosConsVerdict?.verdict ?? []),
        }
      }

      const res = await fetch('/api/generate-seo-excerpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12000),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')

      props.onChange(set(data.seoExcerpt))
      const len = (data.seoExcerpt as string).length
      toast.push({
        status: 'success',
        title: `SEO excerpt generated (${len} chars)`,
        description: len < 120 || len > 155 ? 'Consider editing — ideal range is 120–155 chars' : 'Within the ideal 120–155 character range.',
      })
    } catch (err: any) {
      toast.push({
        status: 'error',
        title: 'Failed to generate SEO excerpt',
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
              This will replace your existing SEO excerpt. This cannot be undone.
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
