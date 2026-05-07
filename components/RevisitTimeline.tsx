import { PortableText } from '@portabletext/react'
import { CalendarCheck, History, TrendingDown, TrendingUp } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

interface TimelineDelta {
  label: string
  before: number
  after: number
  diff: number
}

interface TimelineEntry {
  visitDate: string
  notes?: any[]
  displayRating: string
  textRating: string
  color: string
  deltas: TimelineDelta[]
}

interface RevisitTimelineProps {
  originalDate: string
  originalDisplayRating: string
  originalTextRating: string
  originalColor: string
  entries: TimelineEntry[]
}

function formatVisitDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
}

function DeltaRow({ delta }: { delta: TimelineDelta }) {
  const isPositive = delta.diff > 0
  const isNegative = delta.diff < 0

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 truncate font-medium text-foreground">
        {delta.label}
      </span>
      <span className="text-muted-foreground">
        {delta.before} → {delta.after}
      </span>
      <span
        className={`flex items-center gap-0.5 font-semibold ${
          isPositive
            ? 'text-green-600 dark:text-green-400'
            : isNegative
              ? 'text-red-500 dark:text-red-400'
              : 'text-muted-foreground'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5" />
        )}
        {isPositive ? '+' : ''}
        {delta.diff}
      </span>
    </div>
  )
}

function RatingPill({
  displayRating,
  textRating,
  color,
}: {
  displayRating: string
  textRating: string
  color: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {displayRating} / 5
      </span>
      <span className="text-xs font-medium text-muted-foreground">
        {textRating}
      </span>
    </div>
  )
}

export default function RevisitTimeline({
  originalDate,
  originalDisplayRating,
  originalTextRating,
  originalColor,
  entries,
}: RevisitTimelineProps) {
  if (!entries.length) return null

  return (
    <section aria-label="Visit History" className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-bold tracking-tight">Visit History</h2>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />

        <ol className="space-y-6">
          {/* Revisit entries — newest first */}
          {entries.map((entry, i) => (
            <li key={i} className="relative flex gap-4">
              {/* Dot */}
              <div className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-foreground bg-background" />

              <div className="flex-1 space-y-2 pb-2">
                {/* Header row */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    {formatVisitDate(entry.visitDate)}
                  </div>
                  <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Revisit
                  </span>
                </div>

                {/* Notes */}
                {entry.notes && entry.notes.length > 0 && (
                  <div className="prose-sm max-w-none">
                    <PortableText
                      value={entry.notes}
                      components={portableTextComponents}
                    />
                  </div>
                )}

                {/* Deltas */}
                {entry.deltas.length > 0 && (
                  <div className="mt-2 space-y-1.5 rounded-md border border-border bg-muted/30 px-3 py-2">
                    {entry.deltas.map((delta, j) => (
                      <DeltaRow key={j} delta={delta} />
                    ))}
                  </div>
                )}

                {/* Current rating after this revisit */}
                <RatingPill
                  displayRating={entry.displayRating}
                  textRating={entry.textRating}
                  color={entry.color}
                />
              </div>
            </li>
          ))}

          <Separator className="ml-6" />

          {/* Original visit — always at bottom */}
          <li className="relative flex gap-4">
            <div className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  {formatVisitDate(originalDate)}
                </div>
                <span className="rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                  Original Visit
                </span>
              </div>

              <RatingPill
                displayRating={originalDisplayRating}
                textRating={originalTextRating}
                color={originalColor}
              />
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}
