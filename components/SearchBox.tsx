// Site search popup: opened from the navbar's Search button (or ⌘K / Ctrl+K).
// As-you-type suggestions come from a tiny title-only query; Enter without a
// highlighted suggestion goes to the full /search results page.
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useDebounce } from 'hooks/useDebounce'
import { searchSuggestionsQuery, toSearchTerms } from 'lib/sanity.queries'
import { sanityClient } from 'lib/sanity.server'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useId, useState } from 'react'

import HighlightText from './HighlightText'

interface Suggestion {
  _id: string
  _type: 'hotelReview' | 'foodReview' | 'guide' | 'arenas'
  title: string
  location?: string
  slug: string
}

const SUGGESTION_ROUTES: Record<Suggestion['_type'], string> = {
  hotelReview: '/hotel',
  foodReview: '/food',
  guide: '/guide',
  arenas: '/arena',
}

const SUGGESTION_LABELS: Record<Suggestion['_type'], string> = {
  hotelReview: 'Hotel',
  foodReview: 'Food',
  guide: 'Guide',
  arenas: 'Arena',
}

const MIN_CHARS = 2

function SearchPanel({ onDone }: { onDone: () => void }) {
  const router = useRouter()
  const listboxId = useId()

  // On /search, start from the current query so it can be refined
  const [value, setValue] = useState(
    router.pathname === '/search' && typeof router.query.q === 'string'
      ? router.query.q
      : '',
  )
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  // -1 = nothing highlighted; suggestions.length = the "See all results" row
  const [activeIndex, setActiveIndex] = useState(-1)

  const debouncedValue = useDebounce(value.trim(), 250)

  useEffect(() => {
    const terms =
      debouncedValue.length >= MIN_CHARS ? toSearchTerms(debouncedValue) : []
    if (terms.length === 0) {
      setSuggestions([])
      return
    }
    let isCurrent = true
    sanityClient
      .fetch<Suggestion[]>(searchSuggestionsQuery, { terms })
      .then((data) => {
        if (isCurrent) {
          setSuggestions(data ?? [])
          setActiveIndex(-1)
        }
      })
      // Suggestions are a nice-to-have; the full search still works
      .catch((err) => console.error('Search suggestions failed:', err))
    return () => {
      isCurrent = false
    }
  }, [debouncedValue])

  const showList = value.trim().length >= MIN_CHARS && suggestions.length > 0

  const goToResults = () => {
    const query = value.trim()
    if (!query) return
    onDone()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const goToSuggestion = (suggestion: Suggestion) => {
    onDone()
    router.push(`${SUGGESTION_ROUTES[suggestion._type]}/${suggestion.slug}`)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return
    const lastIndex = suggestions.length // the "See all results" row
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => (i >= lastIndex ? 0 : i + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (i <= 0 ? lastIndex : i - 1))
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (showList && activeIndex >= 0 && activeIndex < suggestions.length) {
      goToSuggestion(suggestions[activeIndex])
    } else {
      goToResults()
    }
  }

  const words = toSearchTerms(value).map((term) => term.slice(0, -1))
  const optionId = (index: number) => `${listboxId}-option-${index}`

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="Site search">
      <div className="flex items-center gap-3 border-b-2 border-muted px-4 py-3 sm:px-5">
        <Search className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search hotels, restaurants, guides or arenas"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-base font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground focus:outline-none sm:text-lg [&::-webkit-search-cancel-button]:hidden"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          enterKeyHint="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
        />
        <span className="hidden rounded-md border border-border px-1.5 py-0.5 text-xs font-semibold text-muted-foreground sm:inline">
          Esc
        </span>
        <DialogPrimitive.Close
          aria-label="Close search"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </DialogPrimitive.Close>
      </div>

      {showList ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="py-2"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion._id}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => goToSuggestion(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex min-h-13 cursor-pointer items-center justify-between gap-3 px-4 py-2 sm:px-5 ${
                index === activeIndex ? 'bg-primary-soft-background' : ''
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-bold text-foreground">
                  <HighlightText text={suggestion.title} words={words} />
                </span>
                {suggestion.location && (
                  <span className="block truncate text-[13px] text-muted-foreground">
                    {suggestion.location}
                  </span>
                )}
              </span>
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {SUGGESTION_LABELS[suggestion._type]}
              </span>
            </li>
          ))}
          <li
            id={optionId(suggestions.length)}
            role="option"
            aria-selected={activeIndex === suggestions.length}
            onClick={goToResults}
            onMouseEnter={() => setActiveIndex(suggestions.length)}
            className={`mt-1 flex min-h-12 cursor-pointer items-center justify-between gap-2 border-t-2 border-muted px-4 py-2 text-[15px] font-bold text-primary sm:px-5 ${
              activeIndex === suggestions.length
                ? 'bg-primary-soft-background'
                : ''
            }`}
          >
            <span>See all results for &ldquo;{value.trim()}&rdquo; →</span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
              ↑ ↓ to move · Enter to open
            </span>
          </li>
        </ul>
      ) : (
        <p className="px-4 py-5 text-sm text-muted-foreground sm:px-5">
          {value.trim().length >= MIN_CHARS
            ? 'Press Enter to see all results.'
            : 'Try a city, a hotel, a restaurant or an arena.'}
        </p>
      )}
    </form>
  )
}

/** The search popup. Full screen on phones, a centred card on larger screens. */
export default function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-gray-900/55 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[60] overflow-y-auto bg-card outline-none sm:inset-auto sm:left-1/2 sm:top-24 sm:max-h-[calc(100vh-8rem)] sm:w-[calc(100%-2rem)] sm:max-w-2xl sm:-translate-x-1/2 sm:rounded-3xl sm:border-[3px] sm:border-border-bold sm:shadow-2xl"
        >
          <DialogPrimitive.Title className="sr-only">
            Search the site
          </DialogPrimitive.Title>
          {/* Remounts each time it opens, so it starts fresh */}
          {open && <SearchPanel onDone={() => onOpenChange(false)} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
