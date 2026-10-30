import SanityImage from 'components/SanityImage'
import { CHECKLIST_EXTRAS } from 'lib/gearSections'
import type { Essential } from 'lib/sanity.queries'
import { Check, Copy, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'

import { storeName } from './GearCard'

interface ChecklistGroup {
  id: string
  title: string
  items: Essential[]
}

interface Row {
  id: string
  name: string
  item?: Essential
}

/** Every group as plain rows: gear groups first, then the no-link extras */
const toRows = (groups: ChecklistGroup[]) => [
  ...groups.map((group) => ({
    id: group.id,
    title: group.title,
    rows: group.items.map((item) => ({
      id: item._id,
      name: item.name?.replace(/\s+/g, ' ') ?? '',
      item,
    })) as Row[],
  })),
  ...CHECKLIST_EXTRAS.map((extra) => ({
    id: extra.id,
    title: extra.title,
    rows: extra.items.map((name) => ({
      id: `${extra.id}:${name}`,
      name,
    })) as Row[],
  })),
]

// Ticks live in this browser only; a private window or blocked storage just starts empty
const load = (key: string): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? '[]'))
  } catch {
    return new Set()
  }
}
const save = (key: string, ticks: Set<string>) => {
  try {
    localStorage.setItem(key, JSON.stringify([...ticks]))
  } catch {
    // Nothing to do: the list still works, it just won't remember
  }
}

/** Checklist view of the Travel Gear page: tick things off while packing */
export default function PackingChecklist({
  groups,
  listName,
  storageKey,
}: {
  groups: ChecklistGroup[]
  /** e.g. "Cruise packing list" */
  listName: string
  storageKey: string
}) {
  const sections = toRows(groups)
  const total = sections.reduce((n, s) => n + s.rows.length, 0)
  const [ticks, setTicks] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  useEffect(() => setTicks(load(storageKey)), [storageKey])

  const update = (next: Set<string>) => {
    setTicks(next)
    save(storageKey, next)
  }
  const toggle = (id: string) => {
    const next = new Set(ticks)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    update(next)
  }

  const packed = sections.reduce(
    (n, s) => n + s.rows.filter((row) => ticks.has(row.id)).length,
    0,
  )

  const copyList = async () => {
    const text = [
      `What We Pack: ${listName}`,
      ...sections.map(
        (s) =>
          `\n${s.title}\n` +
          s.rows
            .map((row) => `${ticks.has(row.id) ? '[x]' : '[ ]'} ${row.name}`)
            .join('\n'),
      ),
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const buttonClass =
    'inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:border-foreground/40'

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
      <aside className="flex flex-col gap-3.5 rounded-2xl border-[3px] border-border-bold bg-card p-5 print:hidden lg:sticky lg:top-24 lg:order-2">
        <span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          {listName}
        </span>
        <span className="font-epilogue text-3xl font-extrabold">
          {packed} of {total} packed
        </span>
        <div
          role="progressbar"
          aria-label="Packed"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={packed}
          className="h-2.5 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${total ? (packed / total) * 100 : 0}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Ticks are saved on this phone or laptop, so you can come back while
          you pack.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className={buttonClass}
          >
            <Printer size={16} aria-hidden="true" />
            Print
          </button>
          <button type="button" onClick={copyList} className={buttonClass}>
            {copied ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy list'}
          </button>
        </div>
        {packed > 0 && (
          <button
            type="button"
            onClick={() => update(new Set())}
            className="min-h-9 self-center text-sm font-bold text-muted-foreground underline underline-offset-2"
          >
            Start over
          </button>
        )}
      </aside>

      <div className="flex flex-col gap-6 lg:order-1">
        <h2 className="hidden font-epilogue text-2xl font-extrabold print:block">
          What We Pack: {listName}
        </h2>
        {sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-2">
            <h3 className="font-epilogue text-lg font-extrabold">
              {section.title}
            </h3>
            <ul className="overflow-hidden rounded-2xl border border-border bg-card print:rounded-none">
              {section.rows.map((row) => {
                const on = ticks.has(row.id)
                const store = storeName(row.item?.link)
                return (
                  <li
                    key={row.id}
                    className="flex items-center gap-3 border-b border-border px-3 last:border-b-0"
                  >
                    <label className="flex min-h-14 min-w-0 flex-1 cursor-pointer items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(row.id)}
                        className="size-6 shrink-0 cursor-pointer accent-foreground"
                      />
                      {row.item && (
                        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white print:hidden">
                          {row.item.productImage?.asset && (
                            <SanityImage
                              image={row.item.productImage}
                              width={88}
                              alt=""
                              sizes="44px"
                              className="h-full w-full object-contain p-1"
                            />
                          )}
                        </span>
                      )}
                      <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                        <span
                          className={`text-sm font-bold sm:text-base ${
                            on ? 'text-muted-foreground line-through' : ''
                          }`}
                        >
                          {row.name}
                        </span>
                        {row.item?.featured && (
                          <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-extrabold text-pink-800">
                            Must pack
                          </span>
                        )}
                      </span>
                    </label>
                    {store && row.item?.link && (
                      <a
                        href={row.item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Get ${row.name} at ${store} (opens in a new tab)`}
                        className="hidden shrink-0 text-sm font-bold text-muted-foreground hover:text-foreground sm:inline print:hidden"
                      >
                        {store} ↗
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
