import HighlightText from 'components/HighlightText'
import { cardName, monthFormatter } from 'components/listing/ListingCard'
import SanityImage from 'components/SanityImage'
import type { SearchItem } from 'lib/searchResults'
import Link from 'next/link'

/**
 * One search result: a row (photo on the left) on phones, a card (square
 * photo on top) from tablets up. Same facts as the /hotels and /food cards:
 * name, city and month, and the score.
 */
export default function SearchResultItem({
  item,
  words,
  className = '',
}: {
  item: SearchItem
  words: string[]
  className?: string
}) {
  const month = item.date ? monthFormatter.format(new Date(item.date)) : null
  const meta = [
    item.place,
    item.kind === 'arena' && month ? `Visited ${month}` : month,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3.5 py-2.5 md:flex-col md:items-stretch md:gap-2.5 md:py-0 ${className}`}
    >
      <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[14px] border-2 border-border-bold bg-border-bold md:aspect-square md:h-auto md:w-full md:rounded-2xl md:border-[3px]">
        {item.image?.asset && (
          <SanityImage
            image={item.image}
            width={480}
            height={480}
            alt=""
            sizes="(min-width: 768px) 25vw, 76px"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="line-clamp-2 text-base font-bold leading-snug text-foreground group-hover:text-primary">
          <HighlightText text={cardName(item.title)} words={words} />
        </span>
        {meta && <span className="text-sm text-muted-foreground">{meta}</span>}
        {item.rating && (
          <span className="text-sm font-semibold text-foreground">
            <span aria-hidden="true">★</span> {item.rating.display}
            <span className="font-normal text-muted-foreground">
              {' '}
              · {item.rating.text}
            </span>
          </span>
        )}
      </div>
    </Link>
  )
}
