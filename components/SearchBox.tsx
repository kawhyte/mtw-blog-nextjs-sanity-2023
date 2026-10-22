// Site search. Laptops: type straight into the field in the navbar and the
// suggestions drop down under it (⌘K / Ctrl+K focuses it). Phones and
// tablets: the search icon opens a full-screen search where the bar becomes
// the field. As-you-type suggestions come from a tiny title-only query;
// Enter without a highlighted suggestion goes to the full /search page.
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useDebounce } from 'hooks/useDebounce'
import { searchSuggestionsQuery, toSearchTerms } from 'lib/sanity.queries'
import { sanityClient } from 'lib/sanity.server'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/router'
import {
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

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

const PLACEHOLDER = 'Search hotels, food, guides or arenas'

/** The search state and actions shared by the navbar field and the phone screen */
function useSiteSearch(onDone: () => void) {
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

  const optionId = (index: number) => `${listboxId}-option-${index}`

  return {
    value,
    setValue,
    suggestions,
    activeIndex,
    setActiveIndex,
    showList,
    goToResults,
    goToSuggestion,
    handleKeyDown,
    handleSubmit,
    listboxId,
    optionId,
    words: toSearchTerms(value).map((term) => term.slice(0, -1)),
    // Props that make the input a combobox for screen readers
    comboboxProps: {
      role: 'combobox' as const,
      'aria-expanded': showList,
      'aria-controls': listboxId,
      'aria-autocomplete': 'list' as const,
      'aria-activedescendant':
        showList && activeIndex >= 0 ? optionId(activeIndex) : undefined,
      autoComplete: 'off',
      enterKeyHint: 'search' as const,
    },
  }
}

type SiteSearch = ReturnType<typeof useSiteSearch>

/** Suggestions with type tags, the "See all results" row, or a hint */
function SuggestionList({ search }: { search: SiteSearch }) {
  const {
    value,
    suggestions,
    activeIndex,
    setActiveIndex,
    showList,
    goToResults,
    goToSuggestion,
    listboxId,
    optionId,
    words,
  } = search

  if (!showList) {
    return (
      <p className="px-4 py-4 text-sm text-muted-foreground lg:px-[18px]">
        {value.trim().length >= MIN_CHARS
          ? 'Press Enter to see all results.'
          : 'Try a city, a hotel, a restaurant or an arena.'}
      </p>
    )
  }

  return (
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
          // mousedown keeps the field focused, so the list doesn't close first
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => goToSuggestion(suggestion)}
          onMouseEnter={() => setActiveIndex(index)}
          className={`flex min-h-[54px] cursor-pointer items-center justify-between gap-3 px-4 py-1.5 lg:px-[18px] ${
            index === activeIndex ? 'bg-primary-soft-background' : ''
          }`}
        >
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-bold text-foreground">
              <HighlightText text={suggestion.title} words={words} />
            </span>
            {suggestion.location && (
              <span className="truncate text-[13px] text-muted-foreground">
                {suggestion.location}
              </span>
            )}
          </span>
          <span className="shrink-0 rounded-full border border-border bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-stone-700">
            {SUGGESTION_LABELS[suggestion._type]}
          </span>
        </li>
      ))}
      <li
        id={optionId(suggestions.length)}
        role="option"
        aria-selected={activeIndex === suggestions.length}
        onMouseDown={(event) => event.preventDefault()}
        onClick={goToResults}
        onMouseEnter={() => setActiveIndex(suggestions.length)}
        className={`mt-1 flex min-h-12 cursor-pointer items-center justify-between gap-2 border-t border-border px-4 py-2 text-[15px] font-extrabold text-pink-700 lg:px-[18px] ${
          activeIndex === suggestions.length
            ? 'bg-primary-soft-background'
            : ''
        }`}
      >
        <span>See all results for &ldquo;{value.trim()}&rdquo; →</span>
        <span className="hidden text-xs font-medium text-muted-foreground lg:inline">
          ↑ ↓ · Enter
        </span>
      </li>
    </ul>
  )
}

/** Laptops: the search field lives in the navbar; suggestions drop down under it */
export function NavSearch({
  inputRef,
}: {
  inputRef: RefObject<HTMLInputElement>
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLFormElement>(null)
  const search = useSiteSearch(() => {
    setOpen(false)
    search.setValue('')
    inputRef.current?.blur()
  })

  // Clicking anywhere else closes the list; it reopens with nothing highlighted
  const { setActiveIndex } = search
  useEffect(() => {
    if (!open) {
      setActiveIndex(-1)
      return
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, setActiveIndex])

  const hasValue = search.value.length > 0

  return (
    <form
      ref={containerRef}
      onSubmit={search.handleSubmit}
      role="search"
      aria-label="Site search"
      className="relative w-52 shrink-0 xl:w-[300px]"
    >
      <div
        className={`flex h-11 items-center gap-2.5 rounded-full border-[3px] bg-card pl-3.5 pr-2.5 transition-colors ${
          open ? 'border-border-bold' : 'border-border hover:border-stone-300'
        }`}
      >
        <Search
          className={`h-[18px] w-[18px] shrink-0 ${open ? 'text-primary' : 'text-muted-foreground'}`}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search the site"
          aria-label={PLACEHOLDER}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-search-cancel-button]:hidden"
          value={search.value}
          onChange={(event) => {
            search.setValue(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              event.currentTarget.blur()
              return
            }
            search.handleKeyDown(event)
          }}
          {...search.comboboxProps}
          {...{ 'aria-expanded': open && search.showList }}
        />
        {hasValue ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              search.setValue('')
              inputRef.current?.focus()
            }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <kbd className="rounded-md border border-border px-1.5 font-sans text-xs font-semibold text-muted-foreground">
            ⌘K
          </kbd>
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[460px] overflow-hidden rounded-[20px] border-[3px] border-border-bold bg-card shadow-[0_16px_40px_rgb(28_25_23/0.16)]">
          <SuggestionList search={search} />
        </div>
      )}
    </form>
  )
}

function SearchSheet({ onDone }: { onDone: () => void }) {
  const search = useSiteSearch(onDone)
  return (
    <form
      onSubmit={search.handleSubmit}
      role="search"
      aria-label="Site search"
      className="flex h-full flex-col"
    >
      {/* The bar itself becomes the search field */}
      <div className="flex h-[68px] shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-full border-[3px] border-border-bold bg-card px-3.5">
          <Search
            className="h-[18px] w-[18px] shrink-0 text-primary"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={PLACEHOLDER}
            className="min-w-0 flex-1 bg-transparent text-base font-semibold text-foreground placeholder:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-search-cancel-button]:hidden"
            value={search.value}
            onChange={(event) => search.setValue(event.target.value)}
            onKeyDown={search.handleKeyDown}
            autoFocus
            {...search.comboboxProps}
          />
        </div>
        <DialogPrimitive.Close className="-mr-1 min-h-11 shrink-0 px-1 text-[15px] font-bold text-pink-700">
          Cancel
        </DialogPrimitive.Close>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <SuggestionList search={search} />
      </div>
    </form>
  )
}

/** Phones and tablets: full-screen search, opened from the navbar's search icon */
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
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[60] bg-card outline-none"
        >
          <DialogPrimitive.Title className="sr-only">
            Search the site
          </DialogPrimitive.Title>
          {/* Remounts each time it opens, so it starts fresh */}
          {open && <SearchSheet onDone={() => onOpenChange(false)} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
