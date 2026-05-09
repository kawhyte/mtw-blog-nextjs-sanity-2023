import { format, parseISO } from 'date-fns'

export function formatDate(dateString: string): string {
  if (!dateString) return ''
  return format(parseISO(dateString), 'MMM d, yyyy')
}

export default function PostDate({ dateString }: { dateString: string }) {
  if (!dateString) return null

  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'MMM d, yyyy')}</time>
}

export function PostYear({ dateString }: { dateString: string }) {
  if (!dateString) return null

  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'u')}</time>
}
