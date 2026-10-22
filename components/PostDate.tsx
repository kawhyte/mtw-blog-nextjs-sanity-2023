// Sanity stores dates as UTC datetimes. Formatting them in the runtime's local
// timezone made the server (UTC on Vercel) and the browser disagree on the day,
// causing hydration errors, so always format in the site's home timezone.
const SITE_TIME_ZONE = 'America/Los_Angeles'

const dayFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: SITE_TIME_ZONE,
})

const yearFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  timeZone: SITE_TIME_ZONE,
})

// Date-only strings ("2024-05-02") are calendar days, not instants, anchor
// them at noon UTC so no timezone shift moves them to a neighbouring day.
const toDate = (dateString: string) =>
  new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(dateString)
      ? `${dateString}T12:00:00Z`
      : dateString,
  )

export function formatDate(dateString: string): string {
  if (!dateString) return ''
  return dayFormatter.format(toDate(dateString))
}

export default function PostDate({ dateString }: { dateString: string }) {
  if (!dateString) return null

  return <time dateTime={dateString}>{formatDate(dateString)}</time>
}

export function PostYear({ dateString }: { dateString: string }) {
  if (!dateString) return null

  return (
    <time dateTime={dateString}>{yearFormatter.format(toDate(dateString))}</time>
  )
}
