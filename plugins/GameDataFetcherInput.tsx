import { SearchIcon } from '@sanity/icons'
import { Box, Button, Card, Flex, Inline, Stack, Text, TextInput, useToast } from '@sanity/ui'
import { useState } from 'react'
import type { ArrayOfObjectsInputProps } from 'sanity'
import { set, useFormValue } from 'sanity'

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

function toDateString(isoDatetime: string | undefined): string | null {
  if (!isoDatetime) return null
  const d = new Date(isoDatetime)
  if (isNaN(d.getTime())) return null
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatChipLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function GameDataFetcherInput(props: ArrayOfObjectsInputProps) {
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  // Root document — for visit dates
  const doc = useFormValue([]) as any
  // Parent gallery item — for team name + type
  const parentItem = useFormValue(props.path.slice(0, -1)) as any

  const teamName = parentItem?.name as string | undefined
  const teamType = parentItem?.teamType as string | undefined
  const isSupported = teamType === 'nba' || teamType === 'wnba'

  // Collect all recorded visit dates from this arena document as quick-select chips
  const visitDates: Array<{ label: string; value: string }> = []
  const addVisitDate = (raw: string | undefined) => {
    const d = toDateString(raw)
    if (d && !visitDates.some((v) => v.value === d)) {
      visitDates.push({ label: formatChipLabel(d), value: d })
    }
  }
  addVisitDate(doc?.date)
  for (const r of doc?.revisits ?? []) {
    addVisitDate(r?.visitDate)
  }
  // Sort most recent first
  visitDates.sort((a, b) => b.value.localeCompare(a.value))

  const handleFetch = async () => {
    if (!date || !teamName) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/game-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameDate: date, teamName, teamType }),
        signal: AbortSignal.timeout(20000),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Failed to fetch game data')
        return
      }

      const newGame = { _key: randomKey(), ...data.game }
      const current = Array.isArray(props.value) ? props.value : []
      props.onChange(set([...current, newGame]))

      const scoreLabel =
        data.game.homeScore != null && data.game.awayScore != null
          ? ` · ${data.game.homeScore}–${data.game.awayScore}`
          : ''

      toast.push({
        status: 'success',
        title: 'Game added!',
        description: `${data.game.opponent}${scoreLabel}`,
      })
      setDate('')
    } catch (err: any) {
      setError(err.message ?? 'Network error — check your connection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack space={4}>
      {/* Fetch panel */}
      <Card padding={3} radius={2} tone={isSupported ? 'primary' : 'default'} border>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            {isSupported
              ? `Fetch Game from ESPN${teamName ? ` · ${teamName}` : ''}`
              : 'Auto-fetch is only available for NBA and WNBA teams'}
          </Text>

          {isSupported ? (
            <>
              {visitDates.length > 0 && (
                <Stack space={2}>
                  <Text size={0} muted>
                    Your recorded visit dates (click to select):
                  </Text>
                  <Inline space={2} style={{ flexWrap: 'wrap', gap: '6px' }}>
                    {visitDates.map((chip) => (
                      <Button
                        key={chip.value}
                        text={chip.label}
                        fontSize={0}
                        padding={2}
                        mode={date === chip.value ? 'default' : 'ghost'}
                        tone="primary"
                        onClick={() => setDate(chip.value)}
                      />
                    ))}
                  </Inline>
                </Stack>
              )}

              <Flex gap={2} align="center">
                <Box flex={1}>
                  <TextInput
                    value={date}
                    onChange={(e) => setDate(e.currentTarget.value)}
                    placeholder="YYYY-MM-DD"
                    type="date"
                    fontSize={1}
                  />
                </Box>
                <Button
                  icon={SearchIcon}
                  text={loading ? 'Fetching…' : 'Fetch Game'}
                  tone="primary"
                  mode="default"
                  fontSize={1}
                  padding={2}
                  disabled={loading || !date || !teamName}
                  onClick={handleFetch}
                />
              </Flex>

              {error && (
                <Card padding={2} tone="critical" radius={2}>
                  <Text size={0}>{error}</Text>
                </Card>
              )}
            </>
          ) : (
            <Text size={1} muted>
              {teamType
                ? `Set League / Team Type to NBA or WNBA to enable auto-fetch.`
                : `Set the League / Team Type field first, then come back here.`}
            </Text>
          )}
        </Stack>
      </Card>

      {/* Standard array editor: shows existing game entries + manual add button */}
      {props.renderDefault(props)}
    </Stack>
  )
}
