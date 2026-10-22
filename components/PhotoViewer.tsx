import * as DialogPrimitive from '@radix-ui/react-dialog'
import { urlForImage } from 'lib/sanity.image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

/*
 * Click-to-enlarge for photos inside an article (guides, review write-ups).
 * PostBody lists every photo in reading order; each photo is wrapped in
 * <ZoomablePhoto>, which opens this full-screen viewer at that photo.
 * Close with the X, Esc, or a click outside the photo; arrows (or arrow
 * keys / a swipe on phones) move between photos.
 */

export interface ViewerPhoto {
  key: string
  image: any
  caption?: string
}

const PhotoViewerContext = createContext<((key: string) => void) | null>(null)

export const photoKey = (image: any) =>
  image?._key || image?.asset?._ref || image?.asset?._id || ''

export function PhotoViewerProvider({
  photos,
  children,
}: {
  photos: ViewerPhoto[]
  children: ReactNode
}) {
  const [index, setIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const open = useCallback(
    (key: string) => {
      const i = photos.findIndex((photo) => photo.key === key)
      if (i !== -1) setIndex(i)
    },
    [photos],
  )

  const count = photos.length
  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i === null ? i : (i + delta + count) % count)),
    [count],
  )

  const photo = index === null ? null : photos[index]
  const src = useMemo(
    () =>
      photo
        ? urlForImage(photo.image).width(2000).fit('max').quality(85).url()
        : '',
    [photo],
  )
  const alt = photo?.image?.alt || photo?.caption || 'Photo'

  return (
    <PhotoViewerContext.Provider value={open}>
      {children}
      <DialogPrimitive.Root
        open={index !== null}
        onOpenChange={(isOpen) => !isOpen && setIndex(null)}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/90" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-[60] flex flex-col outline-none"
            onKeyDown={(event) => {
              if (count < 2) return
              if (event.key === 'ArrowRight') step(1)
              if (event.key === 'ArrowLeft') step(-1)
            }}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null || count < 2) return
              const dx = event.changedTouches[0].clientX - touchStartX.current
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
              touchStartX.current = null
            }}
          >
            <DialogPrimitive.Title className="sr-only">
              {alt}
            </DialogPrimitive.Title>
            <div className="flex items-center justify-between px-4 py-3 text-white">
              <span className="text-sm font-semibold text-white/80">
                {count > 1 && index !== null ? `${index + 1} / ${count}` : ''}
              </span>
              <DialogPrimitive.Close
                aria-label="Close larger view"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>

            {/* Clicking the dark area around the photo closes the viewer */}
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16"
              onClick={(event) => {
                if (event.target === event.currentTarget) setIndex(null)
              }}
            >
              {photo && (
                <figure className="m-0 flex max-h-full flex-col items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={src}
                    src={src}
                    alt={alt}
                    className="max-h-[78vh] max-w-full rounded-xl object-contain"
                  />
                  {photo.caption && (
                    <figcaption className="max-w-2xl text-center text-sm text-white/85">
                      {photo.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {count > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() => step(-1)}
                    className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:flex"
                  >
                    <ChevronLeft className="h-7 w-7" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => step(1)}
                    className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:flex"
                  >
                    <ChevronRight className="h-7 w-7" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </PhotoViewerContext.Provider>
  )
}

/** Wraps a photo so clicking it opens the viewer (plain photo outside an article) */
export function ZoomablePhoto({
  image,
  className = '',
  children,
}: {
  image: any
  className?: string
  children: ReactNode
}) {
  const open = useContext(PhotoViewerContext)
  if (!open) return <>{children}</>
  return (
    <button
      type="button"
      onClick={() => open(photoKey(image))}
      aria-label={`View larger: ${image?.alt || image?.caption || 'photo'}`}
      className={`m-0 block cursor-zoom-in appearance-none border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary ${className}`}
    >
      {children}
    </button>
  )
}
