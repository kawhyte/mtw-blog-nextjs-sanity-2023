import { scoreCircleClass, scoreTextClass } from 'components/ui/score-circle'
import { calculateRating } from 'lib/calculateRating'
import type { ReactNode } from 'react'

// Small building blocks shared by the cruise review sections

/** A 0 to 10 score as the site's 5-point circle, coloured by its band */
export function ScoreCircle({
  score,
  size = 'md',
}: {
  score: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const { displayRating, textRating } = calculateRating({ s: score }, { s: 1 })
  const box = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-14 w-14 text-lg',
  }[size]
  return (
    <span
      role="img"
      aria-label={`Rated ${displayRating} out of 5, ${textRating}`}
      className={`font-heading-family flex shrink-0 items-center justify-center rounded-full pt-[0.15em] font-extrabold ${box} ${scoreCircleClass(textRating)}`}
    >
      {displayRating}
    </span>
  )
}

/** Score circle plus its word, e.g. "4.1 Great · Cabin score" */
export function ScoreWithLabel({
  score,
  label,
}: {
  score: number
  label: string
}) {
  const { textRating } = calculateRating({ s: score }, { s: 1 })
  return (
    <div className="flex items-center gap-3">
      <ScoreCircle score={score} size="lg" />
      <div>
        <div
          className={`font-heading-family text-base font-extrabold ${scoreTextClass(textRating)}`}
        >
          {textRating}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}

/** One section of the review, with the heading rule and an optional score */
export function CruiseSection({
  id,
  title,
  score,
  scoreLabel,
  children,
}: {
  id: string
  title: string
  score?: number
  scoreLabel?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-32 pt-12 md:pt-16">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-border-bold pb-4">
        <h2 className="text-section font-extrabold md:text-page">{title}</h2>
        {typeof score === 'number' && scoreLabel && (
          <ScoreWithLabel score={score} label={scoreLabel} />
        )}
      </div>
      <div className="flex flex-col gap-5 md:gap-6">{children}</div>
    </section>
  )
}

export function OurTake({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div className="rounded-2xl bg-primary-soft-background px-5 py-4 md:px-6 md:py-5">
      <Eyebrow>Our take</Eyebrow>
      <p className="mt-1.5 text-base font-semibold leading-relaxed md:text-lg">
        {text}
      </p>
    </div>
  )
}

export function Eyebrow({
  children,
  className = 'text-muted-foreground',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`text-xs font-extrabold uppercase tracking-[0.1em] ${className}`}
    >
      {children}
    </div>
  )
}

const CARD_TONES = {
  bold: 'border-[3px] border-border-bold bg-card',
  plain: 'border-2 border-border bg-card',
  dashed: 'border-[3px] border-dashed border-muted-foreground bg-card',
  green: 'border-2 border-green-200 bg-green-50',
  red: 'border-2 border-red-200 bg-red-50',
  amber: 'border-2 border-amber-200 bg-amber-50',
  success: 'border-[3px] border-success bg-card',
}

export function Card({
  tone = 'bold',
  className = '',
  children,
}: {
  tone?: keyof typeof CARD_TONES
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl p-4 md:p-5 ${CARD_TONES[tone]} ${className}`}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-lg font-extrabold md:text-title">
      {children}
    </h3>
  )
}

export function Fact({
  label,
  value,
  sub,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
}) {
  return (
    <div className="min-w-0 rounded-xl border-2 border-border bg-card px-4 py-3">
      <Eyebrow>{label}</Eyebrow>
      <div className="font-heading-family mt-1 text-lg font-extrabold leading-snug">
        {value}
      </div>
      {sub && <div className="mt-0.5 text-sm text-muted-foreground">{sub}</div>}
    </div>
  )
}

export function Bullets({ items }: { items?: string[] }) {
  if (!items?.length) return null
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 text-base leading-relaxed">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function Pill({
  children,
  className = 'border border-border bg-card text-foreground',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  )
}

/** Shows a list section only when it has something in it */
export const has = (list?: unknown[] | null) => !!list && list.length > 0
