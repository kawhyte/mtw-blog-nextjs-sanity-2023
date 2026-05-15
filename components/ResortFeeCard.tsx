import { CheckCircle2, MinusCircle, Receipt, XCircle } from 'lucide-react'

interface ResortFeeData {
  amount?: number
  covers?: string[]
  worthIt?: 'yes' | 'partially' | 'no'
}

const worthItConfig = {
  yes: {
    label: 'Worth It',
    Icon: CheckCircle2,
    className: 'text-green-600',
  },
  partially: {
    label: 'Partially Worth It',
    Icon: MinusCircle,
    className: 'text-amber-500',
  },
  no: {
    label: 'Not Worth It',
    Icon: XCircle,
    className: 'text-destructive',
  },
}

export default function ResortFeeCard({ data }: { data: ResortFeeData }) {
  const hasContent = data.amount != null || data.covers?.length || data.worthIt
  if (!hasContent) return null

  const worthIt = data.worthIt ? worthItConfig[data.worthIt] : null

  return (
    <div className="rounded-2xl border-2 border-amber-400 bg-card p-5 shadow-lg">
      <div className="mb-3 flex items-center border-b border-border pb-3 font-bold uppercase tracking-wider text-amber-500">
        <Receipt className="mr-3 h-5 w-5 shrink-0" />
        Resort Fee
        {data.amount != null && (
          <span className="ml-auto text-2xl font-bold text-foreground leading-none">
            ${data.amount}
            <span className="text-sm font-normal text-muted-foreground">
              /night
            </span>
          </span>
        )}
      </div>

      {data.covers && data.covers.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Covers
          </p>
          <div className="flex flex-wrap gap-2">
            {data.covers.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {worthIt && (
        <div className={`flex items-center font-semibold ${worthIt.className}`}>
          <worthIt.Icon className="mr-2 h-4 w-4 shrink-0" />
          {worthIt.label}
        </div>
      )}
    </div>
  )
}
