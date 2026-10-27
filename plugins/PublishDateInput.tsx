import { CalendarIcon, CheckmarkCircleIcon } from '@sanity/icons'
import { Button, Card, Flex, Grid, Stack, Text } from '@sanity/ui'
import { useCallback, useState } from 'react'
import type { StringInputProps } from 'sanity'
import { set, unset } from 'sanity'

// Quick picks for the Publish Date field on reviews and guides. Times are
// Pacific; the stored value is a normal ISO datetime, so the site's
// `publishedAt <= now()` filters keep working unchanged.
const TZ = 'America/Los_Angeles'
const PICK_HOUR = 9

function tzParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'short',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    second: Number(get('second')),
    weekday: get('weekday'),
  }
}

// UTC instant for a wall-clock time in Pacific (handles daylight saving).
function pacificToUtc(year: number, month: number, day: number, hour: number) {
  const guess = Date.UTC(year, month - 1, day, hour)
  const p = tzParts(new Date(guess))
  const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return new Date(guess - (asIfUtc - guess))
}

function pacificDaysFromToday(days: number) {
  const today = tzParts(new Date())
  // Noon UTC avoids month/day rollover surprises when adding days
  const d = new Date(Date.UTC(today.year, today.month - 1, today.day + days, 12))
  return pacificToUtc(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), PICK_HOUR)
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function tomorrowAt9() {
  return pacificDaysFromToday(1)
}

function nextMondayAt9() {
  const wd = WEEKDAYS.indexOf(tzParts(new Date()).weekday)
  return pacificDaysFromToday((1 - wd + 7) % 7 || 7)
}

function formatPacific(iso: string) {
  return `${new Date(iso).toLocaleString('en-US', {
    timeZone: TZ,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })} PT`
}

type Pick = 'now' | 'tomorrow' | 'monday' | 'custom'

function currentPick(value?: string): Pick {
  if (!value) return 'now'
  const t = new Date(value).getTime()
  if (t === tomorrowAt9().getTime()) return 'tomorrow'
  if (t === nextMondayAt9().getTime()) return 'monday'
  return 'custom'
}

export function PublishDateInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props
  const [showPicker, setShowPicker] = useState(false)
  const pick = currentPick(value)
  const customOpen = showPicker || pick === 'custom'

  const choose = useCallback(
    (next: Pick) => {
      if (next === 'custom') {
        setShowPicker(true)
        return
      }
      setShowPicker(false)
      if (next === 'now') onChange(unset())
      if (next === 'tomorrow') onChange(set(tomorrowAt9().toISOString()))
      if (next === 'monday') onChange(set(nextMondayAt9().toISOString()))
    },
    [onChange],
  )

  const options: { id: Pick; label: string }[] = [
    { id: 'now', label: 'Publish now' },
    { id: 'tomorrow', label: 'Tomorrow 9 AM' },
    { id: 'monday', label: 'Next Monday 9 AM' },
    { id: 'custom', label: 'Pick a date…' },
  ]

  const isFuture = !!value && new Date(value) > new Date()

  return (
    <Stack space={3}>
      <Grid columns={[2, 2, 4]} gap={2}>
        {options.map((o) => {
          const selected = o.id === 'custom' ? customOpen : pick === o.id && !showPicker
          return (
            <Button
              key={o.id}
              text={o.label}
              mode={selected ? 'default' : 'ghost'}
              tone={selected ? 'primary' : 'default'}
              aria-pressed={selected}
              padding={3}
              disabled={readOnly}
              onClick={() => choose(o.id)}
            />
          )
        })}
      </Grid>

      {customOpen && props.renderDefault(props)}

      {!value && (
        <Flex align="center" gap={2}>
          <Text size={1} style={{ color: 'var(--card-badge-positive-fg-color)' }}>
            <CheckmarkCircleIcon />
          </Text>
          <Text size={1} muted>
            Goes live as soon as you hit Publish.
          </Text>
        </Flex>
      )}

      {value && isFuture && (
        <Card tone="caution" padding={3} radius={2} border>
          <Flex align="center" gap={3} wrap="wrap">
            <Text size={1}>
              <CalendarIcon />
            </Text>
            <Text size={1} weight="medium" style={{ flex: 1 }}>
              Scheduled: goes live {formatPacific(value)}
            </Text>
            <Button
              text="Clear"
              mode="ghost"
              tone="caution"
              fontSize={1}
              padding={2}
              disabled={readOnly}
              onClick={() => choose('now')}
            />
          </Flex>
        </Card>
      )}

      {value && !isFuture && (
        <Text size={1} muted>
          Live since {formatPacific(value)}.
        </Text>
      )}

      {isFuture && (
        <Text size={1} muted>
          Hit Publish as usual. It stays off the site until then.
        </Text>
      )}
    </Stack>
  )
}
