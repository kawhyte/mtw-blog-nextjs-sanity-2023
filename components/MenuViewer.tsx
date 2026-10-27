import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, FileText, Loader2, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * "View menu" button plus a full-screen viewer for a restaurant menu made of
 * photos and/or PDFs. PDF pages are drawn right in the page with PDF.js, so
 * readers never download a file. Arrows, arrow keys or a swipe move between
 * pages; Esc, the X or a click outside closes it.
 */

export interface MenuFile {
  url: string
  mimeType?: string
}

type Page = { kind: 'image'; url: string } | { kind: 'pdf'; doc: any; number: number }

const isPdf = (file: MenuFile) =>
  file.mimeType === 'application/pdf' || /\.pdf($|\?)/i.test(file.url)

// Loaded on first open only, so the review page stays light
async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
  return pdfjs
}

/** One page per photo, plus one page per PDF page, in upload order */
async function buildPages(files: MenuFile[]): Promise<Page[]> {
  const pages: Page[] = []
  const pdfjs = files.some(isPdf) ? await loadPdfJs() : null
  for (const file of files) {
    if (pdfjs && isPdf(file)) {
      const doc = await pdfjs.getDocument(file.url).promise
      for (let n = 1; n <= doc.numPages; n++) pages.push({ kind: 'pdf', doc, number: n })
    } else {
      pages.push({ kind: 'image', url: file.url })
    }
  }
  return pages
}

/** Draws one PDF page to fit the space it is given, sharp on retina screens */
function PdfPage({ doc, number, label }: { doc: any; number: number; label: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Redraw when the space changes, e.g. a phone turned sideways
  const [size, setSize] = useState('')

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const observer = new ResizeObserver(() => setSize(`${box.clientWidth}x${box.clientHeight}`))
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let task: any
    let cancelled = false
    ;(async () => {
      const box = boxRef.current
      const canvas = canvasRef.current
      if (!box || !canvas) return
      const page = await doc.getPage(number)
      if (cancelled) return
      const base = page.getViewport({ scale: 1 })
      // Fit the whole page inside the box, never wider than the screen
      const scale = Math.min(box.clientWidth / base.width, box.clientHeight / base.height)
      const ratio = window.devicePixelRatio || 1
      const viewport = page.getViewport({ scale: scale * ratio })
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.width = `${viewport.width / ratio}px`
      canvas.style.height = `${viewport.height / ratio}px`
      task = page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport })
      await task.promise.catch(() => {})
    })()
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [doc, number, size])

  return (
    <div ref={boxRef} className="flex h-full w-full items-center justify-center">
      <canvas ref={canvasRef} role="img" aria-label={label} className="rounded-xl bg-white" />
    </div>
  )
}

export default function MenuViewer({
  files,
  restaurant,
}: {
  files: MenuFile[]
  restaurant: string
}) {
  const [open, setOpen] = useState(false)
  const [pages, setPages] = useState<Page[] | null>(null)
  const [error, setError] = useState(false)
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    if (!open || pages) return
    buildPages(files)
      .then(setPages)
      .catch(() => setError(true))
  }, [open, pages, files])

  const count = pages?.length ?? 0
  const step = useCallback(
    (delta: number) => setIndex((i) => Math.min(Math.max(i + delta, 0), Math.max(count - 1, 0))),
    [count],
  )

  if (!files.length) return null

  const page = pages?.[index]
  const label = `${restaurant} menu, page ${index + 1}${count ? ` of ${count}` : ''}`

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) setIndex(0)
      }}
    >
      <DialogPrimitive.Trigger className="inline-flex min-h-11 items-center gap-2 rounded-full border border-current px-4 py-2 text-sm font-semibold transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <FileText className="h-4 w-4" aria-hidden="true" />
        View menu
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/90" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[60] flex flex-col outline-none"
          aria-describedby={undefined}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') step(1)
            if (event.key === 'ArrowLeft') step(-1)
          }}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return
            const dx = event.changedTouches[0].clientX - touchStartX.current
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
            touchStartX.current = null
          }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
            <DialogPrimitive.Title
              // Inline color: the site's global heading color beats Tailwind classes here
              style={{ color: '#fff' }}
              className="m-0 min-w-0 truncate text-sm font-semibold sm:text-base"
            >
              {restaurant} menu
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close menu"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          {/* Clicking the dark area around the page closes the viewer */}
          <div
            className="relative min-h-0 flex-1 px-3 sm:px-16"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false)
            }}
          >
            {error ? (
              <p className="flex h-full items-center justify-center text-center text-white/85">
                Sorry, this menu could not be opened.
              </p>
            ) : !page ? (
              <div className="flex h-full items-center justify-center text-white/80">
                <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading menu" />
              </div>
            ) : page.kind === 'pdf' ? (
              <PdfPage key={`${index}`} doc={page.doc} number={page.number} label={label} />
            ) : (
              <div className="flex h-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={page.url}
                  src={page.url}
                  alt={label}
                  className="max-h-full max-w-full rounded-xl object-contain"
                />
              </div>
            )}

            {count > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={index === 0}
                  onClick={() => step(-1)}
                  className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:opacity-30 sm:flex"
                >
                  <ChevronLeft className="h-7 w-7" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={index === count - 1}
                  onClick={() => step(1)}
                  className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:opacity-30 sm:flex"
                >
                  <ChevronRight className="h-7 w-7" aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          {/* Big tap targets under the page on every screen size */}
          {count > 1 && (
            <div className="flex items-center justify-center gap-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 text-white">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={index === 0}
                className="flex h-12 min-w-24 items-center justify-center gap-1 rounded-full bg-white/10 px-4 text-sm font-semibold transition-colors hover:bg-white/25 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                Prev
              </button>
              <span className="min-w-[6.5rem] text-center text-sm font-semibold tabular-nums text-white/85" aria-live="polite">
                Page {index + 1} of {count}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={index === count - 1}
                className="flex h-12 min-w-24 items-center justify-center gap-1 rounded-full bg-white/10 px-4 text-sm font-semibold transition-colors hover:bg-white/25 disabled:opacity-30"
              >
                Next
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
