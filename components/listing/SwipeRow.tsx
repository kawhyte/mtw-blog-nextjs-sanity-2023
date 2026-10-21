import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

interface SwipeRowProps {
  title: string
  /** Where the title (and the "See all" card, if any) go */
  seeAllHref: string
  /** Label for the dashed end card; leave out when the row already shows everything */
  seeAllLabel?: string
  children: ReactNode
}

/**
 * Airbnb-style horizontal row: swipe on touch, arrow buttons on desktop
 * (disabled at each end), and a dashed "See all" card at the end. Pure CSS
 * scroll-snap — the only JS is the arrow state.
 */
export default function SwipeRow({
  title,
  seeAllHref,
  seeAllLabel,
  children,
}: SwipeRowProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEnds = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateEnds()
    window.addEventListener('resize', updateEnds)
    return () => window.removeEventListener('resize', updateEnds)
  }, [updateEnds])

  const scrollByPage = (direction: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  const arrowClass =
    'flex h-10 w-10 items-center justify-center rounded-full border-2 bg-card transition-colors enabled:border-border-bold enabled:text-foreground enabled:hover:bg-muted disabled:cursor-default disabled:border-border disabled:text-muted-foreground/50'

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
          <Link
            href={seeAllHref}
            scroll={false}
            className="-my-3 inline-block py-3 hover:text-primary"
          >
            {title} <span aria-hidden="true">›</span>
          </Link>
        </h2>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            className={arrowClass}
            disabled={atStart}
            onClick={() => scrollByPage(-1)}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            className={arrowClass}
            disabled={atEnd}
            onClick={() => scrollByPage(1)}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Bleeds to the screen edge on phones so the next card peeks in */}
      <div
        ref={scroller}
        onScroll={updateEnds}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:scroll-px-0 md:gap-5 md:px-0"
      >
        {children}
        {seeAllLabel && (
          <Link
            href={seeAllHref}
            scroll={false}
            className="flex aspect-square w-[68vw] max-w-64 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-[22px] border-[3px] border-dashed border-border-bold bg-card p-4 text-center transition-colors hover:bg-primary-soft-background sm:w-60 lg:w-62"
          >
            <span className="font-heading-family text-lg font-extrabold leading-tight sm:text-xl">
              {seeAllLabel}
            </span>
            <span className="text-sm font-bold text-primary">Browse →</span>
          </Link>
        )}
      </div>
    </section>
  )
}
