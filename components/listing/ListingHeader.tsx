import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

export interface ListingHeaderTab {
  key: string
  label: string
  icon: LucideIcon
}

interface ListingHeaderProps {
  title: string
  intro: string
  tabs: ListingHeaderTab[]
  activeKey: string
  onSelect: (key: string) => void
}

/**
 * Pink title band with Airbnb-style icon tabs, shared by /hotels, /food and
 * /guides. On phones the tabs scroll sideways and the chosen one is kept in view.
 */
export default function ListingHeader({
  title,
  intro,
  tabs,
  activeKey,
  onSelect,
}: ListingHeaderProps) {
  const tabStrip = useRef<HTMLDivElement>(null)

  useEffect(() => {
    tabStrip.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeKey])

  return (
    <section className="border-b border-primary/20 bg-primary-soft-background">
      <div className="container mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-8 sm:pt-10 md:px-6">
        <div>
          <h1 className="text-page font-extrabold tracking-tight text-primary md:text-page">
            {title}
          </h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            {intro}
          </p>
        </div>

        <div
          ref={tabStrip}
          role="tablist"
          aria-label={`Filter ${title.toLowerCase()}`}
          className="scrollbar-hide -mx-4 flex gap-7 overflow-x-auto px-4 md:mx-0 md:gap-9 md:px-0"
        >
          {tabs.map(({ key, label, icon: Icon }) => {
            const active = key === activeKey
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(key)}
                className={`flex min-w-11 shrink-0 flex-col items-center gap-1.5 border-b-[3px] pb-3 text-sm transition-colors ${
                  active
                    ? 'border-foreground font-bold text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
