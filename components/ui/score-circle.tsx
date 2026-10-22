// The design system's score colours: forest green for Excellent/Great,
// amber for Good/Fair, red below that. Used by the review page's big circle
// and the small circle on photo cards, so every score looks the same.

const band = (textRating: string) =>
  textRating === 'Excellent' || textRating === 'Great'
    ? 'success'
    : textRating === 'Good' || textRating === 'Fair'
      ? 'warning'
      : 'destructive'

const CIRCLE = {
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  destructive: 'bg-destructive text-white',
}

const TEXT = {
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
}

export const scoreCircleClass = (textRating: string) =>
  CIRCLE[band(textRating)]

export const scoreTextClass = (textRating: string) => TEXT[band(textRating)]

/**
 * A small score circle for the corner of a photo. The white ring keeps it
 * readable on any photo; position it with className (e.g. "left-2.5 top-2.5").
 */
export function PhotoScore({
  score,
  textRating,
  className = '',
}: {
  score: number
  textRating: string
  className?: string
}) {
  const display = score.toFixed(1)
  return (
    <span
      role="img"
      aria-label={`Rated ${display} out of 5, ${textRating}`}
      className={`font-heading-family absolute z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white pt-[0.15em] text-base font-extrabold shadow ${scoreCircleClass(textRating)} ${className}`}
    >
      {display}
    </span>
  )
}
