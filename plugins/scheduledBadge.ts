import { type DocumentBadgeComponent } from 'sanity'

export const ScheduledBadge: DocumentBadgeComponent = ({ draft, published }) => {
  const doc = draft ?? published
  const publishedAt = doc?.publishedAt as string | undefined

  if (!publishedAt) return null
  if (new Date(publishedAt) <= new Date()) return null

  return {
    label: 'Scheduled',
    color: 'warning',
    title: `Publishes on ${new Date(publishedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}`,
  }
}
