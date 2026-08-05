import { type DocumentBadgeComponent, type DocumentBadgeProps } from 'sanity'

export const ScheduledBadge: DocumentBadgeComponent = (
  props: DocumentBadgeProps,
) => {
  const { draft, published } = props
  const doc = draft ?? published
  const publishedAt = doc?.publishedAt as string | undefined

  if (!publishedAt) return null
  if (new Date(publishedAt) <= new Date()) return null

  return {
    label: 'Scheduled',
    color: 'warning' as const,
    title: `Publishes on ${new Date(publishedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}`,
  }
}
