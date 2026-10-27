import { SparklesIcon } from '@sanity/icons'
import { Button, Card, Inline, Stack, Text, useToast } from '@sanity/ui'
import { useState } from 'react'
import type { ArrayOfObjectsInputProps } from 'sanity'
import { set, useFormValue } from 'sanity'

import { findLine } from '../lib/cruiseShips'
import type { SuggestedFaq } from '../pages/api/suggest-cruise-faq'
import { postForAi } from './aiRequest'
import { extractPlainText } from './utils'

// Photos, files and Studio bookkeeping say nothing an FAQ can use
const SKIP_KEYS = new Set([
  'heroPhotos', 'gallery', 'coverImage', 'menu', 'factSources', 'faqs',
  'relatedHotels', 'relatedFood', 'relatedGuides', 'titleEdited', 'slug', 'tags',
  'seoExcerpt', 'disclosure', 'publishedAt', 'sailings',
])

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** The review as plain data for the prompt: no images, no _keys, rich text as text */
function reviewData(value: any): any {
  if (Array.isArray(value)) {
    if (value.some((v) => v?._type === 'block')) return extractPlainText(value)
    return value.map(reviewData)
  }
  if (value && typeof value === 'object') {
    if (value._type === 'image' || value._type === 'file' || value.asset) return undefined
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('_') || SKIP_KEYS.has(k)) continue
      const clean = reviewData(v)
      if (clean !== undefined && clean !== '' && !(Array.isArray(clean) && !clean.length)) out[k] = clean
    }
    return out
  }
  return value
}

/** FAQ list with a "Suggest FAQ" button: search questions, answered from this review */
export function FaqSuggestInput(props: ArrayOfObjectsInputProps) {
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const doc = (useFormValue([]) ?? {}) as any
  const current = (props.value ?? []) as any[]

  const run = async () => {
    setBusy(true)
    try {
      const review = { ...reviewData(doc), cruiseLine: findLine(doc.cruiseLine)?.title ?? doc.cruiseLine }
      const data = await postForAi<{ faqs: SuggestedFaq[] }>('/api/suggest-cruise-faq', { review })
      const asked = current.map((f) => String(f.question ?? '').toLowerCase())
      const added = data.faqs.filter((f) => !asked.includes(f.question.toLowerCase()))
      props.onChange(
        set([
          ...current,
          ...added.map((f) => ({
            _key: randomKey(),
            _type: 'faq',
            question: f.question,
            ...(f.answer && { answer: f.answer }),
          })),
        ]),
      )
      const unanswered = added.filter((f) => !f.answer).length
      toast.push({
        status: unanswered ? 'warning' : 'success',
        title: `Added ${added.length} questions`,
        description: unanswered
          ? `${unanswered} need your answer (marked in red). Answer or delete them.`
          : 'Read each answer and edit anything that is not quite right.',
      })
    } catch (err: any) {
      toast.push({ status: 'error', title: 'Could not suggest FAQs', description: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} tone="primary" border>
        <Stack space={3}>
          <Inline space={2}>
            <Button
              icon={SparklesIcon}
              text={busy ? 'Writing…' : 'Suggest FAQ'}
              tone="primary"
              fontSize={1}
              padding={2}
              disabled={!doc.shipName || busy}
              onClick={run}
            />
          </Inline>
          <Text size={0} muted>
            Picks questions cruisers search for and answers them only from this review. Best done
            last, once the rest is filled in. Questions it cannot answer come back empty for you.
          </Text>
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
