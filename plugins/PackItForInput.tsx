import { Button, Flex, Stack, Text } from '@sanity/ui'
import type { ArrayOfPrimitivesInputProps } from 'sanity'
import { set, unset } from 'sanity'

import { GEAR_TRIPS } from '../lib/gearSections'

/** The trip checkboxes with "Select all" and "Clear" above them */
export function PackItForInput(props: ArrayOfPrimitivesInputProps) {
  const value = (props.value ?? []) as string[]
  const ticked = GEAR_TRIPS.filter((t) => value.includes(t.value)).length
  const all = ticked === GEAR_TRIPS.length

  return (
    <Stack space={3}>
      <Flex align="center" gap={2}>
        <Text size={1} muted style={{ flex: 1 }}>
          {ticked} of {GEAR_TRIPS.length} ticked
        </Text>
        <Button
          text="Select all"
          mode="ghost"
          tone="primary"
          fontSize={1}
          padding={2}
          disabled={all || props.readOnly}
          onClick={() => props.onChange(set(GEAR_TRIPS.map((t) => t.value)))}
        />
        <Button
          text="Clear"
          mode="ghost"
          fontSize={1}
          padding={2}
          disabled={ticked === 0 || props.readOnly}
          onClick={() => props.onChange(unset())}
        />
      </Flex>
      {props.renderDefault(props)}
    </Stack>
  )
}
