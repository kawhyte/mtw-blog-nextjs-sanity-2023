import { apiVersion, dataset, projectId } from 'lib/sanity.api'
import { createClient } from 'next-sanity'
import { LiveQueryProvider } from 'next-sanity/preview'
import { useMemo } from 'react'

// Re-export so preview components have a single import point for live queries.
// useLiveQuery(initialData, query, params) returns [data, loading, enabled] and
// live-patches the server-rendered data while preview mode is active.
// Unlike the old definePreview/groq-store setup there is no client-side dataset
// mirror anymore, so the old documentLimit/includeTypes tuning is obsolete —
// each query listens for its own changes against the API directly.
export { useLiveQuery } from 'next-sanity/preview'

interface PreviewProviderProps {
  children: React.ReactNode
  token: string | null
}

/**
 * Wraps preview-mode pages. Passing `token` reconfigures the client with
 * `perspective: 'drafts'` and `useCdn: false` so drafts overlay published docs.
 * Without a token the page still renders its static props; live updates are
 * simply disabled (same graceful degradation the old setup alerted about).
 */
export default function PreviewProvider({
  children,
  token,
}: PreviewProviderProps) {
  const client = useMemo(
    () =>
      projectId
        ? createClient({ projectId, dataset, apiVersion, useCdn: false })
        : null,
    [],
  )
  if (!client || !token) return <>{children}</>
  return (
    <LiveQueryProvider client={client} token={token}>
      {children}
    </LiveQueryProvider>
  )
}
