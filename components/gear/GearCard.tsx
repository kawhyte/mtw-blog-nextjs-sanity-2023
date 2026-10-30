import SanityImage from 'components/SanityImage'
import type { Essential } from 'lib/sanity.queries'

// Store names for the button; anything else shows its domain ("Dji.com" style)
const STORES: Record<string, string> = {
  amazon: 'Amazon',
  rei: 'REI',
  nike: 'Nike',
  temu: 'Temu',
  dji: 'DJI',
  blackgirlsunscreen: 'Black Girl Sunscreen',
}

export function storeName(link?: string) {
  if (!link) return null
  try {
    const host = new URL(link).hostname.replace(/^www\./, '')
    const brand = host.split('.').slice(-2, -1)[0] ?? host
    return STORES[brand] ?? brand.charAt(0).toUpperCase() + brand.slice(1)
  } catch {
    return null
  }
}

const priceLabel = (price?: number) =>
  price && price > 0
    ? `$${Number.isInteger(price) ? price : price.toFixed(2)}`
    : null

/** Plain text of the short Portable Text description */
const descriptionText = (description: Essential['description']) =>
  Array.isArray(description)
    ? description
        .map((block: any) =>
          (block?.children ?? []).map((child: any) => child.text).join(''),
        )
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    : ''

/** One product: photo, name, why we pack it, price and the store button */
export default function GearCard({
  item,
  priority = false,
  noteOpen = false,
  onToggleNote,
}: {
  item: Essential
  priority?: boolean
  /** "How we use it" is open under this card's row */
  noteOpen?: boolean
  onToggleNote?: () => void
}) {
  const blurb = item.whyWePack?.trim() || descriptionText(item.description)
  const price = priceLabel(item.price)
  const store = storeName(item.link)

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-square overflow-hidden rounded-2xl border-[3px] border-border-bold bg-white"
      >
        {item.productImage?.asset && (
          <SanityImage
            image={item.productImage}
            width={600}
            alt={item.name ?? 'Travel gear'}
            sizes="(min-width: 1024px) 290px, (min-width: 768px) 30vw, 45vw"
            priority={priority}
            className="h-full w-full object-contain p-[8%] transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {item.featured && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-primary px-2.5 py-1 text-xs font-extrabold text-primary-foreground shadow">
            Must pack
          </span>
        )}
      </a>
      <span className="text-sm font-bold leading-snug sm:text-base">
        {item.name?.replace(/\s+/g, ' ')}
      </span>
      {blurb && (
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground sm:text-sm">
          {blurb}
        </p>
      )}
      {(price || store) && (
        <div className="mt-0.5 flex min-w-0 items-center gap-2">
          {price && <b className="text-sm sm:text-base">{price}</b>}
          {store && item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get ${item.name} at ${store} (opens in a new tab)`}
              className="inline-flex min-h-8 min-w-0 items-center gap-1 rounded-full border-2 border-border px-2.5 text-xs font-bold text-foreground transition-colors hover:border-foreground/40 sm:px-3 sm:text-sm"
            >
              <span className="truncate">{store}</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}
      {item.howWeUseIt && onToggleNote && (
        <button
          type="button"
          aria-expanded={noteOpen}
          aria-controls={`note-${item._id}`}
          onClick={onToggleNote}
          className={`mt-0.5 inline-flex min-h-9 items-center gap-1.5 self-start rounded-full border-2 px-3 text-xs font-bold transition-colors sm:text-sm ${
            noteOpen
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-card text-foreground hover:border-foreground/40'
          }`}
        >
          How we use it
          <span aria-hidden="true">{noteOpen ? '▴' : '▾'}</span>
        </button>
      )}
    </div>
  )
}

/**
 * "How we use it", a full-width panel under the card's row. Always in the
 * HTML (closed = hidden) so search engines can read every note.
 */
export function GearNote({
  item,
  open,
  onClose,
}: {
  item: Essential
  open: boolean
  onClose: () => void
}) {
  const price = priceLabel(item.price)
  const store = storeName(item.link)
  return (
    <div
      id={`note-${item._id}`}
      className={`relative col-span-full gap-3.5 rounded-2xl border-[3px] border-border-bold bg-primary-soft-background p-4 sm:gap-6 sm:p-6 ${
        open ? 'flex' : 'hidden'
      }`}
    >
      {item.productImage?.asset && (
        <div className="w-24 shrink-0 self-start overflow-hidden rounded-xl border-2 border-border bg-white sm:w-40">
          <SanityImage
            image={item.productImage}
            width={320}
            alt=""
            sizes="160px"
            className="aspect-square h-full w-full object-contain p-2"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2 pr-10 sm:gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-epilogue text-lg font-extrabold sm:text-xl">
            {item.name?.replace(/\s+/g, ' ')}
          </span>
          {item.featured && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-extrabold text-primary-foreground">
              Must pack
            </span>
          )}
        </div>
        <span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
          How we use it
        </span>
        <p className="text-sm leading-relaxed sm:text-base">
          {item.howWeUseIt}
        </p>
        {(price || store) && (
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            {price && <b className="text-base">{price}</b>}
            {store && item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1 rounded-full bg-foreground px-4 text-sm font-bold text-background"
              >
                Get it at {store} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label={`Close how we use the ${item.name}`}
        onClick={onClose}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card text-lg font-bold text-foreground"
      >
        ×
      </button>
    </div>
  )
}
