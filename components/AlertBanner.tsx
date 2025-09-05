/* eslint-disable @next/next/no-html-link-for-pages */
import Container from 'components/BlogContainer'
import { Info } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AlertBanner({
  preview,
  loading,
}: {
  preview?: boolean
  loading?: boolean
}) {
  if (!preview) return null

  return (
    <Container>
      <Alert className="my-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          {loading ? 'Loading... ' : 'This page is a preview. '}
          <a
            href="/api/exit-preview"
            className="underline transition-colors duration-200 hover:text-primary font-medium"
          >
            Click here
          </a>{' '}
          to exit preview mode.
        </AlertDescription>
      </Alert>
    </Container>
  )
}
