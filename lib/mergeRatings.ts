/**
 * Applies ALL historical revisit ratingUpdates chronologically over the base rating.
 * Uses .reduce() so Revisit 1 (Service) + Revisit 2 (Food) both accumulate.
 *
 * Accepts any numeric value including 0 — so a literal 0 can intentionally
 * downgrade a category. Only undefined/null/NaN are skipped (meaning "no change").
 * Returns a new object — does NOT mutate base.
 */
export function getEffectiveRating<T extends Record<string, number | undefined>>(
  base: T,
  revisits?: Array<{ visitDate: string; ratingUpdates?: Partial<T> }>,
): T {
  if (!revisits?.length) return base

  // Sort oldest → newest so each revisit layers on top of the previous
  const sorted = [...revisits].sort(
    (a, b) =>
      new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
  )

  return sorted.reduce<T>(
    (acc, revisit) => {
      const updates = revisit.ratingUpdates
      if (!updates) return acc

      const merged = { ...acc }
      for (const [key, val] of Object.entries(updates)) {
        // Accept 0 as a valid explicit downgrade — only skip undefined/null/NaN
        if (typeof val === 'number' && !isNaN(val)) {
          ;(merged as Record<string, number | undefined>)[key] = val
        }
      }
      return merged
    },
    { ...base },
  )
}

/**
 * Returns revisits sorted newest-first for timeline rendering.
 */
export function getSortedRevisits<T extends { visitDate: string }>(
  revisits?: T[],
): T[] {
  if (!revisits?.length) return []
  return [...revisits].sort(
    (a, b) =>
      new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
  )
}

export interface TimelineDelta {
  label: string
  before: number
  after: number
  diff: number
}

export interface TimelineEntry {
  visitDate: string
  notes?: any[]
  deltas: TimelineDelta[]
  accumulatedState: Record<string, number | undefined>
}

/**
 * Processes revisits oldest → newest, tracking the "before" state for each
 * so per-revisit deltas can be computed and displayed in the timeline.
 * Returns entries newest-first (for display).
 */
export function computeTimelineEntries(
  base: Record<string, number | undefined>,
  revisits: Array<{
    visitDate: string
    notes?: any[]
    ratingUpdates?: Record<string, number | undefined>
  }>,
  labelMap: Record<string, string>,
): TimelineEntry[] {
  if (!revisits?.length) return []

  const sorted = [...revisits].sort(
    (a, b) =>
      new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime(),
  )

  let currentState: Record<string, number | undefined> = { ...base }
  const entries: TimelineEntry[] = []

  for (const revisit of sorted) {
    const stateBefore = { ...currentState }
    const deltas: TimelineDelta[] = []

    if (revisit.ratingUpdates) {
      for (const [key, val] of Object.entries(revisit.ratingUpdates)) {
        if (typeof val === 'number' && !isNaN(val)) {
          const before = stateBefore[key] ?? 0
          if (before !== val) {
            deltas.push({
              label: labelMap[key] || key,
              before,
              after: val,
              diff: val - before,
            })
          }
          currentState = { ...currentState, [key]: val }
        }
      }
    }

    entries.push({
      visitDate: revisit.visitDate,
      notes: revisit.notes,
      deltas,
      accumulatedState: { ...currentState },
    })
  }

  // Reverse so newest revisit is first in the timeline
  return entries.reverse()
}
