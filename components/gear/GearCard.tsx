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
}: {
  item: Essential
  priority?: boolean
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
            className={`h-full w-full object-contain p-[8%] transition-transform duration-300 group-hover:scale-105`}
          />
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
    </div>
  )
}
