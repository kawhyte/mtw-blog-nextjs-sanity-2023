import { Check, MapPin, Share2 } from 'lucide-react'
import { useState } from 'react'

/** Google Maps search link for a place, e.g. "Four Seasons Las Vegas, Las Vegas, NV". */
export function directionsUrl(placeName: string, location?: string) {
  const query = [placeName, location].filter(Boolean).join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/**
 * Opens the phone's share sheet when available, otherwise copies the page
 * link and briefly shows "Link copied".
 */
export function useShare(title: string) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Share sheet dismissed or clipboard blocked — nothing to do
    }
  }
  return { share, copied }
}

interface ReviewActionsProps {
  placeName: string
  location?: string
}

/** Directions + Share buttons for the desktop side panel. */
export function ReviewActionButtons({
  placeName,
  location,
}: ReviewActionsProps) {
  const { share, copied } = useShare(placeName)
  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={directionsUrl(placeName, location)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-[3px] border-border-bold bg-primary px-3 text-sm font-bold text-primary-foreground shadow-brutalist-sm transition-transform hover:-translate-y-0.5"
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        Directions
      </a>
      <button
        type="button"
        onClick={share}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-border-bold bg-card px-3 text-sm font-bold text-foreground transition-transform hover:-translate-y-0.5"
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Share2 className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? 'Link copied' : 'Share'}
      </button>
    </div>
  )
}

/** Bar pinned to the bottom of the screen on phones and tablets. */
export function ReviewActionBar({ placeName, location }: ReviewActionsProps) {
  const { share, copied } = useShare(placeName)
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-border-bold bg-card px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2.5 xl:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-2">
        <a
          href={directionsUrl(placeName, location)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-border-bold bg-primary text-base font-bold text-primary-foreground"
        >
          <MapPin className="h-5 w-5" aria-hidden="true" />
          Directions
        </a>
        <button
          type="button"
          onClick={share}
          aria-label={copied ? 'Link copied' : 'Share this review'}
          className="flex h-12 min-w-12 items-center justify-center gap-2 rounded-xl border-2 border-border-bold bg-card px-3 text-sm font-bold text-foreground"
        >
          {copied ? (
            <Check className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Share2 className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">
            {copied ? 'Copied' : 'Share'}
          </span>
        </button>
      </div>
    </div>
  )
}
