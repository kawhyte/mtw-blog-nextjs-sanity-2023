import { Badge, Flex, Stack, Text } from '@sanity/ui'
import { useCallback } from 'react'
import { set } from 'sanity'
import type { NumberInputProps } from 'sanity'

import { mbpsToInternetRating } from '../lib/mbpsToRating'

const SCORE_LABELS: Record<number, string> = {
  0: 'No Internet',
  2: 'Poor',
  4: 'Slow',
  6: 'Average',
  8: 'Fast',
  9: 'Excellent',
  10: 'Exceptional',
}

function badgeTone(score: number): 'critical' | 'caution' | 'positive' {
  if (score >= 8) return 'positive'
  if (score >= 6) return 'caution'
  return 'critical'
}

export function MbpsInternetInput(props: NumberInputProps) {
  // Intercept onChange to clamp negative values to 0 in real-time
  const handleChange = useCallback<NumberInputProps['onChange']>(
    (patch) => {
      const p = patch as any
      const isNegativeSet = (pp: any) =>
        pp?.type === 'set' && typeof pp.value === 'number' && pp.value < 0

      if (isNegativeSet(p)) {
        props.onChange(set(0))
      } else if (p?.patches?.some?.(isNegativeSet)) {
        props.onChange(set(0))
      } else {
        props.onChange(patch)
      }
    },
    [props.onChange],
  )

  const mbps = props.value

  return (
    <Stack space={2}>
      {props.renderDefault({ ...props, onChange: handleChange })}
      {typeof mbps === 'number' && (() => {
        const score = mbpsToInternetRating(mbps) ?? 0
        const label = SCORE_LABELS[score] ?? String(score)
        const tone = badgeTone(score)
        return (
          <Flex align="center" gap={3} paddingTop={1}>
            <Badge tone={tone} size={2} padding={3}>
              {score} / 10
            </Badge>
            <Text size={2} muted>
              {label}
            </Text>
          </Flex>
        )
      })()}
    </Stack>
  )
}
