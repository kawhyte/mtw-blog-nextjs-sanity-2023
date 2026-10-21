// Nav search input with as-you-type suggestions (desktop bar + mobile overlay).
// Suggestions are a tiny title-only query; Enter without a highlighted
// suggestion goes to the full /search results page.
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

export default function SearchBox({
  variant,
  onClose,
}: {
  variant: 'desktop' | 'mobile'
  /** Mobile overlay only: closes the overlay. */
  onClose?: () => void
}) {
  const router = useRouter()
  const listboxId = useId()

  // On /search, show the current query so it can be refined instead of retyped
  const currentQuery =
    router.pathname === '/search' && typeof router.query.q === 'string'
      ? router.query.q
      : ''
  // The mobile overlay only mounts after a tap, so it can start with the query;
  // the desktop box is server-rendered and picks it up in the effect below.
  const [value, setValue] = useState(variant === 'mobile' ? currentQuery : '')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  // -1 = nothing highlighted; suggestions.length = the "See all results" row
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    setValue(currentQuery)
  }, [currentQuery])

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

  const showDropdown =
    isOpen && value.trim().length >= MIN_CHARS && suggestions.length > 0

  const goToResults = () => {
    const query = value.trim()
    if (!query) return
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const goToSuggestion = (suggestion: Suggestion) => {
    setIsOpen(false)
    router.push(`${SUGGESTION_ROUTES[suggestion._type]}/${suggestion.slug}`)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (showDropdown) setIsOpen(false)
      else onClose?.()
      return
    }
    if (!showDropdown) return
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
    if (showDropdown && activeIndex >= 0 && activeIndex < suggestions.length) {
      goToSuggestion(suggestions[activeIndex])
    } else {
      goToResults()
    }
  }

  const words = toSearchTerms(value).map((term) => term.slice(0, -1))
  const optionId = (index: number) => `${listboxId}-option-${index}`

  const isMobile = variant === 'mobile'

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label={isMobile ? 'Mobile search form' : 'Site search'}
      className={
        isMobile
          ? 'absolute inset-0 z-30 flex items-center justify-center bg-background p-4 md:hidden'
          : 'ml-4 hidden flex-1 max-w-md md:ml-6 md:block'
      }
    >
      <div className="relative w-full">
        <input
          type="search"
          placeholder="Search Hotels, Restaurants, Guides, or Arenas..."
          className={`w-full rounded-full border border-input bg-card font-medium [&::-webkit-search-cancel-button]:hidden focus:outline-none focus:ring-2 focus:ring-foreground transition-shadow duration-150 text-sm ${
            isMobile ? 'py-3 pl-5 pr-12' : 'py-2 pl-4 pr-10'
          }`}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
          autoFocus={isMobile}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
        />
        {isMobile ? (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 min-h-11 min-w-11 p-2 text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            aria-label="Submit search"
          >
            <Search size={18} />
          </button>
        )}

        {showDropdown && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Search suggestions"
            className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border-2 border-border-bold bg-card py-1 shadow-lg"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion._id}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                // mousedown + preventDefault keeps focus so blur doesn't close first
                onMouseDown={(event) => {
                  event.preventDefault()
                  goToSuggestion(suggestion)
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm ${
                  index === activeIndex ? 'bg-accent' : ''
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-foreground">
                    <HighlightText text={suggestion.title} words={words} />
                  </span>
                  {suggestion.location && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {suggestion.location}
                    </span>
                  )}
                </span>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {SUGGESTION_LABELS[suggestion._type]}
                </span>
              </li>
            ))}
            <li
              id={optionId(suggestions.length)}
              role="option"
              aria-selected={activeIndex === suggestions.length}
              onMouseDown={(event) => {
                event.preventDefault()
                goToResults()
              }}
              onMouseEnter={() => setActiveIndex(suggestions.length)}
              className={`flex min-h-11 cursor-pointer items-center gap-2 border-t border-border px-4 py-2 text-sm font-semibold text-primary ${
                activeIndex === suggestions.length ? 'bg-accent' : ''
              }`}
            >
              <Search size={14} aria-hidden="true" />
              See all results for &quot;{value.trim()}&quot;
            </li>
          </ul>
        )}
      </div>
    </form>
  )
}
